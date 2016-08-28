/**
 * Created by stinger112 on 28.08.16.
 */

'use strict';


class MusicService {
    constructor(accessToken) {
        this.accessToken = accessToken;/* this.__updateToken(); */
    }

    async createPlaylist(title) {
        let response = await this.__sendRequest(`user/me/playlists?title=${title}`, 'POST');

        return response;
    }

    async addTrackToPlaylist(playlistId, trackId) {
        return this.__sendRequest(`playlist/${playlistId}/tracks?songs=${trackId}`, 'POST');
    }

    async findPlaylist(title) {
        let response = await this.__sendRequest(`user/me/playlists?q=${title}?index=0`);

        let matchedPlaylist = response.data.find(playlist => playlist.title === title);

        while (!matchedPlaylist && response.next) {
            response = await fetch(response.next);
            response = await response.json();
            matchedPlaylist = response.data.find(playlist => playlist.title === title);
        }

        return matchedPlaylist;
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

        console.log(`<-- New ${method} request to:\n`,  encodeURI(url));

        let response = await fetch(url, { method });
        let data = await response.json();

        console.log(`--> Server response with data:`, data, '\n');

        // OAuthException: invalid OAuth access token.
        if (data.error && data.error.code === 300)
            throw new Error(data.error.message, data.error.code);

        return data;
    }

}



async function main({data}) {
    try {
        console.info('----------------------------');
        console.info('NEW EVALUATION CHAIN STARTED!');
        console.info('INITIAL DATA: ', JSON.stringify(data));

        var service = new MusicService(data.token);

        let {playlistName, track} = data;

        let playlist = await service.findPlaylist(playlistName) || await service.createPlaylist(playlistName);

        let matchedTrack = await service.searchTrack(track);

        await service.addTrackToPlaylist(playlist.id, matchedTrack.id);

        return postMessage(matchedTrack);
    } catch(error) {
        console.warn(error);
        // return postMessage({ error });
    }
}

self.onmessage = main;