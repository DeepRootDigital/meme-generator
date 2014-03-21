var memeListData = [];

$(document).ready(function(){
  // Script to register a new user
  $('#changeuser').click(function(event){
    event.preventDefault();
    // Grab the values from the form
    var usern = $('#username-change').val();
    var userlvl = $('#userlevel-choice').val();
    $.getJSON( '/userlist', function( data ) {
      var oldlvl;
      $.each(data, function(){
        if (this.username == usern) {
          oldlvl = this.userlevel;
        }
      });
      // Create the object to be inserted into the database
      var userdata = {
        'username' : usern,
        'userlevel' : userlvl
      };
      // Ajax request to insert into the database
      $.ajax({
        type: 'POST',
        data: userdata,
        url: '/updateuserlevel',
        dataType: 'JSON'
      })
      .done(function(response){
        // Analyze response message from server
        if (response.msg === '') {
          var d = new Date();
          userdata = {
            'username' : usern,
            'new level' : userlvl,
            'old level' : oldlvl
          }
          var adminlog = {
            'username': getCookie("id"),
            'action': "Change Userlevel",
            'actionon': userdata,
            'date': d.toLocaleDateString(),
            'time': d.toLocaleTimeString()
          }
          $.ajax({
            type: 'POST',
            data: adminlog,
            url: '/adminlog',
            dataType: 'JSON'
          })
          .done(function(response){
            if (response.msg === '') {
              window.location = "/admin";
            }
          });
        } else {
          // Throw error if there is one
          alert('Error: ' + response.msg);
        }
      });
    });
  });

  // Populate saved memes the select menu to be loaded
  populateTable();
  redirectQ();

  $('#delete-meme').on('click', deleteMeme);
});

function populateTable() {
  var tableContent = '';
  $.getJSON( '/memelist', function( data ) {
    memeListData = data;
    // For each of the memes generate the HTML
    $.each(data, function(){
      tableContent += '<option value="';
      tableContent += this._id;
      tableContent += '">';
      tableContent += this.memename;
      tableContent += '</option>';
    });
    // Insert into the meme loading selector
    $('#list-of-memes').html(tableContent);
  });
};

function deleteMeme() {
  event.preventDefault;
  var memeToDelete = $('#list-of-memes').val();
  memeToDelete = {
    'id': memeToDelete
  };
  // Ajax request to insert into the database
  $.ajax({
    type: 'POST',
    data: memeToDelete,
    url: '/deletememe',
    dataType: 'JSON'
  })
  .done(function(response){
    // Analyze response message from server
    if (response.msg === '') {
      var d = new Date();
      var adminlog = {
        'username': getCookie("id"),
        'action': "Delete Meme",
        'actionon': memeToDelete,
        'date': d.toLocaleDateString(),
        'time': d.toLocaleTimeString()
      }
      $.ajax({
        type: 'POST',
        data: adminlog,
        url: '/adminlog',
        dataType: 'JSON'
      })
      .done(function(response){
        if (response.msg === '') {
          window.location = "/admin";
        }
      });
    } else {
      // Throw error if there is one
      alert('Error: ' + response.msg);
    }
  });
}

function redirectQ() {
  var userlvl;
  var loggeduser = getCookie("id");
  $.getJSON( '/userlist', function( data ) {
    $.each(data, function(){
      if (loggeduser == this.username) {
        userlvl = this.userlevel;
      }
    });
    if (userlvl != "Admin") {
      window.location = "/home";
    }
  });
}