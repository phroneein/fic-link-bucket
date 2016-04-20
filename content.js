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
	var arrLinks = [];
	for (var i=0, len=arr.length; i<len; i++) {
  	var tempLink = String(arr[i]);
		if (tempLink.includes("works?page=")) {//format of URLs -- ex:"works?page=6"
			numWorksPages++;									//if link includes "works?page=" then author has another page of works links
			arrLinks.push(tempLink);
		}
	}
	var largestNum = 0;
/*	for (i=0, len=arrLinks.length; i<len; i++) {
	  tempLink = String(arrLinks[i]);
		var tempPageNum = location.pathname.match(/\/works?page=(.*)/)[1];
		alert(tempPageNum);
		if (tempPageNum > 0) {
		  largestNum = tempPageNum;
		}
	}*/
//	alert("Number of Works Pages = " + numWorksPages);
	return numWorksPages;
//	return largestNum;
}

//sorts arrays in alphabetical order and removes duplicates
function sortAscUniq(array) {
	array = array.sort(function(a, b){return a-b}); //sort numerical/ascending order
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

//Deselects all text
function clearSelection() {
    if ( document.selection ) {
        document.selection.empty();
    } else if ( window.getSelection ) {
        window.getSelection().removeAllRanges();
    }
}

//parses webpage HTML for links
function parseHTMLforLinks(response) {
	var el = document.createElement('html');  // create dummy HTML document to create NodeList of links
	el.innerHTML = response;									// add html to DOM
	var nl = el.getElementsByTagName('a');    // Live NodeList of anchor elements
	var arr = Array.prototype.slice.call(nl); // convert NodeList to array
  var arrNew = sortAscUniq(arr);					// sorts alphabetically, removes duplicates
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
function clearOutput(){ //used after "Get links!" button is clicked
	var printArr = document.getElementById('printArr');	    //prints ALL links from HTML
	var printWorks = document.getElementById('printWorks'); //VISIBLE	//prints storyIDs
	var printURLs = document.getElementById('printURLs');		//VISIBLE //prints storyURLs
	var printLL = document.getElementById('printLinkList'); //prints links w/o HTTP
	var printSortedLinks = document.getElementById('printSortedLinks');	  //prints edited, sorted links list   
	var printNSF = document.getElementById('printNumStoriesFound');		//VISIBLE
	printArr.innerHTML = printWorks.innerHTML = printLL.innerHTML = '';	//CLEARS ALL OUTPUT
	printURLs.innerHTML = printSortedLinks.innerHTML = '';							//CLEARS ALL OUTPUT
  printWorks.style.visibility = "visible";
	printURLs.style.visibility = "visible";
}

//Replace formatted array to Div InnerHTML
function printNewArrayToDivInnerHTML(divName, array) {
  divName.innerHTML = "";
  for (i=0, j=array.length; i<j; i++){
	  divName.innerHTML += array[i] + "\n";
	}
}

//Replace links of works from author
function printNewAuthorFicLinks(divName, storyIDs, linkBeginning) {
  divName.innerHTML = "";
	for (i=0, j=storyIDs.length; i<j; i++){
		divName.innerHTML += linkBeginning + "/" + storyIDs[i] + "\n";
	}
}

//Replace links from next page of author works
function getNewNextPageLinks(ao3LinkToAuthorWorks, response) {
	var printWorks = document.getElementById('printWorks'); //VISIBLE	
	var printURLs = document.getElementById('printURLs');		//VISIBLE
	
	var arrAll = addNextPageLinksToArr(ao3LinkToAuthorWorks, responseNext, arrAll);
	arrAll = sortAscUniq(arrAll);
	
	printNewArrayToDivInnerHTML(printWorks, storyIDs);  								//print storyIDs
	printNewAuthorFicLinks(printURLs, storyIDs, ao3LinkToAuthorWorks); //print storyURLs
}

//adds all links to array
function addNextPageLinksToArr(linkWorks, responseNext, arrAll) {
  var arr = parseHTMLforLinks(responseNext);//gets links from HTML
	var storyIDsNext = getStoryIDs(arr);		  //gets story IDs from element array
	var storyIDs = sortAscUniq(storyIDsNext);//alphabetical, unique storyID values
  var arrAll = arrAll.concat(storyIDs);			//add new storyIDs to arrAll (all links array)
  //alert(arrAll);	
	return arrAll;	//return updated array
}

//test function
function printArrAll(arrAll) {
	var arrAll = sortAscUniq(arrAll);
//	alert(arrAll);
	return arrAll;
}

//Prints list of storyIDs and storyURLs
function printList(ao3LinkToAuthorWorks, response, authorName) {
	var arr = [], storyIDs = [], storyIDsAll = [];          //initialize arrays
	var printNSF = document.getElementById('printNumStoriesFound');		//VISIBLE
	var printWorks = document.getElementById('printWorks'); 					//VISIBLE	
	var printURLs = document.getElementById('printURLs');							//make VISIBLE
	var printWorksTitle = document.getElementById('printWorksTitle'); //VISIBLE	
	var printURLsTitle = document.getElementById('printURLsTitle');		//VISIBLE
	
	arr = parseHTMLforLinks(response);  //gets links from HTML
	
	//print story div headers
	printWorksTitle.innerHTML = "Story IDs: ".bold();
	printURLsTitle.innerHTML = "Story URLs: ".bold();

	var numWorksPages = getNumWorksPages(arr);//get number of pages of author works //only finds up to 11 pages
	var authorName = authorName; 
	var ao3LinkToAuthorWorks2 = 'http://archiveofourown.org/users/' + authorName + '/pseuds/' + authorName + '/works';
	var ao3Works = 'http://archiveofourown.org/users/' + authorName + '/pseuds/'+ authorName +'/works?page=';
	var ao3LinkToAuthorWorks = 'http://archiveofourown.org/works';
	var arrAll = [];
	for (var i=1, j=numWorksPages+1; i<j; i++) {
	  var tempWorksPage = ao3Works.concat(i.toString());
		sendRequest(tempWorksPage, function (responseNext) { 	//Get HTML from URL based on input //ao3LinkToFrayachWorks
			arrAll = addNextPageLinksToArr(ao3LinkToAuthorWorks, responseNext, arrAll);
			arrAll = sortAscUniq(arrAll);
			printNewArrayToDivInnerHTML(printWorks, arrAll);
			printNewAuthorFicLinks(printURLs, arrAll, ao3LinkToAuthorWorks);
			printNSF.innerHTML ="Stories found: ".bold() + arrAll.length;
			alert(numWorksPages);
//			alert(arrAll);
		});
	}
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
// hard-coded test function //for DEBUGGING
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
var copyURLsBtn = document.querySelector('#copyURLsButton');
copyURLsBtn.addEventListener('click', function () {
  var urlField = document.querySelector('#printURLs');
  var range = document.createRange(); // create a Range object
  range.selectNode(urlField);					// set the Node to select the "range"
  window.getSelection().addRange(range);// add the Range to the set of window selections
  document.execCommand('copy');				// execute 'copy', can't 'cut' in this case
	clearSelection();										// deselects all text
}, false);
var printURLs = document.getElementById('printURLs');		//later VISIBLE //prints storyURLs
printURLs.style.visibility = "hidden";
var printIDs = document.getElementById('printWorks');		//later VISIBLE //prints storyIDs
printIDs.style.visibility = "hidden";







