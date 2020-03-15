/*!
 *  Map effects Javascript Library
 *  MapStareffects - v1.0.0
 *  author - zhangbo
 *  构造器options: {x,y}canvas坐标，size 大小，starsize：最大圈大小colorNum rgb内颜色数字逗号隔开。ctx为绘制canvas
 *
 */
class Star {
  constructor(options) {
    // eslint-disable-next-line no-bitwise
    this.x = ~~options.x;
    // eslint-disable-next-line no-bitwise
    this.y = ~~options.y;
    // eslint-disable-next-line no-bitwise
    this.width = ~~options.width;
    // eslint-disable-next-line no-bitwise
    this.height = ~~options.height;
    // eslint-disable-next-line no-bitwise
    this.size = ~~options.size;
    // eslint-disable-next-line no-bitwise
    this.starSize = ~~options.starSize;
    // eslint-disable-next-line no-bitwise
    this.colorNum = options.colorNum || '7,120,249';
    this.ctx = options.ctx;
    this.reflash = false;
  }

  render = () => {
    const p = this;
    if (p.starSize > p.size) {
      p.starSize = 0;
    }
    p.ctx.clearRect(0, 0, p.width, p.height);
    p.ctx.beginPath();
    const gradient = p.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.starSize);
    gradient.addColorStop(0, `rgba(${p.colorNum},1`);
    gradient.addColorStop(1, `rgba(${p.colorNum},0.2)`);
    p.ctx.fillStyle = gradient;
    p.ctx.arc(p.x, p.y, p.starSize + 5, Math.PI * 2, false);
    p.ctx.fill();
    p.starSize += 0.1;
  };

  renderLine = (py, kfqcenter) => {
    const p = this;
    p.ctx.beginPath();

    const gradient = p.ctx.createLinearGradient(
      kfqcenter.x - py.x,
      p.y,
      p.x,
      kfqcenter.y - py.y,
      p.x,
      p.y,
    );
    const start = p.starSize / 21 - 0.2;
    const middle = p.starSize / 21;
    const end = p.starSize / 21 + 0.02;
    gradient.addColorStop(0, 'rgba(7,120,249,1)');
    gradient.addColorStop(start < 0 ? 0.01 : start, 'rgba(7,120,249,1)');
    gradient.addColorStop(middle, 'rgba(0,249,249,0.6)');

    gradient.addColorStop(end > 1 ? 1 : end, 'rgba(7,120,249,1)');
    // gradient.addColorStop( _starSize/20, "rgba(7,120,249,1)");
    gradient.addColorStop(1, 'rgba(7,120,249,1)');
    p.ctx.strokeStyle = gradient;
    p.ctx.moveTo(kfqcenter.x - py.x, kfqcenter.y - py.y);
    p.ctx.bezierCurveTo(kfqcenter.x - py.x, p.y, p.x, kfqcenter.y - py.y, p.x, p.y);
    p.ctx.stroke();
  };

  // step 步数 0-step  循环一次。fn回调step=fn(step){step++}
  flashStar = (Step, fn) => {
    if (this.reflash) {
      return;
    }
    let tTmp;
    if (this.shouldAnimationFrame) {
      return;
    }
    // requestAnimationFrame(this.flashFace,canvas);
    this.shouldAnimationFrame = true;
    this.flashStarIntervals = requestAnimationFrame(
      ((t) => {
        this.shouldAnimationFrame = false;
        tTmp = fn(t);
        this.flashStar(tTmp, fn);
      }).bind(this, Step),
    );
  };
}
export default Star;
