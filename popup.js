

// acessing html elements to add dynamic behavior
const startButton = document.getElementById('startButton');
const buttonCountTag = document.getElementById("buttonCount");
const successMsgTag = document.getElementById('success');
const WrongVisitedSite = document.getElementById('wrongSite');
const countElement = document.getElementById('count');

// accessing manifest accepting urls 
const manifest = chrome.runtime.getManifest();
const matches = manifest.content_scripts[0].matches;

// creating a regular expression to compare our currTab url with this
const pattern = new RegExp("^" + matches[0].replace("*", ".*") + "$");


// adding event listener on startButton which will execute callback function after button clicked.
startButton.addEventListener('click', () => {

    // it is a query through chrome extenion to web content 
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, { action: 'startClicking' }, function (response) {
            if (response && response.status) {
                startButton.innerText = response.status;
            }
        });
    });
});

// this chrome extesion query will always excuted when we open our extension
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tabId = tabs[0].id;


    // checking if url is part of our regExp or not 

    if (pattern.test(tabs[0].url)) {
// send a request through pop to website to count total users which are available to connect on first page 
        chrome.tabs.sendMessage(tabId, { action: 'countButtons' }, function (response) {
            // handling response received back from request
            if (response && response.buttonCount) {

                let buttonCount = response.buttonCount;
                let currClickCount = response.currClickCount;
                buttonCountTag.textContent = "Available to connect: " + buttonCount;
                countElement.textContent = currClickCount;

                if (buttonCount == currClickCount) {
                    startButton.disabled = true;
                    startButton.classList.add("disabled");
                }

            }
        });

    }
    // if we are not at search results tab then we will shown one message showing you are not at correct tab
    else {
        console.log("visit linkedIn search result to use this extension");
        startButton.style.display = 'none';
        buttonCountTag.style.display = 'none';
        countElement.style.display = 'none';
        WrongVisitedSite.style.display = 'block';

    }




});








// this event will be executed when it receive updateCount action request
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
  
    if (request && request.action === 'updateCount' && request.count) {
        let count = request.count;
        countElement.textContent = count;
    }
});

// this event will be executed when it receive markCompleted action request
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request && request.action == 'markCompleted') {
        successMsgTag.style.display = 'block';
        startButton.style.display = 'none';
    }
})


