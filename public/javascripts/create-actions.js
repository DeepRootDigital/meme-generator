$(document).ready(function(){

  /* Rendering slider and dropzone */
  $('#addtext-fontsize').slider({ max: 200, min:10});
  $('#addtext-fontsize').on("mouseup", function(){
    var fontsize = $('#addtext-fontsize').slider("option","value");
    $(this).parent().find('p span').text(fontsize);
  });

  $('#addshape-opacity').slider({ max: 1, min:0, step: 0.01});
  $('#addshape-opacity').on("mouseup", function(){
    var opacity = $('#addshape-opacity').slider("option","value");
    $(this).parent().find('p span').text(opacity);
  });

  $('#dropzone').dropzone({ 
    url: '/dropzoneupload',
    init: function() {
      this.on("success", function(file) { dropzoneCanvas(file.name); });
    },
    headers: { "un" : getCookie('id') },
    previewsContainer: "#previewCon",
    clickable: false
  });

  $('#bg-dropzone').dropzone({ 
    url: '/uploadimg',
    init: function() {
      this.on("success", function(file) { 
        listImages();
        $('.upload-response').animate({'height':'60px'},function(){
          setTimeout(function(){
            $('.upload-response').animate({'height':'0px'},300);
          },1500);
        });
      });
    },
    headers: { "un" : getCookie('id') },
    previewsContainer: "#previewCon"
  });

  $('#icon-dropzone').dropzone({ 
    url: '/uploadicon',
    init: function() {
      this.on("success", function(file) { 
        listIcons();
        $('.upload-response').animate({'height':'60px'},function(){
          setTimeout(function(){
            $('.upload-response').animate({'height':'0px'},300);
          },1500);
        });
      });
    },
    headers: { "un" : getCookie('id') },
    previewsContainer: "#previewCon"
  });

  /* Different click actions */

  // Open memeloader area
  $('#meme-loader .click-container').click(function(){
    if ($(this).parent().find('.submenu-container').hasClass('memeload')) {
      $(this).parent().find('.submenu-container').removeClass('memeload');
    } else {
      closecontainers();
      $(this).parent().find('.submenu-container').addClass('memeload');
    }
  });
  // Clear the background of the meme
  $('#clear-bg').click(function(){
    canvas.backgroundImage = 0;
    canvas.setBackgroundColor('rgba(0,0,0,0)', canvas.renderAll.bind(canvas));
  });
  // Open solid background panel and close picture background options
  $('#bg-solid .click-container').click(function(){
    if ($(this).parent().find('.submenu-container').hasClass('bg')) {
      $(this).parent().find('.submenu-container').removeClass('bg');
    } else {
      closecontainers();
      $(this).parent().find('.submenu-container').addClass('bg');
    }
  });
  // Set the background to a solid color
  $('#bg-solid-update').click(function(){
    canvas.backgroundImage = 0;
    var backgroundcolor = $('input#background-color').val();
    backgroundcolor = "#" + backgroundcolor;
    canvas.setBackgroundColor(backgroundcolor, canvas.renderAll.bind(canvas));
  });
  // Open text editing panel
  $('.addtextarea .click-container').click(function(){
    if ($(this).parent().find('.submenu-container').hasClass('textb')) {
      $(this).parent().find('.submenu-container').removeClass('textb');
    } else {
      closecontainers();
      $(this).parent().find('.submenu-container').addClass('textb');
    }
  });
  // Slide open the icon panel
  $('.addimage .click-container').click(function(){
    if ($(this).parent().find('.submenu-container').hasClass('icons')) {
      $(this).parent().find('.submenu-container').removeClass('icons');
    } else {
      closecontainers();
      $(this).parent().find('.submenu-container').addClass('icons');
    }
  });
  // Slide open the shape panel
  $('.addshape .click-container').click(function(){
    if ($(this).parent().find('.submenu-container').hasClass('box')) {
      $(this).parent().find('.submenu-container').removeClass('box');
    } else {
      closecontainers();
      $(this).parent().find('.submenu-container').addClass('box');
    }
  });
  // Slide open the line panel
  $('.addline .click-container').click(function(){
    if ($(this).parent().find('.submenu-container').hasClass('lines')) {
      $(this).parent().find('.submenu-container').removeClass('lines');
    } else {
      closecontainers();
      $(this).parent().find('.submenu-container').addClass('lines');
    }
  });
  // Slide open the download options
  $('#downloadmeme-show .click-container').click(function(){
    if ($(this).parent().find('.submenu-container').hasClass('dl')) {
      $(this).parent().find('.submenu-container').removeClass('dl');
    } else {
      closecontainers();
      $(this).parent().find('.submenu-container').addClass('dl');
    }
  });
  // Save meme open
  $('#save-meme .click-container').click(function(){
    if ($(this).parent().find('.submenu-container').hasClass('save')) {
      $(this).parent().find('.submenu-container').removeClass('save');
    } else {
      closecontainers();
      $(this).parent().find('.submenu-container').addClass('save');
    }
  });

});

function closecontainers() {
  $('.submenu-container').each(function(){
    if ($(this).attr('class').split(' ').length > 1) {
      $(this).attr('class','submenu-container');
    }
  });
};