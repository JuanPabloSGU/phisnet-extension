let access_token: string | null = null;
let jwt: string | null = null;
let links: any[] = [];

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.clear();
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
