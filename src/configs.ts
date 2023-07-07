//common
export interface ICoordinates {
    readonly x: number;
    readonly y: number;
}

// buttonView
export const BUTTON_TEXT = 'YOUR WIN:';
export const BUTTON_POSITION: ICoordinates = { x: 400, y: 550 };
export const TEXT_CONTAINER_POSITION: ICoordinates = { x: 55, y: 15 };
export const BUTTON_PIVOT: ICoordinates = { x: 113, y: 55 };
export const buttonHitAreaCoordinates = [207, 88, 217, 64, 216, 40, 30, 12, 7, 45, 35, 99, 184, 98, 22, 94, 35, 99, 7, 45, 8, 67, 13, 84, 208, 20, 198, 12, 190, 8, 41, 7, 30, 12, 216, 40, 19, 27, 12, 28, 7, 45, 30, 12];
export const WIN_INDICATOR_POSITION: ICoordinates = { x: 23, y: 20 };
export interface IButtonConfig {
   readonly pointerdown: IButtonParameter;
   readonly pointerup: IButtonParameter;
   readonly pointerover: IButtonParameter;
   readonly pointerout: IButtonParameter;
}
interface IButtonParameter {
   readonly tint: number;
   readonly scale: number;
}
export const BUTTON_CONFIG: IButtonConfig = {
    pointerdown: {
        tint: 0x7b7b7b,
        scale: 0.95
    },
    pointerup: {
        tint: 0xbababa,
        scale: 1
    },
    pointerover: {
        tint: 0xbababa,
        scale: 1
    },
    pointerout: {
        tint: 0xFFFFFF,
        scale: 1
    }
};

// wheelView
export const WHEEL_POSITION: ICoordinates = { x: 400, y: 300 };
export const WHEEL_PIVOT: ICoordinates = { x: 190, y: 190 };
export const WIN_VALUES: number[] = [70, 30, 60, 10, 20, 40];
export const SPEED: number = 0.035;
export const SPIN_DURATION: number = 2000;
export const WIN_VALUES_POSITION: ICoordinates[] = [{ x: 168, y: 52 }, { x: 59, y: 156 }, { x: 89, y: 281 }, { x: 217, y: 321 }, { x: 321, y: 239 }, { x: 303, y: 110 }];
export const WIN_VALUES_ANGLE: number[] = [0, 292, 237, 177, 120, 64];
export const BREAKPOINTS: number[] = [0, 1.16, 2.15, 3.19, 4.17, 5.16, 6.26];
export const LAST_BREAKPOINT: number = 6.26;
export const TONGUE_BREAKPOINT: number[] = [0.4, 1.47, 2.5, 3.56, 4.56, 5.6];

// debug giu
export const GUI_POSITION: ICoordinates = {
    x: 0,
    y: 550
};
export const enum WinPosition {
    ORANGE = 0,
    GREEN = 5.16,
    VIOLET = 4.17,
    PINK = 3.19,
    YELLOW = 2.15,
    BLUE = 1.16
}

export interface ISectorFolder {
    readonly sectorName: WinPosition;
}

// wheel tongue
export const WHEEL_TONGUE_POSITION: ICoordinates = { x: 400, y: 100 };
export const WHEEL_TONGUE_PIVOT: ICoordinates = { x: 27, y: 20 };
export const TONGUE_ROTATION = -3;




