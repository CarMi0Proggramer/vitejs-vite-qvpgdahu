import Konva from 'konva';

export class ZoomControl {
  private zoomLevel: number = 1;
  private readonly minZoom: number = 1;
  private readonly maxZoom: number = 30;

  constructor(private stage: Konva.Stage) {}

  handleMouseWheel(event: WheelEvent) {
    const delta = event.deltaY;
    let zoom = this.zoomLevel;
    zoom *= 0.999 ** delta;

    zoom = Math.min(this.maxZoom, zoom);
    zoom = Math.max(this.minZoom, zoom);

    event.preventDefault();
    event.stopPropagation();

    this.setZoom(zoom, this.stage.getPointerPosition()!);
  }

  setZoom(zoom: number, point?: { x: number; y: number }) {
    if (zoom < this.minZoom || zoom > this.maxZoom) {
      return;
    }

    const stageWidth = this.stage.width();
    const stageHeight = this.stage.height();
    const minX = stageWidth - stageWidth * zoom;
    const minY = stageHeight - stageHeight * zoom;

    const oldScale = this.stage.scaleX();
    const pointer = point ?? {
      x: stageWidth / 2,
      y: stageHeight / 2,
    };

    const mousePointTo = {
      x: (pointer.x - this.stage.x()) / oldScale,
      y: (pointer.y - this.stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * zoom,
      y: pointer.y - mousePointTo.y * zoom,
    };

    newPos.x = Math.min(0, Math.max(newPos.x, minX));
    newPos.y = Math.min(0, Math.max(newPos.y, minY));

    this.stage.scale({ x: zoom, y: zoom });
    this.stage.position(newPos);
    this.zoomLevel = zoom;
  }

  handleDragMove() {
    const stageWidth = this.stage.width();
    const stageHeight = this.stage.height();
    const scale = this.stage.scaleX();
    const pos = this.stage.position();

    const minX = -(stageWidth * scale - stageWidth);
    const minY = -(stageHeight * scale - stageHeight);

    pos.x = Math.max(minX, Math.min(0, pos.x));
    pos.y = Math.max(minY, Math.min(0, pos.y));

    this.stage.position(pos);
  }
}
