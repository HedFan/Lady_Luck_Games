import * as PIXI from 'pixi.js';
import { Observable, Subject } from 'rxjs';

import {
    SPIN_DURATION,
    WIN_VALUES,
    WIN_VALUES_POSITION,
    WIN_VALUES_ANGLE,
    BREAKPOINTS,
    LAST_BREAKPOINT,
    WHEEL_POSITION,
    WHEEL_PIVOT, SPEED, TONGUE_BREAKPOINT
} from './configs';

export class WheelView extends PIXI.Container {
    private readonly _sendWinValueSubject$ = new Subject<{ winValue: number }>();
    private readonly _sendTongueCollisionSubject$ = new Subject<void>();
    private readonly _app: PIXI.Application;
    private readonly _wheel: PIXI.Sprite;
    private _isSpinning = false;
    private _winContainers = new Array<PIXI.Text>();
    private _stopPosition: number | undefined;
    private _spinTimer: number | undefined;
    private _checkingTongueBreakpoint: number[];

    constructor(app: PIXI.Application) {
        super();
        this._app = app;
        const wheelTexture: PIXI.Texture = PIXI.Texture.from('resources/wheel.png');
        this._wheel = new PIXI.Sprite(wheelTexture);
        this._wheel.pivot.copyFrom(WHEEL_PIVOT);
        this._wheel.position.copyFrom(WHEEL_POSITION);
        this.addChild(this._wheel);
        for (let i = 0; i < WIN_VALUES.length; i++) {
            this._buildWinIndicator(i);
        }
        this._checkingTongueBreakpoint = TONGUE_BREAKPOINT;
    }

    public spinWheel(winValue?: number): void {
        if (this._isSpinning) {
          return;
        }
        this._isSpinning = true;
        this._spinTimer = setTimeout(() => this._preparedToStop(winValue), SPIN_DURATION);
    }

    public updateWheel(delta: number): void {
        if (!this._isSpinning) {
            return;
        }
        this._wheel.rotation += SPEED * delta;
        const rotation = this._wheel.rotation;
        this._findTongueBreakpoint(rotation);
        if (rotation >= this._stopPosition && (this._stopPosition - rotation + 0.1) >= 0) {
            this._stopReels();
        }
        if (rotation >= LAST_BREAKPOINT) {
            this._wheel.rotation = 0;
        }
    }

    get sendWinValue$(): Observable<{ winValue: number }> {
        return this._sendWinValueSubject$;
    }
    get sendTongueCollision$(): Observable<void> {
        return this._sendTongueCollisionSubject$;
    }

    private _preparedToStop(winValue?: number): void {
        if (!!winValue) {
            this._stopPosition = winValue;
            return;
        }
        const currentPosition = this._wheel.rotation;
        this._stopPosition = this._findClosesWinValue(currentPosition);
    }

    private _stopReels(): void {
        const indexWinValue = this._stopPosition === LAST_BREAKPOINT ? 0 : BREAKPOINTS.indexOf(this._stopPosition);
        this._sendWinValueSubject$.next({ winValue: WIN_VALUES[indexWinValue] });
        clearTimeout(this._spinTimer);
        this._isSpinning = false;
        this._stopPosition = undefined;
    }

    private _buildWinIndicator(index: number): void {
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

    private _findClosesWinValue(currentValue: number): number {
        if (currentValue > BREAKPOINTS[BREAKPOINTS.length - 1]) {
            return BREAKPOINTS[0];
        }
        return BREAKPOINTS.filter(value => value > currentValue).sort((a, b) => a - b)[0];
    }

    private _findTongueBreakpoint(currentValue: number): void {
        if (!this._checkingTongueBreakpoint.length) {
            this._checkingTongueBreakpoint = TONGUE_BREAKPOINT;
        }
        if (currentValue > this._checkingTongueBreakpoint[5]) {
          return;
        }
        let checkingValue: number;
        const breakpointLength = this._checkingTongueBreakpoint.length;
        for (let i = 0; i < breakpointLength; i++) {
            checkingValue = this._checkingTongueBreakpoint[i];
            if (currentValue >= checkingValue) {
                this._sendTongueCollisionSubject$.next();
                this._checkingTongueBreakpoint = this._checkingTongueBreakpoint.slice(i + 1);
            }
        }
    }
}
