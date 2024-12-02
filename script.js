// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Fetch the playlist.json file to get album data
    fetch('playlist.json')
        .then(response => response.json())
        .then(data => {
            const albumsContainer = document.getElementById('albums');
            const audioPlayer = document.getElementById('audio-player');
            const currentTrackDisplay = document.getElementById('current-track');
            let currentTrackIndex = -1;
            let currentAlbumTracks = [];

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
                });

                // Append the album card to the albums container
                albumsContainer.appendChild(albumCard);
            });

            // Function to load the track list for a specific album
            function loadTrackList() {
                const trackListContainer = document.createElement('div');
                trackListContainer.classList.add('track-list');
                trackListContainer.innerHTML = '';

                currentAlbumTracks.forEach((track, index) => {
                    const trackButton = document.createElement('button');
                    trackButton.textContent = track.name;
                    trackButton.addEventListener('click', () => playTrack(index));
                    trackListContainer.appendChild(trackButton);
                });

                // If there's an existing track list, remove it and add the new one
                const existingTrackList = document.querySelector('.track-list');
                if (existingTrackList) {
                    existingTrackList.remove();
                }

                // Add the new track list to the player section
                document.getElementById('player').appendChild(trackListContainer);
            }

            // Function to play a track by its index
            function playTrack(index) {
                if (index < 0 || index >= currentAlbumTracks.length) return;

                currentTrackIndex = index;
                audioPlayer.src = currentAlbumTracks[currentTrackIndex].audioURL;
                currentTrackDisplay.textContent = currentAlbumTracks[currentTrackIndex].name;
                audioPlayer.play();
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
        })
        .catch(error => {
            console.error("Error loading playlist:", error);
        });
});
