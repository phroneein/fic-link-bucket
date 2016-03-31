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

function ShowResults(value){
	alert(index);
}

function getLinks(response){
	var el = document.createElement('html');
	el.innerHTML = response;
	var nl = el.getElementsByTagName('a');// Live NodeList of anchor elements
  var arr = [];
  for(var i = nl.length; i--; arr.unshift(nl[i]));
	linklist.textContent = 'Array: ' + arr;
	alert(arr);
////	x = Array.prototype.slice.call(x);
////	var fullLinkList = x.foreach(ShowResults);
////	linklist.textContent = 'All links:  ' + fullLinkList;
	//var linklist = document.getElementById('printLinkList');
	//linklist.textContent = el.getElementsByTagName('a');
//	var i;
//	var linklist = document.getElementById('printLinkList');
	/*for (i=0; i<x.length; i++) [
		linklist.textContent = x[i] + '\n';
	}*/
//	linklist.textContent = 'First element: ' + x[i];
}

// the function which handles the input field logic
function getUserName() {
	var nameField = document.getElementById('nameField').value;
	var ao3LinkToAuthor = 'http://archiveofourown.org/users/' + nameField;
	var result = document.getElementById('result');
	
	if (nameField.length < 3) {
		result.textContent = 'Username must contain at least 3 characters';
		//alert('Username must contain at least 3 characters');
	} else {
		result.textContent = 'Your username is: ' + nameField;
		//alert(nameField);
	}
	
	var Printao3AuthorURL = document.getElementById('printAuthorURL');
	Printao3AuthorURL.textContent = 'Author URL: ' + ao3LinkToAuthor;
	sendRequest(ao3LinkToAuthor, function (response) {
		//getLinks(response);
		var linkHTML = document.getElementById('HTMLfromLink');
		//////////linkHTML.textContent = 'Your request returned this: <xmp>' + response + '</xmp>';
		////////// <xmp>response</xmp> --> so it will print out the XML code instead of rendering
		
		var el = document.createElement('html');
		el.innerHTML = response;
		var nl = el.getElementsByTagName('a');// Live NodeList of anchor elements
		var arr = Array.prototype.slice.call(nl);
		/*for (var index = 0; index < nl.length; index++) {
			alert(nl[index]);//works -- pop up with URL
		}*/
		for (index = 0; index < arr.length; index++) {
		  document.write(arr[index] + '<br><br>');
		}
		
		linklist.textContent = 'Array: ' + arr;
	});
}
// use an eventlistener for the event
var subButton = document.getElementById('subButton');
subButton.addEventListener('click', getUserName, false);
