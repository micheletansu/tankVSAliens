import * as PIXI from 'pixi.js';
import { IMAGES } from './constants.js';

export default class Alien extends PIXI.Sprite {

  constructor(renderer, stage, aliens) {
    super(PIXI.Texture.fromImage(IMAGES.ALIEN));

    this.circular = true;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.scale.x = -0.7; //Flip x
    this.scale.y = 0.7;
    this.x = renderer.view.width;
    this.vx = 2;
    this.y = this.randomInt(0, renderer.view.height - this.height);

    this.renderer = renderer;
    this.stage = stage;
    this.aliens = aliens;
    stage.addChild(this);
    aliens.push(this);
  }

  move() {
    this.x -= this.vx;
    this.checkout();
  }

  checkout() {
    if (this.position.x < 0 || this.position.x > this.renderer.view.width
      || this.position.y < 0 || this.position.y > this.renderer.view.height) {
      this.destroy();
    }
  }

  destroy() {
    this.aliens.splice(this.aliens.indexOf(this), 1);
    this.visible = false;
    this.stage.removeChild(this);
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}