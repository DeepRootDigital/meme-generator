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
    $('.management-left > p').text('My Memes');
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
  var ident = $(this).attr('class');
  $.getJSON('/memelist', function(data) {
    var memen;
    var memeinfo;
    $.each(data, function() {
      if (this._id == ident) {
        memen = this.memename;
        memeinfo = this.json;
      }
    });
    $('.management-right-name h2').text(memen);
    $('.management-right-preview').html('<canvas id="c" width="600px" height="1000px"></canvas>');
    var canvas = new fabric.Canvas('c');
    canvas.loadFromJSON(memeinfo,canvas.renderAll.bind(canvas));
    var dataURL = canvas.toDataURL({format: "png"});
    $('.management-right-preview').html('<img src="' + dataURL + '" alt="Preview Image">');
  });
}

function showSingleIcon() {
  $('.delete-icon').css('display','none');
  $(this).find('.delete-icon').css('display','block');
  // Show Preview
  var ident = $(this).attr('class');
  $.getJSON('/iconlist', function(data) {
    var filen;
    var fileloc;
    $.each(data, function() {
      if (this._id == ident) {
        filen = this.filename;
        fileloc = this.savename;
      }
    });
    $('.management-right-name h2').text(filen);
    $('.management-right-preview').html("<img src='icons/" + fileloc + "' alt='image preview'>");
  });
}

function showSingleImage() {
  $('.delete-icon').css('display','none');
  $(this).find('.delete-icon').css('display','block');
  // Show Preview
  var ident = $(this).attr('class');
  $.getJSON('/imagelist', function(data) {
    var filen;
    var fileloc;
    $.each(data, function() {
      if (this._id == ident) {
        filen = this.filename;
        fileloc = this.savename;
      }
    });
    $('.management-right-name h2').text(filen);
    $('.management-right-preview').html("<img src='bg/" + fileloc + "' alt='image preview'>");
  });
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
    $('.management-left > p').text('My Images');
    $('.delete-icon').on("click",deleteIconSingle);
    $('.management-left ul li div').on('click',showSingleIcon);
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
    $('.management-left > p').text('My Backgrounds');
    $('.delete-icon').on("click",deleteImageSingle);
    $('.management-left ul li div').on('click',showSingleImage);
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