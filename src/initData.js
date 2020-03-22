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
    }
];

let initOpt = {
    initWidth: 1240,
    initHeight: 870,
};

let animation = {
    logoAnimTime: null,
    logoDuration: 1000,
    logoStart: -600,
    logoTrack: 650,
    stairsStart: -100,
    stairsDuration: 300,
    buildAnimTime: null,
    menuMovingFlag: false,
    rangeOfRotation: -Math.PI/180*170,
    btnPace: 1.002,
    btnCurentRatio: 1,
    btnRangeRatio: 1.15,
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
        zIndex: 8,
        buttonMode: true,
        interactive: true
    }, 
    hummer: {
        name: "hummer",
        position: [1020,300],
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
        position: [-400,25],
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

let menuCircle = {
    speed: -0.05,
    acceleration: 1.035,
    centerX: 1100,
    centerY: 550,
    R: 410,
    direction: 1,
    stairs: [
        {
            nameMenu: "menu_ex1",
            nameStair: "new_1",
            alignMenu: [-40,-100],
            alignStairs: [835, 90],
            initAngle: Math.PI/180*30
        },
        {
            nameMenu: "menu_ex2",
            nameStair: "new_2",
            alignMenu: [-40,-135],
            alignStairs: [835, 100],
            initAngle: Math.PI/180*55
        },
        {
            nameMenu: "menu_ex3",
            nameStair: "new_3",
            alignMenu: [-42,-62],
            alignStairs: [850, 55],
            initAngle: Math.PI/180*80
        }
    ],
    rangeAngle: Math.PI/180*60
};

export {arrImg, initOpt, animation, menuCircle, textureObj};