import * as PIXI from 'pixi.js';
import { IMAGES } from './constants.js';
import Bullet from './Bullet.js';
import playerController from "./playerController";

const SPEED = 2.5;

export default class Player extends PIXI.Sprite {
  constructor(renderer, stage, bullets) {
    super(PIXI.Texture.from(IMAGES.TANK));
    this.scale.x = 0.3;
    this.scale.y = 0.3;

    this.circular = true;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this.x = 100;
    this.y = renderer.view.height / 2;
    this.vx = 0;
    this.vy = 0;

    this.bullets = bullets;

    this.renderer = renderer;
    this.stage = stage;
    stage.addChild(this);

    this.setInputHandlers();
  }

  rotateToPoint(mx, my, px, py){
    let dist_Y = my - py;
    let dist_X = mx - px;
    let angle = Math.atan2(dist_Y,dist_X) + Math.PI;
    return angle;
  }

  shoot() {
    let startPosition = {
      x: this.position.x - Math.cos(this.rotation) * this.halfWidth,
      y: this.position.y - Math.sin(this.rotation) * this.halfWidth,
      rotation: this.rotation + Math.PI
    };
    new Bullet(startPosition, this.stage, this.renderer, this.bullets);
  }

  setInputHandlers() {
    playerController(this);
    this.stage.on("mousedown", () => { this.shoot() });
  }

  move() {
    this.rotation = this.rotateToPoint(
      this.renderer.plugins.interaction.mouse.global.x,
      this.renderer.plugins.interaction.mouse.global.y,
      this.position.x,
      this.position.y);
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

  restart() {
    this.x = 100;
    this.y = this.renderer.view.height / 2;
  }
}