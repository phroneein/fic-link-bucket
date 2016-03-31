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
	sendRequest(ao3LinkToAuthor, function (response) {
		var linkHTML = document.getElementById('HTMLfromLink');
		//////////linkHTML.textContent = 'Your request returned this: <xmp>' + response + '</xmp>';
		////////// <xmp>response</xmp> --> so it will print out the XML code instead of rendering
		var el = document.createElement('html');
		el.innerHTML = response;
		var nl = el.getElementsByTagName('a');// Live NodeList of anchor elements
		var arr = Array.prototype.slice.call(nl);
		var printLL = document.getElementById('printLinkList');
		for (index = 0; index < arr.length; index++) { //DEBUG: replaced "arr.length" w/ 10
//		  document.writeln(arr[index] + '<br>'); //writes w/ newline after text
			printLL.innerHTML += arr[index] + '<br>';
			//To-do: remove 'arr[index]'s that start with chrome.runtime.id = .substring(chrome.runtime.id.length)
		}
	});
}
// use an eventlistener for the event
var subButton = document.getElementById('subButton');
subButton.addEventListener('click', getUserName, false);
