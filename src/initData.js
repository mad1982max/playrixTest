const arrImg = [
    {
        name: 'austin',
        url: './img/austin.png'
    },
    {
        name: 'bg',
        url: './img/back.png'
    },
    {
        name: 'dec_1',
        url: './img/dec_1.png'
    },
    {
        name: 'dec_2',
        url: './img/dec_2.png'
    },
    {
        name: 'old',
        url: './img/old.png'
    },
    {
        name: 'logo',
        url: './img/logo.png'
    },
    {
        name: 'hummer',
        url: './img/hummer.png'
    },
    {
        name: 'btn',
        url: './img/btn.png'
    },
    {
        name: 'menu_ex1',
        url: './img/menu_ex1.png'
    },
    {
        name: 'menu_ex2',
        url: './img/menu_ex2.png'
    },
    {
        name: 'menu_ex3',
        url: './img/menu_ex3.png'
    },
    {
        name: 'circle',
        url: './img/circle.png'
    },
    {
        name: 'ok',
        url: './img/ok.png'
    },
    {
        name: 'new_1',
        url: './img/new_1.png'
    },
    {
        name: 'new_2',
        url: './img/new_2.png'
    },
    {
        name: 'new_3',
        url: './img/new_3.png'
    },
    {
        name: 'final_l1',
        url: './img/final_l1.png'
    },
    {
        name: 'final_l2',
        url: './img/final_l2.png'
    },
    {
        name: 'theme', 
        url: './img/theme.mp3'
    }
];

let initOpt = {
    initWidth: 1240,
    initHeight: 870,
};

let animation = {
    logoAnimTime: null,
    logoDuration: 1300,
    logoStart: -600,
    logoTrack: 650,
    stairsStart: -100,
    stairsDuration: 300,
    buildAnimTime: null,
    menuMovingFlag: false,
    menuMovingEnd: false,
    rangeOfRotation: -Math.PI/180*170,

};

const textureObj = {
    bg: {
        name: "bg",
        x: -1100,
        y: -500,
        zIndex: 1
    },
    austin: {
        name: "austin",
        x: 600,
        y: 170,
        zIndex: 2
    },
    ok: {
        name: "ok",
        x: 200,
        y: 200,
        alpha: 0,
        alphaSpeed: 0.04,
        visible: false,
        zIndex: 9,
        buttonMode: true,
        interactive: true
    }, 
    hummer: {
        name: "hummer",
        x: 1020,
        y: 300,
        alpha: 0,
        visible: false,
        alphaPace: 0.03,
        zIndex: 3,
        buttonMode: true,
        interactive: true
    },

    dec_1: {
        name: "dec_1",
        position: [1020,520],
        zIndex: 3,

    },
    dec_2: {
        name: "dec_2",
        zIndex: 2,
    },
    logo: {
        name: "logo",
        x: -400,
        y: 25,
        zIndex: 3,
        animationEnd: false
    },
    old: {
        name: "old",
        position: [735,135],
        zIndex: 2
    },
    btn: {
        name: "btn",
        position: [0, 700],
        buttonMode: true,
        interactive: true,
        pace: 1.002,
        increaseFlag: true,
        curentRatio: 1,
        rangeRatio: 1.15,
        zIndex: 10,
    },
    final_l2: {
        name: "final_l2",
        position: [0,0],
        zIndex: 9,
        alpha: 0,
        increment: 0.03,
        edgeAlpha: 0.8
    },
    final_l1: {
        name: "final_l1",
        position: [0, 0],
        zIndex: 10,
        alpha: 0,
        increment: 0.03
    }
}

let XLmenuCircle = {
    speed: -0.05,
    acceleration: 1.035,
    centerX: 1100,
    centerY: 550,
    R: 410,
    stairs: [
        {
            nameMenu: "menu_ex1",
            nameStair: "new_1",
            alignMenu: [-40,-100],
            alignStairs: [835, 90],
            menuAfterRotation: [813.9, 256.32],
            initAngle: Math.PI/180*30
        },
        {
            nameMenu: "menu_ex2",
            nameStair: "new_2",
            alignMenu: [-40,-135],
            menuAfterRotation: [964.82, 162.9],
            alignStairs: [835, 100],
            initAngle: Math.PI/180*55
        },
        {
            nameMenu: "menu_ex3",
            nameStair: "new_3",
            alignMenu: [-42,-62],
            menuAfterRotation: [1141.06, 142.06],
            alignStairs: [850, 55],
            initAngle: Math.PI/180*80
        }
    ]
};

let XSmenuCircle = {
    speed: -0.05,
    acceleration: 1.035,
    centerX: 800,
    centerY: 680,
    R: 380,
    stairs: [
        {
            nameMenu: "menu_ex1",
            nameStair: "new_1",
            alignMenu: [-40,-100],
            menuAfterRotation: [478.22, 477.87],
            alignStairs: [700, 90],
            initAngle: Math.PI/180*25
        },
        {
            nameMenu: "menu_ex2",
            nameStair: "new_2",
            menuAfterRotation: [622.39, 344.05],
            alignMenu: [-40,-135],
            alignStairs: [700, 100],
            initAngle: Math.PI/180*55
        },
        {
            nameMenu: "menu_ex3",
            nameStair: "new_3",
            menuAfterRotation: [814.15, 300.26],
            alignMenu: [-42,-62],
            alignStairs: [715, 55],
            initAngle: Math.PI/180*85
        }
    ]
};

let SMmenuCircle = {
    speed: -0.05,
    acceleration: 1.035,
    centerX: 800,
    centerY: 830,
    R: 400,
    stairs: [
        {
            nameMenu: "menu_ex1",
            nameStair: "new_1",
            alignMenu: [-40,-100],
            menuAfterRotation: [612.9, 476.45],
            alignStairs: [835, 90],
            initAngle: Math.PI/180*30
        },
        {
            nameMenu: "menu_ex2",
            nameStair: "new_2",
            alignMenu: [-40,-135],
            menuAfterRotation: [779.84, 430.5],
            alignStairs: [835, 100],
            initAngle: Math.PI/180*55
        },
        {
            nameMenu: "menu_ex3",
            nameStair: "new_3",
            alignMenu: [-42,-62],
            menuAfterRotation: [950.56, 459.4],
            alignStairs: [850, 55],
            initAngle: Math.PI/180*80
        }
    ]
};

export {arrImg, initOpt, animation, textureObj, SMmenuCircle, XSmenuCircle, XLmenuCircle};