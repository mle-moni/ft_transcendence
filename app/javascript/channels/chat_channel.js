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
        },
    
        disconnected() {
          // Called when the subscription has been terminated by the server
        },
    
        received(data) {
          // Called when there's incoming data on the websocket for this channel
          if (subDirectChatPreviousDataReceived != data) {
            window.App.collections.DirectMessagesRoom.fetch();
            subDirectChatPreviousDataReceived = data;
          }
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

