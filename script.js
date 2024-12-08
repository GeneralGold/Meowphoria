document.addEventListener("DOMContentLoaded", () => {
    // Fetch the playlist.json file to get album data
    fetch('playlist.json')
        .then(response => response.json())
        .then(data => {
            const albumsContainer = document.getElementById('albums');
            const audioPlayer = document.getElementById('audio-player');
            const currentTrackDisplay = document.getElementById('current-track');
            const trackListContainer = document.querySelector('.track-list');
            const queueList = document.getElementById('queue-list');
            const shuffleButton = document.getElementById('shuffle-btn');
            let currentTrackIndex = -1; // Keeps track of the currently playing track
            let currentAlbumTracks = [];
            let queue = [];
            let isShuffled = false;

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

                    // Check if on mobile (screen width <= 768px), then scroll to the track section
                    if (window.innerWidth <= 768) {
                        const trackSection = document.getElementById('player');
                        trackSection.scrollIntoView({ behavior: 'smooth' });  // Smooth scroll to the track section
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
                    trackButton.addEventListener('click', () => addToQueue(track));
                    trackListContainer.appendChild(trackButton);
                });
            }

            // Function to add a track to the queue
            function addToQueue(track) {
                queue.push(track);
                renderQueue();
            }

            // Function to render the queue in the queue section
            function renderQueue() {
                queueList.innerHTML = '';
                queue.forEach((track, index) => {
                    const li = document.createElement('li');
                    li.textContent = track.name;
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.addEventListener('click', () => removeFromQueue(index));
                    li.appendChild(removeBtn);
                    if (index === currentTrackIndex) {
                        li.classList.add('playing');
                    }
                    queueList.appendChild(li);
                });
            }

            // Function to remove a track from the queue
            function removeFromQueue(index) {
                queue.splice(index, 1);
                if (index === currentTrackIndex) {
                    currentTrackIndex = Math.max(0, currentTrackIndex - 1);
                }
                renderQueue();
            }

            // Function to shuffle the queue
            function shuffleQueue() {
                for (let i = queue.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [queue[i], queue[j]] = [queue[j], queue[i]];
                }
                isShuffled = true;
                renderQueue();
            }

            // Play the next track in the queue without removing it
            function playNext() {
                if (queue.length > 0) {
                    currentTrackIndex = (currentTrackIndex + 1) % queue.length;
                    const track = queue[currentTrackIndex];
                    currentTrackDisplay.textContent = track.name;
                    audioPlayer.src = track.audioURL;
                    audioPlayer.play();
                    renderQueue();
                }
            }

            // Play the previous track in the queue
            function playPrevious() {
                if (queue.length > 0) {
                    currentTrackIndex = (currentTrackIndex - 1 + queue.length) % queue.length;
                    const track = queue[currentTrackIndex];
                    currentTrackDisplay.textContent = track.name;
                    audioPlayer.src = track.audioURL;
                    audioPlayer.play();
                    renderQueue();
                }
            }

            // Play button logic
            document.getElementById('play-button').addEventListener('click', () => {
                if (!audioPlayer.src && queue.length > 0) {
                    playNext();
                } else {
                    audioPlayer.play();
                }
            });

            // Add event listeners for next and previous track buttons
            document.getElementById('prev-track').addEventListener('click', playPrevious);
            document.getElementById('next-track').addEventListener('click', playNext);

            shuffleButton.addEventListener('click', shuffleQueue);

            // Automatically play the next track when the current one ends
            audioPlayer.addEventListener('ended', playNext);
        })
        .catch(error => {
            console.error("Error loading playlist:", error);
        });
});
