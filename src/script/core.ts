import MapScene from "./map/map.js";
import Player from "./player/player.js";
import Render, { RenderTargetInstances } from "./render/render.js";
import { getBassAndTreble } from "./sound/soundMonitor.js";

let RenderInstance: Render | null = null;

const instances: RenderTargetInstances = {
  Map: null,
  Player: null,
};

function initMap(w: number, h: number, canvas: Canvaser) {
  instances.Map = new MapScene(w, h, canvas);
}

function initPlayer(w: number, h: number, canvas: Canvaser) {
  instances.Player = new Player(w, h, canvas);
}

function initRender(fps = 30) {
  RenderInstance = new Render(fps, canvas);

  // 主渲染任务
  RenderInstance.run(instances);

  // 添加输入音频处理行为
  RenderInstance.addBehavior<number | undefined>(
    "sound",
    getBassAndTreble,
    (frequency) => {
      if (frequency) {
        console.log(frequency);
        // todo 改变某个值
      }
    },
    1000 / 0.1
  ); // 0.1 次/秒

  // 人物行走更新速率
  RenderInstance.addBehavior<void>(
    "changeWalkShatus",
    instances.Player!.changeWalkShatus?.bind(instances.Player) as () => void,
    () => {},
    1000 / 10
  ); // 10 次/秒
}

export type Canvaser = {
  cvs: HTMLCanvasElement | null;
  pen: CanvasRenderingContext2D | null;
};

const canvas: Canvaser = {
  cvs: null,
  pen: null,
};

export function init(
  cvs: HTMLCanvasElement,
  pen: CanvasRenderingContext2D,
  w: number,
  h: number,
  fps: number,
  target: HTMLElement
) {
  canvas.cvs = cvs;
  canvas.pen = pen;

  canvas.cvs.width = w;
  canvas.cvs.height = h;
  target.appendChild(canvas.cvs);

  initMap(w, h, canvas);
  initPlayer(w, h, canvas);

  initRender(fps);
}

export function exit() {
  RenderInstance?.clear();
  RenderInstance = null;
  instances.Map = null;
}
