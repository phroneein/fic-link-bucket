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

//get number of author works pages
function getNumWorksPages(arr) {
	var numWorksPages = 1;
	for (var i=0, len=arr.length; i<len; i++) {
  	var tempStr = String(arr[i]);
		if (tempStr.includes("works?page="))//format of URLs -- ex:"works?page=6"
			numWorksPages++;									//if link includes "works?page=" then author has another page of works links
	}
//	alert("Number of Works Pages = " + numWorksPages);
	return numWorksPages;
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
	var printWorks = document.getElementById('printWorks'); //VISIBLE	//prints storyIDs
	var printURLs = document.getElementById('printURLs');		//VISIBLE //prints storyURLs
	var printLL = document.getElementById('printLinkList'); //prints links w/o HTTP
	var printSortedLinks = document.getElementById('printSortedLinks');	  //prints edited, sorted links list   
	printArr.innerHTML = printWorks.innerHTML = printLL.innerHTML = printURLs.innerHTML
	                   = printSortedLinks.innerHTML = '';		//CLEARS ALL OUTPUT
}

//Adds a formatted array to Div InnerHTML
function printArrayToDivInnerHTML(divName, array) {
  for (i=0, j=array.length; i<j; i++){
	  divName.innerHTML += array[i] + "<br>";
	}
}

//Prints links of works from author
function printAuthorFicLinks(divName, storyIDs, linkBeginning) {
	for (i=0, j=storyIDs.length; i<j; i++){
		divName.innerHTML += linkBeginning + "/" + storyIDs[i] + "<br>";
	}
}

//gets links from next page of author works
function getNextPageLinks(ao3LinkToAuthorWorks, response) {
	var printWorks = document.getElementById('printWorks'); //VISIBLE	
	var printURLs = document.getElementById('printURLs');		//VISIBLE
	
  var arr = parseHTMLforLinks(response); //gets links from HTML
	var storyIDsAll = getStoryIDs(arr);		 //gets story IDs from element array
	var storyIDs = sortAlphaUniq(storyIDsAll); //alphabetical, unique values
	
	printArrayToDivInnerHTML(printWorks, storyIDs);  								//print storyIDs
	printAuthorFicLinks(printURLs, storyIDs, ao3LinkToAuthorWorks); //print storyURLs
}

//Prints list of storyIDs and storyURLs
function printList(ao3LinkToAuthorWorks, response, authorName) {
	var arr = [], storyIDs = [], storyIDsAll = [];          //initialize arrays
	var printArr = document.getElementById('printArr');	    //prints ALL links from HTML
	var printWorks = document.getElementById('printWorks'); //VISIBLE	
	var printURLs = document.getElementById('printURLs');		//VISIBLE
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
	
	//print story div headers
	printWorks.innerHTML += "Story IDs: <br>".bold();
	printURLs.innerHTML += "Story URLs: <br>".bold();

	//print formatted list of links
	printLL.innerHTML = printLL.innerHTML.replace(/http:\/\//g,'');
	printSortedLinks.innerHTML = '<br>Unique, sorted list of links: <br>' 
	                       + printLL.innerHTML.replace(/chrome-extension:\/\/mhnpeajhbneafhmljmanlnonhdlgpfja/g,
												 'archiveofourown.org/users/deritine');
//	printSortedLinks.innerHTML = printSortedLinks.innerHTML.sort().replace(/http:\/\//g, ''); //TO DO: Find out why broken

	var numWorksPages = getNumWorksPages(arr);//get number of pages of author works
	var authorName = authorName; 
	var ao3LinkToAuthorWorks2 = 'http://archiveofourown.org/users/' + authorName + '/pseuds/' + authorName + '/works';
	var ao3Works = 'http://archiveofourown.org/users/' + authorName + '/pseuds/'+ authorName +'/works?page=';
	var ao3LinkToAuthorWorks = 'http://archiveofourown.org/works';
	for (var i=1; i<numWorksPages+1; i++) {
	  var tempWorksPage = ao3Works.concat(i.toString());
		sendRequest(tempWorksPage, function (responseNext) { 	//Get HTML from URL based on input //ao3LinkToFrayachWorks
			getNextPageLinks(ao3LinkToAuthorWorks, responseNext);
		});
	}	
//	printURLs.innerHTML += "All links found.".bold(); //does NOT print last
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
		printList(ao3LinkToAuthorWorks, response, authorName); //Parse HTML for links, and print in list			 //ao3LinkToAuthorWorks
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
		printList(ao3LinkToAuthorWorks, response, authorName); //Parse HTML for links, and print in list			 //ao3LinkToAuthorWorks
	});
}

var subButton = document.getElementById('subButton'); 
subButton.addEventListener('click', getUserName, false);// use an event listener for the event
var testButton = document.getElementById('testButton'); 
testButton.addEventListener('click', getUserNameHARD, false);