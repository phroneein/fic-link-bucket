sendRequest('http://archiveofourown.org/users/deritine/pseuds/deritine', function (response) {
  var linkHTML = document.getElementById('HTMLfromLink');
	linkHTML.textContent = 'My request returned this: <xmp>' + response + '</xmp>';
	// <xmp>response</xmp> --> so it will print out the XML code instead of rendering
}); 

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
	var result = document.getElementById('result');
	
	if (nameField.length < 3) {
			result.textContent = 'Username must contain at least 3 characters';
			//alert('Username must contain at least 3 characters');
	} else {
			result.textContent = 'Your username is: ' + nameField;
			//alert(nameField);
	}
}
// use an eventlistener for the event
var subButton = document.getElementById('subButton');
subButton.addEventListener('click', getUserName, false);
