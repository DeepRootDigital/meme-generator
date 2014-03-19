$(document).ready(function(){
	// Script to register a new user
	$('#signup-register').click(function(event){
		event.preventDefault();
		// Grab the values from the form
		var username = $('#username').val();
		var email = $('#email').val();
		var password = $('#password').val();
		// Hash the password for security
		password = CryptoJS.SHA3(password).toString();
		// Create the object to be inserted into the database
		var userdata = {
			'username' : username,
			'email' : email,
			'password' : password
		};
		// Ajax request to insert into the database
		$.ajax({
			type: 'POST',
			data: userdata,
			url: '/register',
			dataType: 'JSON'
		})
		.done(function(response){
			// Analyze response message from server
			if (response.msg === '') {
				// If successful, set cookie and redirect
				var hashname = username;
				document.cookie = "id="+hashname;
				window.location = "/home";
			} else {
            	// Throw error if there is one
            	alert('Error: ' + response.msg);
            }
          });
	});

	$('#username').on('keyup',function(){
		// Set validity and get username inputted
		var valid = 1;
		var username = $('#username').val();
		$.getJSON( '/userlist', function( data ) {
			$.each(data, function(){
				if (username == this.username) {
					valid = 0;
				}
			});
			/* Give real time validation */
			if (valid == 0) {
				/* Give 'in use' message and put red outline */
				$('#signup-register').prop("disabled", true);
				$('#username').addClass('invalid');
				$('#username').removeClass('valid');
				$('.error-box').html('<p>That username is in use.</p>');
			} else {
				/* Get rid of error messages if they are there */
				$('#signup-register').prop("disabled", false);
				$('#username').removeClass('invalid');
				$('#username').addClass('valid');
				$('.error-box').html('');
			}
		});
	});

	$('#email').on('keyup',function(){
		// Set validity and get username inputted
		var valid = 1;
		var avail = 1;
		var email = $('#email').val();
		$.getJSON( '/userlist', function( data ) {
			$.each(data, function(){
				if (email == this.email) {
					avail = 0;
				}
			});
			if (!isValidEmailAddress(email)) {
				valid = 0;
			}
			/* Give real time validation */
			if (valid == 0) {
				/* Throw invalid email warning */
				$('#signup-register').prop("disabled", true);
				$('#email').addClass('invalid');
				$('#email').removeClass('valid');
				$('.error-box').html('<p>That email address is not valid.</p>');
			} else if (avail == 0) {
				/* Give 'in use' message and put red outline */
				$('#signup-register').prop("disabled", true);
				$('#email').addClass('invalid');
				$('#email').removeClass('valid');
				$('.error-box').html('<p>That email is in use.</p>');
			} else {
				/* Get rid of error messages if they are there */
				$('#signup-register').prop("disabled", false);
				$('#email').removeClass('invalid');
				$('#email').addClass('valid');
				$('.error-box').html('');
			}
		});
	});

	$('#repassword').on('keyup',function(){
		// Set validity and get username inputted
		var valid = 0;
		var pw = $('#password').val();
		var repw = $('#repassword').val();
		if (repw == pw) {
			valid = 1;
		}
		/* Give real time validation */
		if (valid == 0) {
			/* Give 'in use' message and put red outline */
			$('#signup-register').prop("disabled", true);
			$('#repassword').addClass('invalid');
			$('#repassword').removeClass('valid');
			$('.error-box').html('<p>The passwords do not match.</p>');
		} else {
			/* Get rid of error messages if they are there */
			$('#signup-register').prop("disabled", false);
			$('#repassword').removeClass('invalid');
			$('#repassword').addClass('valid');
			$('.error-box').html('');
		}
	});

	$('#signin-user').click(function(event){
		event.preventDefault();
		// Get the Username and password entered
		var userName = $('#username-signin').val();
		var password = $('#password').val();
		// Remove any error classes if they are lingering
		$('#username-signin').removeClass('invalid');
		$('#password').removeClass('invalid');
    // Look for username in database
    $.getJSON( '/userlist', function( data ) {
    	var arrayPosition = data.map(function(arrayItem) { return arrayItem.username; }).indexOf(userName);
    	var thisUserObject = data[arrayPosition];
			// If there is such a username in the system, check password
			if (thisUserObject) {
				var hashpw = CryptoJS.SHA3(password).toString();
				if (thisUserObject.password == hashpw) {
					// Set cookie and redirect to home if the combo is correct
					var hashname = userName;
					document.cookie = "id="+hashname;
					window.location = "/home";
				} else {
					// Throw error if the combination of username and pw is not right
					$('.error-box').html('<p>Password does not match the username.</p>');
					$('#password').addClass('invalid');
				}
			} else {
				// Throw error if the username isn't in the database
				$('.error-box').html('<p>Username does not exist.</p>');
				$('#username-signin').addClass('invalid');
			}
		});
  });
});

function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
	return pattern.test(emailAddress);
};