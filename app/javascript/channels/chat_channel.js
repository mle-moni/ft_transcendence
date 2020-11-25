import consumer from "./consumer"

function manageDirectChat() {
    const in_dm = document.getElementById("checkChatPresence");
    if (in_dm)
    {
        consumer.subscriptions.create({
          channel: "ChatChannel"
          // room_id: $('.chat').attr('data-room-id')
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
          //TODO: condition suivant type
          //window.App.collections.allUsers.myFetch();
          window.App.collections.DirectMessagesRoom.fetch();
        }
      });
    }
}


$(window).on('popstate', e => {
  var detectChat = document.getElementById("checkChatPresence");
  if (detectChat) { 
    setTimeout(manageDirectChat, 250)
  }
 });

$(document).ready(function(){
  var detectChat = document.getElementById("checkChatPresence");
  if (detectChat) { 
    setTimeout(manageDirectChat, 250)
  }
});

window.addEventListener("hashchange", e => {
  var detectChat = document.getElementById("checkChatPresence");
  if (detectChat) { 
    setTimeout(manageDirectChat, 250)
  }
});

