import consumer from "./consumer"

var subDirectChatPreviousDataReceived = null;

function manageDirectChat() {

    const inDM = document.getElementById("checkChatPresence");
    if (inDM) {
      var subDC = consumer.subscriptions.create({
          channel: "ChatChannel"
        }, {
        connected() {
          // Called when the subscription is ready for use on the server
          // console.log("Connected DM");
        },
    
        disconnected() {
          // Called when the subscription has been terminated by the server
          // console.log("Disconnected DM");
        },
    
        received(data) {
          // Called when there's incoming data on the websocket for this channel
          if (subDirectChatPreviousDataReceived != data) {
            // console.log("Received DM - New Data - Fetching");
            window.App.collections.DirectMessagesRoom.fetch();
            subDirectChatPreviousDataReceived = data;
          }
          // else {
          //   console.log("Received DM - Identic Data - No Fetch");
          // }

        }
      });
    } else {
      consumer.subscriptions.subscriptions.forEach(sub => {
        if (sub.identifier && sub.identifier.includes("ChatChannel")) {
          consumer.subscriptions.remove(sub);
        }
      })
    }
}

$(document).ready(function(){
    setTimeout(manageDirectChat, 250)
});

window.addEventListener("hashchange", e => {
    setTimeout(manageDirectChat, 250)
});

