const BASE_URL = 'http://localhost:8000';

var id = window.location.search;
const elemLogout = document.getElementById('logout');
var ls = window.localStorage;
var lsNodeApp = ls.getItem('node-app');
lsNodeApp = JSON.parse(lsNodeApp);
id = id.substring(id.lastIndexOf('?id=') + 4)
author = {};
author.id = id;

const elemListAuthors = document.getElementById('listAuthor');
const elemSaveAuthor = document.getElementById('saveAuthor');
const elemValueAuthor = document.getElementById('valueAuthor');

// Get Authors
fetch(BASE_URL + '/author/', {
  method: 'POST',
  headers: new Headers({
  	'Content-Type': 'application/json',
  	'Authorization': 'Bearer ' + lsNodeApp.token
  }),
  body: JSON.stringify(author)
})
.then(function(result) {
  if (result.statusText === 'OK') {
    return result.json(); 
  }
  if (result.status === 401) {
    window.location.href = '/';
  }
  throw new TypeError('Something happen...', result);
})
.then(function(json) {
  console.log('Author: ', json.author);
  author = json.author;
  listBuilder();
  elemValueAuthor.value = author.name;
})
.catch(function(err) {
  console.log('Error: ', err);
});

// Build and put list on page
function listBuilder(arr) {
  var html = null;
  var listItem = null;
  listItem = document.createElement('li');
  listItem.className = 'media';
  listItem.innerHTML =  '<img class="align-self-center mr-3" width="64" height="64" src="' + author.image + '" alt="'+ author.name +'">' +
                        '<div class="media-body">' +
                          '<h5 class="mt-3" id="authorName">' + author.name +'</h5>' +
                          '<p class="mb-3">Author</p>' +
                        '</div>';
                          
  elemListAuthors.appendChild(listItem);
}

function saveAuthor() {
	const elemAuthorName = document.getElementById('authorName');
	author.edit = true;
	author.name = elemValueAuthor.value;

	fetch(BASE_URL + '/author/', {
	  method: 'POST',
	  headers: new Headers({
	  	'Content-Type': 'application/json',
	  	'Authorization': 'Bearer ' + lsNodeApp.token
	  }),
	  body: JSON.stringify(author)
	})
	.then(function(result) {
	  if (result.statusText === 'OK') {
	    return result.json(); 
	  }
	  if (result.status === 401) {
	    window.location.href = '/';
	  }
	  throw new TypeError('Something happen...', result);
	})
	.then(function(json) {
	  console.log('Author: ', json);
	  elemAuthorName.innerHTML = author.name;
	  elemValueAuthor.value = author.name;

	})
	.catch(function(err) {
	  console.log('Error: ', err);
	});
}

elemSaveAuthor.addEventListener('click', function(e) {
	e.preventDefault();
	saveAuthor();
});

elemLogout.addEventListener('click', function(e) {
  e.preventDefault();
  ls.setItem('node-app', "");
  window.location.href = '/';
});

console.log('Author ID', window.location.search, id);
