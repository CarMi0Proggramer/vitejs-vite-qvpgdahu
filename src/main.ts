import './style.css';
import { Editor } from './editor';

const canvasEl = document.querySelector('.canvasEl') as HTMLDivElement;

const editor = new Editor({ canvasEl });

fetch("/image.jpg")
.then(res => res.blob())
.then(blob => {
  const url = URL.createObjectURL(blob);
  editor.setBackgroundImage(url);
})

document.getElementById("zoomInput")!
.addEventListener("change",({target})=> {
const zoom = parseInt((target as HTMLInputElement).value)

  editor.setZoom(zoom);
})