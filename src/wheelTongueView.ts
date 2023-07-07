import * as PIXI from 'pixi.js';
import {
    SPEED,
    TONGUE_ROTATION,
    WHEEL_TONGUE_PIVOT,
    WHEEL_TONGUE_POSITION
} from "./configs";

export class WheelTongueView extends PIXI.Container {
    private readonly _app: PIXI.Application;
    private readonly _wheelTongue: PIXI.Sprite;
    private _isPlay = false;
    private _isOpen = false;

    constructor(app: PIXI.Application) {
        super();
        this._app = app;
        const tongueTexture: PIXI.Texture = PIXI.Texture.from('resources/wheel_tongue.png');
        this._wheelTongue = new PIXI.Sprite(tongueTexture);
        this._wheelTongue.pivot.copyFrom(WHEEL_TONGUE_PIVOT);
        this._wheelTongue.position.copyFrom(WHEEL_TONGUE_POSITION);
        this.addChild(this._wheelTongue);
    }

    public playCollision(): void {
      this._isPlay = true;
      this._isOpen = true;
    }

    public updateWheelTongue(delta: number): void {
        if (!this._isPlay) {
            return;
        }
        if (this._wheelTongue.rotation >= -1 && this._isOpen) {
            this._wheelTongue.rotation += SPEED * TONGUE_ROTATION * delta;
        }
        else if (this._wheelTongue.rotation < 0){
            this._isOpen = false;
            this._wheelTongue.rotation -= SPEED * TONGUE_ROTATION * delta;
        }
        else {
            this._wheelTongue.rotation = 0;
            this._isPlay = this._isOpen = false;
        }
    }
}
