const RIGHT = 1;
const LEFT = -1;
const UP = -1;
const DOWN = 1;
const STOP = 0;

export default class KeyHandler {
  constructor(player) {
    let left = this.keyboard(65),
      up = this.keyboard(87),
      right = this.keyboard(68),
      down = this.keyboard(83);

    left.press = function() {
      player.setXDirection(LEFT);
    };
    left.release = function() {
      if (!right.isDown && player.vy === 0) {
        player.setXDirection(STOP);
      }
    };

    up.press = function() {
      player.setYDirection(UP);
    };
    up.release = function() {
      if (!down.isDown && player.vx === 0) {
        player.setYDirection(STOP);
      }
    };

    right.press = function() {
      player.setXDirection(RIGHT);
    };
    right.release = function() {
      if (!left.isDown && player.vy === 0) {
        player.setXDirection(STOP);
      }
    };

    down.press = function() {
      player.setYDirection(DOWN);
    };
    down.release = function() {
      if (!up.isDown && player.vx === 0) {
        player.setYDirection(STOP);
      }
    };
  }

  keyboard(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
  }
}