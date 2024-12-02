document.addEventListener("DOMContentLoaded", () => {
    // Fetch the playlist.json file to get album data
    fetch('playlist.json')
        .then(response => response.json())
        .then(data => {
            const albumsContainer = document.getElementById('albums');
            const audioPlayer = document.getElementById('audio-player');
            const currentTrackDisplay = document.getElementById('current-track');
            const trackListContainer = document.querySelector('.track-list');
            const queueListContainer = document.getElementById('queue-list');
            let currentTrackIndex = -1;
            let currentAlbumTracks = [];
            let queue = [];
            let isShuffle = false;

            // Create an album card for each album in the playlist
            Object.keys(data).forEach(albumName => {
                const album = data[albumName];

                // Create an album card element
                const albumCard = document.createElement('div');
                albumCard.classList.add('album-card');
                albumCard.innerHTML = `
                    <img src="${album.cover || 'default-cover.jpg'}" alt="${albumName}">
                    <h3>${albumName}</h3>
                `;

                // Add event listener to load tracks when the album card is clicked
                albumCard.addEventListener('click', () => {
                    currentAlbumTracks = album.tracks.map(track => ({
                        name: track,
                        audioURL: `music/${albumName}/${track}`
                    }));
                    loadTrackList();

                    // Check if on mobile, then scroll to track section
                    if (window.innerWidth <= 768) {
                        const trackSection = document.getElementById('player');
                        trackSection.scrollIntoView({ behavior: 'smooth' });
                    }
                });

                // Append the album card to the albums container
                albumsContainer.appendChild(albumCard);
            });

            // Function to load the track list for a specific album
            function loadTrackList() {
                trackListContainer.innerHTML = ''; // Clear existing tracks

                currentAlbumTracks.forEach((track, index) => {
                    const trackButton = document.createElement('button');
                    trackButton.textContent = track.name;
                    trackButton.addEventListener('click', () => addToQueue(index));  // Add to queue, not play
                    trackListContainer.appendChild(trackButton);
                });
            }

            // Function to play the current track
            function playTrack(index) {
                if (index < 0 || index >= currentAlbumTracks.length) return;

                currentTrackIndex = index;
                audioPlayer.src = currentAlbumTracks[currentTrackIndex].audioURL;
                currentTrackDisplay.textContent = currentAlbumTracks[currentTrackIndex].name;
                audioPlayer.play();
            }

            // Add track to queue
            function addToQueue(index) {
                if (index < 0 || index >= currentAlbumTracks.length) return;

                // Check if the track is already in the queue to avoid duplicates
                const trackInQueue = queue.some(track => track.audioURL === currentAlbumTracks[index].audioURL);
                if (!trackInQueue) {
                    queue.push(currentAlbumTracks[index]);
                    updateQueueDisplay();
                }
            }

            // Function to update the queue list display
            function updateQueueDisplay() {
                queueListContainer.innerHTML = ''; // Clear existing queue items

                queue.forEach((track, index) => {
                    const queueItem = document.createElement('li');
                    queueItem.textContent = track.name;

                    // Add play button to queue item
                    const playButton = document.createElement('button');
                    playButton.textContent = 'Play';
                    playButton.addEventListener('click', () => {
                        currentTrackIndex = index;
                        playTrack(currentTrackIndex);
                    });

                    // Add remove button to queue item
                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    removeButton.addEventListener('click', () => {
                        queue.splice(index, 1);
                        updateQueueDisplay();  // Re-render queue after removal
                    });

                    queueItem.appendChild(playButton);
                    queueItem.appendChild(removeButton);
                    queueListContainer.appendChild(queueItem);
                });
            }

            // Add event listeners for next and previous track buttons
            document.getElementById('prev-track').addEventListener('click', () => {
                if (currentTrackIndex > 0) {
                    playTrack(currentTrackIndex - 1);
                }
            });

            document.getElementById('next-track').addEventListener('click', () => {
                if (currentTrackIndex < currentAlbumTracks.length - 1) {
                    playTrack(currentTrackIndex + 1);
                }
            });

            // Shuffle queue functionality
            document.getElementById('shuffle-queue').addEventListener('click', () => {
                isShuffle = !isShuffle; // Toggle shuffle mode
                if (isShuffle) {
                    shuffleQueue();
                } else {
                    resetQueueOrder();
                }
            });

            // Function to shuffle the queue
            function shuffleQueue() {
                for (let i = queue.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [queue[i], queue[j]] = [queue[j], queue[i]]; // Swap elements
                }
                updateQueueDisplay(); // Re-render queue after shuffle
            }

            // Function to reset queue order
            function resetQueueOrder() {
                // Revert to original order (no shuffle)
                queue = queue.sort((a, b) => a.name.localeCompare(b.name));
                updateQueueDisplay(); // Re-render queue
            }

            // Save playlist to local storage
            document.getElementById('save-playlist').addEventListener('click', () => {
                localStorage.setItem('savedQueue', JSON.stringify(queue));
            });

            // Load playlist from local storage
            document.getElementById('load-playlist').addEventListener('click', () => {
                const savedQueue = JSON.parse(localStorage.getItem('savedQueue'));
                if (savedQueue) {
                    queue = savedQueue;
                    updateQueueDisplay();
                }
            });
        })
        .catch(error => {
            console.error("Error loading playlist:", error);
        });
});
