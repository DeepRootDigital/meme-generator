var textcount = 0;
var imagecount = 0;
var canvas = new fabric.Canvas('c');

$(document).ready(function(){

	$('#meme-loader').click(function(){
		$('.meme-loader').animate({'height':'100px'},300);
	});

	$('#bg-picture').click(function(){
		$('.bg-solid-options').animate({'height':'0px'},300,function(){
			$('.bg-picture-options').animate({'height':'100px'},300);
		});
	});

	$('#clear-bg').click(function(){
		canvas.backgroundColor = 0;
		canvas.setBackgroundColor('rgba(0,0,0,0)', canvas.renderAll.bind(canvas));
	});

	$('#bg-solid').click(function(){
		$('.bg-picture-options').animate({'height':'0px'},300,function(){
			$('.bg-solid-options').animate({'height':'100px'},300);
		});
	});

	$('#bg-solid-update').click(function(){
		canvas.backgroundImage = 0;
		var backgroundcolor = $('input#background-color').val();
		canvas.setBackgroundColor(backgroundcolor, canvas.renderAll.bind(canvas));
	});

	$('.addtextarea').click(function(){
		$('.addtext-options').animate({'height':'250px'},300);
	});

	$('#addtext-add').click(function(){
		idnum = window.textcount + 1;
		idnum = "text_" + idnum;
		var textcontent = document.getElementById('addtext-text').value;
		var textcolor = document.getElementById('addtext-color').value;
		var textsize = parseInt(document.getElementById('addtext-fontsize').value);
		var newtext = new fabric.IText(textcontent, {
			fontFamily: 'Helvetica',
			fontSize: textsize,
			fill: textcolor,
			id: idnum
		});
		canvas.add(newtext);
		window.textcount = window.textcount + 1;
	});

	$('#downloadmeme').click(function(){
		var dataURL = canvas.toDataURL({format: 'jpeg'});
		window.open(dataURL);
	});

	$('.addimage').click(function(){
		$('.addimage-options').animate({'height':'100px'},300);
	});

	canvas.on('mouse:up', function(e){
		var activeObject = e.target;
		if ( activeObject ) {
			if ( activeObject.get('left') > 630 ) {
				canvas.remove(activeObject);
			}
		}
	});

});