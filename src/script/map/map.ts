import { Canvaser } from "../core.js";
import { loadImg, LoadImgRes } from "../util/utils.js";

class MapScene {
  w: number;
  h: number;
  $: CanvasRenderingContext2D;
  cvs: HTMLCanvasElement;
  roadImage: LoadImgRes | undefined;

  // 当前纹理在“世界坐标”下的垂直偏移
  offset: number = 0;
  // 每帧滚动的像素数（这里依然使用正数，update 中会递减）
  speed: number = 10;
  // 从消失点到屏幕底部沿路程纹理重复次数
  textureRepeat: number = 3;

  constructor(w: number, h: number, canvas: Canvaser) {
    this.w = w; // 例如 600
    this.h = h; // 例如 600

    this.$ = canvas.pen!;
    this.cvs = canvas.cvs!;

    this.init();
  }

  async init() {
    const [img] = await loadImg(["/assets/images/floor.jpeg"]);
    this.roadImage = img;
  }

  // 更新纹理偏移，实现滚动效果（这里采用递减方式，从而转换滚动方向）
  update() {
    if (!this.roadImage) return;
    this.offset -= this.speed;
    while (this.offset < 0) {
      this.offset += this.roadImage.uri.height;
    }
  }

  // draw 方法每帧调用，用于绘制整个场景
  draw() {
    if (!this.roadImage) return;
    // 更新偏移量，实现滚动
    this.update();

    /**
     * 定义透视参数：
     * horizonY：消失线的位置（这里设在画布高度的 20%，即中上部）
     * roadBottomWidth：屏幕底部道路宽度（例如画布宽度的 80%）
     * roadTopWidth：屏幕远处（消失线）的道路宽度（不再为 0，这里设为画布宽度的 10%）
     * step：每次绘制的水平切片高度（单位：像素）
     */
    const horizonY = this.h * 0.2; // 140
    const roadBottomWidth = this.w * 0.8;
    const roadTopWidth = this.w * 0.05;
    const step = 2;

    /**
     * 思路：
     * 从 horizonY 到屏幕底部，按 step 分成多个水平切片。
     * 计算归一化比例 t（0～1），并根据 t 计算出当前切片的道路宽度，
     * 使得道路宽度从 roadTopWidth 过渡到 roadBottomWidth。
     * 纹理的采样位置计算不变，只是透视下宽度有所改变。
     */
    for (let y = horizonY; y < this.h; y += step) {
      // 归一化比例 t：0 表示在 horizonY（远处），1 表示在屏幕底部（近处）
      const t = (y - horizonY) / (this.h - horizonY);
      // 道路宽度从 roadTopWidth 线性变化到 roadBottomWidth
      const roadWidth = roadTopWidth + t * (roadBottomWidth - roadTopWidth);
      // 道路位置
      const dx = (this.w - roadWidth) / 3;

      // 计算当前屏幕 y 对应的“世界距离”
      const worldDistance =
        t * (this.textureRepeat * this.roadImage.uri.height);
      // 计算纹理采样的 y 坐标（滚动方向已反转），确保结果在 [0, roadImage.height)
      // const sy = (this.offset - worldDistance) % this.roadImage.uri.height;
      const sy = (this.offset + worldDistance) % this.roadImage.uri.height;

      const properSy =
        (sy + this.roadImage.uri.height) % this.roadImage.uri.height;
        
      // 计算下一个切片对应的世界距离，并得到纹理采样的高度
      const tNext = (y + step - horizonY) / (this.h - horizonY);
      const worldDistanceNext =
        tNext * (this.textureRepeat * this.roadImage.uri.height);
      let sHeight = worldDistanceNext - worldDistance;
      if (sHeight < 1) sHeight = 1;

      // 如果纹理采样不跨越纹理底部，直接绘制
      if (properSy + sHeight <= this.roadImage.uri.height) {
        this.$.drawImage(
          this.roadImage.uri,
          0, // 源 x 坐标，从纹理左侧开始
          properSy, // 源 y 坐标
          this.roadImage.uri.width, // 源宽度
          sHeight, // 源高度
          dx, // 目标 x 坐标
          y, // 目标 y 坐标
          roadWidth, // 目标宽度（透视缩放后的宽度）
          step // 目标高度（固定切片高度）
        );
      } else {
        // 若超出纹理底部，则拆分为两部分绘制
        const sHeight1 = this.roadImage.uri.height - properSy;
        const sHeight2 = sHeight - sHeight1;
        const part1Height = step * (sHeight1 / sHeight);
        const part2Height = step - part1Height;
        // 第一部分
        this.$.drawImage(
          this.roadImage.uri,
          0,
          properSy,
          this.roadImage.uri.width,
          sHeight1,
          dx,
          y,
          roadWidth,
          part1Height
        );
        // 第二部分：从纹理顶部开始绘制剩余部分
        this.$.drawImage(
          this.roadImage.uri,
          0,
          0,
          this.roadImage.uri.width,
          sHeight2,
          dx,
          y + part1Height,
          roadWidth,
          part2Height
        );
      }
    }
  }
}

export default MapScene;
