import * as PIXI from 'pixi.js';
import Bump from 'bump.js';

import IMAGES from './constants.js';
import Player from './Player.js';
import Alien from './Alien.js';
import Bullet from './Bullet.js';

const bump = new Bump(PIXI);

let numberOfAliens = 6;

let loadTeaxture;
let stage = new PIXI.Container();
stage.height = 500;
stage.width = 1000;

let renderer = PIXI.autoDetectRenderer(1000, 500);
renderer.backgroundColor = 0x897A20;
document.body.appendChild(renderer.view);

let player, aliens = [], bullets = [];
let message, state;

PIXI.loader.add(IMAGES.TILESET)
  .load(setup);

function setup() {
  loadTeaxture = PIXI.loader.resources[IMAGES.TILESET].textures;
  setupMessage();
  setupAliens();
  setupPlayer();

  animate();

  inputHandler(player); //Capture the keyboard arrow keys
  state = play;
  gameLoop();
}

function setupMessage() {
  let opt = { fontFamily: "Arial", fontSize: 32, fill: "white" };
  message = new PIXI.Text("Hello Pixi!", opt);
  message.anchor.x = 0.5;
  message.position.set(renderer.view.width / 2, 30);
  message.visible = false;
  stage.addChild(message);
}

function setupAlien(i, isInitialSetup) {
  //let alien = new PIXI.Sprite(loadTeaxture[IMAGES.ALIEN]);
  let alien = new Alien(i, isInitialSetup, renderer);
  stage.addChild(alien);
  aliens.push(alien);
  return alien;
}

function setupAliens() {
  for (let i = 0; i < numberOfAliens; i++) {
    setupAlien(i, true);
  }
}

function setupPlayer() {
  player = new Player();
  stage.addChild(player);
}

let loopNumber = 0;
function gameLoop() {
  //Loop this function at 60 frames per second
  requestAnimationFrame(gameLoop);
  play();
  renderer.render(stage);
}

function play() {
  player.x += player.vx;
  player.y += player.vy;
  for (let alien of aliens) {
    if (bump.hit(player, alien)) {
      message.text = "Game over";
      message.visible = true;
      return;
    }
    message.visible = false;
    for (let bullet of bullets) {
      if (bump.hit(bullet, alien)) {
        aliens.splice(aliens.indexOf(alien), 1);
        stage.removeChild(alien);
      }
    }
    alien.x -= alien.vx;;
  }

  if (loopNumber === 100) {
    setupAlien(++numberOfAliens, false);
    loopNumber = 0;
  }
  loopNumber++;
}

function shoot(bullet, rotation, startPosition){
  bullet.position.x = startPosition.x;
  bullet.position.y = startPosition.y;
  bullet.rotation = rotation;
  stage.addChild(bullet);
  bullets.push(bullet);
}

function rotateToPoint(mx, my, px, py){
  let dist_Y = my - py;
  let dist_X = mx - px;
  let angle = Math.atan2(dist_Y,dist_X) + Math.PI;
  //var degrees = angle * 180/ Math.PI;
  return angle;
}

function animate() {
  requestAnimationFrame(animate);

  player.rotation = rotateToPoint(
    renderer.plugins.interaction.mouse.global.x,
    renderer.plugins.interaction.mouse.global.y,
    player.position.x,
    player.position.y);

  for (let b = bullets.length - 1; b >= 0; b--) {
    bullets[b].position.x += Math.cos(bullets[b].rotation) * Bullet.speed;
    bullets[b].position.y += Math.sin(bullets[b].rotation) * Bullet.speed;
  }
  // render the container
  renderer.render(stage);
}

function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

function keyHandler(player) {
  let left = keyboard(65),
    up = keyboard(87),
    right = keyboard(68),
    down = keyboard(83);

  left.press = function() {
    player.vx = - Player.speed;
    player.vy = 0;
  };
  left.release = function() {
    if (!right.isDown && player.vy === 0) {
      player.vx = 0;
    }
  };

  up.press = function() {
    player.vy = - Player.speed;
    player.vx = 0;
  };
  up.release = function() {
    if (!down.isDown && player.vx === 0) {
      player.vy = 0;
    }
  };

  right.press = function() {
    player.vx = Player.speed;
    player.vy = 0;
  };
  right.release = function() {
    if (!left.isDown && player.vy === 0) {
      player.vx = 0;
    }
  };

  down.press = function() {
    player.vy = Player.speed;
    player.vx = 0;
  };
  down.release = function() {
    if (!up.isDown && player.vx === 0) {
      player.vy = 0;
    }
  };
}

function mouseHandler(player) {
  stage.interactive = true;
  stage.on("mousedown", function(e) {
    const cannonLength = player.width / 2;
    let startPosition = {
      x: player.position.x - Math.cos(player.rotation) * cannonLength,
      y: player.position.y - Math.sin(player.rotation) * cannonLength
    };
    shoot(new Bullet(), player.rotation + Math.PI, startPosition);
  });
}

function inputHandler(player) {
  keyHandler(player);
  mouseHandler(player);
}