import * as PIXI from 'pixi.js';
import IMAGES from './constants.js';

const speed = 5;

export default class Bullet extends PIXI.Sprite {
  constructor({x, y, rotation}, stage, renderer, bullets) {
    super(PIXI.Texture.fromImage(IMAGES.BULLET));
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.position.x = x;
    this.position.y = y;
    this.rotation = rotation;

    this.stage = stage;
    this.renderer = renderer;
    this.bullets = bullets;
    stage.addChild(this);
    bullets.push(this);
  }

  move() {
    this.position.x += Math.cos(this.rotation) * Bullet.speed;
    this.position.y += Math.sin(this.rotation) * Bullet.speed;
    this.checkout();
  }

  checkout() {
    if (this.position.x < 0 || this.position.x > this.renderer.view.width
      || this.position.y < 0 || this.position.y > this.renderer.view.height) {
      this.destroy();
    }
  }

  destroy() {
    this.bullets.splice(this.bullets.indexOf(this), 1);
    this.visible = false;
    this.stage.removeChild(this);
  }

  static get speed() {
    return speed;
  }
}