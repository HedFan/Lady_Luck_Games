declare var require: any;
import * as PIXI from 'pixi.js';
import { Observable, Subject } from 'rxjs';
const dat = require('dat.gui');

import { GUI_POSITION, WinPosition, ISectorFolder } from './configs';

export class DebugView extends PIXI.Container {
  private readonly _spinWithResultSubject$ = new Subject<{ winValue: number }>();

  constructor() {
    super();
    this.position.copyFrom(GUI_POSITION);

    const gui = new dat.GUI({ name: 'Lady_Luck_Games' });
    const container = gui.domElement.parentElement;
    gui.domElement.style.left = '0px';
    gui.domElement.style.position = 'absolute';
    if (container) {
      container.setAttribute('id', 'debug-gui-controlPanel');
      container.style.zIndex = '100';
      container.style.userSelect = 'none';
    }
    const sectorFolder: ISectorFolder = {
      sectorName: WinPosition.BLUE
    };

    gui.add(sectorFolder, 'sectorName', {
      ORANGE: 6.26,
      GREEN: 5.16,
      VIOLET: 4.17,
      PINK: 3.19,
      YELLOW: 2.15,
      BLUE: 1.16
    });
    const guiReels = {
      spin: () => sendSpin()
    };
    gui.add(guiReels, 'spin').name('spin');

    const sendSpin = (): void => {
      this._spinWithResultSubject$.next({ winValue: Number(sectorFolder.sectorName) });
    };
  }

  get spinWithResult$(): Observable<{ winValue: number }> {
    return this._spinWithResultSubject$;
  }
}
