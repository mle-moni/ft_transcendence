import consumer from "./consumer"

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
          // console.log("Received Room");
          window.App.collections.rooms.fetch();
          // window.App.collections.allUsers.myfetch();

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
