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
}

//parses webpage HTML for links
function parseHTMLforLinks(response) {
	var el = document.createElement('html');  //create dummy HTML document to create NodeList of links
	el.innerHTML = response;
	var nl = el.getElementsByTagName('a');    // Live NodeList of anchor elements
	var arr = Array.prototype.slice.call(nl); // convert NodeList to array
  sortAlphaUniq(arr);												// sorts alphabetically, removes duplicates
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

//Gets story IDs by author
function getStoryIDs(arr){
  var storyIDs = [];
	for (var i=0, j=arr.length; i<j; i++) {
		var temp = arr[i].split("/");//splits each URL into sections by '/'
		for (var i2=0; i2 < temp.length; i2++){
			if (temp[i2] === "works"){ //adds numbers following "works/" to storyID array
			  storyIDs.push(temp[i2+1]);
      }
		}
	}	
	return storyIDs;
}

//printsList
function printList(response) {
	var arr = [];
	arr = parseHTMLforLinks(response);  //gets links from HTML
	var temp1 = [];
	var temp2 = [];
	for (var i2=0, j2=arr.length; i2<j2; i2++) { //make copy of arr
		temp1[i2] = arr[i2];
		temp2[i2] = arr[i2];
	}
	var storyIDs = [];
	var printTemp1 = document.getElementById('printTemp1');
//	printTemp1.style.display = 'none'; // HIDE this div
	printTemp1.innerHTML = "Printing copy of arr[] values: <br>";
	for (i2=0, j2=temp1.length; i2<10; i2++) { //debug replace j2 w/ 10
		printTemp1.innerHTML += i2+1 + '. ' + temp1[i2] + '<br>';
	}
	var temp = ["tester/works/321", "test/works/123"];//works

	var arrSplit = [];
	tempStringArr = temp2[1];
	alert(temp2[1]);
	var arrSplit = arr[1].href.split('/');
	alert("arrSplit = " + arrSplit.join('\n'))
	for (var i=0, j=arr.length; i<j; i++) {
		var tempSplit = arr[i].href.split("/");//splits each URL into sections by '/'
		for (var i2=0; i2 < tempSplit.length; i2++){
			if (tempSplit[i2] === "works" && i2+1 < tempSplit.length){ //adds numbers following "works/" to storyID array
			  storyIDs.push(tempSplit[i2+1]);
      }
		}
	}
	sortAlphaUniq(storyIDs);
	printTemp1.innerHTML += "<br> StoryIDs: <br>";
	for (i=0, j=storyIDs.length; i<j; i++){
	  printTemp1.innerHTML += storyIDs[i] + "<br>";
	}
	
	var printLL = document.getElementById('printLinkList');
	printLL.style.display = 'none'; // HIDE this div
	for (var i=0, j=arr.length; i<10; i++) { //DEBUG: replace 'j' w/ '10'
		printLL.innerHTML += i+1 + '. ' + arr[i] + '<br>';
	}
	printLL.innerHTML = printLL.innerHTML.replace(/http:\/\//g,'');
	var printInner = document.getElementById('TestDiv');
	printInner.innerHTML = '<br>Unique, sorted list of links: <br><br>' + printLL.innerHTML.replace(/chrome-extension:\/\/mhnpeajhbneafhmljmanlnonhdlgpfja/g,'archiveofourown.org/users/deritine');
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