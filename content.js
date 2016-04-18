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

//parses webpage HTML for links
function parseHTMLforLinks(response) {
	var el = document.createElement('html');  // create dummy HTML document to create NodeList of links
	el.innerHTML = response;									// add html to DOM
	var nl = el.getElementsByTagName('a');    // Live NodeList of anchor elements
	var arr = Array.prototype.slice.call(nl); // convert NodeList to array
  var arrNew = sortAlphaUniq(arr);					// sorts alphabetically, removes duplicates
	return arrNew;														// RETURN converted array 	
}

//checks if value is a number
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//Gets story IDs by author
function getStoryIDs(eleArr){ //pass in array of elements(a)
  var storyIDs = [];
	for (var i=0, len=eleArr.length; i<len; i++) {
		var temp = eleArr[i].href.split("/");//splits each URL into sections by '/'
		for (var j=0, len2=temp.length; j<len2; j++){
			var next = j+1;
			if (temp[j]==="works" && next<len2){ //adds numbers following "works/" to storyID array
				if (isNumeric(temp[next]))  //if value is number
				  storyIDs.push(temp[next]);//add to storyIDs array
      }
		}
	}	
	return storyIDs;
}

//Clears printed list of links
function clearOutput(){
	var printArr = document.getElementById('printArr');	    //prints ALL links from HTML
	var printWorks = document.getElementById('printWorks'); //VISIBLE	//prints storyIDs and URLs
	var printLL = document.getElementById('printLinkList'); //prints links w/o HTTP
	var printSortedLinks = document.getElementById('printSortedLinks');	  //prints edited, sorted links list   
	printArr.innerHTML = printWorks.innerHTML = printLL.innerHTML 
	                   = printSortedLinks.innerHTML = '';		//CLEARS ALL OUTPUT
}

//Adds a formatted array to Div InnerHTML
function printArrayToDivInnerHTML(divName, array) {
  for (i=0, j=array.length; i<j; i++){
	  divName.innerHTML += array[i] + "<br>";
	}
}

//Prints links of works from author
function printAuthorFicLinks (divName, storyIDs, linkBeginning) {
	divName.innerHTML += "<br>Story URLs: <br>".bold();
	for (i=0, j=storyIDs.length; i<j; i++){
		divName.innerHTML += linkBeginning + "/" + storyIDs[i] + "<br>";
	}
}

//Prints list of storyIDs and storyURLs
function printList(ao3LinkToAuthorWorks, response) {
	var arr = [], storyIDs = [], storyIDsAll = [];          //initialize arrays
	var printArr = document.getElementById('printArr');	    //prints ALL links from HTML
	var printWorks = document.getElementById('printWorks'); //VISIBLE	
	var printLL = document.getElementById('printLinkList'); //prints links w/o HTTP
	var printSortedLinks = document.getElementById('printSortedLinks');	  //prints edited, sorted links list
	printArr.style.display = 'none'; 				 // HIDES 'printArr' div
	printLL.style.display = 'none'; 				 // HIDES 'printLinkList' div	
	printSortedLinks.style.display = 'none'; // HIDES 'TestDiv' div
	
	arr = parseHTMLforLinks(response);  //gets links from HTML

	//print arr[] values in printLL, printArr
	printArr.innerHTML = "Printing arr[] values: <br>";
	for (var i=1, j=arr.length+1; i<j; i++) { //debug replace j w/ 10
		printArr.innerHTML += i + '. ' + arr[i] + '<br>';
		printLL.innerHTML += i + '. ' + arr[i] + '<br>';
	}

	//print story IDs
	storyIDsAll = getStoryIDs(arr);				 //gets story ids from element array
	storyIDs = sortAlphaUniq(storyIDsAll); //alphabetical, unique values
	printWorks.innerHTML += "Story IDs: <br>".bold();
	printArrayToDivInnerHTML(printWorks, storyIDs);
	//print URLs from story IDs
	printAuthorFicLinks(printWorks, storyIDs, ao3LinkToAuthorWorks);

	//print formatted list of links
	printLL.innerHTML = printLL.innerHTML.replace(/http:\/\//g,'');
	printSortedLinks.innerHTML = '<br>Unique, sorted list of links: <br>' 
	                       + printLL.innerHTML.replace(/chrome-extension:\/\/mhnpeajhbneafhmljmanlnonhdlgpfja/g,
												 'archiveofourown.org/users/deritine');
	printSortedLinks.innerHTML = printSortedLinks.innerHTML.sort().replace(/http:\/\//g, '');
}

// the function which handles the input field logic
function getUserName() {
  clearOutput(); //clears output on subsequent calls
	var authorName = document.getElementById('nameField').value; //gets user inputted author
	var ao3LinkToAuthor = 'http://archiveofourown.org/users/' + authorName;
	var ao3LinkToAuthorWorks = 'http://archiveofourown.org/works';
	var ao3LinkToAuthorWorks2 = 'http://archiveofourown.org/users/' + authorName + '/pseuds/' + authorName + '/works';
	var result = document.getElementById('result');
	
	if (authorName.length < 3) {
		result.textContent = 'ERROR:  Username must contain at least 3 characters';
	} else {
		result.innerHTML = 'Author: '.bold() + authorName;
	}
	
	var Printao3AuthorURL = document.getElementById('printAuthorURL');
	Printao3AuthorURL.innerHTML = 'Author URL:  '.bold() + ao3LinkToAuthor;
	sendRequest(ao3LinkToAuthorWorks2, function (response) { 	//Get HTML from URL based on input //ao3LinkToFrayachWorks
		printList(ao3LinkToAuthorWorks, response); //Parse HTML for links, and print in list			 //ao3LinkToAuthorWorks
	});
}
// hard-coded test function
function getUserNameHARD() {
  clearOutput();
	var authorName = 'deritine';
	var ao3LinkToAuthor = 'http://archiveofourown.org/users/' + authorName;
	var ao3LinkToAuthorWorks = 'http://archiveofourown.org/works';
	var ao3LinkToAuthorWorks2 = 'http://archiveofourown.org/users/' + authorName + '/pseuds/' + authorName + '/works';
	var result = document.getElementById('result');
	result.innerHTML = 'Author: '.bold() + authorName;
	
	var Printao3AuthorURL = document.getElementById('printAuthorURL');
	Printao3AuthorURL.innerHTML = 'Author URL:  '.bold() + ao3LinkToAuthor;
	sendRequest(ao3LinkToAuthorWorks2, function (response) { 	//Get HTML from URL based on input //ao3LinkToFrayachWorks
		printList(ao3LinkToAuthorWorks, response); //Parse HTML for links, and print in list			 //ao3LinkToAuthorWorks
	});
}

var subButton = document.getElementById('subButton'); 
subButton.addEventListener('click', getUserName, false);// use an event listener for the event
var testButton = document.getElementById('testButton'); 
testButton.addEventListener('click', getUserNameHARD, false);