var memeListData = [];

$(document).ready(function() {

	populateTable();
	listImages();
	listIcons();
	loggedinUser();

	// Click trigger to save a meme
	$('#savememe').on('click', saveMeme);
	// Click trigger to load meme on canvas
	$('#memeLoad').on('click', loadCanvas);
	// Click trigger to load image on canvas bg
	$('#background-choice-submit').on('click', loadImageCanvas);
	// Click trigger to load icon on canvas
	$('#icon-choice-submit').on('click', loadIconCanvas);
	// Click trigger to resize canvas
	$('#canvas-resize').on('click', resizeCanvas);
	// Update bglist
	$('#bg-iframe').on('mouseout', listImages);

	$('#logout').click(function(event){
		event.preventDefault();
		document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		window.location = "/login";
	});

});


// Function to save the meme that is fired on clicking button
function saveMeme(event){
	event.preventDefault();
	// Basic validation to check name isn't empty, probably need more validation
	if ($('#memename').val() === '') {
		// Alert and return false if the name fails validation.
		alert('Please fill in the name.');
		return false;
	} else {
		// Get the json string for the current canvas
		var jsonstring = JSON.stringify(canvas);
		// Get the name entered
		var memename = $('#memename').val();
		// Turn the data into an object to be submitted
		var newMeme = {
			'memename' : memename,
			'json' : jsonstring
		}
		// Execute ajax request
		$.ajax({
			type: 'POST',
			data: newMeme,
			url: '/addmeme',
			dataType: 'JSON'
		})
		.done(function(response){
			// Analyze response message from server
			if (response.msg === '') {
				// Clear the name field
				$('#memename').val('');
            	// Update list of memes
            	populateTable();
            } else {
            	// Throw error if there is one
            	alert('Error: ' + response.msg);
            }
        });
	}
};

function populateTable() {
	var tableContent = '';

	$.getJSON( '/memelist', function( data ) {
		memeListData = data;
		$.each(data, function(){
			tableContent += '<option>';
			tableContent += this.memename;
			tableContent += '</option>';
		});

		$('#memeLoadSelector').html(tableContent);
	});
};

function loadCanvas(event) {
	event.preventDefault();
	var confirmation = confirm('Are you sure you want to load? It will overwrite current progress.');
	if (confirmation === true) {
		var thisMeme = $('#memeLoadSelector').val();
		var arrayPosition = memeListData.map(function(arrayItem) { return arrayItem.memename; }).indexOf(thisMeme);
		var thisMemeObject = memeListData[arrayPosition];
		canvas.loadFromJSON(thisMemeObject.json,canvas.renderAll.bind(canvas));
	} else {
		return false;
	}
};

function listImages() {
	event.preventDefault();
	var imageTable = '';
	$.getJSON( '/imagelist', function( data) {
		$.each(data, function(){
			imageTable += '<option>';
			imageTable += this.filename;
			imageTable += '</option>';
		});
		$('#background-choice').html(imageTable);
	});
};

function loadImageCanvas(event) {
	event.preventDefault();
	var thisImage = $('#background-choice').val();
	$.getJSON( '/imagelist', function( data ) {
		var arrayPosition = data.map(function(arrayItem) { return arrayItem.filename; }).indexOf(thisImage);
		var thisImageObject = data[arrayPosition];
		canvas.setBackgroundImage( 'bg/' + thisImageObject.filename, canvas.renderAll.bind(canvas) );
	});
};

function listIcons() {
	event.preventDefault();
	var iconTable = '';
	$.getJSON( '/iconlist', function( data) {
		$.each(data, function(){
			iconTable += '<option>';
			iconTable += this.filename;
			iconTable += '</option>';
		});
		$('#icon-choice').html(iconTable);
	});
};

function loadIconCanvas(event) {
	event.preventDefault();
	var thisIcon = $('#icon-choice').val();
	$.getJSON( '/iconlist', function( data ) {
		var arrayPosition = data.map(function(arrayItem) { return arrayItem.filename; }).indexOf(thisIcon);
		var thisIconObject = data[arrayPosition];
		idnum = window.imagecount + 1;
		idnum = "image_" + idnum;
		fabric.Image.fromURL('icons/' + thisIconObject.filename,function(smallimage) {
			smallimage.set('id',idnum);
			canvas.add(smallimage);
		});
		window.imagecount = window.imagecount + 1;
	});
};

function resizeCanvas(event) {
	event.preventDefault();
	var oldwidth = $('.canvas-container').css('width');
	var oldheight = $('.canvas-container').css('height');
	var width = $('#canvas-width').val();
	var height = $('#canvas-height').val();
	$('.canvas-container').css('width',width+'px');
	$('.canvas-container').css('height',height+'px');
	$('#c').attr('width',width+'px');
	$('#c').attr('height',height+'px');
	$('#c').css('width',width+'px');
	$('#c').css('height',height+'px');
	$('.upper-canvas').attr('width',width+'px');
	$('.upper-canvas').attr('height',height+'px');
	$('.upper-canvas').css('width',width+'px');
	$('.upper-canvas').css('height',height+'px');
	var jsonstring = canvas.toJSON();
	$.each(jsonstring, function() {
		if (this.height) {
			var newheight = parseInt(this.height) * ( parseInt(height) / parseInt(oldheight) );
			this.height = newheight;
		}
		if (this.width) {
			var newwidth = parseInt(this.width) * ( parseInt(width) / parseInt(oldwidth) );
			this.width = newwidth;
		}
	});
	canvas.loadFromJSON(jsonstring,canvas.renderAll.bind(canvas));
}

function loggedinUser() {
	var loggeduser = getCookie("id");
	$('#cookied-name').text(loggeduser);
}

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