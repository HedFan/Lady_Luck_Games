import * as PIXI from 'pixi.js';

export class WheelTongueView extends PIXI.Container {
    private readonly _app: PIXI.Application;
    private readonly _wheelTongue: PIXI.Sprite;

    constructor(app: PIXI.Application) {
        super();
        this._app = app;
        const tongueTexture: PIXI.Texture = PIXI.Texture.from('resources/wheel_tongue.png');
        this._wheelTongue = new PIXI.Sprite(tongueTexture);
        this._wheelTongue.pivot.set(27, 20);
        this._wheelTongue.x = 400;
        this._wheelTongue.y = 100;
        this.addChild(this._wheelTongue);
    }

}
