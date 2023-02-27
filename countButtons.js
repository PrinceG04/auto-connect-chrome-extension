
// to track connect buttons of users
let buttons = [];
// to track count of connect button clicked until now
let clickedCount = 0;
// using this variable we are managing our state of extension button auto connect button 
let buttonClickTracker = false;

// handling request received when auto connect button is clicked 
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request && request.action === 'startClicking') {
        // console.log("started");
        // sendResponse({status:'hello'});
        startClicking();
        if (buttonClickTracker) {
            sendResponse({ status: 'Stop' });
        }
        else {
            sendResponse({ status: 'Start' });
        }
        // sendResponse({status: 'hello'});
        // console.log({ buttonClickTracker });
    }
});
// handling request received when we open our extenion 
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request && request.action === 'countButtons') {
        // when i insepct linked then i found that all the button has this class name that's why i am using this click to access all the buttons 
        buttons = getConnectButtons(document.querySelectorAll('.artdeco-button'));
        sendResponse({ buttonCount: buttons.length, currClickCount: clickedCount });
    }
});


// function which gets all users connect buttons 
function getConnectButtons(buttonsArray) {
    const connectButtons = [];
    buttonsArray.forEach((button) => {
        if (button.innerText.split(' ').includes('Connect')) {
            connectButtons.push(button);
        }

    })
    return connectButtons;
}

// function to click the button which we get after clicking connect button and that button has 'Send now' label. 
function clickSendButton() {
    const buttonsArray = document.querySelectorAll('.artdeco-button');

    buttonsArray.forEach((button) => {


        if (button.ariaLabel == 'Send now') {
            console.log(button);
            // connectButtons.push(button);
            // button.click();
        }
        if (button.ariaLabel == 'Dismiss') {
            // console.log(button);
            // connectButtons.push(button);
            button.click();
        }
    })



// increase click count after send now button click
    clickedCount++;
    // sending that message to extension to update current count 
    chrome.extension.sendMessage({ action: 'updateCount', count: clickedCount });
// if we clicked all the buttons then we send message to show all connection request all sent 
    if (buttons.length == clickedCount) {
        chrome.extension.sendMessage({ action: 'markCompleted' });
    }

}

//  this function will click the connect button and send request to click send button 
function clickButton(button) {
    button.click();
    // after we click button then it will take some time to open toggle card which has functionality to send button and input some connection message with it.
    // for now we are only sending connection request.
    // we are using setTimeout which will wait for some time before doing to click send now button 
    setTimeout(clickSendButton, 0);
}

//  initializing variable to track curr user whom we need to send request 
let i = 0;
function startClicking() {
    buttonClickTracker = !buttonClickTracker;
// creating setInterval which will call function in after 1 sec  and continues that until all buttons are not clicked or we can send request to stop it.
    let interval = setInterval(function () {
        if (i < buttons.length && buttonClickTracker) {
            clickButton(buttons[i]);
            i++;
        }
        else {
            clearInterval(interval);
        }
    }, 1000);

}





