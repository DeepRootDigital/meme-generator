$(document).ready(function(){

$('#error-submit').on('click',errorHandler);

$('.error-tab').on('click',function(){
  if ($('#error-box').css('margin-left') == "-300px") {
    $('#error-box').animate({'margin-left':'0px'},300);
  } else {
    $('#error-box').animate({'margin-left':'-300px'},300);
  }
});

});

function errorHandler(event){
  event.preventDefault();
  var username = getCookie('id');
  var message = $('.error-message').val();
  var dataSub = {'username':username,'message':message};
  $.ajax({
    type: 'POST',
    data: dataSub,
    url: '/error',
    dataType: 'JSON'
  })
  .done(function(response){
    $('.error-message').val('');
  });
}