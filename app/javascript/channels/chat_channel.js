import consumer from "./consumer"

// https://stackoverflow.com/questions/60050647/disconnect-and-unsubscribe-action-cable-on-rails-6?rq=1

function manageDirectChat() {

    if (subDC) {
      consumer.subscriptions.remove(subDC);
    }

    const inDM = document.getElementById("checkChatPresence");
    if (inDM) {
      var subDC = consumer.subscriptions.create({
          channel: "ChatChannel"
        }, {
        connected() {
          // Called when the subscription is ready for use on the server
          console.log("Connected DM");
          //console.log("room_id = " + room_id.toString());
        },
    
        disconnected() {
          // Called when the subscription has been terminated by the server
          console.log("Disconnected DM");
        },
    
        received(data) {
          // Called when there's incoming data on the websocket for this channel
          console.log("Received DM");
          window.App.collections.allUsers.myFetch();
          // window.App.collections.DirectMessagesRoom.fetch(); --> à reconfirmer
        }
      });
    }
}

$(window).on('popstate', e => {
  var detectChat = document.getElementById("checkChatPresence");
  if (detectChat) { 
    setTimeout(manageDirectChat, 250)
  }
  // ELSE ?
 });

$(document).ready(function(){
  var detectChat = document.getElementById("checkChatPresence");
  if (detectChat) { 
    setTimeout(manageDirectChat, 250)
  }
  // ELSE ?
});

window.addEventListener("hashchange", e => {
  var detectChat = document.getElementById("checkChatPresence");
  if (detectChat) { 
    setTimeout(manageDirectChat, 250)
  }
  // ELSE ?
});

