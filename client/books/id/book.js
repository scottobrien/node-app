const BASE_URL = 'http://localhost:8000';
const elemLogout = document.getElementById('logout');
var ls = window.localStorage;
var lsNodeApp = ls.getItem('node-app');
lsNodeApp = JSON.parse(lsNodeApp);
var id = window.location.search;
id = id.substring(id.indexOf('?id=') + 4);
book = {};
book.type = (id.substring(id.indexOf('?type=') + 6) === 'fiction') ? 'fiction' : 'nonfiction';
book.id = id.substring(0, id.lastIndexOf('?'));

var ls = window.localStorage.getItem('node-app');
ls = JSON.parse(ls);

const elemListBook = document.getElementById('listBook');
const elemSaveBook = document.getElementById('saveBook');
const elemValueBook = document.getElementById('valueBook');

// Post book
fetch(BASE_URL + '/books/', {
  method: 'POST',
  headers: new Headers({
  	'Content-Type': 'application/json',
  	'Authorization': 'Bearer ' + lsNodeApp.token
  }),
  body: JSON.stringify(book)
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
  console.log('Book: ', json.book);
  book = json.book;
  listBuilder();
})
.catch(function(err) {
  console.log('Error: ', err);
});

// Build and put list on page
function listBuilder() {
  var html = null;
  var listItem = null;
  var bName = titleCase(book.bookName);
  elemValueBook.value = bName;
  listItem = document.createElement('li');
  listItem.className = 'media';
  listItem.innerHTML =  '<img class="align-self-center mr-3" width="64" height="64" src="' + book.image + '" alt="'+ bName +'">' +
                        '<div class="media-body">' +
                          '<h5 class="mt-3" id="bookName">' + bName +'</h5>' +
                          '<p class="mb-3">Author: ' + book.authorName +
                          '<br>Type: ' + book.type +
                          '</p>' +
                        '</div>';
                          
  elemListBook.appendChild(listItem);
}

function saveBook() {
	const elemBookName = document.getElementById('bookName');
	book.edit = true;
	book.type = (id.substring(id.indexOf('?type=') + 6) === 'fiction') ? 'fiction' : 'nonfiction';
	book.bookName = titleCase(elemValueBook.value);

	fetch(BASE_URL + '/books/', {
	  method: 'POST',
	  headers: new Headers({
	  	'Content-Type': 'application/json',
	  	'Authorization': 'Bearer ' + lsNodeApp.token
	  }),
	  body: JSON.stringify(book)
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
	  console.log('Book: ', json);
	  elemBookName.innerHTML = book.bookName;
	  elemValueBook.value = book.bookName;

	})
	.catch(function(err) {
	  console.log('Error: ', err);
	});
}

function titleCase(str) {
  return str.replace(/\b\S/g, function(t) { return t.toUpperCase() });
}

elemSaveBook.addEventListener('click', function(e) {
	e.preventDefault();
	saveBook();
});

elemLogout.addEventListener('click', function(e) {
  e.preventDefault();
  ls.setItem('node-app', "");
  window.location.href = '/';
});

console.log('Book ID', window.location.search, id);
