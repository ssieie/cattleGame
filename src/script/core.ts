import Render, { RenderTargetInstances } from "./render/render.js";
import { updateSoundData } from "./sound/soundMonitor.js";

let RenderInstance: Render | null = null;

const instances: RenderTargetInstances = {
  Map: null,
};

// function initPlayer(w, h, canvas, data) {
// instances.Player = new Player(w, h, canvas, data)
// }

function initRender(fps = 10) {
  RenderInstance = new Render(fps, canvas);

  // 主渲染任务
  RenderInstance.run(instances);

  // 添加输入音频处理行为
  RenderInstance.addBehavior<Uint8Array | undefined>(
    "sound",
    updateSoundData,
    (buffer) => {
      if (buffer) {
        if (buffer.some((value) => value !== 0)) {
          console.log("有频率数据变化221111");
        } else {
          console.log("无频率数据变化1121");
        }
      }
    },
    1000 / 1
  ); // 1 次/秒
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

  initRender(fps);
}

export function exit() {
  RenderInstance?.clear();
  RenderInstance = null;
  instances.Map = null;
}
