import keyboard from './keyboard.js';
const RIGHT = 1;
const LEFT = -1;
const UP = -1;
const DOWN = 1;
const STOP = 0;
const A = 65;
const W = 87;
const D = 68;
const S = 83;

export default function playerKeys(player) {
  let left = keyboard(A),
    up = keyboard(W),
    right = keyboard(D),
    down = keyboard(S);

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