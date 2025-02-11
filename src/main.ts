import { init } from "./script/core.js";
import { initSoundMonitor } from "./script/sound/soundMonitor.js";

const gameContent = document.getElementById("gameContent")!;
const GAME_HEIGHT = 700;

function generateGameContent(size = 600) {
  initSoundMonitor()
    .then(() => {
      gameContent.innerHTML = "";

      gameContent.style.width = size + "px";
      gameContent.style.height = GAME_HEIGHT + "px";

      const canvasEl = document.createElement("canvas");
      const $ = canvasEl.getContext("2d")!;

      init(canvasEl, $, size, GAME_HEIGHT, 30, gameContent);
    })
    .catch((err) => {
      gameContent.innerHTML = err;
    });
}

generateGameContent();
