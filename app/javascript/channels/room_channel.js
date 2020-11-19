import consumer from "./consumer"

var sub = null;


// $(document).ready(function() {
//   console.log($('#room_messages').attr('data-room-id'));
// });

function manage_subscription() {
    const in_room = document.getElementById("checkRoomPresence")
    if (in_room)
    {
        consumer.subscriptions.create({
          channel: "RoomChannel",
          room_id: $('#room_messages').attr('data-room-id')
        }, {
        connected() {
          // Called when the subscription is ready for use on the server
          console.log("Connected ROOM");
          //console.log("room_id = " + room_id.toString());
        },
    
        disconnected() {
          // Called when the subscription has been terminated by the server
          console.log("Disconnected ROOM");
        },
    
        received(data) {
          // Called when there's incoming data on the websocket for this channel
          console.log("Received");
          console.log(subscriptions)

          const currentUserID = document.getElementById("userID").value

          var addMessage = ""
          if (data.user.id == currentUserID)
            addMessage = '<li style="background-color:lightskyblue" class="list-group-item">'
          else
            addMessage = '<li style="background-color:grey" class="list-group-item">'
          addMessage  += '<div class"otherMessage"> <img src="' + data.user.image + '"alt="Avatar" class="avatar"> '
                      + data.user.nickname + ' : ' + data.content + '</div> </li> <br>'

          // $('#checkRoomPresence').append('<p class="message"> New Message ! </p>')
          $('.list-group').append(addMessage)
          //AppClasses.Views.ShowRoom.rooms.fetch()
        }
      });
    }
}

window.addEventListener("hashchange", e => {
  console.log("You've change of route 1");
  setTimeout(manage_subscription, 50);
}); 
