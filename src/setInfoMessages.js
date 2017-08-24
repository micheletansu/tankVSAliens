export default function setInfoMessages(startPage, message, renderer) {
  let stateFont = { fontFamily: "Arial", fontSize: 32, fill: "white" };
  message = new PIXI.Text("Tank vs Aliens", stateFont);
  message.anchor.x = 0.5;
  message.position.set(renderer.view.width / 2, 30);
  startPage.addChild(message);

  let keysFont = { fontFamily: "Arial", fontSize: 28, fill: "white" };
  let shootKeyInfo = new PIXI.Text("Left click: Shoot", keysFont);
  shootKeyInfo.position.set(renderer.view.width / 4, 220);
  startPage.addChild(shootKeyInfo);

  let leftKeyInfo = new PIXI.Text("A: Left", keysFont);
  leftKeyInfo.position.set(renderer.view.width / 4, 270);
  startPage.addChild(leftKeyInfo);

  let rightKeyInfo = new PIXI.Text("D: Right", keysFont);
  rightKeyInfo.position.set(2 * renderer.view.width / 3, 270);
  startPage.addChild(rightKeyInfo);

  let upKeyInfo = new PIXI.Text("W: Up", keysFont);
  upKeyInfo.position.set(renderer.view.width / 4, 320);
  startPage.addChild(upKeyInfo);

  let downKeyInfo = new PIXI.Text("S: Down", keysFont);
  downKeyInfo.position.set(2 * renderer.view.width / 3, 320);
  startPage.addChild(downKeyInfo);

  let startInfo = new PIXI.Text("Play/Pause:  Space bar", keysFont);
  startInfo.position.set(renderer.view.width / 4, 370);
  startPage.addChild(startInfo);
}