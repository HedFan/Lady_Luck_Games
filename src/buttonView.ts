import * as PIXI from 'pixi.js';
import { Subject, Observable } from 'rxjs';

import {
    BUTTON_CONFIG,
    WIN_INDICATOR_POSITION,
    WIN_VALUES,
    BUTTON_TEXT,
    IButtonConfig,
    BUTTON_PIVOT,
    BUTTON_POSITION,
    TEXT_CONTAINER_POSITION,
    SPIN_BUTTON_HIT_AREA
} from './configs';

export class ButtonView extends PIXI.Container {
    private readonly _clickSpinButtonSubject$ = new Subject<void>();
    private readonly _button: PIXI.Sprite;
    private readonly _textContainer = new PIXI.Container();
    private _winIndicator: PIXI.BitmapText;

    constructor() {
        super();
        const buttonTexture: PIXI.Texture = PIXI.Texture.from('resources/button.png');
        this._button = new PIXI.Sprite(buttonTexture);
        this._button.pivot.copyFrom(BUTTON_PIVOT);
        this._button.position.copyFrom(BUTTON_POSITION);
        this._button.interactive = this._button.buttonMode = true;
        this._button.cursor = 'pointer';
        this._button.hitArea = new PIXI.Polygon(SPIN_BUTTON_HIT_AREA);

        this._textContainer.position.copyFrom(TEXT_CONTAINER_POSITION);
        this._textContainer.visible = false;
        
        this.addChild(this._button);
        this._button.addChild(this._textContainer);

        this._addButtonInteractive();
        this._addWinText();
        this._initWinIndicator();
    }

    public showResult(value: number | string): void {
        this._changeWinIndicator(value);
        this._toggleButtonState(true);
    }

    public buttonClicked(): void {
        this._toggleButtonState(false);
        this.toggleVisibleText(false);
        this._changeWinIndicator('');
    }

    public changeButtonStateManually(isPressed: boolean): void {
        const state = isPressed ? 'pointerdown' : 'pointerover';
        this._buttonInteractiveConfig(state);
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

        PIXI.BitmapFont.from('WinCounterFont', {
            fontFamily: 'Courier New',
            fontWeight: 'bold',
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

    private _changeWinIndicator(value: number | string): void {
        this._winIndicator.text = typeof value === 'number' ? value.toString() : value;
    }

    private _toggleButtonState(isActive: boolean): void {
        this._button.interactive = isActive;
        this.changeButtonStateManually(!isActive);
    }

    private _addButtonInteractive(): void {
        this._button
            .on('pointerdown', (event: PIXI.InteractionEvent) => {
                this._buttonInteractiveConfig(event.type as keyof IButtonConfig);
                this.buttonClicked();
                this._clickSpinButtonSubject$.next();
            })
            .on('pointerup', (event: PIXI.InteractionEvent) => this._buttonInteractiveConfig(event.type as keyof IButtonConfig))
            .on('pointerover', (event: PIXI.InteractionEvent) => this._buttonInteractiveConfig(event.type as keyof IButtonConfig))
            .on('pointerout', (event: PIXI.InteractionEvent) => this._buttonInteractiveConfig(event.type as keyof IButtonConfig));
    }

    private _buttonInteractiveConfig(event: keyof IButtonConfig): void {
        const { tint, scale } = BUTTON_CONFIG[event];
        this._button.tint = tint;
        this._button.scale.set(scale);
    }
}
