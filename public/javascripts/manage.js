$(document).ready(function(){

  $('#viewmemes').on('click',populateMemeTable);
  $('#viewimages').on('click',populateImageTable);
  $('#viewbgs').on('click',populateBgTable);

});

function populateMemeTable() {
  var tableContent = '';
  $.getJSON( '/memelist', function( data ) {
    memeListData = data;
    // For each of the memes generate the HTML
    $.each(data, function(){
      if (this.username == getCookie('id')) {
        tableContent += '<li><div class="';
        tableContent += this._id;
        tableContent += '"><p>';
        tableContent += this.memename;
        tableContent += '</p><button class="delete-icon"></button></div></li>';
      }
    });
    // Insert into the meme loading selector
    $('.management-left ul').html(tableContent);
    $('.delete-icon').on("click",deleteMemeSingle);
    $('.management-left ul li div').on('click',showSingleMeme);
  });
};

function deleteMemeSingle(event) {
  event.preventDefault();
  var ident = $(this).parent().attr("class");
  var deletememe = {
    id: ident
  }
  $.ajax({
    type: 'POST',
    data: deletememe,
    url: '/deletememe',
    dataType: 'JSON'
  })
  .done(function(response){
    // Analyze response message from server
    if (response.msg === '') {
      // Update list of memes
      populateMemeTable();
    } else {
      // Throw error if there is one
      alert('Error: ' + response.msg);
    }
  });
};

function showSingleMeme() {
  $('.delete-icon').css('display','none');
  $(this).find('.delete-icon').css('display','block');
  // Show Preview
}

function populateImageTable() {
  event.preventDefault();
  var tableContent = '';
  $.getJSON( '/iconlist', function( data) {
    $.each(data, function(){
      if (this.username == getCookie('id')) {
        tableContent += '<li><div class="';
        tableContent += this._id;
        tableContent += '"><p>';
        tableContent += this.filename;
        tableContent += '</p><button class="delete-icon"></button></div></li>';
      }
    });
    $('.management-left ul').html(tableContent);
    $('.delete-icon').on("click",deleteIconSingle);
    $('.management-left ul li div').on('click',showSingleMeme);
  });
};

function deleteIconSingle(event) {
  event.preventDefault();
  var ident = $(this).parent().attr("class");
  var deletememe = {
    'id': ident
  }
  $.ajax({
    type: 'POST',
    data: deletememe,
    url: '/deleteimage',
    dataType: 'JSON'
  })
  .done(function(response){
    // Analyze response message from server
    if (response.msg === '') {
      // Update list of memes
      populateImageTable();
    } else {
      // Throw error if there is one
      alert('Error: ' + response.msg);
    }
  });
};

function populateBgTable() {
  event.preventDefault();
  var tableContent = '';
  $.getJSON( '/imagelist', function( data) {
    $.each(data, function(){
      if (this.username == getCookie('id')) {
        tableContent += '<li><div class="';
        tableContent += this._id;
        tableContent += '"><p>';
        tableContent += this.filename;
        tableContent += '</p><button class="delete-icon"></button></div></li>';
      }
    });
    $('.management-left ul').html(tableContent);
    $('.delete-icon').on("click",deleteImageSingle);
    $('.management-left ul li div').on('click',showSingleMeme);
  });
};

function deleteImageSingle(event) {
  event.preventDefault();
  var ident = $(this).parent().attr("class");
  var deletememe = {
    id: ident
  }
  $.ajax({
    type: 'POST',
    data: deletememe,
    url: '/deletebg',
    dataType: 'JSON'
  })
  .done(function(response){
    // Analyze response message from server
    if (response.msg === '') {
      // Update list of memes
      populateBgTable();
    } else {
      // Throw error if there is one
      alert('Error: ' + response.msg);
    }
  });
};