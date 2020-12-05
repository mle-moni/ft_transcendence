import consumer from "./consumer"

const GIF = function () {
  // **NOT** for commercial use.
  var timerID;                          // timer handle for set time out usage
  var st;                               // holds the stream object when loading.
  var interlaceOffsets  = [0, 4, 2, 1]; // used in de-interlacing.
  var interlaceSteps    = [8, 8, 4, 2];
  var interlacedBufSize;  // this holds a buffer to de interlace. Created on the first frame and when size changed
  var deinterlaceBuf;
  var pixelBufSize;    // this holds a buffer for pixels. Created on the first frame and when size changed
  var pixelBuf;
  const GIF_FILE = { // gif file data headers
      GCExt   : 0xF9,
      COMMENT : 0xFE,
      APPExt  : 0xFF,
      UNKNOWN : 0x01, // not sure what this is but need to skip it in parser
      IMAGE   : 0x2C,
      EOF     : 59,   // This is entered as decimal
      EXT     : 0x21,
  };      
  // simple buffered stream used to read from the file 
  var Stream = function (data) { 
      this.data = new Uint8ClampedArray(data);
      this.pos  = 0;
      var len   = this.data.length;
      this.getString = function (count) { // returns a string from current pos of len count
          var s = "";
          while (count--) { s += String.fromCharCode(this.data[this.pos++]) }
          return s;
      };
      this.readSubBlocks = function () { // reads a set of blocks as a string
          var size, count, data  = "";
          do {
              count = size = this.data[this.pos++];
              while (count--) { data += String.fromCharCode(this.data[this.pos++]) }
          } while (size !== 0 && this.pos < len);
          return data;
      }
      this.readSubBlocksB = function () { // reads a set of blocks as binary
          var size, count, data = [];
          do {
              count = size = this.data[this.pos++];
              while (count--) { data.push(this.data[this.pos++]);}
          } while (size !== 0 && this.pos < len);
          return data;
      }
  };
  // LZW decoder uncompressed each frames pixels
  // this needs to be optimised.
  // minSize is the min dictionary as powers of two
  // size and data is the compressed pixels
  function lzwDecode(minSize, data) {
      var i, pixelPos, pos, clear, eod, size, done, dic, code, last, d, len;
      pos = pixelPos = 0;
      dic      = [];
      clear    = 1 << minSize;
      eod      = clear + 1;
      size     = minSize + 1;
      done     = false;
      while (!done) { // JavaScript optimisers like a clear exit though I never use 'done' apart from fooling the optimiser
          last = code;
          code = 0;
          for (i = 0; i < size; i++) {
              if (data[pos >> 3] & (1 << (pos & 7))) { code |= 1 << i }
              pos++;
          }
          if (code === clear) { // clear and reset the dictionary
              dic = [];
              size = minSize + 1;
              for (i = 0; i < clear; i++) { dic[i] = [i] }
              dic[clear] = [];
              dic[eod] = null;
          } else {
              if (code === eod) {  done = true; return }
              if (code >= dic.length) { dic.push(dic[last].concat(dic[last][0])) }
              else if (last !== clear) { dic.push(dic[last].concat(dic[code][0])) }
              d = dic[code];
              len = d.length;
              for (i = 0; i < len; i++) { pixelBuf[pixelPos++] = d[i] }
              if (dic.length === (1 << size) && size < 12) { size++ }
          }
      }
  };
  function parseColourTable(count) { // get a colour table of length count  Each entry is 3 bytes, for RGB.
      var colours = [];
      for (var i = 0; i < count; i++) { colours.push([st.data[st.pos++], st.data[st.pos++], st.data[st.pos++]]) }
      return colours;
  }
  function parse (){        // read the header. This is the starting point of the decode and async calls parseBlock
      var bitField;
      st.pos                += 6;  
      gif.width             = (st.data[st.pos++]) + ((st.data[st.pos++]) << 8);
      gif.height            = (st.data[st.pos++]) + ((st.data[st.pos++]) << 8);
      bitField              = st.data[st.pos++];
      gif.colorRes          = (bitField & 0b1110000) >> 4;
      gif.globalColourCount = 1 << ((bitField & 0b111) + 1);
      gif.bgColourIndex     = st.data[st.pos++];
      st.pos++;                    // ignoring pixel aspect ratio. if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
      if (bitField & 0b10000000) { gif.globalColourTable = parseColourTable(gif.globalColourCount) } // global colour flag
      setTimeout(parseBlock, 0);
  }
  function parseAppExt() { // get application specific data. Netscape added iterations and terminator. Ignoring that
      st.pos += 1;
      if ('NETSCAPE' === st.getString(8)) { st.pos += 8 }  // ignoring this data. iterations (word) and terminator (byte)
      else {
          st.pos += 3;            // 3 bytes of string usually "2.0" when identifier is NETSCAPE
          st.readSubBlocks();     // unknown app extension
      }
  };
  function parseGCExt() { // get GC data
      var bitField;
      st.pos++;
      bitField              = st.data[st.pos++];
      gif.disposalMethod    = (bitField & 0b11100) >> 2;
      gif.transparencyGiven = bitField & 0b1 ? true : false; // ignoring bit two that is marked as  userInput???
      gif.delayTime         = (st.data[st.pos++]) + ((st.data[st.pos++]) << 8);
      gif.transparencyIndex = st.data[st.pos++];
      st.pos++;
  };
  function parseImg() {                           // decodes image data to create the indexed pixel image
      var deinterlace, frame, bitField;
      deinterlace = function (width) {                   // de interlace pixel data if needed
          var lines, fromLine, pass, toline;
          lines = pixelBufSize / width;
          fromLine = 0;
          if (interlacedBufSize !== pixelBufSize) {      // create the buffer if size changed or undefined.
              deinterlaceBuf = new Uint8Array(pixelBufSize);
              interlacedBufSize = pixelBufSize;
          }
          for (pass = 0; pass < 4; pass++) {
              for (toLine = interlaceOffsets[pass]; toLine < lines; toLine += interlaceSteps[pass]) {
                  deinterlaceBuf.set(pixelBuf.subArray(fromLine, fromLine + width), toLine * width);
                  fromLine += width;
              }
          }
      };
      frame                = {}
      gif.frames.push(frame);
      frame.disposalMethod = gif.disposalMethod;
      frame.time           = gif.length;
      frame.delay          = gif.delayTime * 10;
      gif.length          += frame.delay;
      if (gif.transparencyGiven) { frame.transparencyIndex = gif.transparencyIndex }
      else { frame.transparencyIndex = undefined }
      frame.leftPos = (st.data[st.pos++]) + ((st.data[st.pos++]) << 8);
      frame.topPos  = (st.data[st.pos++]) + ((st.data[st.pos++]) << 8);
      frame.width   = (st.data[st.pos++]) + ((st.data[st.pos++]) << 8);
      frame.height  = (st.data[st.pos++]) + ((st.data[st.pos++]) << 8);
      bitField      = st.data[st.pos++];
      frame.localColourTableFlag = bitField & 0b10000000 ? true : false; 
      if (frame.localColourTableFlag) { frame.localColourTable = parseColourTable(1 << ((bitField & 0b111) + 1)) }
      if (pixelBufSize !== frame.width * frame.height) { // create a pixel buffer if not yet created or if current frame size is different from previous
          pixelBuf     = new Uint8Array(frame.width * frame.height);
          pixelBufSize = frame.width * frame.height;
      }
      lzwDecode(st.data[st.pos++], st.readSubBlocksB()); // decode the pixels
      if (bitField & 0b1000000) {                        // de interlace if needed
          frame.interlaced = true;
          deinterlace(frame.width);
      } else { frame.interlaced = false }
      processFrame(frame);                               // convert to canvas image
  };
  function processFrame(frame) { // creates a RGBA canvas image from the indexed pixel data.
      var ct, cData, dat, pixCount, ind, useT, i, pixel, pDat, col, frame, ti;
      frame.image        = document.createElement('canvas');
      frame.image.width  = gif.width;
      frame.image.height = gif.height;
      frame.image.ctx    = frame.image.getContext("2d");
      ct = frame.localColourTableFlag ? frame.localColourTable : gif.globalColourTable;
      if (gif.lastFrame === null) { gif.lastFrame = frame }
      useT = (gif.lastFrame.disposalMethod === 2 || gif.lastFrame.disposalMethod === 3) ? true : false;
      if (!useT) { frame.image.ctx.drawImage(gif.lastFrame.image, 0, 0, gif.width, gif.height) }
      cData = frame.image.ctx.getImageData(frame.leftPos, frame.topPos, frame.width, frame.height);
      ti  = frame.transparencyIndex;
      dat = cData.data;
      if (frame.interlaced) { pDat = deinterlaceBuf }
      else { pDat = pixelBuf }
      pixCount = pDat.length;
      ind = 0;
      for (i = 0; i < pixCount; i++) {
          pixel = pDat[i];
          col   = ct[pixel];
          if (ti !== pixel) {
              dat[ind++] = col[0];
              dat[ind++] = col[1];
              dat[ind++] = col[2];
              dat[ind++] = 255;      // Opaque.
          } else
              if (useT) {
                  dat[ind + 3] = 0; // Transparent.
                  ind += 4;
              } else { ind += 4 }
      }
      frame.image.ctx.putImageData(cData, frame.leftPos, frame.topPos);
      gif.lastFrame = frame;
      if (!gif.waitTillDone && typeof gif.onload === "function") { doOnloadEvent() }// if !waitTillDone the call onload now after first frame is loaded
  };
  // **NOT** for commercial use.
  function finnished() { // called when the load has completed
      gif.loading           = false;
      gif.frameCount        = gif.frames.length;
      gif.lastFrame         = null;
      st                    = undefined;
      gif.complete          = true;
      gif.disposalMethod    = undefined;
      gif.transparencyGiven = undefined;
      gif.delayTime         = undefined;
      gif.transparencyIndex = undefined;
      gif.waitTillDone      = undefined;
      pixelBuf              = undefined; // dereference pixel buffer
      deinterlaceBuf        = undefined; // dereference interlace buff (may or may not be used);
      pixelBufSize          = undefined;
      deinterlaceBuf        = undefined;
      gif.currentFrame      = 0;
      if (gif.frames.length > 0) { gif.image = gif.frames[0].image }
      doOnloadEvent();
      if (typeof gif.onloadall === "function") {
          (gif.onloadall.bind(gif))({   type : 'loadall', path : [gif] });
      }
      if (gif.playOnLoad) { gif.play() }
  }
  function canceled () { // called if the load has been cancelled
      finnished();
      if (typeof gif.cancelCallback === "function") { (gif.cancelCallback.bind(gif))({ type : 'canceled', path : [gif] }) }
  }
  function parseExt() {              // parse extended blocks
      const blockID = st.data[st.pos++];
      if(blockID === GIF_FILE.GCExt) { parseGCExt() }
      else if(blockID === GIF_FILE.COMMENT) { gif.comment += st.readSubBlocks() }
      else if(blockID === GIF_FILE.APPExt) { parseAppExt() }
      else {
          if(blockID === GIF_FILE.UNKNOWN) { st.pos += 13; } // skip unknow block
          st.readSubBlocks();
      }

  }
  function parseBlock() { // parsing the blocks
      if (gif.cancel !== undefined && gif.cancel === true) { canceled(); return }

      const blockId = st.data[st.pos++];
      if(blockId === GIF_FILE.IMAGE ){ // image block
          parseImg();
          if (gif.firstFrameOnly) { finnished(); return }
      }else if(blockId === GIF_FILE.EOF) { finnished(); return }
      else { parseExt() }
      if (typeof gif.onprogress === "function") {
          gif.onprogress({ bytesRead  : st.pos, totalBytes : st.data.length, frame : gif.frames.length });
      }
      setTimeout(parseBlock, 0); // parsing frame async so processes can get some time in.
  };
  function cancelLoad(callback) { // cancels the loading. This will cancel the load before the next frame is decoded
      if (gif.complete) { return false }
      gif.cancelCallback = callback;
      gif.cancel         = true;
      return true;
  }
  function error(type) {
      if (typeof gif.onerror === "function") { (gif.onerror.bind(this))({ type : type, path : [this] }) }
      gif.onload  = gif.onerror = undefined;
      gif.loading = false;
  }
  function doOnloadEvent() { // fire onload event if set
      gif.currentFrame = 0;
      gif.nextFrameAt  = gif.lastFrameAt  = new Date().valueOf(); // just sets the time now
      if (typeof gif.onload === "function") { (gif.onload.bind(gif))({ type : 'load', path : [gif] }) }
      gif.onerror = gif.onload  = undefined;
  }
  function dataLoaded(data) { // Data loaded create stream and parse
      st = new Stream(data);
      parse();
  }
  function loadGif(filename) { // starts the load
      var ajax = new XMLHttpRequest();
      ajax.responseType = "arraybuffer";
      ajax.onload = function (e) {
          if (e.target.status === 404) { error("File not found") }
          else if(e.target.status >= 200 && e.target.status < 300 ) { dataLoaded(ajax.response) }
          else { error("Loading error : " + e.target.status) }
      };
      ajax.open('GET', filename, true);
      ajax.send();
      ajax.onerror = function (e) { error("File error") };
      this.src = filename;
      this.loading = true;
  }
  function play() { // starts play if paused
      if (!gif.playing) {
          gif.paused  = false;
          gif.playing = true;
          playing();
      }
  }
  function pause() { // stops play
      gif.paused  = true;
      gif.playing = false;
      clearTimeout(timerID);
  }
  function togglePlay(){
      if(gif.paused || !gif.playing){ gif.play() }
      else{ gif.pause() }
  }
  function seekFrame(frame) { // seeks to frame number.
      clearTimeout(timerID);
      gif.currentFrame = frame % gif.frames.length;
      if (gif.playing) { playing() }
      else { gif.image = gif.frames[gif.currentFrame].image }
  }
  function seek(time) { // time in Seconds  // seek to frame that would be displayed at time
      clearTimeout(timerID);
      if (time < 0) { time = 0 }
      time *= 1000; // in ms
      time %= gif.length;
      var frame = 0;
      while (time > gif.frames[frame].time + gif.frames[frame].delay && frame < gif.frames.length) {  frame += 1 }
      gif.currentFrame = frame;
      if (gif.playing) { playing() }
      else { gif.image = gif.frames[gif.currentFrame].image}
  }
  function playing() {
      var delay;
      var frame;
      if (gif.playSpeed === 0) {
          gif.pause();
          return;
      } else {
          if (gif.playSpeed < 0) {
              gif.currentFrame -= 1;
              if (gif.currentFrame < 0) {gif.currentFrame = gif.frames.length - 1 }
              frame = gif.currentFrame;
              frame -= 1;
              if (frame < 0) {  frame = gif.frames.length - 1 }
              delay = -gif.frames[frame].delay * 1 / gif.playSpeed;
          } else {
              gif.currentFrame += 1;
              gif.currentFrame %= gif.frames.length;
              delay = gif.frames[gif.currentFrame].delay * 1 / gif.playSpeed;
          }
          gif.image = gif.frames[gif.currentFrame].image;
          timerID = setTimeout(playing, delay);
      }
  }
  var gif = {                      // the gif image object
      onload         : null,       // fire on load. Use waitTillDone = true to have load fire at end or false to fire on first frame
      onerror        : null,       // fires on error
      onprogress     : null,       // fires a load progress event
      onloadall      : null,       // event fires when all frames have loaded and gif is ready
      paused         : false,      // true if paused
      playing        : false,      // true if playing
      waitTillDone   : true,       // If true onload will fire when all frames loaded, if false, onload will fire when first frame has loaded
      loading        : false,      // true if still loading
      firstFrameOnly : false,      // if true only load the first frame
      width          : null,       // width in pixels
      height         : null,       // height in pixels
      frames         : [],         // array of frames
      comment        : "",         // comments if found in file. Note I remember that some gifs have comments per frame if so this will be all comment concatenated
      length         : 0,          // gif length in ms (1/1000 second)
      currentFrame   : 0,          // current frame. 
      frameCount     : 0,          // number of frames
      playSpeed      : 1,          // play speed 1 normal, 2 twice 0.5 half, -1 reverse etc...
      lastFrame      : null,       // temp hold last frame loaded so you can display the gif as it loads
      image          : null,       // the current image at the currentFrame
      playOnLoad     : true,       // if true starts playback when loaded
      // functions
      load           : loadGif,    // call this to load a file
      cancel         : cancelLoad, // call to stop loading
      play           : play,       // call to start play
      pause          : pause,      // call to pause
      seek           : seek,       // call to seek to time
      seekFrame      : seekFrame,  // call to seek to frame
      togglePlay     : togglePlay, // call to toggle play and pause state
  };
  return gif;
}
// * Credits to : https://stackoverflow.com/questions/48234696/how-to-put-a-gif-with-canvas/48348567

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
    case "z" || "ArrowUp":
      keyboard["up"] = true;
      break;
    case "s" || "ArrowDown":
      keyboard["down"] = true;
      break;
  }
  // console.log(event.key);
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
  constructor(room_name, ctx, player_left, player_right, score_left, score_right, consumer) {
    this.room_name = room_name;
    this.ctx = ctx;
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

  if (ranked_el === null)
    ranked = false;

  if (ingameelement !== null) {
    let is_a_player = false;

    consumer.subscriptions.subscriptions.forEach(sub => {
      if (JSON.parse(sub.identifier)["channel"] === "PlayChannel")
        is_a_player = true;
    })

    console.log("the consummer is a player ? " + is_a_player)
    if (!is_a_player) {
      let match_id = ingameelement.dataset.id;
      consumer.subscriptions.create({channel: "PlayChannel", game_room_id: match_id, role: 'v'}, {
        room: undefined,
        connected() {
          // Called when the subscription is ready for use on the server
          this.role = 'v';
          this.room = `play_channel_${match_id}`;
          console.log("your role is : " + this.role);
          console.log(this.room);
          canvas = document.getElementById("myCanvas");
          ctx = canvas.getContext('2d');
          game = new Game(this.room, ctx, 0, 0, 0, 0, this)
          game_loop(game);
        },

        disconnected() {
          // Called when the subscription has been terminated by the server
          console.log("I am disconnected of the room");
          ball.x = 0.0;
          ball.y = 0.0;
          ctx = null;
          canvas = null;
        },

        received(data_nest) {
          // console.log(data_nest);
          if (data_nest['action'] == 'quit')
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

  const element = document.getElementById("game_page_id")
  consumer.subscriptions.create({channel: "GameChannel", is_ranked: ranked, is_matchmaking: element !== null}, {
    connected() {
      console.log("You are register on the game channel");
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
      ctx = null;
      canvas = null;
    },

    received(data) {
      console.log(data);
      if (data.action === 'game_start') {
        location.hash = "#game/" + data.match_room_id;
        consumer.subscriptions.create({channel: "PlayChannel", game_room_id: data.match_room_id, role: data.msg}, {
          room: undefined,
          connected() {
            // Called when the subscription is ready for use on the server
            console.log("Now Playing, with paddle :" + data.msg);
            this.role = data.msg;
            this.room = `play_channel_${data.match_room_id}`;
            console.log("your role is : " + this.role);
            console.log(this.room);
            this.perform("start_game", { room_name: this.room, is_ranked: data.ranked }); // default action
            canvas = document.getElementById("myCanvas");
            ctx = canvas.getContext('2d');
            const UID = document.getElementById("UID");
            UID.innerHTML = `You have the ${this.role} paddle`
            game = new Game(this.room, ctx, 0, 0, 0, 0, this)
            game.draw_datas();
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
            console.log("I am disconnected of the room");
            ball.x = 0.0;
            ball.y = 0.0;
            this.perform("quit", {room_name: game.room_name, player: this.role}); // default action
            console.log("perform ok");
            ctx = null;
            canvas = null;
          },

          received(data_nest) {
            if (data_nest != null) {
              if (data_nest['action'] == 'quit')
                location.hash = "#";
              if (data_nest['ball_speed'] != null) {
                update_datas(data_nest)
                game_loop(game);
              }
            }
          }
        });
      }
    }
  });
}

window.addEventListener("hashchange", e => {
  setTimeout(unregister_loop, 50);
  setTimeout(subscription_loop, 150);
});

subscription_loop();