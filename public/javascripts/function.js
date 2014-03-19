var textcount = 0;
var imagecount = 0;
var canvas = new fabric.Canvas('c');
var memeListData = [];

$(document).ready(function(){
	// Open memeloader area
	$('#meme-loader').click(function(){
		$('.meme-loader').animate({'height':'100px'},300);
	});
	// Open background picture opens and close the solid background options
	$('#bg-picture').click(function(){
		$('.bg-solid-options').animate({'height':'0px'},300,function(){
			$('.bg-picture-options').animate({'height':'100px'},300);
		});
	});
	// Clear the background of the meme  NOT WORKING YET
	$('#clear-bg').click(function(){
		canvas.backgroundColor = 0;
		canvas.setBackgroundColor('rgba(0,0,0,0)', canvas.renderAll.bind(canvas));
	});
	// Open solid background panel and close picture background options
	$('#bg-solid').click(function(){
		$('.bg-picture-options').animate({'height':'0px'},300,function(){
			$('.bg-solid-options').animate({'height':'100px'},300);
		});
	});
	// Set the background to a solid color
	$('#bg-solid-update').click(function(){
		canvas.backgroundImage = 0;
		var backgroundcolor = $('input#background-color').val();
		canvas.setBackgroundColor(backgroundcolor, canvas.renderAll.bind(canvas));
	});
	// Open text editing panel
	$('.addtextarea').click(function(){
		$('.addtext-options').animate({'height':'250px'},300);
	});
	// Add text to the meme canvas
	$('#addtext-add').click(function(){
		idnum = window.textcount + 1;
		idnum = "text_" + idnum;
		var textcontent = document.getElementById('addtext-text').value;
		var textcolor = document.getElementById('addtext-color').value;
		var textsize = parseInt(document.getElementById('addtext-fontsize').value);
		var textlh = parseInt(textsize * 1.2);
		var newtext = new fabric.IText(textcontent, {
			fontFamily: 'Helvetica',
			fontSize: textsize,
			fill: textcolor,
			lineHeight: 1,
			id: idnum
		});
		canvas.add(newtext);
		window.textcount = window.textcount + 1;
	});
	// Slide open the icon panel
	$('.addimage').click(function(){
		$('.addimage-options').animate({'height':'100px'},300);
	});
	// Slide open the shape panel
	$('.addshape').click(function(){
		$('.addshape-options').animate({'height':'150px'},300);
	});
	// Add shape-box
	$('#addshape-box').click(function(){
		var bgcolor = $('#addshape-color').val();
		var opa = $('#addshape-opacity').val();
		if (opa == '') {
			opa = 1;
		}
		opa = parseFloat(opa);
		if (bgcolor == '') {
			bgcolor = '#ffffff';
		}
		var newShape = new fabric.Rect({
			width: 100,
			height: 100,
			top: 100,
			left: 100,
			fill: bgcolor,
			opacity: opa
		});
		canvas.add(newShape);
	});
	// Add shape-line
	$('#addshape-line').click(function(){
		var bgcolor = $('#addshape-color').val();
		var lw = $('#addshape-lw').val();
		if (lw == '0' || lw == '') {
			lw = 1;
		}
		lw = parseInt(lw);
		if (bgcolor == '') {
			bgcolor = '#ffffff';
		}
		var newShape = new fabric.Line([50,50,150,150], {
			top: 100,
			left: 100,
			stroke: bgcolor,
			strokeWidth: lw
		});
		canvas.add(newShape);
	});
	// Open new tab with image to be saved
	$('#downloadmeme').click(function(){
		console.log(canvas);
		var dataURL = canvas.toDataURL({format: 'jpeg'});
		console.log(dataURL);
		window.open(dataURL);
	});
	// Delete objects if they are dragged off to the left
	canvas.on('mouse:up', function(e){
		var activeObject = e.target;
		if ( activeObject ) {
			if ( activeObject.get('left') > 630 ) {
				canvas.remove(activeObject);
			}
		}
	});
	// Populate saved memes the select menu to be loaded
	populateTable();
	// Populate background images to the select menu
	listImages();
	// Populate icons to their select menu
	listIcons();

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
		// For each of the memes generate the HTML
		$.each(data, function(){
			tableContent += '<option>';
			tableContent += this.memename;
			tableContent += '</option>';
		});
		// Insert into the meme loading selector
		$('#memeLoadSelector').html(tableContent);
	});
};

function loadCanvas(event) {
	event.preventDefault();
	// Confirm that you want to load the saved canvas state
	var confirmation = confirm('Are you sure you want to load? It will overwrite current progress.');
	if (confirmation === true) {
		var thisMeme = $('#memeLoadSelector').val();
		var arrayPosition = memeListData.map(function(arrayItem) { return arrayItem.memename; }).indexOf(thisMeme);
		var thisMemeObject = memeListData[arrayPosition];
		// Render canvas to the saved state
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
	// Resize the canvas in all aspects and resize stuff on the canvas
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
	canvas.width = width;
	canvas.height = height;
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