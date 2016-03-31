// get HTML from webpage URL
function sendRequest(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
				callback(xhr.responseText);
		}
	};
	xhr.open("GET", url, true);
	xhr.send();
}

function printList(response) {
	var linkHTML = document.getElementById('HTMLfromLink');
	var el = document.createElement('html');
	el.innerHTML = response;
	var nl = el.getElementsByTagName('a');// Live NodeList of anchor elements
	var arr = Array.prototype.slice.call(nl);
	var printLL = document.getElementById('printLinkList');
	for (index = 0; index < arr.length; index++) { //DEBUG: replaced "arr.length" w/ 10
		printLL.innerHTML += index+1 + '. ' + arr[index] + '<br>'; //To-do: remove 'arr[index]'s that start with chrome.runtime.id = .substring(chrome.runtime.id.length)
	}
}

// the function which handles the input field logic
function getUserName() {
	var nameField = document.getElementById('nameField').value;
	var ao3LinkToAuthor = 'http://archiveofourown.org/users/' + nameField;
	var result = document.getElementById('result');
	
	if (nameField.length < 3) {
		result.textContent = 'Username must contain at least 3 characters';
	} else {
		result.textContent = 'Author: ' + nameField;
	}
	
	var Printao3AuthorURL = document.getElementById('printAuthorURL');
	Printao3AuthorURL.textContent = 'Author URL: ' + ao3LinkToAuthor;
	//Get HTML from URL based on input
	sendRequest(ao3LinkToAuthor, function (response) {
		//Parse HTML for links, and print in list
		printList(response);
	});
}
// use an eventlistener for the event
var subButton = document.getElementById('subButton');
subButton.addEventListener('click', getUserName, false);
