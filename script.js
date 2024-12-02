document.addEventListener("DOMContentLoaded", function () {
    // Fetch the playlist data from the JSON file
    fetch('playlist.json')
        .then(response => response.json())
        .then(data => {
            generateAlbums(data);
        });

    // Function to generate album grid
    function generateAlbums(data) {
        const albumGrid = document.getElementById("album-grid");

        // Loop through each album in the JSON data
        for (let albumName in data) {
            const album = data[albumName];
            const albumCard = document.createElement("div");
            albumCard.classList.add("album-card");
            albumCard.dataset.albumName = albumName;

            // Create album cover
            const albumCover = document.createElement("img");
            albumCover.src = album.cover;
            albumCover.alt = `${albumName} Cover`;

            // Album name
            const albumTitle = document.createElement("h3");
            albumTitle.textContent = albumName;

            // Add cover and title to the album card
            albumCard.appendChild(albumCover);
            albumCard.appendChild(albumTitle);

            // Add click event to show tracks when clicked
            albumCard.addEventListener("click", function () {
                showTracks(albumName, album.tracks);
            });

            // Append album card to album grid
            albumGrid.appendChild(albumCard);
        }
    }

    // Function to display the tracks of an album when it's clicked
    function showTracks(albumName, tracks) {
        const trackList = document.getElementById("track-list");
        trackList.innerHTML = ''; // Clear existing tracks

        // Set current album name
        document.getElementById("current-track").textContent = `Playing from: ${albumName}`;

        // Loop through the tracks and add them to the track list
        tracks.forEach(track => {
            const trackItem = document.createElement("li");
            trackItem.textContent = track;

            // Add click event to load track into the player when clicked
            trackItem.addEventListener("click", function () {
                playTrack(albumName, track);
            });

            trackList.appendChild(trackItem);
        });
    }

    // Function to play the selected track
    function playTrack(albumName, track) {
        const audioPlayer = document.getElementById("audio");
        const trackUrl = `music/${albumName}/${track}`;

        // Set the source of the audio player
        audioPlayer.src = trackUrl;

        // Update the current track info
        document.getElementById("current-track").textContent = `Now playing: ${track}`;

        // Play the track
        audioPlayer.play();

        // Update the track's duration and time during playback
        audioPlayer.addEventListener("loadedmetadata", function () {
            document.getElementById("duration").textContent = formatTime(audioPlayer.duration);
        });

        // Update current time
        audioPlayer.addEventListener("timeupdate", function () {
            document.getElementById("current-time").textContent = formatTime(audioPlayer.currentTime);
            document.getElementById("seek-bar").value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        });

        // Play/pause functionality
        document.getElementById("play-pause").addEventListener("click", function () {
            if (audioPlayer.paused) {
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        });

        // Seekbar functionality
        document.getElementById("seek-bar").addEventListener("input", function (event) {
            const seekTime = (event.target.value / 100) * audioPlayer.duration;
            audioPlayer.currentTime = seekTime;
        });
    }

    // Helper function to format time in minutes:seconds
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Make logo open the website https://generalgoldyt.com in a new tab when clicked
    const logo = document.getElementById("meowphoria-logo");
    logo.addEventListener("click", function () {
        window.open("https://generalgoldyt.com", "_blank");
    });
});
