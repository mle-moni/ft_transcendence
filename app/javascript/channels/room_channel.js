

import consumer from "./consumer"

$(document).ready(function() {
  console.log($('#room_messages').attr('data-room-id'));
});

consumer.subscriptions.create({
    channel: "RoomChannel",
    room_id: 1
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
    console.log(data)
    $('#checkRoomPresence').append('<p class="message"> New Message ! </p>')
  }
});