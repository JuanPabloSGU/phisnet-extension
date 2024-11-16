interface Link {
    href: string;
    text: string;
}

chrome.storage.local.get(['automatic_search'], (result) => {
    if (result.automatic_search) {
        chrome.storage.local.get(['jwt'], (result) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } else {
                const jwt = result.jwt;
                if (jwt) {
                    const a_tags = document.getElementsByTagName('a');

                    const possible_links = new Set<Link>();

                    for (let i = 0; i < a_tags.length; i++) {
                        possible_links.add({
                            href: a_tags[i].href,
                            text: a_tags[i].innerText
                        });
                    }

                    const fetchLinksPromises = Array.from(possible_links).map(link => {
                        return fetch('http://localhost:5000/api/v1/llm_mock', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${jwt}`
                            },
                            body: JSON.stringify({ url: link.href })
                        })
                            .then(response => response.json())
                            .then(data => {
                                return { url: link.href, score: data.message };
                            })
                            .catch(error => {
                                console.error('Error fetching data:', error);
                            });
                    });

                    Promise.all(fetchLinksPromises).then(links => {
                        links = links.filter(link => link !== null && link !== undefined && link.url !== null && link.url !== undefined && link.url !== '');

                        chrome.runtime.sendMessage({ links: links }, (response) => {
                            console.log('Response from background:', response);
                        });
                    });
                } else {
                    console.error('JWT is empty');
                }
            }
        });
    } else {
        console.log('Automatic search disabled');
    }
});
