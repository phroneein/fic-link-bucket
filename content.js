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

function parseHTMLforLinks(response) {
	var linkHTML = document.getElementById('HTMLfromLink');
	var el = document.createElement('html');  //create dummy HTML document to create NodeList of links
	el.innerHTML = response;
	var nl = el.getElementsByTagName('a');    // Live NodeList of anchor elements
	var arr = Array.prototype.slice.call(nl); // convert NodeList to array
	arr = arr.sort(); 												// sort alphabetical order
	arr = uniq_fast(arr);  										// removes duplicates from links list
	return arr;																// RETURN converted array 
}

//Removes duplicates from links list
function uniq_fast(a) {
	var seen = {};
	var out = [];
	var len = a.length;
	var j = 0;
	for(var i = 0; i < len; i++) {
	  var item = a[i];
	  if(seen[item] !== 1) {
		  seen[item] = 1;
		  out[j++] = item;
	  }
	}
  return out;
}

//printsList
function printList(response) {
	var arr = parseHTMLforLinks(response);
	
	var printLL = document.getElementById('printLinkList');
	printLL.style.display = 'none';
	for (var i=0, j=arr.length; i<j; i++) { //DEBUG: replaced j w/ 10
		printLL.innerHTML += i+1 + '. ' + arr[i] + '<br>';
	}
	var printInner = document.getElementById('TestDiv');
	printInner.innerHTML = '<br>Unique, sorted list of links: <br><br>' 
												 + printLL.innerHTML.replace(/chrome-extension:\/\/mhnpeajhbneafhmljmanlnonhdlgpfja/g,'archiveofourown.org/users/deritine');
	printInner.innerHTML = printInner.innerHTML.sort().replace(/http:\/\//g, '');;
}

// the function which handles the input field logic
function getUserName() {
//	var nameField = document.getElementById('nameField').value;
  var nameField = 'deritine';
	var ao3LinkToAuthor = 'http://archiveofourown.org/users/' + nameField;
	var result = document.getElementById('result');
	
	if (nameField.length < 3) {
		result.textContent = 'Username must contain at least 3 characters';
	} else {
		result.textContent = 'Author: ' + nameField;
	}
	
	var Printao3AuthorURL = document.getElementById('printAuthorURL');
	Printao3AuthorURL.textContent = 'Author URL: ' + ao3LinkToAuthor;
	sendRequest(ao3LinkToAuthor, function (response) { 	//Get HTML from URL based on input
		printList(response); //Parse HTML for links, and print in list
	});
}
var subButton = document.getElementById('subButton'); 
subButton.addEventListener('click', getUserName, false);// use an eventlistener for the event