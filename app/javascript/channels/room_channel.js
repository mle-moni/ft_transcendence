import consumer from "./consumer"

function manageRoomChat() {
    const in_room = document.getElementById("checkRoomPresence");
    if (in_room)
    {
        consumer.subscriptions.create({
          channel: "RoomChannel"
          // room_id: $('.chat').attr('data-room-id')
        }, {
        connected() {
          // Called when the subscription is ready for use on the server
          console.log("Connected Room");
          //console.log("room_id = " + room_id.toString());
        },
    
        disconnected() {
          // Called when the subscription has been terminated by the server
          console.log("Disconnected Room");
        },
    
        received(data) {
          // Called when there's incoming data on the websocket for this channel
          console.log("Received Room");
          //TODO: condition suivant type
          window.App.collections.rooms.fetch();
          window.App.collections.allUsers.myFetch();
          
        }
      });
    }
}

// 250 to be sure that the view is fully rendered before checking '#checkRoomPresence' in manageRoomChat()

$(window).on('popstate', e => {
  var detectRoom = document.getElementById("checkRoomPresence")
  if (detectRoom) { 
    setTimeout(manageRoomChat, 250)
  }
 });

$(document).ready(function(){
  var detectRoom = document.getElementById("checkRoomPresence")
  if (detectRoom) { 
    setTimeout(manageRoomChat, 250)
  }
});

window.addEventListener("hashchange", e => {
  var detectRoom = document.getElementById("checkRoomPresence")
  if (detectRoom) { 
    setTimeout(manageRoomChat, 250)
  }
});
