import consumer from "./consumer"

// https://www.xspdf.com/resolution/50834632.html

var subRoomPreviousDataReceived = null;

function manageRoomChat() {

    const inRoom = document.getElementById("checkRoomPresence");
    if (inRoom) {
      var subRoom = consumer.subscriptions.create({
          channel: "RoomChannel"
        }, {
        connected() {
          // Called when the subscription is ready for use on the server
          // console.log("Connected Room");
        },
    
        disconnected() {
          // Called when the subscription has been terminated by the server
          // console.log("Disconnected Room");
        },
    
        received(data) {
          // Called when there's incoming data on the websocket for this channel
          if (subRoomPreviousDataReceived != data) {
            // console.log("Received Room - New Data - Fetching");
            window.App.collections.rooms.fetch();
            subRoomPreviousDataReceived = data;
          }
          // else {
          //   console.log("Received Room - Identic Data - No Fetch");
          // }

        }
      });
    } else {
      consumer.subscriptions.subscriptions.forEach(sub => {
        if (sub.identifier && sub.identifier.includes("RoomChannel")) {
          consumer.subscriptions.remove(sub);
        }
      })
    }
}

$(document).ready(function(){
    setTimeout(manageRoomChat, 250)
});

window.addEventListener("hashchange", e => {
    setTimeout(manageRoomChat, 250)
});
