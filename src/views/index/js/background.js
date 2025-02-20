/**
 * justThreeJs background.js
 * @author kongjianqiu
 * @description
 * @created 2025/1/21 15:17:34
 */
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import gsap from "gsap";
import Triangle from '@/views/index/js/triangle'

export default class Background {
    mouseX = 0;
    mouseY = 0;
    mouseOldX = 0;
    mouseOldY = 0;
    triangleWidth = 21;
    triangleHeight = 27;
    speedTriangleAppear = 0.1;
    speedTriangleDisappear = 0.1;
    speedTriangleOpen = 1;
    triangleMaxLength = 18;
    triangleIntervalCreation = 100;
    delayBeforeDisappear = 2;
    cols = 0;
    rows = 0;
    triangles = [];
    randomAlpha = true;
    neighbours = ["side", "top", "bottom"];
    colors = [
        //oranges
        '#eb9000', '#f6b400', //'#f5cb00', '#fbde1a', '#feeb31', '#fff163',
        //reds
        '#440510', '#8a0a08', //'#c11e1f', '#e52822', '#f43d0d', '#fb5c28', '#ff8547',
        //greens
        '#05391e', '#004b25', //'#006d3c', '#059849', '#15ae44', '#52b933', '#78c340', '#b2cd53',
        //blues
        '#0c1a36', '#01235d', '#0b3f7a', '#0561a6', '#007ecb', '#32b2fa', '#54cefc', '#91dffa'
    ];
    interval = null;

    constructor() {
        this.initCanvas()
        this.start();
        // this.initGUI()
    }

    initCanvas() {
        this.parent = document.getElementById('preview');
        this.canvas = document.getElementById('canvas');
        this.width = this.canvas.width = this.parent.scrollWidth;
        this.height = this.canvas.height = this.parent.scrollHeight;
        this.ctx = this.canvas.getContext('2d')
        this.initParams();
        gsap.ticker.add(() => this.draw())
        this.resize()
    }

    initParams() {
        this.cols = Math.floor(this.width / this.triangleWidth);
        this.cols = (this.cols % 2) ? this.cols : this.cols - 1; // => keep it odd
        this.rows = Math.floor(this.height / this.triangleHeight) * 2;
        this.triangles = [];
    }

    initGrid() {
        for (let j = 0; j < this.rows; j++) {
            for (let i = 0; i < this.cols; i++) {
                let pos = i + (j * this.cols);
                let triangle = new Triangle({
                    pos: pos,
                    col: i,
                    row: j,
                    triangleWidth: this.triangleWidth,
                    triangleHeight: this.triangleHeight,
                    colors: this.colors,
                    ctx: this.ctx
                });
                this.triangles.push(triangle);
                triangle.draw();
            }
        }
    }

    start() {
        if (this.interval) clearInterval(this.interval);
        this.initParams();
        this.initGrid();
        this.createTriangle();
        this.interval = setInterval(() => {
            this.createTriangle()
        }, this.triangleIntervalCreation);
    }

    shuffleArray(o) {
        for (let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
        return o;
    }

    getNeighbour(t) {
        this.shuffleArray(this.neighbours);
        for (let i = 0; i < this.neighbours.length; i++) {
            if (this.neighbours[i] === 'top') {
                if (t.row !== 0 && !this.triangles[t.pos - this.cols].selectedForTrail && !this.triangles[t.pos - this.cols].opened) return {
                    triangle: this.triangles[t.pos - this.cols],
                    openDir: "top",
                    closeDir: "top"
                };
            } else if (this.neighbours[i] === 'bottom') {
                if (t.row !== this.rows - 1 && !this.triangles[t.pos + this.cols].selectedForTrail && !this.triangles[t.pos + this.cols].opened) return {
                    triangle: this.triangles[t.pos + this.cols],
                    openDir: "bottom",
                    closeDir: "top"
                };
            } else if (this.neighbours[i] === 'side') {
                if (t.isLeft && t.col !== this.cols - 1 && !this.triangles[t.pos + 1].selectedForTrail && !this.triangles[t.pos + 1].opened) {
                    return {
                        triangle: this.triangles[t.pos + 1],
                        openDir: "side",
                        closeDir: "top"
                    };
                }
                if (!t.isLeft && t.col !== 0 && !this.triangles[t.pos - 1].selectedForTrail && !this.triangles[t.pos - 1].opened) {
                    return {
                        triangle: this.triangles[t.pos - 1],
                        openDir: "side",
                        closeDir: "top"
                    };
                }
            }
        }
        return null;
    }

    createTriangle() {
        for (let i = 0; i < this.triangles.length; i++) {
            this.triangles[i].selectedForTrail = false;
        }
        let triangleLength = Math.floor(Math.random() * this.triangleMaxLength - 2) + 2;
        let index = Math.round(Math.random() * this.triangles.length);
        let startTriangle = this.triangles[index];
        startTriangle.selectedForTrail = true;
        let currentTriangle = {
            triangle: startTriangle,
            openDir: "side",
            closeDir: "side"
        };
        for (let i = 0; i < triangleLength; i++) {
            let opacity = this.randomAlpha ? (Math.random() < .8 ? Math.random() * .5 : 1) : 1;
            let o = this.getNeighbour(currentTriangle.triangle)
            if (o != null) {
                o.triangle.selectedForTrail = true;
                currentTriangle.triangle.closeDir = o.openDir;
                currentTriangle.triangle.open(currentTriangle.openDir, this.speedTriangleOpen, opacity, i * this.speedTriangleAppear);
                currentTriangle.triangle.close(currentTriangle.closeDir, 1, this.delayBeforeDisappear + i * this.speedTriangleDisappear);
                currentTriangle = o;
            } else {
                currentTriangle.triangle.open(currentTriangle.openDir, this.speedTriangleOpen, opacity, (i + 1) * this.speedTriangleAppear);
                currentTriangle.triangle.close(currentTriangle.closeDir, 1, this.delayBeforeDisappear + (i + 1) * this.speedTriangleDisappear);
                break;
            }
        }
    }

    initGUI() {
        this.gui = new GUI({container: this.parent});
        this.gui.domElement.style.position = 'absolute'
        this.gui.domElement.style.right = '0'
        this.gui.domElement.style.top = '0'
        this.gui.domElement.style.zIndex = '999'
        this.gui.add(this, 'triangleWidth', 10, 50, 1).name('Triangle Width').onFinishChange(() => this.start());
        this.gui.add(this, 'triangleHeight', 10, 50, 1).name('Triangle Height').onFinishChange(() => this.start());
        this.gui.add(this, 'triangleMaxLength', 2, 40, 1).name('Triangle MaxLength').onFinishChange(() => this.start());
        this.gui.add(this, 'triangleIntervalCreation', 100, 1000, 100).name('Triangle Creation delay').onFinishChange(() => this.start());
        this.gui.add(this, 'delayBeforeDisappear', 0.02, 4, 0.01).name('Disappear delay').onFinishChange(() => this.start());
        this.gui.add(this, 'randomAlpha').name('Random Opacity').onFinishChange(() => this.start());
        this.gui.add(this, 'pause').name('Pause');
        this.gui.add(this, 'closeAll').name('closeAll');
        this.gui.add(this, 'kill').name('Kill');
        this.gui.add(this, 'start').name('Restart');
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.triangles.length; i++) {
            this.triangles[i].draw();
        }
    }

    pause() {
        if (this.interval) clearInterval(this.interval);
        for (let i = 0; i < this.triangles.length; i++) {
            if (this.triangles[i].tweenClose) this.triangles[i].tweenClose.kill();
        }
    }
    closeAll(){
        let count = 0;
        if (this.interval) clearInterval(this.interval);
        for (let i = 0; i < this.triangles.length; i++) {
            if (this.triangles[i].tweenOpen) this.triangles[i].tweenOpen.kill();
            if (this.triangles[i].opened || this.triangles[i].opening) {
                count++;
                this.triangles[i].close("top", .8, .2 + .0015 * count);
            }
        }
    }
    kill(){
        if (this.interval) clearInterval(this.interval);
        for (let i = 0; i < this.triangles.length; i++) {
            gsap.killTweensOf(this.triangles[i]);
            this.triangles[i].alpha = 0;
        }
    }

    resize() {
        window.addEventListener("resize", () => {
            this.canvas.width = this.parent.offsetWidth;
            this.canvas.height = this.parent.offsetHeight;
            this.width = this.canvas.width = this.parent.scrollWidth;
            this.height = this.canvas.height = this.parent.scrollHeight;
            this.start()
        });
    }

}
