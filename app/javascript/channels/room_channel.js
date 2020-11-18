import consumer from "./consumer"

var sub = null;


function chatRoomMain() {

  if (sub) {
		sub.unsubscribe();
		sub = null;
	}
  
  // var messageTemplate = $('[data-role="message-template"]');
  // var placeToAppend = $('[data-channel-subscribe="room"]');
  // var room_id = $('#room_messages').attr('data-room-id');

  // if (messageSection == null || placeToAppend == null || room_id == null || messageTemplate == null) {
  //   alert("Null");
  // }

  const checkRoomPresence = document.getElementById("checkRoomPresence")
  if (checkRoomPresence === null) {
    consumer.subscriptions.subscriptions.forEach(subscription => {
      console.log(subscription);
    })
  } else {

    console.log("We're inside the room !" + $('[data-channel-subscribe="room"]').data('room-id'));
  
    sub = consumer.subscriptions.create({
        channel: "RoomChannel",
        room_id: 2
      }, {

      connected() {
        // Called when the subscription is ready for use on the server
        console.log("Connected");
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
        console.log("Disconnected");
      },

      received(data) {
        // Called when there's incoming data on the websocket for this channel
        console.log("Received");
        // $('#roomIndexPage').append('<p class="message"> New Message ! </p>')
        // $('#checkRoomPresence').append('<p class="message"> New Message ! </p>')

        console.log(data)

        // var content = messageTemplate.children().clone(true, true);
        // content.find('[data-role="message-text"]').text(data.content);
        $('#checkRoomPresence').append('<p class="message">' + data.content + '</p>')

      }
    });

  }

}

window.addEventListener("hashchange", e => {
  console.log("You've change of route 3");
  setTimeout(chatRoomMain, 50);
}); 
