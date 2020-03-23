import * as PIXI from 'pixi.js';
import {arrImg, initOpt, animation, menuCircle, textureObj} from './initData';
import {easeOutSine, easeInQuart} from './easeFn';

PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? "WebGL": "CANVAS");

let menuContainer = [];
menuContainer.counter = 0;
let scaleFactor = 1;
let finishBuildStair = false;
let finalBuildFlag = false;
let initRatio = initOpt.initWidth/initOpt.initHeight;

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
            .load(this.loader.bind(this));        
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
        let textureToLoadArr = ["bg", "austin", "ok", "hummer", "dec_1", "dec_2", "btn", "logo", "old"];

        for (let texture of textureToLoadArr) {
            this.insertTexture(texture, resources, this.container)
        }
        
        let centerX = Math.floor(0.5*(this.app.view.width/scaleFactor/this.options.resolution - this.btn.width));
        this.btn.x = centerX;

        animation.logoAnimTime = Date.now();

        this.btn.on('tap', () => console.log('continue'));
        this.btn.on('click', () => console.log('continue'));

        this.ok.on('click', (e) => {
            this.changeStairs(e, resources);
        });
        this.ok.on('tap', (e) => {
            this.changeStairs(e, resources);
        });

        this.hummer.on('click', () => {
            this.hummer.visible = false;
            this.showMenu();
        })
        this.hummer.on('tap', () => {
            this.hummer.visible = false;
            this.showMenu();
        })

        this.createMenu(resources);            
        this.app.ticker.add(this.ticker.bind(this));

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

    
    createMenu(resources) {
        let menuNamesArr = menuCircle.stairs;
        for (let i = 0; i < menuNamesArr.length; i++) {
            let {initAngle, nameStair, nameMenu, alignMenu} = menuNamesArr[i];
            let y = menuCircle.centerY + menuCircle.R * Math.sin(initAngle); 
            let x = menuCircle.centerX + menuCircle.R * Math.cos(initAngle);
            let containerMenu = new PIXI.Container();
            containerMenu.sortableChildren = true;
            containerMenu.zIndex = 8;
            containerMenu.x = x;
            containerMenu.y = y;
            containerMenu.isChecked = false;
            containerMenu.name = nameStair;
            containerMenu.currentRotation = initAngle;
            containerMenu.initAngle = initAngle;
            containerMenu.speed = menuCircle.speed;

            let whiteCircle = new PIXI.Graphics();
            whiteCircle.beginFill(0xffffff);
            whiteCircle.drawCircle(0,0, 80);
            whiteCircle.endFill();
            whiteCircle.name = "border";
            whiteCircle.zIndex = 7;
            containerMenu.addChild(whiteCircle);

            let grdCircle = this.createCircleGrad(60, "#FFF6DA", "#F6DBB6");  
            grdCircle.zIndex = 9;
            containerMenu.addChild(grdCircle);

            let mask = new PIXI.Graphics();
            mask.beginFill(0xffffff);
            mask.drawCircle(0,0, 67);
            mask.endFill();
            mask.name = "mask";
            mask.zIndex = 8;
            containerMenu.addChild(mask);

            containerMenu.interactive = true;
            containerMenu.mask = mask;
            containerMenu.buttonMode = true;
            containerMenu.on('click', (e) => this.clickOnMenu.call(this, e, resources));
            containerMenu.on('tap', (e) => this.clickOnMenu.call(this, e, resources));
              
            this.container.addChild(containerMenu);              

            let menu_ex = new PIXI.Sprite(resources[nameMenu].texture);
            menu_ex.name = "texture";
            menu_ex.position.set(alignMenu[0],alignMenu[1]);            
            menu_ex.zIndex = 9;

            containerMenu.addChild(menu_ex);
            menuContainer.push(containerMenu); 
        }
    }

    createCircleGrad(r, color1, color2) {
        var canvas = document.createElement('canvas');
        canvas.width  = 200;
        canvas.height = 200;
        var ctx = canvas.getContext('2d');
        var grd = ctx.createRadialGradient(r, r, 10, r, r, 60);
        grd.addColorStop(0, color1);
        grd.addColorStop(1, color2);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(r, r, r, 0, 2 * Math.PI);
        ctx.fill();
        var sprite = new PIXI.Sprite(PIXI.Texture.from(canvas));
        sprite.name = "grd";
        sprite.x = -r;
        sprite.y = -r;
        return sprite;
    }

    changeStairs(e, resources) {
        finishBuildStair = true;
        this.ok.visible = false;
        this.showFinal(resources);
    }

    showFinal(resources) {
        let finalArr = ["final_l2", "final_l1"];

        for(let finalSceneTexture of finalArr) {
            this.insertTexture(finalSceneTexture, resources, this.container)
        }

        this.final_l2.height = this.app.view.height/scaleFactor/this.options.resolution;

        let centerXfinal = Math.floor(0.5*(this.app.view.width/scaleFactor/this.options.resolution-this.final_l1.width));
        let centerYfinal = Math.floor(0.5*(this.app.view.height/scaleFactor/this.options.resolution-this.final_l1.height));
        this.final_l1.position.set(centerXfinal,centerYfinal);
        
        finalBuildFlag = true;
    }

    recolorizeOldMenu() {
        menuContainer.forEach(item => {           
            if(item.isChecked) {               
                let grd = item.children.find(val => val.name === 'grd');
                grd.destroy({children:true, texture:true, baseTexture:true});
                let grdCircle = this.createCircleGrad(60, "#FFF6DA", "#F6DBB6");  
                grdCircle.zIndex = 8;
                item.isChecked.false;
                item.addChild(grdCircle); 
            }
        })
    }

    colorizeChekedMenu(currentContainer) {
        this.recolorizeOldMenu();
        let grd = currentContainer.children.find(val => val.name === 'grd');
        grd.destroy();
        let grdCircle = this.createCircleGrad(60, "#d7f7ba", "#86e830");  
        grdCircle.zIndex = 8;
        currentContainer.isChecked = true;
        currentContainer.addChild(grdCircle);            
    }

    clickOnMenu(e, resources) {
        let currentContainer = e.target;
        currentContainer.isChecked = true;

        if(this.newStairs) {
            this.newStairs.destroy();
        }

        if(this.old) {
            this.container.removeChild(this.old);
                        
        }
        
        this.colorizeChekedMenu(currentContainer);       
                  
        this.ok.visible = true;
        this.ok.name = e.target.name;
        this.ok.alpha = 0;
        this.ok.shadeOut = true;        
        this.ok.position.set(currentContainer.x - 70, currentContainer.y + 65);

        let currentStair = menuCircle.stairs.find(item => item.nameStair === currentContainer.name);

        this.newStairs = new PIXI.Sprite(resources[e.target.name].texture);
        this.newStairs.isCreated = true;
        animation.buildAnimTime = new Date();
        this.newStairs.initX = currentStair.alignStairs[0];
        this.newStairs.initY = currentStair.alignStairs[1];
        this.newStairs.position.set(currentStair.alignStairs[0], animation.stairsStart);
        this.newStairs.zIndex = 2;
        this.newStairs.alpha = 0;
        this.newStairs.animationEnd = false;
        this.container.addChild(this.newStairs);      
    }

    showMenu() {
        animation.menuMovingFlag = true;
    }

    menuMovingCircle(containerArr) {
        
        for(let i = 0; i < containerArr.length; i++) {
            containerArr[i].x = menuCircle.centerX + Math.cos(-containerArr[i].currentRotation) * menuCircle.R;
            containerArr[i].y = menuCircle.centerY + Math.sin(containerArr[i].currentRotation) * menuCircle.R;
            containerArr[i].currentRotation += containerArr[i].speed;
            containerArr[i].speed *= menuCircle.acceleration;
        }
    }

    btnMoving() {
        if(this.btn.curentRatio > this.btn.rangeRatio) {
            this.btn.increaseFlag = false
        } else if (this.btn.curentRatio < 1){
            this.btn.increaseFlag = true
        }

        let multer = this.btn.increaseFlag ? this.btn.pace : 1/this.btn.pace
        this.btn.curentRatio *= multer;
        this.btn.scale.set(this.btn.curentRatio.toFixed(3));
        let centerX = Math.floor(0.5*(this.app.view.width/scaleFactor/this.options.resolution-this.btn.width));
        this.btn.x = centerX;         
    }

    okAppear() {
        if(this.ok.shadeOut) {
            this.ok.alpha += this.ok.alphaSpeed
            if(this.ok.alpha > 1) {
                this.ok.shadeOut = false;                
            }
        }
    }

    newStairsAppear() {
        if (this.newStairs && this.newStairs.isCreated && !this.newStairs.animationEnd) {
            let currentTime = Date.now();
            let d = currentTime - animation.buildAnimTime;
            if (this.newStairs.alpha < 1) this.newStairs.alpha +=0.05;
            if (d >= animation.stairsDuration) {
                this.newStairs.animationEnd = true;
                return
            }                        
            this.newStairs.y = Math.floor(easeInQuart(d, animation.stairsStart, this.newStairs.initY - animation.stairsStart, animation.stairsDuration));
            
        }
    }

    menuAppear() {
        if (animation.menuMovingFlag) {
            this.menuMovingCircle(menuContainer);
            let {currentRotation, initAngle} = menuContainer[0];
           
            if(currentRotation - initAngle <=  animation.rangeOfRotation) {
                animation.menuMovingFlag = false;                
            }
        }
    }

    logoAppear() {

        if(!this.logo.animationEnd) {           
            let currentTime = Date.now();
            let d = currentTime - animation.logoAnimTime;            
            this.logo.x = easeOutSine(d, animation.logoStart, animation.logoTrack, animation.logoDuration);

            if (d >= animation.logoDuration) {
                this.logo.animationEnd = true;
                this.hummer.visible = true;
            }
        }
    }

    hummerAppear() {
        if(this.hummer.visible && this.hummer.alpha < 1) this.hummer.alpha += this.hummer.alphaPace;
    }

    finishedBuildStair() {
        if(finishBuildStair) {
            
            if (menuContainer.counter === menuContainer.length) {
                finishBuildStair = false;
                return;
            }
            menuContainer.forEach(item => {
                if(item.alpha <=0) {
                    item.destroy();
                    menuContainer.counter++;
                }
                item.alpha -= 0.05
            });            
            this.btn.pace = 1.01;
        }        
    }

    finalAppear() {
        if (finalBuildFlag) {
            if (this.final_l2.alpha >= this.final_l2.edgeAlpha && this.final_l1.alpha >= 1) {
                finalBuildFlag = false;
                return
            }
            if (this.final_l2.alpha >= 0.8) this.final_l2.increment = 0;
            if (this.final_l1.alpha >= 1) this.final_l1.increment = 0;
            this.final_l1.alpha += this.final_l1.increment;
            this.final_l2.alpha += this.final_l2.increment;
        }
    }

    ticker() {        
        this.okAppear();
        this.btnMoving();
        this.newStairsAppear();
        this.menuAppear();
        this.logoAppear();
        this.hummerAppear(); 
        this.finishedBuildStair();
        this.finalAppear();        
    }

}

const game = new GameArea();