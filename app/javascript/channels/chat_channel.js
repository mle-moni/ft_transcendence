import consumer from "./consumer"

// https://stackoverflow.com/questions/60050647/disconnect-and-unsubscribe-action-cable-on-rails-6?rq=1

function manageDirectChat() {

    const inDM = document.getElementById("checkChatPresence");
    if (inDM) {
      var subDC = consumer.subscriptions.create({
          channel: "ChatChannel"
        }, {
        connected() {
          // Called when the subscription is ready for use on the server
          // console.log("Connected DM");
          //console.log("room_id = " + room_id.toString());
        },
    
        disconnected() {
          // Called when the subscription has been terminated by the server
          // console.log("Disconnected DM");
        },
    
        received(data) {
          // Called when there's incoming data on the websocket for this channel
          // console.log("Received DM");
          window.App.collections.DirectMessagesRoom.fetch();
          // window.App.collections.allUsers.myfetch();

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

