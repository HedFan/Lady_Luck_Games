import * as PIXI from 'pixi.js';
import { Polygon } from 'pixi.js';
import { Subject, fromEvent, Observable } from 'rxjs';

import { buttonHitAreaCoordinates } from './configs';

export class ButtonView extends PIXI.Container {
    private readonly _clickSpinButtonSubject$ = new Subject<void>();
    private readonly _app: PIXI.Application;
    private readonly _button: PIXI.Sprite;

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

        const clickButton$ = fromEvent(this._button, 'pointerdown', () => {});

        clickButton$.subscribe(() => {
            this._clickSpinButtonSubject$.next();
        });
    }

    get clickSpinButton$(): Observable<void> {
        return this._clickSpinButtonSubject$;
    }
}
