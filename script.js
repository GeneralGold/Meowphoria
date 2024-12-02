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
            let currentTrackIndex = -1;
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
                    if (index === 0 && !audioPlayer.paused) {
                        li.classList.add('playing');
                    }
                    queueList.appendChild(li);
                });
            }

            // Function to remove a track from the queue
            function removeFromQueue(index) {
                queue.splice(index, 1);
                renderQueue();
                if (index === 0 && !audioPlayer.paused) {
                    playNext();
                }
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

            // Play the next track in the queue
            function playNext() {
                if (queue.length > 0) {
                    const track = queue.shift();
                    currentTrackDisplay.textContent = track.name;
                    audioPlayer.src = track.audioURL;
                    audioPlayer.play();
                    renderQueue();
                }
            }

            // Add event listeners for next and previous track buttons
            document.getElementById('prev-track').addEventListener('click', () => {
                if (currentTrackIndex > 0) {
                    playTrack(currentTrackIndex - 1);
                }
            });

            document.getElementById('next-track').addEventListener('click', playNext);

            shuffleButton.addEventListener('click', shuffleQueue);

            audioPlayer.addEventListener('ended', playNext);
        })
        .catch(error => {
            console.error("Error loading playlist:", error);
        });
});
