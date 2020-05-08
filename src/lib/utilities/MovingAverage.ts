// const getMovingAverage = (array: Array<number>, newValue: number, limit: number = 7) => {

//   let sliceIndex = 1;

//   if (array.length > limit) {
//     sliceIndex = array.length - limit + 1;
//   }

//   const movedArray = [...array.slice(sliceIndex), newValue];
// }

export default class MovingAverage {
  private _sliceIndex = 1;

  private _movedArray: Array<number>;

  private _averageValue: number;

  public get movedArray() {
    return this._movedArray;
  }

  public get averageValue() {
    return this._averageValue;
  }

  constructor(array: Array<number>, newValue: number, limit: number = 7) {
    if (array.length > limit) {
      this._sliceIndex = array.length - limit + 1;
    } else if (array.length < limit) {
      this._sliceIndex = 0;
    }

    this._movedArray = [...array.slice(this._sliceIndex), newValue];

    this._averageValue = this._movedArray.reduce((prev, current) => prev + current) / this._movedArray.length;

    return this;
  }
}
