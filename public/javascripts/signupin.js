$(document).ready(function(){
	$('#signup-register').click(function(event){
		event.preventDefault();
		var username = $('#username').val();
		var password = $('#password').val();
		password = CryptoJS.SHA3(password).toString();
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
        var hashname = username;
        document.cookie = "id="+hashname;
				window.location = "/create";
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
    $('#username-signin').removeClass('invalid');
    $('#password').removeClass('invalid');
		$.getJSON( '/userlist', function( data ) {
			var arrayPosition = data.map(function(arrayItem) { return arrayItem.username; }).indexOf(userName);
			var thisUserObject = data[arrayPosition];
			if (thisUserObject) {
				var hashpw = CryptoJS.SHA3(password).toString();
				if (thisUserObject.password == hashpw) {
          var hashname = userName;
          document.cookie = "id="+hashname;
					window.location = "/create";
				} else {
					$('.error-box').html('<p>Password does not match the username.</p>');
          $('#password').addClass('invalid');
				}
			} else {
        $('.error-box').html('<p>Username does not exist.</p>');
        $('#username-signin').addClass('invalid');
			}
		});
	});
});