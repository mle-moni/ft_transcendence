import consumer from "./consumer"

var sub = null;

function manage_subscription() {
    const in_room = document.getElementById("checkRoomPresence")
    if (in_room)
    {
        consumer.subscriptions.create({
          channel: "RoomChannel"
          // room_id: $('.chat').attr('data-room-id')
        }, {
        connected() {
          // Called when the subscription is ready for use on the server
          console.log("Connected");
          //console.log("room_id = " + room_id.toString());
        },
    
        disconnected() {
          // Called when the subscription has been terminated by the server
          console.log("Disconnected");
        },
    
        received(data) {
          // Called when there's incoming data on the websocket for this channel
          console.log("Received");

          //TODO: condition suivant type
          window.App.collections.rooms.fetch();
          window.App.collections.allUsers.myFetch();
          
        }
      });
    }
}

$(window).on('popstate', e => {
  setTimeout(manage_subscription, 50);
 });

$(document).ready(function(){
  setTimeout(manage_subscription, 50);
});

window.addEventListener("hashchange", e => {
  console.log("You've change of route");
  setTimeout(manage_subscription, 50);
});
