import * as PIXI from 'pixi.js';
import {arrImg, initOpt} from './initData';

PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? "WebGL": "CANVAS");


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
        visible: false,
        zIndex: 8,
        buttonMode: true,
        interActive: true
    }, 
    hummer: {
        name: "hummer",
        position: [1020,300],
        alpha: 1,
        visible: true,
        alphaPace: 0.03,
        zIndex: 3,
        buttonMode: true,
        interActive: true
    },
    dec_1: {
        name: "dec_1",
        position: [1020,520],
        zindex: 3,

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
        position: [735,135],
        zIndex: 2
    },
    btn: {
        buttonMode: true,
        interactive: true,
        pace: 1.002,
        increaseFlag: true,
        curentRatio: 1,
        rangeRatio: 1.15,
        zIndex: 10,
    }



}

let initRatio = initOpt.initWidth/initOpt.initHeight;
let scaleFactor = 1;

class GameArea {
    constructor() {
        this.wrapper = document.getElementById('wrapper');

        this.options = {
            width: this.wrapper.clientWidth, 
            height: this.wrapper.clientHeight,
            antialias: true,
            transparent: false,
            resizeTo: this.wrapper,
            autoResize: true,
            resolution: window.devicePixelRatio || 1
        };

        this.app = new PIXI.Application(this.options);        

        this.container = new PIXI.Container();
        this.container.sortableChildren = true;
        

        this.wrapper.append(this.app.view);
        this.app.stage.addChild(this.container);

        window.addEventListener('resize', this.resize.bind(this));
        this.resize();      
        

        this.app.loader
            .add(arrImg)
            .on('error', (e) => console.log('error:', e.message))
            .load(this.loader.bind(this)) 
        
        
    }

    insertTexture(name, resources, parent) {
        let texture = textureObj[name];
        let keys = Object.keys(texture);
        this[name] = new PIXI.Sprite(resources[name].texture);        
        
        for (const element of keys) {
            switch(element) {
                case 'scale':
                case 'position':
                    this[name][element].set(...texture[element]);
                    break;
                default:
                    this[name][element] = texture[element]
            }  
        }
        parent.addChild(this[name])
        
    }

    loader(loader, resources) {
        //console.log('resources', resources);

        this.insertTexture("bg", resources, this.container);
        this.insertTexture("austin", resources, this.container);
        this.insertTexture("ok", resources, this.container);
        this.insertTexture("hummer", resources, this.container);
        this.insertTexture("dec_1", resources, this.container);
        this.insertTexture("dec_2", resources, this.container);
        this.insertTexture("btn", resources, this.container);
        this.insertTexture("old", resources, this.container);

    }

    resize() {
        this.wrapper.style.height = `${this.wrapper.offsetWidth / initRatio}px`;
        
        scaleFactor = Math.min(
            this.wrapper.offsetWidth / initOpt.initWidth,
            this.wrapper.offsetHeight / initOpt.initHeight,
        )

        const newWidth = Math.ceil(initOpt.initWidth * scaleFactor);
        const newHeight = Math.ceil(initOpt.initHeight * scaleFactor);  
        
        this.app.resize(newWidth, newHeight);
        this.container.scale.set(scaleFactor); 
    }

    



    // resize() {
    //     console.log(window.innerWidth, window.innerHeight);

    //     // this.app.renderer.resize(window.innerWidth, window.innerHeight);

    //     if(window.innerWidth > window.innerHeight) {
    //         console.log('w > h');
            
    //     } else {
    //         console.log('h > w');
    //         if(window.innerWidth <= 320) {
    //             initPosition.bg.point = [-800, -240]
    //             initPosition.bg.scale = 0.55
    //             console.log(this.wrapper.style.width );
    //             if(window.innerHeight >= 567) {
    //                 this.wrapper.style.height = `568px`;
    //             }
    //         }
            
            
    //     }



    

                
        
    // }
}

const game = new GameArea();