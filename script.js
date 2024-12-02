// DOM Elements
const audio = document.getElementById('audio');
const playPauseButton = document.getElementById('play-pause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const shuffleButton = document.getElementById('shuffle');
const loopButton = document.getElementById('loop');
const seekBar = document.getElementById('seek-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const trackList = document.getElementById('track-list');
const uploadTrack = document.getElementById('upload-track');
const playlistsDiv = document.getElementById('playlists');
const newPlaylistButton = document.getElementById('new-playlist');
const logo = document.getElementById('meowphoria-logo');

let playlists = JSON.parse(localStorage.getItem('playlists')) || {};
let currentPlaylist = null;
let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isLoop = false;

// Utility Functions
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

function updateTrackList() {
    trackList.innerHTML = '';
    if (currentPlaylist && playlists[currentPlaylist]) {
        playlists[currentPlaylist].forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.name;
            li.addEventListener('click', () => playTrack(index));
            trackList.appendChild(li);
        });
    }
}

function savePlaylists() {
    localStorage.setItem('playlists', JSON.stringify(playlists));
}

// Playlist Management
newPlaylistButton.addEventListener('click', () => {
    const name = prompt('Enter playlist name:');
    if (name) {
        playlists[name] = [];
        currentPlaylist = name;
        savePlaylists();
        updatePlaylistUI();
    }
});

function updatePlaylistUI() {
    playlistsDiv.innerHTML = '';
    Object.keys(playlists).forEach((name) => {
        const button = document.createElement('button');
        button.textContent = name;
        button.addEventListener('click', () => {
            currentPlaylist = name;
            updateTrackList();
        });
        playlistsDiv.appendChild(button);
    });
}

updatePlaylistUI();

// Audio Player Controls
playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playPauseButton.textContent = '▶';
    } else {
        audio.play();
        playPauseButton.textContent = '⏸';
    }
    isPlaying = !isPlaying;
});

audio.addEventListener('timeupdate', () => {
    seekBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
});

seekBar.addEventListener('input', () => {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
});

audio.addEventListener('ended', () => {
    if (isLoop) {
        audio.currentTime = 0;
        audio.play();
    } else if (isShuffle) {
        currentTrackIndex = Math.floor(Math.random() * playlists[currentPlaylist].length);
        playTrack(currentTrackIndex);
    } else {
        nextTrack();
    }
});

prevButton.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlists[currentPlaylist].length) % playlists[currentPlaylist].length;
    playTrack(currentTrackIndex);
});

nextButton.addEventListener('click', nextTrack);

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlists[currentPlaylist].length;
    playTrack(currentTrackIndex);
}

shuffleButton.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleButton.style.background = isShuffle ? '#007acc' : '';
});

loopButton.addEventListener('click', () => {
    isLoop = !isLoop;
    loopButton.style.background = isLoop ? '#007acc' : '';
});

// Track Upload
uploadTrack.addEventListener('change', (event) => {
    const files = Array.from(event.target.files);
    if (currentPlaylist) {
        files.forEach(file => playlists[currentPlaylist].push({ name: file.name, url: URL.createObjectURL(file) }));
        savePlaylists();
        updateTrackList();
    } else {
        alert('Please select or create a playlist first.');
    }
});

// Play Track
function playTrack(index) {
    currentTrackIndex = index;
    const track = playlists[currentPlaylist][index];
    if (track) {
        audio.src = track.url;
        audio.play();
        playPauseButton.textContent = '⏸';
        isPlaying = true;
    }
}

// Logo click navigation
logo.addEventListener('click', () => {
    window.open('https://generalgoldyt.com', '_blank');
});
