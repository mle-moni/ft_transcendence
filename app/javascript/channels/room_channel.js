import consumer from "./consumer"

function manageRoomChat() {
    if (subRoom) {
      consumer.subscriptions.remove(subDC);
    }
    const inRoom = document.getElementById("checkRoomPresence");
    if (inRoom) {
      var subRoom = consumer.subscriptions.create({
          channel: "RoomChannel"
        }, {
        connected() {
          // Called when the subscription is ready for use on the server
          console.log("Connected Room");
          //console.log("room_id = " + room_id.toString());
        },
    
        disconnected() {
          App.cable.subscriptions.remove(this)
          // Called when the subscription has been terminated by the server
          console.log("Disconnected Room");
        },
    
        received(data) {
          // Called when there's incoming data on the websocket for this channel
          console.log("Received Room");
          window.App.collections.rooms.fetch();
          // window.App.collections.allUsers.myFetch(); ---> à reconfirmer
          
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
  // ELSE ?
});

$(document).ready(function(){
  var detectRoom = document.getElementById("checkRoomPresence")
  if (detectRoom) { 
    setTimeout(manageRoomChat, 250)
  }
  // ELSE ?
});

window.addEventListener("hashchange", e => {
  var detectRoom = document.getElementById("checkRoomPresence")
  if (detectRoom) { 
    setTimeout(manageRoomChat, 250)
  }
  // ELSE ?
});
