import * as PIXI from 'pixi.js';
import IMAGES from './constants.js';

const speed = 5;

export default class Bullet extends PIXI.Sprite {
  constructor({x, y, rotation}, stage, bullets) {
    super(PIXI.Texture.fromImage(IMAGES.BULLET));
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.position.x = x;
    this.position.y = y;
    this.rotation = rotation;

    this.stage = stage;
    this.bullets = bullets;
    stage.addChild(this);
    bullets.push(this);
  }

  move() {
    this.position.x += Math.cos(this.rotation) * Bullet.speed;
    this.position.y += Math.sin(this.rotation) * Bullet.speed;
  }

  destroy() {
    this.bullets.splice(this.bullets.indexOf(this), 1);
    this.stage.removeChild(this);
  }

  static get speed() {
    return speed;
  }
}