import Konva from 'konva';
import { ZoomControl } from './zoom-control';
import { throttle } from 'lodash';

export class Editor {
  private stage: Konva.Stage;
  private backgroundLayer: Konva.Layer;
  private mainLayer: Konva.Layer;
  private backgroundImage?: Konva.Image;
  private zoomControl: ZoomControl;

  constructor({ canvasEl }: { canvasEl: HTMLDivElement }) {
    this.stage = new Konva.Stage({
      container: canvasEl,
      width: canvasEl.offsetWidth,
      height: Math.max(canvasEl.offsetHeight, 500),
      draggable: true,
    });

    this.mainLayer = new Konva.Layer();
    this.backgroundLayer = new Konva.Layer({
      listening: false,
      draggable: false,
    });

    this.stage.add(this.mainLayer);
    this.stage.add(this.backgroundLayer);
    this.backgroundLayer.moveToBottom();

    this.zoomControl = new ZoomControl(this.stage);

    this.initEvents();
  }

  private initEvents() {
    this.stage.on('wheel', ({ evt }) => {
      this.zoomControl.handleMouseWheel(evt);
    });

    this.stage.on(
      'dragmove',
      throttle((event: Konva.KonvaEventObject<Event>) => {
        if (event.target === this.stage) {
          this.zoomControl.handleDragMove();
        }
      }, 16)
    );
  }

  async setBackgroundImage(url: string): Promise<void> {
    const oldImage = this.backgroundImage;

    const image = new Image();
    image.src = url;
    await new Promise((resolve) => (image.onload = resolve));

const scaleX = this.stage.width() / image.naturalWidth;
    const scaleY = this.stage.height() / image.naturalHeight;
    
    // Usar la escala que mejor se ajuste (cover) o mantener aspecto (contain)
    // Para cover (llenar todo el stage):
    const scale = Math.max(scaleX, scaleY);
    // Para contain (mantener toda la imagen visible):
    // const scale = Math.min(scaleX, scaleY);

    this.backgroundImage = new Konva.Image({
      image,
      x: 0,
      y: 0,
      scaleX: scale,
      scaleY: scale,
      draggable: false,
      listening: false,
    });

 this.backgroundLayer.add(this.backgroundImage);
    this.backgroundImage.moveToBottom();
this
.backgroundImage.cache();

    if (oldImage) {
      oldImage.destroy();
    }
  }

  setZoom(zoom: number) {
    this.zoomControl.setZoom(zoom);
  }
}
