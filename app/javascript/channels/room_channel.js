import consumer from "./consumer"

var sub = null;

function manage_subscription() {
    const in_room = document.getElementById("checkRoomPresence")
    if (in_room)
    {
        consumer.subscriptions.create({
          channel: "RoomChannel",
          room_id: $('.chat').attr('data-room-id')
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

          const currentUserID = document.getElementById("userID").value

          var addMessage = ""
          if (data.user.id == currentUserID)
            addMessage = '<li style="background-color:lightskyblue" class="list-group-item">'
          else
            addMessage = '<li style="background-color:grey" class="list-group-item">'
          addMessage  += '<div class"otherMessage"> <img src="' + data.user.image + '" alt="Avatar" class="avatar"> '
                      + data.user.nickname + ' : '
                      + '<p style="display: inline;" data-role="message-text">' + data.content + '</p> </div> </li> <br>'

          $('.chat').prepend(addMessage)
        }
      });
    }
}

window.addEventListener("hashchange", e => {
  console.log("You've change of route 1");
  setTimeout(manage_subscription, 50);
});
