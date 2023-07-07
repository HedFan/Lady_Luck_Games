import * as PIXI from 'pixi.js';

const SPIN_DURATION: number = 2000;
const WIN_VALUES = [70, 10, 40, 20, 60, 30];
const WIN_VALUES_POSITION = [{ x: 168, y: 52 }, { x: 303, y: 110 }, { x: 321, y: 239 }, { x: 217, y: 321 }, { x: 89, y: 281 }, { x: 59, y: 156 }];
const WIN_VALUES_ANGLE = [0, 64, 120, 177, 237, 292];
const BREAKPOINTS = [0, 1.16, 2.15, 3.19, 4.17, 5.16, 6.26];

export class WheelView extends PIXI.Container {
    private readonly _app: PIXI.Application;
    private readonly _wheel: PIXI.Sprite;
    private _isSpinning = false;
    private _winContainers = new Array<any>();
    private _stopPosition: number | undefined;
    private _spinTimer: number | undefined;

    constructor(app: PIXI.Application) {
        super();
        this._app = app;
        const wheelTexture: PIXI.Texture = PIXI.Texture.from('resources/wheel.png');
        this._wheel = new PIXI.Sprite(wheelTexture);
        this._wheel.pivot.set(190, 190);
        this._wheel.x = 400;
        this._wheel.y = 300;
        this.addChild(this._wheel);
        for(let i = 0; i < WIN_VALUES.length; i++) {
            this.buildWinIndicator(i);
        }
    }

    public spinWheel(): void {
        if (this._isSpinning) {
          this._preparedToStop();
            return;
        }
        this._isSpinning = true;

        this._spinTimer = setTimeout(() => this._preparedToStop(), SPIN_DURATION);
    }
    public updateWheel(delta: number): void {
        if (!this._isSpinning) {
            return;
        }
        this._wheel.rotation += 0.01 * delta;

        if(this._wheel.rotation >= this._stopPosition) {
            this.stopReels();
        }
        if(this._wheel.rotation >= 6.26) {
            this._wheel.rotation = 0;
        }

    }

    private _preparedToStop(): void {
        const currentPosition = this._wheel.rotation;
        this._stopPosition = this.findClosesWinValue(currentPosition);
    }

    private stopReels(): void {
        clearTimeout(this._spinTimer);
        this._isSpinning = false;
        this._stopPosition = undefined;
    }

    private buildWinIndicator(index: number): void {
        const winText = new PIXI.Text(WIN_VALUES[index].toString(), {
            fontFamily: 'Courier New',
            fontSize: 44,
            fill: 0x181B1F,
            align: 'center',
            fontWeight: "bold",
            stroke: 0x181B1F,
            strokeThickness: 3,
            letterSpacing: -5
        });
        winText.position.copyFrom(WIN_VALUES_POSITION[index]);
        winText.angle = WIN_VALUES_ANGLE[index];
        this._winContainers.push(winText);
        this._wheel.addChild(winText);
    }

    private findClosesWinValue(currentValue: number) {
        if (currentValue > BREAKPOINTS[BREAKPOINTS.length - 1]) {
            return BREAKPOINTS[0];
        }
        return BREAKPOINTS.filter(value => value > currentValue).sort((a, b) => a - b)[0];
    }
}
