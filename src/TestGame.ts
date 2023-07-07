import * as PIXI from 'pixi.js';

import { WheelView } from './wheelView';
import {WheelTongueView} from "./wheelTongueView";
import { ButtonView } from './buttonView';

export class TestGame {
    private app: PIXI.Application;
    private container: PIXI.Container;
    private wheel: WheelView;
    private wheelTongue: WheelTongueView;
    private button: ButtonView;

    public initialize(): void {
        const appOptions: any = {
            width: 800,
            height: 700,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1
        };
        this.app = new PIXI.Application(appOptions);
        // @ts-ignore
        globalThis.__PIXI_APP__ = this.app;
        document.body.appendChild(this.app.view);

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.loadResources();
        this.app.ticker.add(this.update, this);
    }
    public update(deltaTime: number): void {
        this.wheel.updateWheel(deltaTime);
    }

    protected loadResources(): void {
        this.wheel = new WheelView(this.app);
        this.wheelTongue = new WheelTongueView(this.app);
        this.button = new ButtonView(this.app);

        this.container.addChild(this.wheel, this.wheelTongue, this.button);

        const { clickSpinButton$ } = this.button;

        const { sendWinValue$ } = this.wheel;

        clickSpinButton$.subscribe(() => {
            this.startSpin();
        });

        sendWinValue$.subscribe(({ winValue }) => {
            this.button.changeWinIndicator(winValue);
            this.button.toggleVisibleText(true);
        });
    }

    private startSpin(): void {
        this.wheel.spinWheel();
    }

}
