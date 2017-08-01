(function() {
  const bump = new Bump(PIXI);
  const Sprite = PIXI.Sprite;
  const loader = PIXI.loader;
  const velocity = 2;

  let stage = new PIXI.Container();
  stage.height = 500;
  stage.width = 1000;

  let renderer = PIXI.autoDetectRenderer(1000, 500);
  renderer.backgroundColor = 0x897A20;
  document.body.appendChild(renderer.view);

  var aFace, aliens = [];
  var message, state;

  loader.add("images/tileset.json")
    .load(setup);

  function setup() {

    message = new PIXI.Text(
      "Hello Pixi!",
      {fontFamily: "Arial", fontSize: 32, fill: "white"}
    );

    message.position.set(54, 96);
    stage.addChild(message);

    const id = loader.resources["images/tileset.json"].textures;

    let numberOfAliens = 6,
        spacing = 100,
        xOffset = 150;

    for (let i = 0; i < numberOfAliens; i++) {
      let alien = new Sprite(id["alien.png"]);
      alien.circular = true;
      alien.x = spacing * i + xOffset;
      alien.y = randomInt(0, stage._height - alien.height);
      stage.addChild(alien);
      aliens.push(alien);
    }

    aFace = new Sprite(id["face.png"]);
    aFace.circular = true;
    aFace.x = 1000 - 100;
    aFace.y = 500 / 2 - aFace.height / 2;
    aFace.vx = 0;
    aFace.vy = 0;

    stage.addChild(aFace);

    //Capture the keyboard arrow keys
    keyboardSetup(aFace);

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
    let collision = false;
    for (let i=0; i<aliens.length; i++) {
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
    aFace.x += aFace.vx;
    aFace.y += aFace.vy;
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function keyboard(keyCode) {
    var key = {};
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

  function keyboardSetup(aFace) {
    var left = keyboard(65),
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