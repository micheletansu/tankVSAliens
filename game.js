(function() {
  const bump = new Bump(PIXI);
  const Sprite = PIXI.Sprite;
  const loader = PIXI.loader;
  const Texture = PIXI.Texture;
  const playerSpeed = 2,
    bulletSpeed = 5,
    numberOfAliens = 6,
    spacing = 100,
    xOffset = 150;

  let stage = new PIXI.Container();
  stage.height = 500;
  stage.width = 1000;

  let renderer = PIXI.autoDetectRenderer(1000, 500);
  renderer.backgroundColor = 0x897A20;
  document.body.appendChild(renderer.view);

  let player, aliens = [], bullets = [];
  let message, state;

  let bulletTex = Texture.fromImage('images/bullet.png');
  let tankTex = Texture.fromImage('images/tank.png');

  loader.add("images/tileset.json")
    .load(setup);

  function setup() {
    const id = loader.resources["images/tileset.json"].textures;
    setupMessage();
    setupAliens(id);
    setupPlayer(id);

    animate();

    inputHandler(player); //Capture the keyboard arrow keys
    state = play;
    gameLoop();
  }

  function setupMessage() {
    let opt = { fontFamily: "Arial", fontSize: 32, fill: "white" };
    message = new PIXI.Text("Hello Pixi!", opt);
    message.position.set(54, 96);
    stage.addChild(message);
  }

  function setupAliens(id) {
    for (let i = 0; i < numberOfAliens; i++) {
      let alien = new Sprite(id["alien.png"]);
      alien.circular = true;
      alien.x = spacing * i + xOffset;
      alien.y = randomInt(0, stage._height - alien.height);
      stage.addChild(alien);
      aliens.push(alien);
    }
  }

  function setupPlayer(id) {
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

  function gameLoop() {
    //Loop this function at 60 frames per second
    requestAnimationFrame(gameLoop);
    play();
    renderer.render(stage);
  }

  function play() {
    collisionsHandler();
    player.x += player.vx;
    player.y += player.vy;
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

  function collisionsHandler() {
    let collision = false;
    for (let i = 0; i < aliens.length; i++) {
      if (bump.hit(player, aliens[i])) {
        collision = true;
        break;
      }
    }
    if (collision) {
      //if there's a collision, change the message text
      //and tint the box red
      message.text = "hit!";
    } else {
      //if there's no collision, reset the message
      //text and the box's color
      message.text = "No collision...";
    }
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