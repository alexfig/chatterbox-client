// YOUR CODE HERE:
var makeApp = function(){
  var instance = {};
  var chatlog = [];
  var _id;
  var rooms = {};
  instance.server = 'https://api.parse.com/1/classes/chatterbox';

  instance.init = function(){
    _id = prompt("Please type in your user name. ");
    instance.fetch();

    $('.sendMessage').click(function(){
      var message = {
        'username': _id,
        'text':     $('input[name="message"]').val(), 
        'roomname': "lobby"
      };
      instance.send(message);
    });

    setInterval(function(){instance.fetch();}, 5000);
  }

  instance.fetch = function(){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        chatlog = data.results;

        var $chats = $('#chats');
        instance.clearMessages();
        for(var i = 9; i >= 0; i--){
          instance.addMessage(chatlog[i]);
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });
  }

  instance.send = function(message){
    $.ajax({
        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent');
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message');
        }
      });
  };
  instance.clearMessages = function(){
    $('#chats').empty();
  };

  instance.addMessage = function(message){
    var $message = $('<div></div>');
    $message.addClass('chat');

    var $user_name = $('<h3></h3>')
    $user_name.addClass('username');
    $user_name.text(message.username);
    $message.append($user_name);

    var $text = $('<p></p>');
    $text.text(message.text);
    $message.append($text);

    $('#chats').prepend($message);
  };

  instance.addRoom = function(roomname){
    if(!(roomname in rooms)){
      var $room = $('<option></option>');
      $room.val(roomname);
      $room.text(roomname);
      $('#roomSelect').append($room);
    }
  };

  return instance;
};

var app = makeApp();

//$(document).ready(app.init);


// curl -X GET \
//   -H "X-Parse-Application-Id: voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r" \
//   -H "X-Parse-REST-API-Key: QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf" \
//   https://api.parse.com/1/classes/chatterbox