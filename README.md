# Music Map project

Map songs you're currently listening to! See a map of songs previously mapped to by others at any location. Discover new music wherever you go.

This Music Map project going to be a website containing a map there you can map your currently listening songs to your current position on the map and see a map filled with songs previously mapped by others at any location. Filter the songs by time, genre or both. Click on the album-pic on the map to find more informations about the mapped song, or click further at the listen-button to open Spotify and listen. Like it? "Like" it!

It's also going to be a news feed with rencently mapped songs of users you have followed. To share, to listen, to get inspired!

Go, Listen, Map!

## Getting started on your local system

1. Clone this repository and go into the folder.
2. Run `npm install`.
3. Run `webpack -p`.
4. Go into dist/app.js and check that the `redirect_uri` is `http://localhost:8888/callback`, if not change it to this. Setting this will make sure Spotify's authentication redirects upon completion to your localhost server instead of our production website.
5. Run `node dist/app.js`.
6. Go to `localhost:8888` in your browser and you should see the site running.

## Backend

Here you can find the repository to our backend: [Music Map Backend](https://github.com/beichenc/MusicMapAPI).

## Screenshots

![alt text](https://github.com/beichenc/MusicMap/blob/master/Skärmavbild%202018-11-14%20kl.%2013.27.40.png)

![alt text](https://github.com/beichenc/MusicMap/blob/master/Skärmavbild%202018-11-14%20kl.%2013.31.24.png)
