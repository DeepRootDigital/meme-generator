$(document).ready(function(){
	// Script to register a new user
	$('#signup-register').click(function(event){
		event.preventDefault();
		// Grab the values from the form
		var username = $('#username').val();
		var password = $('#password').val();
		// Hash the password for security
		password = CryptoJS.SHA3(password).toString();
		// Create the object to be inserted into the database
		var userdata = {
			'username' : username,
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