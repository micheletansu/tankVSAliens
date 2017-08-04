(function() {
  const bump = new Bump(PIXI);
  const Sprite = PIXI.Sprite;
  const loader = PIXI.loader;
  const Texture = PIXI.Texture;
  let loadTeaxture;
  const IMAGES = {
    TANK: 'images/tank.png',
    ALIEN: 'alien.png',
    BULLET: 'images/bullet.png',
    TILESET: 'images/tileset.json'
  };
  const playerSpeed = 2.5,
    bulletSpeed = 5,
    spacing = 100,
    xOffset = 150;
  let numberOfAliens = 6;

  let stage = new PIXI.Container();
  stage.height = 500;
  stage.width = 1000;

  let renderer = PIXI.autoDetectRenderer(1000, 500);
  renderer.backgroundColor = 0x897A20;
  document.body.appendChild(renderer.view);

  let player, aliens = [], bullets = [];
  let message, state;

  let bulletTex = Texture.fromImage(IMAGES.BULLET);
  let tankTex = Texture.fromImage(IMAGES.TANK);

  loader.add(IMAGES.TILESET)
    .load(setup);

  function setup() {
    loadTeaxture = loader.resources[IMAGES.TILESET].textures;
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
    let alien = new Sprite(loadTeaxture[IMAGES.ALIEN]);
    alien.circular = true;
    alien.anchor.x = 0.5;
    alien.anchor.y = 0.5;
    alien.scale.x = -1; //Flip x
    alien.x = isInitialSetup ? spacing * i + xOffset : renderer.view.width;
    alien.vx = 2;
    alien.y = randomInt(0, stage._height - alien.height);
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
    //player = new Sprite(id["face.png"]);
    player = new Sprite(tankTex);
    player.width = 80;
    player.height = 50;

    player.circular = true;
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;

    player.x = 100;
    player.y = 500 / 2;
    player.vx = 0;
    player.vy = 0;

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
      bullets[b].position.x += Math.cos(bullets[b].rotation) * bulletSpeed;
      bullets[b].position.y += Math.sin(bullets[b].rotation) * bulletSpeed;
    }
    // render the container
    renderer.render(stage);
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
      player.vx = -playerSpeed;
      player.vy = 0;
    };
    left.release = function() {
      if (!right.isDown && player.vy === 0) {
        player.vx = 0;
      }
    };

    up.press = function() {
      player.vy = -playerSpeed;
      player.vx = 0;
    };
    up.release = function() {
      if (!down.isDown && player.vx === 0) {
        player.vy = 0;
      }
    };

    right.press = function() {
      player.vx = playerSpeed;
      player.vy = 0;
    };
    right.release = function() {
      if (!left.isDown && player.vy === 0) {
        player.vx = 0;
      }
    };

    down.press = function() {
      player.vy = playerSpeed;
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
      let bullet = new Sprite(bulletTex);
      bullet.anchor.x = 0.5;
      bullet.anchor.y = 0.5;
      const cannonLength = player.width / 2;
      let startPosition = {
        x: player.position.x - Math.cos(player.rotation) * cannonLength,
        y: player.position.y - Math.sin(player.rotation) * cannonLength
      };
      shoot(bullet, player.rotation + Math.PI, startPosition);
    });
  }

  function inputHandler(player) {
    keyHandler(player);
    mouseHandler(player);
  }
})();