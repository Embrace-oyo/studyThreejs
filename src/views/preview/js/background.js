/**
 * justThreeJs background.js
 * @author kongjianqiu
 * @description
 * @created 2025/1/21 15:17:34
 */
import * as THREE from 'three'
import gsap from "gsap";
import Triangle from '@/views/preview/js/triangle'

export default class Background {
    mouseX = 0;
    mouseY = 0;
    mouseOldX = 0;
    mouseOldY = 0;
    triangleWidth = 21;
    triangleHeight = 27;
    speedTrailAppear = 0.1;
    speedTrailDisappear = 0.1;
    speedTriOpen = 1;
    trailMaxLength = 18;
    trailIntervalCreation = 100;
    delayBeforeDisappear = 2;
    cols;
    rows;
    tris;
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

    constructor(config) {
        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.initCanvas()
        this.start();
        this.resize()
    }

    initCanvas() {
        this.ctx = this.target.getContext('2d')
        this.cols = Math.floor(this.width / this.triangleWidth);
        this.cols = (this.cols % 2) ? this.cols : this.cols - 1; // => keep it odd
        this.rows = Math.floor(this.height / this.triangleHeight) * 2;
        this.triangles = [];
        gsap.ticker.add(() => this.draw())
    }

    start() {
        for (let j = 0; j < this.rows; j++) {
            for (let i = 0; i < this.cols; i++) {
                let pos = i + (j * this.cols);
                let triangle = new Triangle({
                    pos,
                    column: i,
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
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.createTrail(), this.trailIntervalCreation);
    }

    draw(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.triangles.length; i++) {
            this.triangles[i].draw();
        }
    }

    createTrail() {
        for (let i = 0; i < this.triangles.length; i++) {
            this.triangles[i].selectedForTrail = false;
        }
        let trailLength = Math.floor(Math.random() * this.trailMaxLength - 2) + 2;
        let index = Math.round(Math.random() * this.triangles.length);
        let startTri = this.triangles[index];
        startTri.selectedForTrail = true;
        let currentTri = {
            tri: startTri,
            openDir: "side",
            closeDir: "side"
        };
        for (let i = 0; i < trailLength; i++) {
            let o = this.getNeighbour(currentTri.tri);
            let opacity = 1;
            if (this.randomAlpha) {
                opacity = (Math.random() < .8) ? Math.random() * .5 : 1;
            } else {
                opacity = 1;
            }
            if (o != null) {
                o.tri.selectedForTrail = true;
                currentTri.tri.closeDir = o.openDir;
                currentTri.tri.open(currentTri.openDir, this.speedTriOpen, opacity, i * this.speedTrailAppear);
                currentTri.tri.close(currentTri.closeDir, 1, this.delayBeforeDisappear + i * this.speedTrailDisappear);
                currentTri = o;
            } else {
                currentTri.tri.open(currentTri.openDir, this.speedTriOpen, opacity, (i + 1) * this.speedTrailAppear);
                currentTri.tri.close(currentTri.closeDir, 1, this.delayBeforeDisappear + (i + 1) * this.speedTrailDisappear);
                break;
            }
        }
    }

    shuffleArray(o) {
        for (let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
        return o;
    }

    getNeighbour(t) {
        this.shuffleArray(this.neighbours);
        for (let i = 0; i < this.neighbours.length; i++) {
            if (this.neighbours[i] === "top") {
                if (this.triangles[t.pos - this.cols] && t.row !== 0 && !this.triangles[t.pos - this.cols].selectedForTrail && !this.triangles[t.pos - this.cols].opened) {
                    return {
                        tri: this.triangles[t.pos - this.cols],
                        openDir: "top",
                        closeDir: "top"
                    };
                }

            } else if (this.neighbours[i] === "bottom") {
                if (this.triangles[t.pos + this.cols] && t.row !== this.rows - 1 && !this.triangles[t.pos + this.cols].selectedForTrail && !this.triangles[t.pos + this.cols].opened) {
                    return {
                        tri: this.triangles[t.pos + this.cols],
                        openDir: "bottom",
                        closeDir: "top"
                    };
                }
            } else {
                if (this.triangles[t.pos + 1] && t.isLeft && t.col !== this.cols - 1 && !this.triangles[t.pos + 1].selectedForTrail && !this.triangles[t.pos + 1].opened) {
                    return {
                        tri: this.triangles[t.pos + 1],
                        openDir: "side",
                        closeDir: "top"
                    };
                } else if (this.triangles[t.pos - 1] && !t.isLeft && t.col !== 0 && !this.triangles[t.pos - 1].selectedForTrail && !this.triangles[t.pos - 1].opened) {
                    return {
                        tri: this.triangles[t.pos - 1],
                        openDir: "side",
                        closeDir: "top"
                    };
                }
            }
        }
        return null;
    }

    pause() {
    }

    closeAll() {
    }

    kill() {
    }


    resize() {
        window.addEventListener("resize", () => {
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            this.cols = Math.floor(this.width / this.triangleWidth);
            this.cols = (this.cols % 2) ? this.cols : this.cols - 1; // => keep it odd
            this.rows = Math.floor(this.height / this.triangleHeight) * 2;
        });
    }

}
