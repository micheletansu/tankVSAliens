import * as PIXI from 'pixi.js';
import IMAGES from './constants.js';

const speed = 2.5;

export default class Player extends PIXI.Sprite {
  constructor() {
    super(PIXI.Texture.fromImage(IMAGES.TANK));
    this.width = 80;
    this.height = 50;

    this.circular = true;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this.x = 100;
    this.y = 500 / 2;
    this.vx = 0;
    this.vy = 0;
  }

  static get speed() {
    return speed;
  }
}