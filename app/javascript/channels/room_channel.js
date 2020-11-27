import consumer from "./consumer"

function manageRoomChat() {
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
          // Called when the subscription has been terminated by the server
          console.log("Disconnected Room");
        },
    
        received(data) {
          // Called when there's incoming data on the websocket for this channel
          console.log("Received Room");
          window.App.collections.rooms.fetch();
          
        }
      });
    } else {
      // console.log("Not in RoomChannel");
      consumer.subscriptions.subscriptions.forEach(sub => {
        if (sub.identifier && sub.identifier.includes("RoomChannel")) {
          // console.log("Removed RoomChannel");
          consumer.subscriptions.remove(sub);
        }
      })
    }
}

// 250 to be sure that the view is fully rendered before checking '#checkRoomPresence' in manageRoomChat()
// popstate = prev / after buttons
// .ready = refresh
// haschange = change route

$(window).on('popstate', e => {
    setTimeout(manageRoomChat, 250)
});

$(document).ready(function(){
    setTimeout(manageRoomChat, 250)
});

window.addEventListener("hashchange", e => {
    setTimeout(manageRoomChat, 250)
});
