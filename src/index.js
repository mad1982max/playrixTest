import * as PIXI from 'pixi.js';
import {arrImg, initOpt, animation, textureObj, SMmenuCircle, XSmenuCircle, XLmenuCircle} from './initData';
import {easeOutSine, easeInQuart} from './easeFn';
import {DropShadowFilter} from '@pixi/filter-drop-shadow';
//import pixiSound from 'pixi-sound';

PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? "WebGL": "CANVAS");

let menuContainer = [];
menuContainer.counter = 0;
let scaleFactor = 1;
let windowRatio = 1;
let finishBuildStair = false;
let finalBuildFlag = false;
let initRatio = initOpt.initWidth/initOpt.initHeight;
let scaleAdd = 1;
let isFirstResize = true;
let appearAfterResizing = false;
let isFinish = false;
let dX = 0;
let dY = 0;
let menuCircleInit;
const alphaFilter = new PIXI.filters.AlphaFilter(1);
alphaFilter.resolution = 4;

const shadowFilter = new DropShadowFilter({rotation:-90, distance: 5, blur: 10, quality: 4, resolution: 4});
let resizeTimer = 0;

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
        this.container.filters = [alphaFilter];

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
        this.resources = resources;     
        
        let textureToLoadArr = ["bg", "austin", "ok", "hummer", "dec_1", "dec_2", "btn", "logo", "old"];

        for (let texture of textureToLoadArr) {
            this.insertTexture(texture, this.resources, this.container)
        }        

        let centerX = 0.5*(this.wrapper.offsetWidth/ scaleFactor / scaleAdd - this.btn.width - 2*dX/scaleFactor/ scaleAdd);

        this.btn.x = centerX;
        animation.logoAnimTime = Date.now();

        this.btn.on('tap', () => console.log('...download'));
        this.btn.on('click', () => console.log('...download'));

        this.ok.on('click', (e) => {
            this.changeStairs(e, this.resources);
        });
        this.ok.on('tap', (e) => {
            this.changeStairs(e, this.resources);
        });

        this.hummer.on('click', () => {
            this.hummer.visible = false;
            this.showMenu();
        })
        this.hummer.on('tap', () => {
            this.hummer.visible = false;
            this.showMenu();
        })

        this.createMenu(this.resources);            
        this.app.ticker.add(this.ticker.bind(this));
    }

    resizingCorection() {
        
        if(!isFinish && !animation.menuMovingFlag && !animation.menuMovingEnd) {
            menuContainer.forEach(item => {
                item.destroy(); 
                menuContainer = [];                       
            });
            this.createMenu(this.resources);

        }  else if (!isFinish && animation.menuMovingEnd) {
            menuContainer.forEach(item => {
                let currentStairs = menuCircleInit.stairs.find(val => val.nameStair === item.name);

                item.x = currentStairs.menuAfterRotation[0];
                item.y = currentStairs.menuAfterRotation[1]
                if(item.isChecked) {
                    this.ok.x = item.x - 70;
                    this.ok.y = item.y + 60;
                    this.newStairs.x = currentStairs.alignStairs[0];
                    this.newStairs.y = currentStairs.alignStairs[1];
                }
            })
        } else if (isFinish) {
            this.correctionPositionFinal(); 
        }
    }

    getScaleFactor() {
        return Math.min(
            this.wrapper.offsetWidth / initOpt.initWidth,
            this.wrapper.offsetHeight / initOpt.initHeight,
        )
    }

    resize() {

        clearTimeout(resizeTimer);
        alphaFilter.alpha = 0;
        windowRatio = (window.innerWidth / window.innerHeight).toFixed(2);
        console.log("windowRatio: ", windowRatio);
       
        scaleAdd = 1;
        dX = 0;
        dY = 0;

        if(windowRatio < 0.57) {
            this.wrapper.style.width = "100%";            
            scaleFactor = this.getScaleFactor();
            scaleAdd = 2.3;
            dX = -800 * scaleFactor;
            dY = 100* scaleFactor;
            menuCircleInit = XSmenuCircle;
            animation.rangeOfRotation = -Math.PI/180*173;

            if(isFirstResize) {                                
                textureObj.logo.y = -20;                
                textureObj.old.x = 550
                textureObj.hummer.x = 730;
                textureObj.hummer.y = 380;
                textureObj.dec_1.x = 820;
                textureObj.dec_1.y = 560;
                animation.logoTrack = 970;

            } else {
                textureObj.logo.y = -20;
                this.logo.position.set(360, -20);
                this.old.x = 550;
                this.hummer.position.set(730, 380);
                this.btn.y = 700;
                this.dec_1.position.set(820, 560);
                this.resizingCorection();                  
            }
            this.wrapper.style.height = `${scaleAdd * this.wrapper.offsetWidth / initRatio + dY}px`;

        } else if(windowRatio >= 0.57 && windowRatio < 1) {
            this.wrapper.style.width = "100%"
            scaleFactor = this.getScaleFactor();
            scaleAdd = 1.45;
            dX = -380* scaleFactor;
            dY = 30* scaleFactor;
            animation.logoTrack = 870;
            animation.rangeOfRotation = -Math.PI/180*150;
            menuCircleInit = SMmenuCircle;

            if(isFirstResize) {
                textureObj.logo.y = 0;
                textureObj.hummer.x = 920;
                textureObj.hummer.y = 400;
                textureObj.btn.y = 670;                           

            } else {
                this.logo.position.set(300, 0);
                this.old.position.set(735, 135);
                this.hummer.position.set(920, 400);
                this.btn.y = 670;
                this.dec_1.position.set(1020, 520);
                this.resizingCorection()  
            }
            this.wrapper.style.height = `${scaleAdd * this.wrapper.offsetWidth / initRatio + dY}px`;            

        } else if (windowRatio <= 1.43 && windowRatio >= 1) {
            this.wrapper.style.width = "100%"
            scaleFactor = this.getScaleFactor();

            menuCircleInit = XLmenuCircle;
            animation.rangeOfRotation = -Math.PI/180*172;
            this.wrapper.style.height = `${scaleAdd * this.wrapper.offsetWidth / initRatio + dY}px`;
            if(!isFirstResize) {
                this.logo.position.set(50, 20);
                this.old.position.set(735, 135);
                this.hummer.position.set(1020, 300);
                this.dec_1.position.set(1020,520);
                this.resizingCorection();  
            }
            this.wrapper.style.height = `${scaleAdd * this.wrapper.offsetWidth / initRatio + dY}px`;

        } else if (windowRatio > 1.43) {
            this.wrapper.style.height = "100vh";
            scaleFactor = this.getScaleFactor();

            menuCircleInit = XLmenuCircle;
            animation.rangeOfRotation = -Math.PI/180*172;
            if(!isFirstResize) {
                this.logo.position.set(50, 20);
                this.old.position.set(735, 135);
                this.hummer.position.set(1020, 300);
                this.dec_1.position.set(1020,520); 
                this.resizingCorection();  
            }
            this.wrapper.style.width = `${scaleAdd * this.wrapper.offsetHeight * initRatio + dX}px`;
        }       

        const newWidth = Math.ceil(initOpt.initWidth * scaleFactor);
        const newHeight = Math.ceil(initOpt.initHeight * scaleFactor);  
        
        this.app.resize(newWidth, newHeight);
        this.container.scale.set(scaleFactor * scaleAdd); 
        this.container.x = dX;
        this.container.y = dY;
        isFirstResize = false;
        resizeTimer = setTimeout(() => {
            appearAfterResizing = true;
        }, 500);       
    }
 
    createMenu(resources) {
        let menuNamesArr = menuCircleInit.stairs;
        for (let i = 0; i < menuNamesArr.length; i++) {
            let {initAngle, nameStair, nameMenu, alignMenu} = menuNamesArr[i];
            let y = menuCircleInit.centerY + menuCircleInit.R * Math.sin(initAngle); 
            let x = menuCircleInit.centerX + menuCircleInit.R * Math.cos(initAngle);
            let containerMenu = new PIXI.Container();
            containerMenu.sortableChildren = true;
            containerMenu.zIndex = 8;
            containerMenu.x = x;
            containerMenu.y = y;
            containerMenu.isChecked = false;
            containerMenu.name = nameStair;
            containerMenu.currentRotation = initAngle;
            containerMenu.initAngle = initAngle;
            containerMenu.speed = menuCircleInit.speed;

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
        const canvas = document.createElement('canvas');
        canvas.width  = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        const grd = ctx.createRadialGradient(r, r, 10, r, r, 60);
        grd.addColorStop(0, color1);
        grd.addColorStop(1, color2);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(r, r, r, 0, 2 * Math.PI);
        ctx.fill();
        const sprite = new PIXI.Sprite(PIXI.Texture.from(canvas));
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

    correctionPositionFinal() {        

        this.final_l2.height = this.wrapper.offsetHeight / scaleFactor;
        this.final_l2.y = -dY/scaleFactor;

        let ratioWidthFinal = this.final_l1.width/this.final_l1.height;
        let widthMulter = windowRatio >= 1 ? 0.6 : 0.9;
        let verticalMulter = windowRatio <= 0.57 ? 0.5 : 0.35;
        
        this.final_l1.width = this.wrapper.offsetWidth / scaleFactor / scaleAdd * widthMulter;
        this.final_l1.height= this.final_l1.width/ratioWidthFinal;

        let cY = verticalMulter * (this.wrapper.offsetHeight/ scaleFactor / scaleAdd - this.final_l1.height) - dY/ scaleFactor / scaleAdd /verticalMulter;
        let cX= 0.5*(this.wrapper.offsetWidth/ scaleFactor / scaleAdd - this.final_l1.width - 2*dX/scaleFactor/ scaleAdd);

        this.final_l1.position.set(cX, cY);
    }

    showFinal(resources) {

        let finalArr = ["final_l2", "final_l1"];
        for(let finalSceneTexture of finalArr) {
            this.insertTexture(finalSceneTexture, resources, this.container)
        }
        this.correctionPositionFinal();        
        finalBuildFlag = true;
    }

    recolorizeOldMenu() {
        menuContainer.forEach(item => {           
                let grd = item.children.find(val => val.name === 'grd');
                grd.destroy({children:true, texture:true, baseTexture:true});
                let grdCircle = this.createCircleGrad(60, "#FFF6DA", "#F6DBB6");  
                grdCircle.zIndex = 8;
                item.isChecked.false;
                item.addChild(grdCircle); 
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
        
        menuContainer.forEach(item => item.isChecked = false);

        let currentContainer = e.target;
        currentContainer.isChecked = true;
        this.colorizeChekedMenu(currentContainer);

        if(this.newStairs) {
            this.newStairs.destroy();
        }

        if(this.old) {
            this.container.removeChild(this.old);                        
        }          
                  
        this.ok.visible = true;
        this.ok.name = e.target.name;
        this.ok.alpha = 0;
        this.ok.shadeOut = true;
        this.ok.filters = [shadowFilter];        
        this.ok.position.set(currentContainer.x - 70, currentContainer.y + 60);
        let currentStair = menuCircleInit.stairs.find(item => item.nameStair === currentContainer.name);

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
            containerArr[i].x = menuCircleInit.centerX + Math.cos(-containerArr[i].currentRotation) * menuCircleInit.R;
            containerArr[i].y = menuCircleInit.centerY + Math.sin(containerArr[i].currentRotation) * menuCircleInit.R;
            containerArr[i].currentRotation += containerArr[i].speed;
            containerArr[i].speed *= menuCircleInit.acceleration;
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
        let centerX = 0.5*(this.wrapper.offsetWidth/ scaleFactor / scaleAdd - this.btn.width - 2*dX/scaleFactor/ scaleAdd);
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
            if (this.newStairs.y >= this.newStairs.initY || d >= animation.stairsDuration) {
                this.newStairs.y = this.newStairs.initY;
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
                animation.menuMovingEnd = true;
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
                isFinish = true;
                return;
            }
            if (this.final_l2.alpha >= 0.8) this.final_l2.increment = 0;
            if (this.final_l1.alpha >= 1) this.final_l1.increment = 0;
            this.final_l1.alpha += this.final_l1.increment;
            this.final_l2.alpha += this.final_l2.increment;
        }
    }

    afterResizingAppearance() {
        if(appearAfterResizing) {
            alphaFilter.alpha += 0.03;
            if(alphaFilter.alpha >= 1) {
                appearAfterResizing = false;
            }
        }
    }

    ticker() {    
        this.afterResizingAppearance();    
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