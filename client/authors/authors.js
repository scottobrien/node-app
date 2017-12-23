const BASE_URL = 'http://localhost:8000';

const elemListAuthors = document.getElementById('listAuthors');
const elemLogout = document.getElementById('logout');
var ls = window.localStorage;
var lsNodeApp = ls.getItem('node-app');
lsNodeApp = JSON.parse(lsNodeApp);

// Get Authors
fetch(BASE_URL + '/author/', {
  method: 'GET',
  headers: new Headers({
    'Authorization': 'Bearer ' + lsNodeApp.token
  })
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
  listBuilder(json);
})
.catch(function(err) {
  console.log('Error: ', err);
});

// Build and put list on page
function listBuilder(arr) {
  var html = null;
  var listItem = null;
  for (var i = 0; i < arr.length; i++) {
    listItem = document.createElement('li');
    listItem.className = 'media';
    // listItem.setAttribute('id', arr[i].id);
    listItem.innerHTML =  '<img class="align-self-center mr-3" width="64" height="64" src="' + arr[i].image + '" alt="'+ arr[i].name +'">' +
                          '<div class="media-body">' +
                            '<h5 class="mt-3" id=""><a href="./id/?id=' + arr[i].id + '">' + arr[i].name +'</a></h5>' +
                            '<p class="mb-3">Author</p>' +
                          '</div>';
                            
    elemListAuthors.appendChild(listItem);
  }
}

elemLogout.addEventListener('click', function(e) {
  e.preventDefault();
  ls.setItem('node-app', "");
  window.location.href = '/';
});
