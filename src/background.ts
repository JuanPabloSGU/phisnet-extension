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

