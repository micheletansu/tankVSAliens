import * as PIXI from 'pixi.js';
import IMAGES from './constants.js';

const spacing = 100;
const xOffset = 150;

export default class Alien extends PIXI.Sprite {

  constructor(number, isInitialSetup, renderer) {
    super(PIXI.Texture.fromImage(IMAGES.ALIEN));

    this.circular = true;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.scale.x = -1; //Flip x
    this.x = isInitialSetup ? spacing * number + xOffset : renderer.view.width;
    this.vx = 2;
    this.y = this.randomInt(0, renderer.view.height - this.height);
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}