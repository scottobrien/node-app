const BASE_URL = 'http://localhost:8000';
const elemLogout = document.getElementById('logout');
var ls = window.localStorage;
var lsNodeApp = ls.getItem('node-app');
lsNodeApp = JSON.parse(lsNodeApp);

const elemListBooks = document.getElementById('listBooks');

// Get Books
fetch(BASE_URL + '/books/', {
  method: 'GET',
  headers: new Headers({
    'Authorization': 'Bearer ' + lsNodeApp.token
  }),
})
.then(function(result) {
  console.log('Result ', result);
  if (result.statusText === 'OK') {
    return result.json(); 
  }
  if (result.status === 401) {
    window.location.href = '/';
  }
  throw new TypeError(result);
})
.then(function(json) {
  console.log('Books: ', json);
  listBuilder(json);
})
.catch(function(err) {
  console.log('Error: ', err);
});

// Build and put list on page
function listBuilder(arr) {
  var html = null;
  var listItem = null;
  var bName = null;
  for (var i = 0; i < arr.length; i++) {
    listItem = document.createElement('li');
    listItem.className = 'media';
    bName = titleCase(arr[i].bookName);
    // listItem.setAttribute('id', arr[i].id);
    listItem.innerHTML =  '<img class="align-self-center mr-3" width="64" height="64" src="' + arr[i].image + '" alt="'+ bName +'">' +
                          '<div class="media-body">' +
                            '<h5 class="mt-3" id=""><a href="./id/?id=' + arr[i].id + '?type=' + arr[i].type + '">' + bName +'</a></h5>' +
                            '<p class="mb-3">Author: ' + arr[i].authorName  +
                            '<br>Type: '  + arr[i].type  +
                            '</p>' +
                          '</div>';
                            
    elemListBooks.appendChild(listItem);
  }
}

function titleCase(str) {
  return str.replace(/\b\S/g, function(t) { return t.toUpperCase() });
}

elemLogout.addEventListener('click', function(e) {
  e.preventDefault();
  ls.setItem('node-app', "");
  window.location.href = '/';
});

