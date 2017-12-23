var lsItem = window.localStorage.getItem('node-app');
var ls = window.localStorage;
const elemUserName = document.getElementById('userName');
const elemLogout = document.getElementById('logout');

lsItem = JSON.parse(lsItem);

console.log(lsItem.user.tokenExp, Date.now());

// if ()
elemUserName.innerHTML = lsItem.user.username.charAt(0).toUpperCase() + lsItem.user.username.slice(1).toLowerCase() + '\'s ';

elemLogout.addEventListener('click', function(e) {
	e.preventDefault();
	ls.setItem('node-app', "");
	window.location.href = '/';
});