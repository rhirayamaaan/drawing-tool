import MovingAverage from '../../lib/utilities/MovingAverage';
import styleVariables from '../../lib/styles/_variables.scss';
import styles from './styles.scss';
import TextField from '../../parts/TextField';

interface DrawMousePosition {
  x: MouseEvent['offsetX'];
  y: MouseEvent['offsetY'];
}

interface DrawingCanvasContextProps {
  width?: number;
  color?: string;
  cap?: CanvasLineCap;
  join?: CanvasLineJoin;
}

interface DrawingCanvasProps {
  width?: number;
  height?: number;
}

export default class DrawingCanvas {
  private static NAMESPACE = 'drawingCanvas';

  private _rootDOM: HTMLDivElement;

  private _canvasDOM: HTMLCanvasElement;

  private _intervalInputDOM: HTMLElement;

  private _canvasContext: CanvasRenderingContext2D | null;

  // private _isDrawing = false;

  public get Element() {
    return this._rootDOM;
  }

  public set lineStyle({ width, color, cap, join }: DrawingCanvasContextProps) {
    if (this._canvasContext === null) {
      return;
    }

    if (typeof cap !== 'undefined') {
      this._canvasContext.lineCap = cap;
    }

    if (typeof join !== 'undefined') {
      this._canvasContext.lineJoin = join;
    }

    if (typeof width !== 'undefined') {
      this._canvasContext.lineWidth = width;
    }

    if (typeof color !== 'undefined') {
      this._canvasContext.strokeStyle = color;
    }
  }

  private _lastDrawPosition: DrawMousePosition = {
    x: 0,
    y: 0,
  };

  private _tempDrawXPositions: Array<DrawMousePosition['x']> = [];
  private _tempDrawYPositions: Array<DrawMousePosition['y']> = [];

  private _movingAveregeInterval = 0;

  private _setMovingAverageInterval(event?: Event) {
    const target = event?.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const interval = parseInt(target.value || '');

    if (isNaN(interval) || !isFinite(interval) || interval < 0) {
      this._movingAveregeInterval = 0;
      return;
    }

    this._movingAveregeInterval = interval;
  }

  private _preDrawHandler(event: MouseEvent) {
    if (this._canvasContext === null) {
      return;
    }

    this._lastDrawPosition = {
      x: event.offsetX,
      y: event.offsetY,
    };

    this._canvasContext.beginPath();

    this._canvasDOM.addEventListener('mousemove', this._drawingHandler);
    this._canvasDOM.addEventListener('mouseleave', this._postDrawHandler);
    window.addEventListener('mouseup', this._postDrawHandler);
  }

  private _drawingHandler(event: MouseEvent) {
    const drawingPosition: DrawMousePosition = {
      x: event.offsetX,
      y: event.offsetY,
    };

    this._canvasContext?.moveTo(this._lastDrawPosition.x, this._lastDrawPosition.y);

    const movingAverageX = new MovingAverage(this._tempDrawXPositions, drawingPosition.x, this._movingAveregeInterval);
    const movingAverageY = new MovingAverage(this._tempDrawYPositions, drawingPosition.y, this._movingAveregeInterval);
    this._canvasContext?.lineTo(movingAverageX.averageValue, movingAverageY.averageValue);

    this._tempDrawXPositions = movingAverageX.movedArray;
    this._tempDrawYPositions = movingAverageY.movedArray;

    this._canvasContext?.stroke();

    this._lastDrawPosition = { x: movingAverageX.averageValue, y: movingAverageY.averageValue };
  }

  private _postDrawHandler(_event: MouseEvent) {
    this._tempDrawXPositions = [];
    this._tempDrawYPositions = [];

    this._canvasDOM.removeEventListener('mousemove', this._drawingHandler);
    this._canvasDOM.removeEventListener('mouseleave', this._postDrawHandler);
    window.removeEventListener('mouseup', this._postDrawHandler);

    this._canvasContext?.closePath();
  }

  constructor({ width = 400, height = 400 }: DrawingCanvasProps) {
    this._preDrawHandler = this._preDrawHandler.bind(this);
    this._drawingHandler = this._drawingHandler.bind(this);
    this._postDrawHandler = this._postDrawHandler.bind(this);
    this._setMovingAverageInterval = this._setMovingAverageInterval.bind(this);

    this._rootDOM = document.createElement('div');
    this._rootDOM.classList.add(styles[DrawingCanvas.NAMESPACE]);

    this._canvasDOM = document.createElement('canvas');
    this._canvasDOM.setAttribute('width', `${width}`);
    this._canvasDOM.setAttribute('height', `${height}`);
    this._canvasDOM.classList.add(styles[`${DrawingCanvas.NAMESPACE}__canvas`]);

    this._intervalInputDOM = new TextField({
      defaultValue: `${this._movingAveregeInterval}`,
      label: '移動平均の区間値',
      onInput: this._setMovingAverageInterval,
      className: styles[`${DrawingCanvas.NAMESPACE}__interval`],
    }).Element;

    this._canvasContext = this._canvasDOM.getContext('2d');

    if (this._canvasContext === null) {
      return this;
    }

    this.lineStyle = {
      width: 4,
      color: styleVariables.globalColorGray1,
      cap: 'round',
      join: 'round',
    };

    this._canvasDOM.addEventListener('mousedown', this._preDrawHandler);

    this._rootDOM.appendChild(this._intervalInputDOM);
    this._rootDOM.appendChild(this._canvasDOM);

    return this;
  }
}
