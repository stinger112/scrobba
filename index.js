/**
 * Created by stinger112 on 01.07.16.
 */

'use strict';

const chromep = new ChromePromise();


function createNewWorker(playlistName, track, token) {
    return new Promise((resolve, reject) => {
        let worker = new Worker('deezer-compiled.js');
        worker.postMessage({
            playlistName,
            track,
            token
        });

        worker.onmessage = (event) => {
            console.log(event.data);

            worker.terminate();

            Promise.resolve(event.data);
        };

        // return worker;
    })
}

var accessToken = null;
async function getAccessToken() {
    // Return cached value if exists and not too old
    if (accessToken && (accessToken.expires - Date.now()) > 2*60*1000)
        return accessToken;

    let url = new URL(`https://connect.deezer.com/oauth/auth.php`);

    url.searchParams.append('app_id', 189582);
    url.searchParams.append('redirect_uri', 'http://solaris.tk');
    url.searchParams.append('perms', 'basic_access,manage_library');
    url.searchParams.append('response_type', 'token');

    // let response = await fetch(url, { redirect: 'follow'});
    // let data = response.text();
    // console.log(response);

    let tab = await chromep.tabs.create( { url: url.toString() });

    //TODO: Delay? Really?
    await Promise.delay(1000);

    // Update tab info
    tab = await chromep.tabs.get(tab.id);

    // Close tab
    await chromep.tabs.remove(tab.id);

    var params = tab.url.match( /#access_token=([a-z0-9]+)&expires=([0-9]+)$/i );

    // Save new cached value to global var accessToken.
    accessToken = {
        token: params[1],
        expires: Date.now() + parseInt(params[2]) * 1000
    };

    console.log('New token received', accessToken);

    return accessToken.token;
}


async function onTrackSwitching(message, sender) {
    // console.log(sender.tab ?
    // "from a content script:" + sender.tab.url :
    //     "from the extension");

    console.log(message);

    let {channel, track} = message;

    let playlistName = `${channel} (Digitally Imported)`;

    let token = await getAccessToken();

    createNewWorker(playlistName, track, token);
}


chrome.runtime.onMessage.addListener(onTrackSwitching);

function test(args) {
    onTrackSwitching(args);
}

