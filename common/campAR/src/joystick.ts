export class Joystick {
  private _position: { x: number; y: number } = { x: 0, y: 0 };
  private draggable: HTMLElement = document.createElement("div");
  private background: HTMLElement =  document.createElement("div");

  constructor() {
    const joystick = document.getElementById("joystick");
    this.draggable.id = "joystick-draggable";
    this.background.id = "joystick-background";
    joystick?.appendChild(this.background);
    joystick?.appendChild(this.draggable);
  }

  get bar(): { x: number; y: number } {
    return this._position;
  }
}
