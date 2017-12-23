const BASE_URL = 'http://localhost:8000';

const elemTitle = document.getElementById('title');
const elemValidation = document.getElementById('validation');
const formSignUp = document.getElementsByTagName('form')[0];
const formLogin = document.getElementsByTagName('form')[1];
var user = {};

fetch(BASE_URL, {
  method: 'GET',
})
.then(function(result) {
  if (result.statusText === 'OK') {
    return result.json(); 
  }
  throw new TypeError('Something happen...');
})
.then(function(json) {
  elemTitle.innerHTML = json.title;
});

function userInit(user) {
  fetch(BASE_URL + '/user/', {
    method: 'POST',
    headers: new Headers({
    'Content-Type': 'application/json'
    }),
    body: JSON.stringify(user)
  })
  .then(function(result) {
    if(result.statusText === 'OK') {
      return result.json();
    }
    throw new TypeError('ERROR: ', result);
  })
  .then(function(json) {
    formSignUp.elements.username.value = '';
    formSignUp.elements.password.value = '';
    console.log('DATA POSTED: ', json);
  }); 
}

function authInit(user) {
  console.log('authInit ', user);
  fetch(BASE_URL + '/auth/', {
    method: 'POST',
    headers: new Headers({
    'Content-Type': 'application/json'
    }),
    body: JSON.stringify(user)
  })
  .then(function(result) {
    if(result.statusText === 'OK') {
      return result.json();
    }
    throw new TypeError('ERROR: ', result);
  })
  .then(function(obj) {
    if (!obj.isAuth) {
      console.log(obj.msg);
      elemValidation.innerText = obj.msg;
      return;
    }
    formLogin.elements.username.value = '';
    formLogin.elements.password.value = '';
    delete obj.isAuth;
    window.localStorage.setItem('node-app', JSON.stringify(obj));
    window.location.href = '/profile/'
  });
}




function signUpInit() {
  user.username = formSignUp.elements.username.value;
  user.password = formSignUp.elements.password.value;
  userInit(user);
}

function loginInit() {
  user.username = formLogin.elements.username.value;
  user.password = formLogin.elements.password.value;
  authInit(user);
}



