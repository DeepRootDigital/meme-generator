$(document).ready(function(){
	$('#signup-register').click(function(event){
		event.preventDefault();
		var username = $('#username').val();
		var password = $('#password').val();
		console.log(password);
		password = CryptoJS.SHA3(password).toString();
		console.log(username);
		console.log(password);
		var userdata = {
			'username' : username,
			'password' : password
		};
		$.ajax({
			type: 'POST',
			data: userdata,
			url: '/register',
			dataType: 'JSON'
		})
		.done(function(response){
			// Analyze response message from server
			if (response.msg === '') {
				window.location = "/";
			} else {
            	// Throw error if there is one
            	alert('Error: ' + response.msg);
            }
        });
	});

	$('#username').on('keyup',function(){
		var valid = 1;
		var username = $('#username').val();
		$.getJSON( '/userlist', function( data ) {
			$.each(data, function(){
				if (username == this.username) {
					valid = 0;
				}
			});
			if (valid == 0) {
				$('#signup-register').prop("disabled", true);
				$('#username').addClass('invalid');
				$('#username').removeClass('valid');
			} else {
				$('#signup-register').prop("disabled", false);
				$('#username').removeClass('invalid');
				$('#username').addClass('valid');
			}
		});
	});

	$('#signin-user').click(function(event){
		event.preventDefault();
		var userName = $('#username-signin').val();
		var password = $('#password').val();
		$.getJSON( '/userlist', function( data ) {
			var arrayPosition = data.map(function(arrayItem) { return arrayItem.username; }).indexOf(userName);
			var thisUserObject = data[arrayPosition];
			if (thisUserObject) {
				var hashpw = CryptoJS.SHA3(password).toString();
				if (thisUserObject.password == hashpw) {
					window.location = "/";
				} else {
					alert('Password is incorrect.');
				}
			} else {
				alert('Username is not in our database.');
			}
		});
	});
});