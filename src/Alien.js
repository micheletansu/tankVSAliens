import * as PIXI from 'pixi.js';
import IMAGES from './constants.js';

export default class Alien extends PIXI.Sprite {

  constructor(renderer, stage, aliens) {
    super(PIXI.Texture.fromImage(IMAGES.ALIEN));

    this.circular = true;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.scale.x = -1; //Flip x
    this.x = renderer.view.width;
    this.vx = 2;
    this.y = this.randomInt(0, renderer.view.height - this.height);

    this.stage = stage;
    this.aliens = aliens;
    stage.addChild(this);
    aliens.push(this);
  }

  move() {
    this.x -= this.vx;
  }

  destroy() {
    this.aliens.splice(this.aliens.indexOf(this), 1);
    this.stage.removeChild(this);
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}