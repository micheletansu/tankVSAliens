import keyboard from './keyboard.js';
import { KEY } from './constants.js';
const DIRECTION = {
  RIGHT: 1,
  LEFT: -1,
  UP: -1,
  DOWN: 1,
  STOP: 0
};

export default function playerKeys(player) {
  let left = keyboard(KEY.A),
    up = keyboard(KEY.W),
    right = keyboard(KEY.D),
    down = keyboard(KEY.S);

  left.press = function() {
    player.setXDirection(DIRECTION.LEFT);
  };
  left.release = function() {
    if (!right.isDown && player.vy === 0) {
      player.setXDirection(DIRECTION.STOP);
    }
  };

  up.press = function() {
    player.setYDirection(DIRECTION.UP);
  };
  up.release = function() {
    if (!down.isDown && player.vx === 0) {
      player.setYDirection(DIRECTION.STOP);
    }
  };

  right.press = function() {
    player.setXDirection(DIRECTION.RIGHT);
  };
  right.release = function() {
    if (!left.isDown && player.vy === 0) {
      player.setXDirection(DIRECTION.STOP);
    }
  };

  down.press = function() {
    player.setYDirection(DIRECTION.DOWN);
  };
  down.release = function() {
    if (!up.isDown && player.vx === 0) {
      player.setYDirection(DIRECTION.STOP);
    }
  };
}