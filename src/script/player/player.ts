import { Canvaser } from "../core.js";
import { loadImg, LoadImgRes } from "../util/utils.js";

const walkImgUrlList = [
  "/assets/images/walk/image0.png",
  "/assets/images/walk/image1.png",
  "/assets/images/walk/image2.png",
  "/assets/images/walk/image3.png",
  "/assets/images/walk/image4.png",
  "/assets/images/walk/image5.png",
  "/assets/images/walk/image6.png",
  "/assets/images/walk/image7.png",
  "/assets/images/walk/image8.png",
  "/assets/images/walk/image9.png",
  "/assets/images/walk/image10.png",
  "/assets/images/walk/image11.png",
];

const mapOffset = 30;
// 原图缩放倍率
const imgScale = 1.5;

class Player {
  w: number;
  h: number;
  $: CanvasRenderingContext2D;
  cvs: HTMLCanvasElement;

  playerWalkList: LoadImgRes[] = [];

  frameIndex: number;
  playerImgW: number = 0;
  playerImgH: number = 0;

  posX: number = 0;
  posY: number = 0;

  constructor(w: number, h: number, canvas: Canvaser) {
    this.w = w; // 例如 600
    this.h = h; // 例如 600

    this.$ = canvas.pen!;
    this.cvs = canvas.cvs!;

    this.frameIndex = 0;

    this.init();
  }

  async init() {
    const imgs = await loadImg(walkImgUrlList);
    this.playerWalkList = imgs;

    this.playerImgW = imgs[0].uri.width * imgScale;
    this.playerImgH = imgs[0].uri.height * imgScale;

    this.posX = (this.w - this.playerImgW) / 2 - mapOffset;
    this.posY = this.h - this.playerImgH;
  }

  changeWalkShatus() {
    this.frameIndex = (this.frameIndex + 1) % walkImgUrlList.length;
  }

  update() {}

  draw() {
    if (!this.playerWalkList.length) return;
    this.$.drawImage(
      this.playerWalkList[this.frameIndex].uri,
      this.posX, // 目标 x 坐标
      this.posY, // 目标 y 坐标
      this.playerImgW, // 绘制宽度（可做缩放处理）
      this.playerImgH // 绘制高度
    );
  }
}

export default Player;
