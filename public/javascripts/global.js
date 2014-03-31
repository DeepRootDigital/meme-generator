$(document).ready(function() {

	// Determine the logged in user and display their username
	loggedinUser();
	ifAdmin();

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

	// Functionality for choosing preset box
	$('#choose-preset').click(function(){
		$('.preset-menu').animate({'height':'400px'},300);
	});

  //DROP DOWN MENU CONTROLS
  var box = $('.main-menu-container');
  $('.mobile-nav-icon').on('click', function() {
    if ($('.main-menu-container').css('height') == '490px') {
      $(box).css({'width' : '85px'});
      setTimeout(function() {
        $('.main-menu-container').css({'height' : '0'});
      }, 700);
    } else {
      $('.main-menu-container').css({'height' : '490px'});
      setTimeout(function() {
        $(box).css({'width' : '280px'});
      }, 700);
    }
  });
  $('.close-menu').on('click', function() {
    $(box).css({'width' : '85px'});
    setTimeout(function() {
      $('.main-menu-container').css({'height' : '0'});
    }, 700);
  });

  //HOMEPAGE ROLLOVER CONTROLS
  $('.block').on('mouseenter', function() {
    $(this).find('.home-icon > p').css({'color' : '#4c4c4c'});
  });
  $('.block').on('mouseleave', function() {
    $(this).find('.home-icon > p').css({'color' : '#fff'});
  });

});

function loggedinUser() {
	var loggeduser = getCookie("id");
	$('#cookied-name').text(loggeduser);
}

function ifAdmin() {
	var userlvl;
	var loggeduser = getCookie("id");
	$.getJSON( '/userlist', function( data ) {
    $.each(data, function(){
      if (loggeduser == this.username) {
        userlvl = this.userlevel;
      }
    });
    if (userlvl == "Admin") {
    	$('.main-menu-container > ul').prepend('<a href="/admin"><li>Admin Panel</li></a>');
    }
  });
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