import * as PIXI from 'pixi.js';
import IMAGES from './constants.js';
import Bullet from './Bullet.js';
import KeyHandler from "./KeyHandler";

const SPEED = 2.5;

export default class Player extends PIXI.Sprite {
  constructor(renderer, stage, bullets) {
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

    this.bullets = bullets;

    this.renderer = renderer;
    this.stage = stage;
    stage.addChild(this);

    this.setInputHandlers();
  }

  rotate() {
    this.rotation = this.rotateToPoint(
      this.renderer.plugins.interaction.mouse.global.x,
      this.renderer.plugins.interaction.mouse.global.y,
      this.position.x,
      this.position.y);
  }

  rotateToPoint(mx, my, px, py){
    let dist_Y = my - py;
    let dist_X = mx - px;
    let angle = Math.atan2(dist_Y,dist_X) + Math.PI;
    return angle;
  }

  shoot() {
    const cannonLength = this.width / 2;
    let startPosition = {
      x: this.position.x - Math.cos(this.rotation) * cannonLength,
      y: this.position.y - Math.sin(this.rotation) * cannonLength,
      rotation: this.rotation + Math.PI
    };
    new Bullet(startPosition, this.stage, this.bullets);
  }

  setInputHandlers() {
    new KeyHandler(this);
    this.stage.interactive = true;
    this.stage.on("mousedown", () => { this.shoot() });
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
  }

  setXDirection(direction) {
    if (direction !== 0) {
      this.vx = direction * SPEED;
      this.vy = 0;
    }
    else {
      this.vx = 0;
    }
  }

  setYDirection(direction) {
    if (direction !== 0) {
      this.vy = direction * SPEED;
      this.vx = 0;
    }
    else {
      this.vy = 0;
    }
  }
}