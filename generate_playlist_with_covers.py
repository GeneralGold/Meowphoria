#!/usr/bin/env python3

import os
import json
import urllib.request
import urllib.error
import random

# Set the base directory for music files
MUSIC_DIR = "music"

# This function uses urllib to fetch the album cover from the iTunes API
def get_album_cover_url(album_name):
    try:
        # Encode the album name to be URL-safe
        query = urllib.parse.quote(album_name)

        # Build the iTunes API search URL
        url = f"https://itunes.apple.com/search?term={query}&entity=album"

        # Fetch the response from the API
        with urllib.request.urlopen(url) as response:
            data = json.load(response)

        # Check if results are available and return the first album cover
        if data['resultCount'] > 0:
            return data['results'][0].get('artworkUrl100', '')
        else:
            return ''
    except (urllib.error.URLError, urllib.error.HTTPError) as e:
        print(f"Error fetching cover for album '{album_name}': {e}")
        return ''

# Function to generate playlist data
def generate_playlist():
    playlist = {}

    # Walk through all directories in the MUSIC_DIR
    for album in os.listdir(MUSIC_DIR):
        album_path = os.path.join(MUSIC_DIR, album)

        if os.path.isdir(album_path):
            tracks = []
            for track in os.listdir(album_path):
                if track.endswith(".mp3"):
                    tracks.append(track)

            if tracks:
                # Get the album cover URL from iTunes or use a default
                album_cover = get_album_cover_url(album) or "default-cover.jpg"
                playlist[album] = {
                    "tracks": tracks,
                    "cover": album_cover
                }

    return playlist

# Function to save the playlist as JSON
def save_playlist(playlist):
    with open("playlist.json", "w") as f:
        json.dump(playlist, f, indent=4)

# Main execution
if __name__ == "__main__":
    playlist = generate_playlist()
    save_playlist(playlist)
    print("Playlist generated successfully.")
