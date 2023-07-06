import * as PIXI from 'pixi.js';

export class TestGame {

    private app: PIXI.Application;
    private container: PIXI.Container;
    private wheel: PIXI.Sprite;
    private wheelTongue: PIXI.Sprite;
    private button: PIXI.Sprite;

    public initialize(): void {
        
        const appOptions: any = {
            width: 800,
            height: 700,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1
        };
        this.app = new PIXI.Application(appOptions);
        document.body.appendChild(this.app.view);

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.loadResources();
    }

    protected loadResources(): void {
        const wheelTexture: PIXI.Texture = PIXI.Texture.from('resources/wheel.png');
        this.wheel = new PIXI.Sprite(wheelTexture);
        this.wheel.pivot.set(190, 190);
        this.wheel.x = 400;
        this.wheel.y = 300;
        this.container.addChild(this.wheel);

        const tongueTexture: PIXI.Texture = PIXI.Texture.from('resources/wheel_tongue.png');
        this.wheelTongue = new PIXI.Sprite(tongueTexture);
        this.wheelTongue.pivot.set(27, 20);
        this.wheelTongue.x = 400;
        this.wheelTongue.y = 100;
        this.container.addChild(this.wheelTongue);

        const buttonTexture: PIXI.Texture = PIXI.Texture.from('resources/button.png');
        this.button = new PIXI.Sprite(buttonTexture);
        this.button.pivot.set(113, 55);
        this.button.x = 400;
        this.button.y = 550;
        this.container.addChild(this.button);
    }

}
