import * as PIXI from 'pixi.js';
import IMAGES from './constants.js';

const speed = 5;

export default class Bullet extends PIXI.Sprite {
  constructor() {
    super(PIXI.Texture.fromImage(IMAGES.BULLET));
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
  }

  static get speed() {
    return speed;
  }
}