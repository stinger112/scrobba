/**
 * Created by stinger112 on 28.08.16.
 */

'use strict';

function main() {
    console.log(`Hi, I'm extension`);

    // select the target node
    var target = document.querySelector( '.track-title');

    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // console.log(mutation);

           let trackNameContainer = mutation.addedNodes.item(1);

            if (trackNameContainer
                && trackNameContainer.localName === 'a'
                && !trackNameContainer.classList.contains('sponsor')) {

                // console.log(trackNameContainer.title);

                let channelTitle = document.querySelector('.channel-detail .title a').getAttribute('title');
                let trackTitle = document.querySelector('.metadata-container .track-name').getAttribute('title');

                chrome.runtime.sendMessage({ channel: channelTitle, track: trackTitle });
                // chrome.extension.sendMessage({ channel: channelTitle, track: trackTitle });
            }
        });
    });

    // configuration of the observer:
    var config = {
        attributes: true,
        childList: true,
        // characterData: true,
        subtree: true
    };

    // pass in the target node, as well as the observer options
    observer.observe(target, config);

    // later, you can stop observing
    // observer.disconnect();
}

window.onload = main;

