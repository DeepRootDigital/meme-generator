$(document).ready(function(){
  $('#facebook-preset').click(function(){
    document.cookie = "templatename=facebook";
    window.location = "/create";
  });

  $('#twitter-preset').click(function(){
    document.cookie = "templatename=twitter";
    window.location = "/create";
  });

  $('#bms-preset').click(function(){
    document.cookie = "templatename=bms";
    window.location = "/create";
  });
});