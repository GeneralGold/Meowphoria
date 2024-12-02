const audioPlayer = document.getElementById("audio-player");
const playButton = document.getElementById("play");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const playlistContainer = document.getElementById("playlist-container");

let currentAlbum = null;
let currentTrackIndex = 0;
let playlist = {};

// Load playlist from playlist.json
async function loadPlaylist() {
  try {
    const response = await fetch("playlist.json");
    playlist = await response.json();
    renderAlbums();
  } catch (error) {
    console.error("Error loading playlist:", error);
  }
}

// Render albums on the page
function renderAlbums() {
  playlistContainer.innerHTML = "";
  for (const album in playlist) {
    const albumData = playlist[album];

    // Album Container
    const albumElement = document.createElement("div");
    albumElement.className = "album";

    // Album Cover
    const cover = document.createElement("img");
    cover.src = albumData.cover || "default-cover.jpg"; // Use a default image if no cover is found
    cover.alt = `${album} Cover`;
    cover.className = "album-cover";

    // Album Title
    const title = document.createElement("h3");
    title.textContent = album;

    // Add click event to display tracks
    albumElement.onclick = () => renderTracks(album);

    albumElement.appendChild(cover);
    albumElement.appendChild(title);
    playlistContainer.appendChild(albumElement);
  }
}

// Render tracks for a selected album
function renderTracks(album) {
  currentAlbum = album;
  playlistContainer.innerHTML = `<h2>${album}</h2>`;
  playlist[album].tracks.forEach((track, index) => {
    const trackElement = document.createElement("div");
    trackElement.textContent = track;
    trackElement.className = "track";
    trackElement.onclick = () => playTrack(album, index);
    playlistContainer.appendChild(trackElement);
  });

  // Add a back button to return to the album list
  const backButton = document.createElement("button");
  backButton.textContent = "Back to Albums";
  backButton.onclick = renderAlbums;
  playlistContainer.appendChild(backButton);
}

// Play the selected track
function playTrack(album, index) {
  currentAlbum = album;
  currentTrackIndex = index;
  audioPlayer.src = `music/${album}/${playlist[album].tracks[index]}`;
  audioPlayer.play();
}

// Control Buttons
playButton.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playButton.textContent = "Pause";
  } else {
    audioPlayer.pause();
    playButton.textContent = "Play";
  }
});

nextButton.addEventListener("click", () => {
  if (!currentAlbum) return;
  currentTrackIndex = (currentTrackIndex + 1) % playlist[currentAlbum].tracks.length;
  playTrack(currentAlbum, currentTrackIndex);
});

prevButton.addEventListener("click", () => {
  if (!currentAlbum) return;
  currentTrackIndex = (currentTrackIndex - 1 + playlist[currentAlbum].tracks.length) % playlist[currentAlbum].tracks.length;
  playTrack(currentAlbum, currentTrackIndex);
});

// Load playlist on page load
loadPlaylist();
