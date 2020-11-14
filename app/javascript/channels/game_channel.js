import consumer from "./consumer"

let ball = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  radius: 6,
  color: 'white',
  draw: function(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};

let ctx = null;
let canvas = null;

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function subscription_loop() {
  const ingameelement = document.getElementById("in_game_id")
  if (ingameelement === null) {
    consumer.subscriptions.subscriptions.forEach(sub => {
      console.log(sub);
      sub.disconnected();
      consumer.subscriptions.remove(sub);
    })
  } else {
    let is_a_player = false;
    consumer.subscriptions.subscriptions.forEach(sub => {
      if (JSON.parse(sub.identifier)["channel"] === "PlayChannel")
        is_a_player = true;
    })
    console.log("the consummer is a player ? " + is_a_player)
    if (!is_a_player) {
      let match_id = ingameelement.dataset.id;
      consumer.subscriptions.create({channel: "PlayChannel", game_room_id: match_id}, {
        pad_h: null,
        connected() {
          // Called when the subscription is ready for use on the server
          this.role = "viewer"
          console.log("your role is : " + this.role); pad_h: null
        },

        disconnected() {
          // Called when the subscription has been terminated by the server
          console.log("I am disconnected of the room");
        },

        received(data_nest) {
          // Called when there's incoming data on the websocket for this channel
          if (data_nest.s == 'end') {
            ctx = null;
            canvas = null;
            location.hash = "#";
            return ;
          }
          if (canvas === null) {
            canvas = document.getElementById("myCanvas");
          } else if (ctx === null) {
            ctx = canvas.getContext('2d');
            this.pad_h = canvas.height / 4;
          } else {
            ctx.fillStyle = "white";
            clear();
            // pads
            let l_y = (canvas.height / 2) + (canvas.height / 2) * (data_nest.l - 0.250);
            ctx.fillRect((canvas.width * 0.055), l_y, 10, this.pad_h);
            let r_y = (canvas.height / 2) + (canvas.height / 2) * (data_nest.r - 0.250);
            ctx.fillRect((canvas.width * 0.93), r_y, 10, this.pad_h);
            let centerX = ((data_nest.bl[0] + 1) / 2) * canvas.width;
            let centerY = ((data_nest.bl[1] + 1) / 2) * canvas.height;
            ball.x = centerX;
            ball.y = centerY;
            ctx.font = "42px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(data_nest.sl.toString(), canvas.width / 3, 60);
            ctx.fillText(data_nest.sr.toString(), (canvas.width / 3) * 2, 60);
            // demarcation
            ctx.fillRect((canvas.width * 0.495), 0, (canvas.width * 0.01), canvas.height);
            // ball
            ball.draw(ctx);
          }
        }
      });
    }
  }


  const element = document.getElementById("game_page_id")
  if (element !== null) {
    consumer.subscriptions.create("GameChannel", {
      connected() {
        console.log("this is streaming from the game channel");
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
        console.log("leave matchmaking");
        ctx = null;
        canvas = null;
      },

      received(data) {
        console.log(data);
        if (data.action === 'game_start') {
          location.hash = "#game/" + data.match_room_id;
          consumer.subscriptions.create({channel: "PlayChannel", game_room_id: data.match_room_id}, {
            room: undefined, keyboard: undefined, pad_h: null,
            connected() {
              this.keyboard = {
                up: false,
                down: false
              }
              // Called when the subscription is ready for use on the server
              console.log("Now Playing, with paddle :" + data.msg);
              this.role = data.msg;
              this.room = data.match_room_id;
              console.log("your role is : " + this.role);
              this.perform("start_game", {action: "wait", room_id: this.room, player: this.role}); // default action
              document.addEventListener("keydown",  event => {
                switch (event.keyCode) {
                  case 90 || 38:
                    this.keyboard["up"] = true;
                    break;
                  case 83 || 40:
                    this.keyboard["down"] = true;
                    break;
                }
              });

              document.addEventListener("keyup", event => {
                switch (event.keyCode) {
                  case 90 || 38:
                    this.keyboard["up"] = false;
                    break;
                  case 83 || 40:
                    this.keyboard["down"] = false;
                    break;
                }
              });

              document.addEventListener("blur", event => {
                this.keyboard["up"] = false;
                this.keyboard["down"] = false;
              });
            },

            disconnected() {
              // Called when the subscription has been terminated by the server
              console.log("I am disconnected of the room");
              this.perform("take_turn", {input: "quit", room_id: this.room, player: this.role}); // default action
              ctx = null;
              canvas = null;
            },

            received(data_nest) {
              // Called when there's incoming data on the websocket for this channel
              if (data_nest.s == 'end') {
                ctx = null;
                canvas = null;
                location.hash = "#";
                return ;
              }
              if (canvas === null) {
                canvas = document.getElementById("myCanvas");
              } else if (ctx === null) {
                ctx = canvas.getContext('2d');
                this.pad_h = canvas.height / 4;
              } else {
                ctx.fillStyle = "white";
                clear();
                // pads
                let l_y = (canvas.height / 2) + (canvas.height / 2) * (data_nest.l - 0.250);
                ctx.fillRect((canvas.width * 0.055), l_y, 10, this.pad_h);
                let r_y = (canvas.height / 2) + (canvas.height / 2) * (data_nest.r - 0.250);
                ctx.fillRect((canvas.width * 0.93), r_y, 10, this.pad_h);
                let centerX = ((data_nest.bl[0] + 1) / 2) * canvas.width;
                let centerY = ((data_nest.bl[1] + 1) / 2) * canvas.height;
                ball.x = centerX;
                ball.y = centerY;
                ctx.font = "42px Arial";
                ctx.fillStyle = "white";
                ctx.fillText(data_nest.sl.toString(), canvas.width / 3, 60);
                ctx.fillText(data_nest.sr.toString(), (canvas.width / 3) * 2, 60);
                // demarcation
                ctx.fillRect((canvas.width * 0.495), 0, (canvas.width * 0.01), canvas.height);
                // ball
                ball.draw(ctx);
              }
              let action = "w";
              if (this.keyboard["up"] !== this.keyboard["down"]) {
                if (this.keyboard["up"]) {
                  action = "u";
                } else {
                  action = "d";
                }
              }
              this.perform("take_turn", {input: action, room_id: this.room, player: this.role}); // default action
            }
          });
        }
      }
    });
  }
}

window.addEventListener("hashchange", e => {
  // console.log('hashchange1', window.location.hash );
  setTimeout(subscription_loop, 50);
});
