var inputValues = new Array();

$(document).ready(function(){
	// Check if logged in
	if (getCookie('id')) {
		var usern = getCookie('id');
		console.log(usern);
		$.getJSON( '/userlist', function( data ) {
			$.each(data, function(){
				console.log(usern);
				if (usern == this.username) {
					window.location = "/home";
				}
			});
		});
	}

	$('#arrow').click(function(event){
		event.preventDefault();
		var form = $('.form');
		var label = $('label');
		var progress = $('.progress-bar');
		
		if ($('.arrow').parent().find('#input').val() || $('.arrow').parent().find('#password').val()) {
			if ($('.name').text() == 'Name') {
				$.getJSON( '/userlist', function( data ) {
					var inuse = 1;
					$.each(data, function(){
						if ($('#input').val() == this.username){
							inuse = 0;
						}
					});
					if (inuse == 0) {
						$('.error-box').text('That username is already in use.');
						$('.error-box').css('display','block');
					} else {
						$('.email').text('Email');
						$('.email').animate({'top' : '-30px'});
						$('.name').animate({'top' : '-30px'});
						$('.progress-bar').css({'width' : '138px'});
						$('.name').text('');
						if ($('.arrow').parent().find('#input').val()) {
							inputValues.push($('#input').val());
						} else {
							inputValues.push($('#password').val());
						}
						var counter = $('.counter span').text();
						var newCount = parseInt(counter) + 1;
						$('.counter span').text(newCount);
						$('.input').val('');
						$('.error-box').text('');
						$('.error-box').css('display','none');
					}
				});
			}
			else if ($('.email').text() == 'Email') {
				if (!isValidEmailAddress($('#input').val())) {
					$('.error-box').text('Please enter a valid email address.');
					$('.error-box').css('display','block');
				} else {
					$.getJSON( '/userlist', function( data ) {
						var inuse = 1;
						$.each(data, function() {
							if ($('#input').val() == this.email) {
								inuse = 0;
							}
						});
						if (inuse == 0) {
							$('.error-box').text('That email is already in use.');
							$('.error-box').css('display','block');
						} else {
							$('.info').text('Password');
							$('.info').animate({'top' : '-60px'}, 400);
							$('.email').animate({'top' : '-60px'});
							$('.progress-bar').css({'width' : '277px'});
							$('.email').text('');
							$('#input').hide();
							$('#password').show();
							$('#password').focus();
							if ($('.arrow').parent().find('#input').val()) {
								inputValues.push($('#input').val());
							} else {
								inputValues.push($('#password').val());
							}
							var counter = $('.counter span').text();
							var newCount = parseInt(counter) + 1;
							$('.counter span').text(newCount);
							$('.input').val('');
							$('.error-box').text('');
							$('.error-box').css('display','none');
						}
					});
        }
			} 
else if ($('.info').text() == 'Password') {
	$('.address').text('Retype Password');
	$('.address').animate({'top' : '-90px'}, 400);
	$('.info').animate({'top' : '-90px'});
	$('.progress-bar').css({'width' : '415px'});
	$('.info').text('');
	if ($('.arrow').parent().find('#input').val()) {
		inputValues.push($('#input').val());
	} else {
		inputValues.push($('#password').val());
	}
	var counter = $('.counter span').text();
	var newCount = parseInt(counter) + 1;
	$('.counter span').text(newCount);
	$('.input').val('');
	$('.error-box').text('');
	$('.error-box').css('display','none');
} 
else if ($(label).text() == 'Retype Password') {
	if ($('#password').val() != inputValues[2]) {
		$('.error-box').text('Make sure your password matches your previous one.');
		$('.error-box').css('display','block');
	} else {
		$('.progress-bar').css({'width' : '500px'});
		if ($('.arrow').parent().find('#input').val()) {
			inputValues.push($('#input').val());
		} else {
			inputValues.push($('#password').val());
		}
		var counter = $('.counter span').text();
		var newCount = parseInt(counter) + 1;
		$('.counter span').text(newCount);
		$('.error-box').text('');
		$('.error-box').css('display','none');
					// Hash the password for security
					password = CryptoJS.SHA3(inputValues[2]).toString();
				  // Create the object to be inserted into the database
				  var userdata = {
				  	'username' : inputValues[0],
				  	'email' : inputValues[1],
				  	'password' : password,
				  	'userlevel' : "one"
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
							var hashname = inputValues[0];
							document.cookie = "id="+hashname;
							window.location = "/home";
						} else {
	          	// Throw error if there is one
	          	alert('Error: ' + response.msg);
	          }
	        });
				}
			}
		} else {
			$('.error-box').text('Please enter something.');
			$('.error-box').css('display','block');
		}
	});

/*
	// Script to register a new user
	$('#signup-register').click(function(event){
		event.preventDefault();
		var uservalid = 1;
		var emailvalid = 1;
		// Grab the values from the form
		var username = $('#username').val();
		var email = $('#email').val();
		var password = $('#password').val();
		$.getJSON( '/userlist', function( data ) {
			$.each(data, function(){
				if (username == this.username) {
					uservalid = 0;
				}
				if (email == this.email) {
					emailvalid = 0;
				}
			});
			if (uservalid == 0) {
				alert('That username is in use.');
			} else {
				if (emailvalid == 0) {
					alert('That email is in use.');
				} else {
					// Hash the password for security
					password = CryptoJS.SHA3(password).toString();
				  // Create the object to be inserted into the database
				  var userdata = {
				  	'username' : username,
				  	'email' : email,
				  	'password' : password,
				  	'userlevel' : "one"
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
				}			
			}
		});
});

$('#username').on('keyup',function(){
		// Set validity and get username inputted
		var valid = 1;
		var notEmpty = 1;
		var username = $('#username').val();
		if (username == '') {
			notEmpty = 0;
		}
		$.getJSON( '/userlist', function( data ) {
			$.each(data, function(){
				if (username == this.username) {
					valid = 0;
				}
			});
			// Give real time validation
			if (valid == 0) {
				// Give 'in use' message and put red outline
				$('#signup-register').prop("disabled", true);
				$('#username').addClass('invalid');
				$('#username').removeClass('valid');
				$('.error-box').html('<p>That username is in use.</p>');
			} else if (notEmpty == 0) {
				// Give 'fill out' message and put red outline
				$('#signup-register').prop("disabled", true);
				$('#username').addClass('invalid');
				$('#username').removeClass('valid');
				$('.error-box').html('<p>Please enter a username.</p>');
			} else {
				// Get rid of error messages if they are there
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
			// Give real time validation 
			if (valid == 0) {
				// Throw invalid email warning
				$('#signup-register').prop("disabled", true);
				$('#email').addClass('invalid');
				$('#email').removeClass('valid');
				$('.error-box').html('<p>That email address is not valid.</p>');
			} else if (avail == 0) {
				// Give 'in use' message and put red outline
				$('#signup-register').prop("disabled", true);
				$('#email').addClass('invalid');
				$('#email').removeClass('valid');
				$('.error-box').html('<p>That email is in use.</p>');
			} else {
				// Get rid of error messages if they are there
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
		// Give real time validation
		if (valid == 0) {
			// Give 'in use' message and put red outline
			$('#signup-register').prop("disabled", true);
			$('#repassword').addClass('invalid');
			$('#repassword').removeClass('valid');
			$('.error-box').html('<p>The passwords do not match.</p>');
		} else {
			// Get rid of error messages if they are there
			$('#signup-register').prop("disabled", false);
			$('#repassword').removeClass('invalid');
			$('#repassword').addClass('valid');
			$('.error-box').html('');
		}
	});
*/

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
    	var emailorun = userName.split("@").length;
    	if (emailorun > 1) {
    		var arrayPosition = data.map(function(arrayItem) { return arrayItem.email; }).indexOf(userName);
    	} else {
    		var arrayPosition = data.map(function(arrayItem) { return arrayItem.username; }).indexOf(userName);
    	}
    	
    	var thisUserObject = data[arrayPosition];
			// If there is such a username in the system, check password
			if (thisUserObject) {
				var hashpw = CryptoJS.SHA3(password).toString();
				if (thisUserObject.password == hashpw) {
					// Set cookie and redirect to home if the combo is correct
					var hashname = thisUserObject.username;
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

$('#recover-password').click(function(){
	if ($('.password-recovery').css('display') == "none") {
		$('.password-recovery').slideDown(300);	
	} else {
		$('.password-recovery').slideUp(300);
	}
});

$('#recover-my-pw').on("click",function(event){
	event.preventDefault();
	var userName = "";
	$.getJSON( '/userlist', function( data ) {
		$.each(data, function() {
			if ($('#email-recovery').val() == this.email) {
				userName = this.username;
			}
		});
		if (userName == "") {
			alert('That email is not in our records');
		} else {
			userName = CryptoJS.enc.Utf16.parse(userName);
			var thedata = {'email':$('#email-recovery').val(), 'username':userName};
			$.ajax({
				type: 'POST',
				data: thedata,
				url: '/email-recovery',
				dataType: 'JSON'
			})
			.done(function(response){
				window.location = "/";
			});
		}
	});
});

$('#reset-change-pw').on('click',function(event){
	event.preventDefault();
	if ($('#password').val() == $('#repassword').val()) {
		var userName = getURLParameter('id');
		console.log(userName);
		userName = CryptoJS.enc.Utf16.stringify(userName);
		console.log(userName);
		var hashpw = CryptoJS.SHA3($('#password').val()).toString();
		$('.error-box').html('');
		$.ajax({
				type: 'POST',
				data: {'username':userName, 'password':hashpw},
				url: '/changepw',
				dataType: 'JSON'
			})
			.done(function(response){
				document.cookie = "id="+userName;
				// window.location = "/home";
			});
	} else {
		$('.error-box').html('<p>Username does not exist.</p>');
	}
});

});

function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
	return pattern.test(emailAddress);
};

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
};