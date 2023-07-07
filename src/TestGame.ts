import * as PIXI from 'pixi.js';

import { WheelView } from './wheelView';
import { WheelTongueView } from "./wheelTongueView";
import { ButtonView } from './buttonView';
import { DebugView } from './debugView';

export class TestGame {
    private app: PIXI.Application;
    private container: PIXI.Container;
    private wheel: WheelView;
    private wheelTongue: WheelTongueView;
    private button: ButtonView;
    private debug: DebugView;

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
        this.debug = new DebugView();

        this.container.addChild(this.wheel, this.wheelTongue, this.button);

        this.button.clickSpinButton$.subscribe(() => this.startSpin());

        this.wheel.sendWinValue$.subscribe(({ winValue }) => {
            this.button.showResult(winValue);
            this.button.toggleVisibleText(true);
        });

        this.debug.spinWithResult$.subscribe(({ winValue }) => {
            this.startSpin(winValue);
            this.button.buttonClicked();
            this.button.changeButtonStateManually(true);
        });
    }

    private startSpin(winValue?: number): void {
        this.wheel.spinWheel(winValue);
    }
}
