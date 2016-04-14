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

//sorts arrays in alphabetical order and removes duplicates
function sortAlphaUniq(array) {
  array = array.sort(); 		// sort alphabetical order
	array = uniq_fast(array); // removes duplicates from links list
	return array;
}

//parses webpage HTML for links
function parseHTMLforLinks(response) {
	var el = document.createElement('html');  //create dummy HTML document to create NodeList of links
	el.innerHTML = response;
	var nl = el.getElementsByTagName('a');    // Live NodeList of anchor elements
	var arr = Array.prototype.slice.call(nl); // convert NodeList to array
  var arrNew = sortAlphaUniq(arr);					// sorts alphabetically, removes duplicates
	return arrNew;														// RETURN converted array 	
}

//Removes duplicates from links list
function uniq_fast(a) {
	var seen = {}, out = [];
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

//checks if value is a number
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//Gets story IDs by author
function getStoryIDs(eleArr){ //pass in array of elements(a)
  var storyIDs = [];
	for (var i=0, j=eleArr.length; i<j; i++) {
		var temp = eleArr[i].href.split("/");//splits each URL into sections by '/'
		for (var i2=0; i2 < temp.length; i2++){
			if (temp[i2] === "works" && i2+1 < temp.length){ //adds numbers following "works/" to storyID array
				if (isNumeric(temp[i2+1]))  //if value is number
				  storyIDs.push(temp[i2+1]);//add to storyIDs array
      }
		}
	}	
	return storyIDs;
}

//printsList
function printList(response) {
	var arr = [], storyIDs = [], storyIDsAll = [];
	var printTemp1 = document.getElementById('printTemp1');	
	var printLL = document.getElementById('printLinkList');
	var printInner = document.getElementById('TestDiv');	
	arr = parseHTMLforLinks(response);  //gets links from HTML

//	printTemp1.style.display = 'none'; // HIDEs this div
	printTemp1.innerHTML = "Printing arr[] values: <br>";
	for (var i=0, j=arr.length; i<10; i++) { //debug replace j2 w/ 10
		printTemp1.innerHTML += i+1 + '. ' + arr[i] + '<br>';
		printLL.innerHTML += i+1 + '. ' + arr[i] + '<br>';
	}

	storyIDsAll = getStoryIDs(arr);				 //gets story ids from element array
	storyIDs = sortAlphaUniq(storyIDsAll); //alphabetical, unique values
	printTemp1.innerHTML += "<br> StoryIDs: <br>";
	for (i=0, j=storyIDs.length; i<j; i++){
	  printTemp1.innerHTML += storyIDs[i] + "<br>";
	}

	printLL.style.display = 'none'; // HIDEs this div
	printLL.innerHTML = printLL.innerHTML.replace(/http:\/\//g,'');
	printInner.innerHTML = '<br>Unique, sorted list of links: <br>' 
	                       + printLL.innerHTML.replace(/chrome-extension:\/\/mhnpeajhbneafhmljmanlnonhdlgpfja/g,
												 'archiveofourown.org/users/deritine');
	printInner.innerHTML = printInner.innerHTML.sort().replace(/http:\/\//g, '');
}

// the function which handles the input field logic
function getUserName() {
  var nameField = 'deritine'; //hard-coded for testing purposes
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