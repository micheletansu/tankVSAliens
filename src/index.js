import * as PIXI from 'pixi.js';
import Bump from 'bump.js';

import Player from './Player.js';
import Alien from './Alien.js';

const bump = new Bump(PIXI);

let renderer = PIXI.autoDetectRenderer(1000, 500);
renderer.backgroundColor = 0x897A20;
document.body.appendChild(renderer.view);

let stage = new PIXI.Container();
stage.height = renderer.view.height;
stage.width = renderer.view.width;

let player, aliens = [], bullets = [];
let message, state, loopNumber = 0;

setup();

function setup() {
  setupMessage();
  player = new Player(renderer, stage, bullets);
  state = play;
  gameLoop();
}

function gameLoop() {
  //Loop this function at 60 frames per second
  requestAnimationFrame(gameLoop);
  state();
  renderer.render(stage);
}

function play() {
  player.move();

  for (let alien of aliens) {
    if (bump.hit(player, alien)) {
      message.text = "Game over";
      message.visible = true;
      state = stop;
      return;
    }
    for (let bullet of bullets) {
      if (bump.hit(bullet, alien)) {
        alien.destroy();
        bullet.destroy();
      }
      else {
        bullet.move();
      }
    }
    if (alien.visible) {
        alien.move();
    }
  }

  if (loopNumber === 100) {
    new Alien(renderer, stage, aliens);
    loopNumber = 0;
  }
  loopNumber++;
}

function stop() {}

function setupMessage() {
  let opt = { fontFamily: "Arial", fontSize: 32, fill: "white" };
  message = new PIXI.Text("Hello Pixi!", opt);
  message.anchor.x = 0.5;
  message.position.set(renderer.view.width / 2, 30);
  message.visible = false;
  stage.addChild(message);
}