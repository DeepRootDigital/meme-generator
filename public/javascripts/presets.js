$(document).ready(function(){
  $('#facebook-preset').click(function(){
    document.cookie = "socialtype=facebook";
    window.location = "/create";
  });

  $('#twitter-preset').click(function(){
    document.cookie = "socialtype=twitter";
    window.location = "/create";
  });
});