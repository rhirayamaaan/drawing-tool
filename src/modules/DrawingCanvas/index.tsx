import React, { useRef, useEffect } from 'react';
import MovingAverage from '../../lib/utilities/MovingAverage';
import styleVariables from '../../lib/styles/_variables.scss';
import styles from './styles.scss';
import TextField from '../../parts/TextField';
import { FC } from 'react';
import Button from '../../parts/Button';

const NAMESPACE = 'drawingCanvas';

interface DrawMousePositionProps {
  x: MouseEvent['offsetX'];
  y: MouseEvent['offsetY'];
}

interface TempDrawPositionsProps {
  x: DrawMousePositionProps['x'][];
  y: DrawMousePositionProps['y'][];
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
  className?: string;
  lineStyle?: DrawingCanvasContextProps;
}

class DrawingCore {
  private _canvasElement: HTMLCanvasElement | null = null;
  private _canvasContext: CanvasRenderingContext2D | null = null;
  private _lastDrawPosition: DrawMousePositionProps = { x: 0, y: 0 };
  private _tempDrawPositions: TempDrawPositionsProps = { x: [], y: [] };
  private _movingAverageInterval = 0;

  public preDrawHandler(event: React.MouseEvent) {
    if (this._canvasContext === null) {
      return;
    }

    this._lastDrawPosition = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    this._canvasContext.beginPath();

    this._canvasElement?.addEventListener('mousemove', this._drawingHandler);
    this._canvasElement?.addEventListener('mouseleave', this._postDrawHandler);
    window.addEventListener('mouseup', this._postDrawHandler);
  }

  private _drawingHandler(event: MouseEvent) {
    const drawingPosition: DrawMousePositionProps = {
      x: event.offsetX,
      y: event.offsetY,
    };

    this._canvasContext?.moveTo(this._lastDrawPosition.x, this._lastDrawPosition.y);

    const movingAverageX = new MovingAverage(this._tempDrawPositions.x, drawingPosition.x, this._movingAverageInterval);
    const movingAverageY = new MovingAverage(this._tempDrawPositions.y, drawingPosition.y, this._movingAverageInterval);

    this._canvasContext?.lineTo(movingAverageX.averagedValue, movingAverageY.averagedValue);
    this._canvasContext?.stroke();

    this._tempDrawPositions = {
      x: movingAverageX.movedArray,
      y: movingAverageY.movedArray,
    };

    this._lastDrawPosition = { x: movingAverageX.averagedValue, y: movingAverageY.averagedValue };
  }

  private _postDrawHandler(_event: MouseEvent) {
    this._tempDrawPositions = {
      x: [],
      y: [],
    };

    this._canvasElement?.removeEventListener('mousemove', this._drawingHandler);
    this._canvasElement?.removeEventListener('mouseleave', this._postDrawHandler);
    window.removeEventListener('mouseup', this._postDrawHandler);

    this._canvasContext?.closePath();
  }

  public setMovingAverageInterval(event?: React.FormEvent) {
    const target = event?.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const interval = parseInt(target.value || '');

    if (isNaN(interval) || !isFinite(interval) || interval < 0) {
      this._movingAverageInterval = 0;
      return;
    }

    this._movingAverageInterval = interval;
  }

  public set canvasElement(element: HTMLCanvasElement | null) {
    this._canvasElement = element;

    if (this._canvasElement === null) {
      return;
    }

    this._canvasContext = this._canvasElement.getContext('2d');
  }

  public get canvasElement() {
    return this._canvasElement;
  }

  public get canvasContext() {
    return this._canvasContext;
  }

  public set lastDrawPosition(position: DrawMousePositionProps) {
    this._lastDrawPosition = position;
  }

  public get lastDrawPosition() {
    return this._lastDrawPosition;
  }

  public set tempDrawPostions(positions: TempDrawPositionsProps) {
    this._tempDrawPositions = positions;
  }

  public get tempDrawPostions() {
    return this._tempDrawPositions;
  }

  public set movingAverageInterval(number: number) {
    this._movingAverageInterval = number;
  }

  public get movingAverageInterval() {
    return this._movingAverageInterval;
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

  public clearCanvas() {
    this._canvasContext?.clearRect(0, 0, this.canvasElement?.width || 0, this.canvasElement?.height || 0);
  }

  constructor() {
    this.preDrawHandler = this.preDrawHandler.bind(this);
    this._drawingHandler = this._drawingHandler.bind(this);
    this._postDrawHandler = this._postDrawHandler.bind(this);
    this.setMovingAverageInterval = this.setMovingAverageInterval.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    return this;
  }
}

const DrawingCanvas: FC<DrawingCanvasProps> = ({
  width = 400,
  height = 400,
  className,
  lineStyle = {
    width: 4,
    color: styleVariables.globalColorGray1,
    cap: 'round',
    join: 'round',
  },
}) => {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const drawingCoreRef = useRef(new DrawingCore());

  useEffect(() => {
    drawingCoreRef.current.canvasElement = canvasElementRef.current;
  }, []);

  useEffect(() => {
    drawingCoreRef.current.lineStyle = lineStyle;
  }, [lineStyle]);

  return (
    <div className={[styles[NAMESPACE], className].join(' ').trim()}>
      <div className={styles[`${NAMESPACE}__interval`]}>
        <TextField
          defaultValue={'0'}
          label="移動平均の区間値"
          onInput={drawingCoreRef.current.setMovingAverageInterval}
        />
      </div>
      <div className={styles[`${NAMESPACE}__main`]}>
        <canvas
          className={styles[`${NAMESPACE}__canvas`]}
          width={width}
          height={height}
          onMouseDown={drawingCoreRef.current.preDrawHandler}
          ref={canvasElementRef}
        />
      </div>
      <div className={styles[`${NAMESPACE}__clear`]}>
        <Button onClick={drawingCoreRef.current.clearCanvas}>キャンバスをきれいにする</Button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
