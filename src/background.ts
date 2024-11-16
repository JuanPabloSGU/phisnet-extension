let access_token: string | null = null;
let jwt: string | null = null;
let links: any[] = [];

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.clear();
    chrome.storage.local.set({ automatic_search: false }, () => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        }
        console.log('Automatic Search is disabled');
    });
    chrome.action.setPopup({ popup: 'popup.html' });
    chrome.action.openPopup();
});

chrome.runtime.onStartup.addListener(() => {
    checkTokenAndSetPopup();
});

chrome.action.onClicked.addListener(() => {
    checkTokenAndSetPopup();
});

function checkTokenAndSetPopup() {
    chrome.storage.local.get(['jwt', 'token'], (result) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        } else {
            const jwt = result.jwt;
            const token = result.token;
            if (!jwt || !token) {
                chrome.action.setPopup({ popup: 'popup.html' });
                chrome.action.openPopup();
            } else {
                chrome.action.setPopup({ popup: 'home.html' });
                chrome.action.openPopup();
            }
        }
    });
}

function toggleAutomaticSearch(tab_id: number, toggle: boolean) {
    if (toggle) {
        chrome.scripting.executeScript({
            target: { tabId: tab_id },
            files: ['content.js']
        });
    } else {
        console.log('Automatic search disabled', tab_id);
    }
}

chrome.tabs.onUpdated.addListener((tab_id, change_info, tab) => {
    // Skips urls like "chrome://" to avoid extension error
    if (tab.url?.startsWith("chrome://")) return undefined;

    if (tab.active && change_info.status === 'complete') {
        chrome.storage.local.get(['automatic_search'], (result) => {
            if (chrome.runtime.lastError) {
                // console.error(chrome.runtime.lastError.message);
            } else {
                const automatic_search = result.automatic_search;
                toggleAutomaticSearch(tab_id, automatic_search);
            }
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.token) {
        access_token = request.token;
        sendResponse({ message: 'Token received' });
    } else if (request.jwt) {
        jwt = request.jwt;
        sendResponse({ message: 'JWT received' });
    } else if (request.links) {
        links = request.links;
        sendResponse({ message: 'Links received', links: links });
    }

    switch (request.action) {
        case "getJWT":
            sendResponse({ jwt: jwt });
            break;
        case "clearJWT":
            jwt = null;
            sendResponse({ message: 'JWT cleared' });
            break;
        case "getToken":
            sendResponse({ token: access_token });
            break;
        case "clearToken":
            access_token = null;
            sendResponse({ message: 'Token cleared' });
            break;
        case "getLinks":
            sendResponse({ links: links });
            break;
    }
});
