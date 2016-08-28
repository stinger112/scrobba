/**
 * Created by stinger112 on 28.08.16.
 */

'use strict';

// importScripts('./lib/dz.js');

// import { DZ } from './lib/dz'


class MusicService {
    constructor(accessToken) {
        this.accessToken = accessToken;/* this.__updateToken(); */
    }

    async createPlaylist(title) {
        let uri = `user/me/playlists?title=${title}`;

        return this.__sendRequest(uri, 'POST');
    }

    async addTrackToPlaylist(playlistId, trackId) {
        return this.__sendRequest(`playlist/${playlistId}/tracks?songs=${trackId}?limit=1`, 'POST');
    }

    //TODO: Hardcode!
    async findPlaylist(title) {
        let response = await this.__sendRequest(`user/me/playlists?q=${title}?index=0`);

        return response.data.find(playlist => playlist.title === title);

        // this.__sendRequest(`user/me/playlists?q=${name}?index=25`);
    }

    async searchTrack(title) {
        let response = await this.__sendRequest(`search?q=${title}&strict=on&title=${title}&limit=1`);

        return response.data[0];
    }

    async getMyProfile() {
        return this.__sendRequest(`user/me`);
    }

    async __sendRequest(action, method = 'GET') {
        let url = 'https://api.deezer.com/' + action + '&access_token=' + this.accessToken;

        console.log(`New ${method} request to`,  encodeURI(url));

        let response = await fetch(url, { method });
        let data = await response.json();

        console.log(`Server answer with data:`, data);

        // OAuthException: invalid OAuth access token.
        if (data.error && data.error.code === 300)
            throw new Error(data.error.message, data.error.code);

        return data;
    }

}



async function main({data}) {
    try {
        console.log('Init evaluation chain with data', data);

        var service = new MusicService(data.token);

        let {playlistName, track} = data;

        let playlist = await service.findPlaylist(playlistName) || await service.createPlaylist(playlistName);

        let matchedTrack = await service.searchTrack(track);

        await service.addTrackToPlaylist(playlist.id, matchedTrack.id);

        return postMessage(matchedTrack);
    } catch(error) {
        console.warn(error);
        return postMessage({ error });
    }
}

self.onmessage = main;