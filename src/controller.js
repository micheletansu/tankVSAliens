import keyboard from './keyboard.js';
import { KEY } from './constants.js';

export default function controller(setState) {
  let space = keyboard(KEY.SPACE);
  space.release = setState;
}