import consumer from "./consumer"
import {GIF} from "../utils/GIF"

let game = null;

var mygif = GIF();
mygif.load("/images/test.gif");

var img = new Image();
img.src = "/images/old_tv.png"

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
    case "z":
    case "w":
    case "ArrowUp":
      keyboard["up"] = true;
      break;
    case "s":
    case "ArrowDown":
      keyboard["down"] = true;
      break;
  }
  // console.log(event.key);
});

document.addEventListener("keyup", event => {
  switch (event.key) {
    case "z":
    case "w":
    case "ArrowUp":
      keyboard["up"] = false;
      break;
    case "s":
    case "ArrowDown":
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
  radius: 7
};

function draw_ball(color=`rgb(230, 230, 230)`) {
  ctx.beginPath();
  ctx.arc(((ball.x + 1) / 2) * canvas.width, ((ball.y + 1) / 2) * canvas.height, ball.radius, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

class Game {
  constructor(room_name, player_left, player_right, score_left, score_right, consumer) {
    this.room_name = room_name;
    this.player_left = player_left;
    this.player_right = player_right;
    this.left_action = 'w';
    this.right_action = 'w';
    this.consumer = consumer;
    this.stop = false;
    this.ball_speed = 0.55;
    this.paddle_speed = 1.1;
    this.score_left = score_left;
    this.score_right = score_right;
    this.poss_dir = [1, -1];
    this.ball_dir = [this.poss_dir[Math.round(Math.random())], getRandomBetween(-1, 1)];
    this.fps = 45;
    this.has_ended = false;
  }

  check_end() {
    if (this.has_ended == false && (this.score_right == score_max || this.score_left == score_max)) {
      this.has_ended = true;
      setTimeout(function (game) {
        game.consumer.perform("end_the_game", {room_name: game.room_name})
      }, 2000, this)
    }
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

    ctx.lineWidth = 10;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.setLineDash([15, 10]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    draw_ball();

    ctx.font = "84px 'Air Americana'";
    ctx.fillStyle = "white";
    ctx.fillText(this.score_left.toString(), canvas.width / 3, 180);
    ctx.fillText(this.score_right.toString(), (canvas.width / 3) * 2 - 42, 180);

    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.drawImage(mygif.image, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.6;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.restore();
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

let inter;

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
      game.ball_speed = 0.55;
      ball.x = 0;
      ball.y = 0;
      game.ball_dir = [game.poss_dir[Math.round(Math.random())], getRandomBetween(-1, 1)];
    } else if (act == 4) {
      game.score_right += 1;
      game.ball_speed = 0.55;
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
      game.ball_speed *= 1.08; 
    } else if (act == 0) { // * Bounce left
      game.ball_dir = [1, getRandomBetween(-1.5, 1.5)];
      game.ball_speed *= 1.08;
    }

    game.ball_speed = Math.min(game.ball_speed, 1.4);
  }

  if (game.consumer.role != 'v') {
    game.send_datas();
    game.check_end();
  }

  if (canvas != null)
    game.draw_datas();
  
  //console.log("1 frame");
  if (game.consumer.role == 'r') {
    setTimeout(function () {
      game.consumer.perform("get_datas", {room_name: game.room_name})
    }, 1000 / game.fps)
  } 
}

function unregister_loop() {
  if (document.getElementById("in_game_id") === null) {
    consumer.subscriptions.subscriptions.forEach(sub => {
        if (sub.identifier && (sub.identifier.includes("PlayChannel") || sub.identifier.includes("GameChannel"))) {
          sub.disconnected();
          consumer.subscriptions.remove(sub);
        }
    })
  }
}

function subscription_loop() {
  const ingameelement = document.getElementById("in_game_id")
  let ranked = true;
  const ranked_el = document.getElementById("ranked")

  const up_button = document.getElementById("up_button")
  const down_button = document.getElementById("down_button")

  if (up_button != null) {
    up_button.addEventListener("mousedown", event => {
      keyboard["up"] = true;
    })

    up_button.addEventListener("touchstart", event => {
      keyboard["up"] = true;
    })
  
    up_button.addEventListener("touchend", event => {
      keyboard["up"] = false;
    })
  
    up_button.addEventListener("mouseup", event => {
      keyboard["up"] = false;
    })
  
    down_button.addEventListener("mousedown", event => {
      keyboard["down"] = true;
    })
  
    down_button.addEventListener("mouseup", event => {
      keyboard["down"] = false;
    })

    down_button.addEventListener("touchstart", event => {
      keyboard["down"] = true;
    })
  
    down_button.addEventListener("touchend", event => {
      keyboard["down"] = false;
    })
  }

  if (ranked_el === null)
    ranked = false;

  if (ingameelement !== null) {
    let is_a_player = false;

    consumer.subscriptions.subscriptions.forEach(sub => {
      if (JSON.parse(sub.identifier)["channel"] === "PlayChannel") {
        if (JSON.parse(sub.identifier)["game_room_id"] === location.hash.split("/")[1] && JSON.parse(sub.identifier)["role"] != 'v') {
          is_a_player = true;
        } else {
          sub.disconnected();
          consumer.subscriptions.remove(sub);
        }
      }
    })

    if (!is_a_player) {
      let match_id = ingameelement.dataset.id;
      consumer.subscriptions.create({channel: "PlayChannel", game_room_id: match_id, role: 'v'}, {
        room: undefined,
        connected() {
          // Called when the subscription is ready for use on the server
          this.role = 'v';
          this.room = `play_channel_${match_id}`;
          inter = setInterval(() => {
            canvas = document.getElementById("myCanvas");
            if (canvas != null) {
              ctx = canvas.getContext('2d');
              game_loop(game);
              clearInterval(inter);
            }
          }, 50);
          game = new Game(this.room, 0, 0, 0, 0, this)
          game.consumer.perform("get_user_infos", {room_name: this.room})
        },

        disconnected() {
          // Called when the subscription has been terminated by the server
          ball.x = 0.0;
          ball.y = 0.0;
          ctx = null;
          canvas = null;
        },

        received(data_nest) {
          // console.log(data_nest);
          if (data_nest['action'] == 'quit')
            location.hash = "#";
          if (data_nest['action'] == "users_infos") {
            const UID = document.getElementById("UID");
            UID.innerHTML = `${data_nest['left_user']} VS ${data_nest['right_user']}`
          }
          else if (data_nest['ball_speed'] != null) {
            update_datas(data_nest)
            game_loop(game);
          }
          // if don't work use a set Interval avec une variable action has been played to check if data has been received in a certain time
        }
      });
    }
  }

  const element = document.getElementById("game_page_id")
  consumer.subscriptions.create({channel: "GameChannel", is_ranked: ranked, is_matchmaking: element !== null}, {
    connected() {
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
      ctx = null;
      canvas = null;
    },


    received(data) {
      if (data.action === 'game_start') {
        setTimeout(function() {
          $.ajax({
              url:  `/api/games/${data.match_room_id}/${window.App.models.user.toJSON().id}.json`,
              data: { "authenticity_token": $('meta[name="csrf-token"]').attr('content') },
              type: 'GET'
          })
          .done(res => {
            if (res == null) {
              location.hash = "#game/" + data.match_room_id;

              consumer.subscriptions.create({channel: "PlayChannel", game_room_id: data.match_room_id, role: data.msg}, {
                room: undefined,
                connected() {
                  // Called when the subscription is ready for use on the server
                  this.role = data.msg;
                  this.room = `play_channel_${data.match_room_id}`;
                  inter = setInterval(() => {
                    canvas = document.getElementById("myCanvas");
                    if (canvas != null) {
                      ctx = canvas.getContext('2d');
                      game.draw_datas();
                      clearInterval(inter);
                    }
                  }, 80);
                  const UID = document.getElementById("UID");
                  if (this.role == "l") {
                    UID.innerHTML = `${window.App.models.user.toJSON().email} VS ${data.adv}`
                  } else {
                    UID.innerHTML = `${data.adv} VS ${window.App.models.user.toJSON().email}`
                  }
                  game = new Game(this.room, 0, 0, 0, 0, this)
                  
                  document.addEventListener("visibilitychange", function(e) {
                    game.consumer.perform("end_the_game", {room_name: game.room_name})
                  });

                  setTimeout(function() {
                    game.consumer.perform("connect_to_game", { room_name: game.room_name, player: game.consumer.role });
                  }, 500)
                  setTimeout(function() {
                    currentTime = Date.now();
                    game.consumer.perform("check_users_connection", { room_name: game.room_name })
                    game_loop(game);
                  }, 2000);
                },

                disconnected() {
                  // Called when the subscription has been terminated by the server
                  ball.x = 0.0;
                  ball.y = 0.0;
                  this.perform("quit", {room_name: game.room_name, player: this.role}); // default action
                  canvas = null;
                },

                received(data_nest) {
                  if (data_nest != null) {
                    if (data_nest['action'] == 'quit')
                      location.hash = "#";
                    if (data_nest['action'] != "users_infos" && data_nest['ball_speed'] != null) {
                      update_datas(data_nest)
                      game_loop(game);
                    }
                  }
                }
              });
            } else {
              window.App.toast.success("The Game was launch in another window");
              if (location.hash == "#game" || location.hash == "#game_ranked")
                location.hash = "#";
            }
          })
          .fail((e) => {
          });
        }, Math.random() * 1000);
      }
    }
  });
}

window.addEventListener("hashchange", e => {
  setTimeout(unregister_loop, 50);
  setTimeout(subscription_loop, 150);
});

setTimeout(subscription_loop, 1500);