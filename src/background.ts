let access_token: string | null = null;
let jwt: string | null = null;

chrome.runtime.onInstalled.addListener(() => {
    fetch("http://localhost:5000/api/v1/hello_world")
        .then(response => response.json())
        .then(data => {
            console.log('Data from server:', data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.token) {
        access_token = request.token;
        sendResponse({ message: 'Token received' });
    } else if (request.jwt) {
        jwt = request.jwt;
        console.log('JWT received:', jwt);
        sendResponse({ message: 'JWT received' });
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
    }
});
