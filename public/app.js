// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a>" + data[i].link + '</a>');
    }
  });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the article headline
    var thisId = $(this).attr("data-id");
  
    // Makes an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With this done, we add the note input information to the page
      .then(function(data) {
        console.log(data);
        // Title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // Input for new title
        $("#notes").append("<input id= 'titleinput' name='title' >");
        // Adds textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // Button that will submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's not a note within the article
        if (data.note) {
          // Places the title of the note into the title input
          $("#titleinput").val(data.note.title);
          // Places the body of the note into the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // On click function for when the savenote button is clicked
  $(document).on("click", "#savenote", function() {
    // Grabs the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Runs a POST request to change the note, using what has been entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })

      .then(function(data) {
        // then log the response
        console.log(data);
        // then empty the notes section
        $("#notes").empty();
      });
  
    // Removing the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  