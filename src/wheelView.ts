import * as PIXI from 'pixi.js';
import { fromEvent, Observable, Subject } from 'rxjs';

import {
    SPIN_DURATION,
    WIN_VALUES,
    WIN_VALUES_POSITION,
    WIN_VALUES_ANGLE,
    BREAKPOINTS,
    LAST_BREAKPOINT,
    WHEEL_POSITION,
    WHEEL_PIVOT,
    SPEED,
    TONGUE_BREAKPOINT,
    WHEEL_HIT_AREA
} from './configs';

export class WheelView extends PIXI.Container {
    private readonly _sendWinValueSubject$ = new Subject<{ winValue: number }>();
    private readonly _sendTongueCollisionSubject$ = new Subject<void>();
    private readonly _wheel: PIXI.Sprite;
    private _winContainers = new Array<PIXI.Text>();
    private _stopPosition: number | undefined;
    private _spinTimer: number | undefined;
    private _checkingTongueBreakpoint: number[];
    private _isSpinning = false;
    private _dragWheelTarget: undefined | PIXI.Sprite = undefined;

    constructor() {
        super();
        const wheelTexture: PIXI.Texture = PIXI.Texture.from('resources/wheel.png');
        this._wheel = new PIXI.Sprite(wheelTexture);
        this._wheel.pivot.copyFrom(WHEEL_PIVOT);
        this._wheel.position.copyFrom(WHEEL_POSITION);
        this._wheel.interactive = true;
        this._wheel.cursor = 'pointer';
        const { coords, radius } = WHEEL_HIT_AREA;
        this._wheel.hitArea = new PIXI.Circle(coords.x, coords.y, radius);
        this.addChild(this._wheel);
        for (let i = 0; i < WIN_VALUES.length; i++) {
            this._buildWinIndicator(i);
        }
        this._checkingTongueBreakpoint = TONGUE_BREAKPOINT;

        this._wheel
            .on('pointerdown', (event: PIXI.InteractionEvent) => this._startMoveWheel(event), this._wheel)
            .on('pointerup', (event: PIXI.InteractionEvent) => this._stopMoveWheel(event), this._wheel)
            .on('pointerupoutside', (event: PIXI.InteractionEvent) => this._stopMoveWheel(event))
            .on('pointermove', (event: PIXI.InteractionEvent) => this._onDragMove(event));
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

    private _startMoveWheel(event: PIXI.InteractionEvent): void {
        this._dragWheelTarget = this._wheel;
    }
    
    private _stopMoveWheel(event: PIXI.InteractionEvent): void {
        if (this._dragWheelTarget) {
            this._dragWheelTarget.off('pointermove', this._onDragMove);
            this._dragWheelTarget = undefined;
        }
    }
    
    private _onDragMove(event: PIXI.InteractionEvent): void {
        if (this._isSpinning) {
            this._wheel.cursor = 'default';
            return;
        }
        if (this._dragWheelTarget === undefined) {
            return;
        }
        this._wheel.cursor = 'pointer';
        const { x, y } = event.data.originalEvent as PointerEvent;
        const { position } = this._dragWheelTarget;
        const dx = x - position.x;
        const dy = y - position.y;
        this._dragWheelTarget.rotation = Math.atan2(dy, dx);
    }
}
