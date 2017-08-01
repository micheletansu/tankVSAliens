(function() {
  const bump = new Bump(PIXI);
  const Sprite = PIXI.Sprite;
  const loader = PIXI.loader;
  const Texture = PIXI.Texture;
  const velocity = 2,
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

  let aFace, aliens = [], bullets = [];
  let message, state;

  let bulletTex = Texture.fromImage('images/bullet.png');

  loader.add("images/tileset.json")
    .load(setup);

  function setupMessage() {
    message = new PIXI.Text(
      "Hello Pixi!",
      {fontFamily: "Arial", fontSize: 32, fill: "white"}
    );

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

  function setupFace(id) {
    aFace = new Sprite(id["face.png"]);
    aFace.circular = true;
    // center the sprite's anchor point
    aFace.anchor.x = 0.5;
    aFace.anchor.y = 0.5;

    aFace.x = 1000 - 100;
    aFace.y = 500 / 2 - aFace.height / 2;
    aFace.vx = 0;
    aFace.vy = 0;

    stage.addChild(aFace);
  }

  function setup() {

    const id = loader.resources["images/tileset.json"].textures;

    setupMessage();

    setupAliens(id);

    setupFace(id);

    stage.interactive = true;

    stage.on("mousedown", function(e){
      shoot(aFace.rotation, {
        x: aFace.position.x+Math.cos(aFace.rotation)*20,
        y: aFace.position.y+Math.sin(aFace.rotation)*20
      });
    });

    animate();

    //Capture the keyboard arrow keys
    setupKeyboard(aFace);

    state = play;

    gameLoop();
  }

  function gameLoop() {
    //Loop this function at 60 frames per second
    requestAnimationFrame(gameLoop);
    play();
    renderer.render(stage);
  }

  function play() {
    collisionsHandler();
    aFace.x += aFace.vx;
    aFace.y += aFace.vy;
  }

  function shoot(rotation, startPosition){
    let bullet = new Sprite(bulletTex);
    bullet.position.x = startPosition.x;
    bullet.position.y = startPosition.y;
    bullet.rotation = rotation;
    stage.addChild(bullet);
    bullets.push(bullet);
  }

  function rotateToPoint(mx, my, px, py){
    let dist_Y = my - py;
    let dist_X = mx - px;
    let angle = Math.atan2(dist_Y,dist_X);
    //var degrees = angle * 180/ Math.PI;
    return angle;
  }

  function animate() {
    requestAnimationFrame(animate);

    // just for fun, let's rotate mr rabbit a little
    aFace.rotation = rotateToPoint(
      renderer.plugins.interaction.mouse.global.x,
      renderer.plugins.interaction.mouse.global.y,
      aFace.position.x,
      aFace.position.y);

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
      if (bump.hit(aFace, aliens[i])) {
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

  function setupKeyboard(aFace) {
    let left = keyboard(65),
      up = keyboard(87),
      right = keyboard(68),
      down = keyboard(83);

    left.press = function() {
      //Change the alien face velocity when the key is pressed
      aFace.vx = -velocity;
      aFace.vy = 0;
    };

    left.release = function() {
      //If the left arrow has been released, and the right arrow isn't down,
      //and the cat isn't moving vertically:
      //Stop the cat
      if (!right.isDown && aFace.vy === 0) {
        aFace.vx = 0;
      }
    };

    up.press = function() {
      aFace.vy = -velocity;
      aFace.vx = 0;
    };
    up.release = function() {
      if (!down.isDown && aFace.vx === 0) {
        aFace.vy = 0;
      }
    };

    //Right
    right.press = function() {
      aFace.vx = velocity;
      aFace.vy = 0;
    };
    right.release = function() {
      if (!left.isDown && aFace.vy === 0) {
        aFace.vx = 0;
      }
    };

    //Down
    down.press = function() {
      aFace.vy = velocity;
      aFace.vx = 0;
    };
    down.release = function() {
      if (!up.isDown && aFace.vx === 0) {
        aFace.vy = 0;
      }
    };
  }
})();