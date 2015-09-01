// YOUR CODE HERE:
var makeApp = function(){
  var instance = {};
  var chatlog = [];
  var _id = prompt("Please type in your user name. ");
  var _room;
  var rooms = {};
  var friends = {};

  instance.server = 'https://api.parse.com/1/classes/chatterbox';

  instance.init = function(){
    //_id = prompt("Please type in your user name. ");
    instance.addRoom( prompt("Please type chatroom you want to enter. ") );
    console.log($('#roomSelect').val());
    instance.fetch();

    $('.submit').click(instance.handleSubmit);

    setInterval(function(){instance.fetch();}, 1000);
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
        var currentRoom = $("#roomSelect").val();
        var messageCount = 0;
        var i=0;
        while(messageCount<10 && i < chatlog.length){
          if( currentRoom === chatlog[i].roomname ){
            instance.addMessage(chatlog[i]);
            messageCount++;
          }
          i++;
        }
        instance.addRoomsFromChatLog(chatlog);
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

    if(message.username in friends){
      $text.css({'font-weight': 'bold'});
    }
    $message.append($text);

    $('#chats').append($message);
    $('.username').click(function(){
        instance.addFriend(this.textContent);
    });
  };

  instance.addRoom = function(roomname){

    if(!(roomname in rooms)){
      rooms[roomname] = true;
      var $room = $('<option></option>');
      $room.val(roomname);
      $room.text(roomname);
      $('#roomSelect').append($room);
    }
  };

  instance.addRoomsFromChatLog = function(log){
    for(var i=0; i< log.length; i++){
      instance.addRoom(log[i].roomname);
    }
  };

  instance.addFriend = function(username){
    if(!friends[username]){
      friends[username] = true;
    }
  }

  instance.handleSubmit = function(){
    var message = {
      'username': _id,
      'text':     $('#message').val(), 
      'roomname': $('#roomSelect').val()
    };
    instance.send(message);
  };

  return instance;
};

var app = makeApp();

$(document).ready(app.init);