import 'ress';
import DrawingCanvas from './modules/DrawingCanvas';
import './lib/styles/reset.scss';
// import styles from './App.scss';

const AppElement = document.createElement('div');

const DrawingCanvasElement = new DrawingCanvas({
  width: 400,
  height: 400,
}).Element;

AppElement.appendChild(DrawingCanvasElement);

document.getElementById('App')?.appendChild(AppElement);
