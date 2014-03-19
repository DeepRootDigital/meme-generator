$(document).ready(function() {

	// Determine the logged in user and display their username
	loggedinUser();

	// Logout function
	$('#logout').click(function(event){
		event.preventDefault();
		// Remove the cookie
		document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		// Redirect to login page
		window.location = "/login";
	});

	// Give link functionality to the logo
	$('#logolink').click(function(event){
		event.preventDefault();
		if (getCookie("id")) {
			// Redirct to home if logged in
			window.location = "/home";
		} else {
			// Redirect to frontpage if logged out
			window.location = "/";
		}
	});

});

function loggedinUser() {
	var loggeduser = getCookie("id");
	$('#cookied-name').text(loggeduser);
}

/* Get the cookie info */
function getCookie(cname)
{
var name = cname + "=";
var ca = document.cookie.split(';');
for(var i=0; i<ca.length; i++) 
  {
  var c = ca[i].trim();
  if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
return "";
}