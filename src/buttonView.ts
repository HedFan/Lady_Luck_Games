import * as PIXI from 'pixi.js';
import { Polygon } from 'pixi.js';
import { Subject, fromEvent, Observable } from 'rxjs';

import {buttonHitAreaCoordinates, WIN_INDICATOR_POSITION, WIN_VALUES} from './configs';

const BUTTON_TEXT = 'YOUR WIN:';
export class ButtonView extends PIXI.Container {
    private readonly _clickSpinButtonSubject$ = new Subject<void>();
    private readonly _app: PIXI.Application;
    private readonly _button: PIXI.Sprite;
    private readonly _textContainer = new PIXI.Container();
    private _winIndicator: PIXI.BitmapText;

    constructor(app: PIXI.Application) {
        super();
        this._app = app;
        const buttonTexture: PIXI.Texture = PIXI.Texture.from('resources/button.png');
        this._button = new PIXI.Sprite(buttonTexture);
        this._button.pivot.set(113, 55);
        this._button.x = 400;
        this._button.y = 550;
        this._button.interactive = true;
        this._button.cursor = 'pointer';
        this.addChild(this._button);
        this._button.hitArea = new Polygon(buttonHitAreaCoordinates);

        this._textContainer.position.set(55, 15);
        this._textContainer.visible = false;
        this._button.addChild(this._textContainer);

        this._addWinText();
        this._initWinIndicator();

        const clickButton$ = fromEvent(this._button, 'pointerdown', () => {});

        clickButton$.subscribe(() => {
            this._clickSpinButtonSubject$.next();
            this.toggleVisibleText(false);
            this.changeWinIndicator('');
        });
    }

    public changeWinIndicator(value: number | string): void {
        this._winIndicator.text = typeof value === 'number' ? value.toString() : value;
    }

    public toggleVisibleText(isVisible: boolean): void {
        this._textContainer.visible = isVisible;
    }

    get clickSpinButton$(): Observable<void> {
        return this._clickSpinButtonSubject$;
    }

    private _addWinText(): void {
        const winText = new PIXI.Text(BUTTON_TEXT, {
            fontFamily: 'Courier New',
            fontSize: 20,
            fill: 0x181B1F,
            align: 'center',
            fontWeight: "bold",
            stroke: 0x181B1F,
            strokeThickness: 1
        });
        this._textContainer.addChild(winText);
    }

    private _initWinIndicator(): void {
        const winValuesString = WIN_VALUES.map(value => value.toString());

        PIXI.BitmapFont.from("WinCounterFont", {
            fontFamily: "Courier New",
            fontWeight: "bold",
            stroke: 0x181B1F,
            strokeThickness: 1,
            fill: 0x181B1F
        }, {
            chars: winValuesString,
            resolution: 4
        });

        this._winIndicator = new PIXI.BitmapText('', { fontName: 'WinCounterFont',   fontSize: 50, align: 'center' });
        this._winIndicator.position.copyFrom(WIN_INDICATOR_POSITION);
        this._textContainer.addChild(this._winIndicator);
    }
}
