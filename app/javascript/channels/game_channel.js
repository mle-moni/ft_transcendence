import consumer from "./consumer"

let game = null;

let currentTime = Date.now();

const score_max = 11;

let keyboard = {
  up: false,
  down: false
}

function getRandomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

document.addEventListener("keydown",  event => {
  switch (event.key) {
    case "z" || "ArrowUp":
      keyboard["up"] = true;
      break;
    case "s" || "ArrowDown":
      keyboard["down"] = true;
      break;
  }
  console.log(event.key);
});

document.addEventListener("keyup", event => {
  switch (event.key) {
    case "z" || "ArrowUp":
      keyboard["up"] = false;
      break;
    case "s" || "ArrowDown":
      keyboard["down"] = false;
      break;
  }
});

document.addEventListener("blur", event => {
  keyboard["up"] = false;
  keyboard["down"] = false;
});


let ctx = null;
let canvas = null;

let ball = {
  x: 0.0,
  y: 0.0,
  radius: 5,
  color: `rgb(255, 165, 0)`,
  draw: function(ctx) {
    ctx.beginPath();
    ctx.arc(((this.x + 1) / 2) * canvas.width, ((this.y + 1) / 2) * canvas.height, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

class Game {
  constructor(room_name, ctx, player_left, player_right, score_left, score_right, consumer) {
    this.room_name = room_name;
    this.ctx = ctx;
    this.player_left = player_left;
    this.player_right = player_right;
    this.left_action = 'w';
    this.right_action = 'w';
    this.consumer = consumer;
    currentTime = Date.now();
    this.stop = false;
    this.ball_speed = 0.45;
    this.paddle_speed = 1.4;
    this.score_left = score_left;
    this.score_right = score_right;
    this.poss_dir = [1, -1];
    this.ball_dir = [this.poss_dir[Math.round(Math.random())], getRandomBetween(-1, 1)];
    this.fps = 45;
  }

  check_end() {
    if (this.score_right == score_max)
      this.consumer.perform("end_the_game", {room_name: this.room_name});
    if (this.score_left == score_max)
      this.consumer.perform("end_the_game", {room_name: this.room_name});
  }

  send_datas() {
    let action = "w";
    if (keyboard["up"] !== keyboard["down"]) {
      if (keyboard["up"])
        action = "u";
      else
        action = "d";
    }
    this.consumer.perform("take_turn", {input: action, room_name: this.room_name, player: this.consumer.role});
    if (this.consumer.role == 'r')
      this.consumer.perform("new_state", {room_name: this.room_name, ball_x: ball.x, ball_y: ball.y, left_pos: this.player_left, right_pos: this.player_right, right_score: this.score_right, left_score: this.score_left, ball_dir_x: this.ball_dir[0], ball_dir_y: this.ball_dir[1], ball_speed: this.ball_speed});
  }

  draw_datas() {
    let pad_h = canvas.height / 10;
    ctx.fillStyle = "white";
    clear();
    let l_y = (canvas.height / 2) + (canvas.height / 2) * (this.player_left - 0.1);
    ctx.fillRect((canvas.width * 0.075) - 10, l_y, 10, pad_h);
    let r_y = (canvas.height / 2) + (canvas.height / 2) * (this.player_right - 0.1);
    ctx.fillRect((canvas.width * 0.925), r_y, 10, pad_h);
    ctx.font = "42px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(this.score_left.toString(), canvas.width / 3, 60);
    ctx.fillText(this.score_right.toString(), (canvas.width / 3) * 2, 60);
    
    ctx.fillRect((canvas.width * 0.495), 0, (canvas.width * 0.01), canvas.height);
    ball.draw(ctx);
  }

  ball_collision() {
    if (ball.x >= 1) { // * only right player will update the score to prevent score update collision
      return 5;
    } else if (ball.x <= -1) {
      return 4;
    } else if (ball.y >= 1) {
      return 3;
    } else if (ball.y <= -1) {
      return 2;
    } else if (this.ball_dir[0] > 0 && ball.x >= 0.82 && ball.x <= 0.9 && ball.y >= this.player_right - 0.1 && ball.y <= this.player_right + 0.1) {
      return 1;
    } else if (this.ball_dir[0] < 0 && ball.x <= -0.82 && ball.x >= -0.9 && ball.y >= this.player_left - 0.1 && ball.y <= this.player_left + 0.1) {
      return 0;
    }
    return -1;
  }
}

function update_datas(data) {
    ball.x = data["ball_pos_x"];
    ball.y = data["ball_pos_y"];
    game.player_left = data["left_pos"];
    game.player_right = data["right_pos"];
    game.score_right = data["right_score"];
    game.score_left = data["left_score"];
    if (data["ball_dir_x"] != 0 || data["ball_dir_y"] != 0)
      game.ball_dir = [data["ball_dir_x"], data["ball_dir_y"]]
    if (data["ball_speed"] != 0)
      game.ball_speed = data["ball_speed"];
    game.left_action = data["left_action"];
    game.right_action = data["right_action"];
    // console.log("request processed")
}

function magnitude(vec) {
  return Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
}

function game_loop() {
  if (game.stop)
    return;
  var now = Date.now();
  var delta = (now - currentTime) / 1000;
  currentTime = now;

  if (game.consumer.role == 'r' && game.score_left != score_max && game.score_right != score_max) {
    if (game.left_action == "u")
      game.player_left = Math.max(game.player_left - game.paddle_speed * delta, -0.9)
    else if (game.left_action == "d")
      game.player_left = Math.min(game.player_left + game.paddle_speed * delta, 0.9)
    
    if (game.right_action == "u")
      game.player_right = Math.max(game.player_right - game.paddle_speed * delta, -0.9)
    else if (game.right_action == "d")
      game.player_right = Math.min(game.player_right + game.paddle_speed * delta, 0.9)

    let magn = magnitude(game.ball_dir);

    if (magn != 0) {
      ball.x += (game.ball_dir[0] / magn) * game.ball_speed * delta
      ball.y += (game.ball_dir[1] / magn) * game.ball_speed * delta
    }

    var act = game.ball_collision();
    if (act == 5) {
      game.score_left += 1;
      game.ball_speed = 0.45;
      ball.x = 0;
      ball.y = 0;
      game.ball_dir = [game.poss_dir[Math.round(Math.random())], getRandomBetween(-1, 1)];
    } else if (act == 4) {
      game.score_right += 1;
      game.ball_speed = 0.45;
      ball.x = 0;
      ball.y = 0;
      game.ball_dir = [game.poss_dir[Math.round(Math.random())], getRandomBetween(-1, 1)];
    } else if (act == 3) {
      ball.y = 0.95;
      game.ball_dir[1] = -1 * game.ball_dir[1];
    } else if (act == 2) {
      ball.y = -0.95;
      game.ball_dir[1] = -1 * game.ball_dir[1];
    } else if (act == 1) { // * Bounce right
      game.ball_dir = [-1, getRandomBetween(-1.5, 1.5)];
      game.ball_speed *= 1.05;
    } else if (act == 0) { // * Bounce left
      game.ball_dir = [1, getRandomBetween(-1.5, 1.5)];
      game.ball_speed *= 1.05;
    }

    game.ball_speed = Math.min(game.ball_speed, 1.2);

  }

  game.check_end();
  game.draw_datas();
  game.send_datas();

  //console.log("1 frame");
  if (game.consumer.role == 'r') {
    setTimeout(function () {
      game.consumer.perform("get_datas", {room_name: game.room_name})
    }, 1000 / game.fps)
  } 
}

function subscription_loop() {
  const ingameelement = document.getElementById("in_game_id")
  let ranked = true;
  const ranked_el = document.getElementById("ranked")

  if (ranked_el === null)
    ranked = false;

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
    /*if (!is_a_player) {
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
    }*/
  }

  const element = document.getElementById("game_page_id")
  if (element !== null) {
    consumer.subscriptions.create({channel: "GameChannel", is_ranked: ranked}, {
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
            room: undefined,
            connected() {
              // Called when the subscription is ready for use on the server
              console.log("Now Playing, with paddle :" + data.msg);
              this.role = data.msg;
              this.room = `play_channel_${data.match_room_id}`;
              console.log("your role is : " + this.role);
              console.log(this.room);
              this.perform("start_game", {room_name: this.room, is_ranked: ranked }); // default action
              canvas = document.getElementById("myCanvas");
              ctx = canvas.getContext('2d');
              const UID = document.getElementById("UID");
              UID.innerHTML = `You have the ${this.role} paddle`
              game = new Game(this.room, ctx, 0, 0, 0, 0, this)
              game_loop(game);
            },

            disconnected() {
              // Called when the subscription has been terminated by the server
              console.log("I am disconnected of the room");
              ball.x = 0.0;
              ball.y = 0.0;
              this.perform("quit", {room_name: game.room_name, player: this.role}); // default action
              console.log("perform ok");
              ctx = null;
              canvas = null;
            },

            received(data_nest) {
              // console.log(data_nest);
              if (data_nest['action'] == 'quit' || game.left_action == "quit" || game.right_action == "quit")
                location.hash = "#";
              if (data_nest['ball_speed'] != null) {
                update_datas(data_nest)
                game_loop(game);
              }

              // if don't work use a set Interval avec une variable action has been played to check if data has been received in a certain time
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
