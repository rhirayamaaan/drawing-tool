export default class MovingAverage {
  private _sliceIndex = 1;

  private _movedArray: Array<number>;

  private _averagedValue: number;

  public get movedArray() {
    return this._movedArray;
  }

  public get averagedValue() {
    return this._averagedValue;
  }

  constructor(array: Array<number>, newValue: number, limit: number = 7) {
    if (array.length > limit) {
      this._sliceIndex = array.length - limit + 1;
    } else if (array.length < limit) {
      this._sliceIndex = 0;
    }

    this._movedArray = [...array.slice(this._sliceIndex), newValue];

    this._averagedValue = this._movedArray.reduce((prev, current) => prev + current) / this._movedArray.length;

    return this;
  }
}
