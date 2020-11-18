

import consumer from "./consumer"

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
          console.log(data)
          $('#checkRoomPresence').append('<p class="message"> New Message ! </p>')
        }
      });
    }
}

window.addEventListener("hashchange", e => {
  console.log("ROOM EVENT\n");
  setTimeout(manage_subscription, 50);
});