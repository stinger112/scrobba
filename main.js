/**
 * Created by stinger112 on 01.07.16.
 */

'use strict';
//
// import TabManager from './tab-manager'
// import SignalSocket from './signal-socket'

// console.log('in main');

// /*const*/ window.tabManager = new TabManager();
// /*const*/ window.signalSocket = new SignalSocket('ws://localhost:10001');

// tabManager.on('init', tab => {
//     console.log(tab);
//
//     // socket.send(tab);
// });
//
// tabManager.onActivateApp = activeApp => {
//     signalSocket.sendNotification(activeApp.name.api_key)
// };

// Create background page
chrome.browserAction.onClicked.addListener(tab => {
    chrome.tabs.create( { url: chrome.extension.getURL("index.html") } );
});