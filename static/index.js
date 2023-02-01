// index.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const textColor = getComputedStyle(document.body).getPropertyValue("--text-color");
const fontFamily = getComputedStyle(document.body).getPropertyValue("--font-family")
const highlightColor = getComputedStyle(document.body).getPropertyValue("--highlight-color")
// const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597];
const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
const fibSum = [0, 1, 2, 4, 7, 12, 20, 33, 54, 88]
const fibX = [0, 0, -1, 0, 3, -1, -6, 2, 15, -6]
const fibY = [0, 1, 0, -1, 1, 4, -1, -9, 4, 25]
const AnWinX = 1000;
const AnWinY = AnWinX * 34/55;
const scale = AnWinX / 55;
// const scale = 1;
const AnWinCx = AnWinX / 2;
const AnWinCy = AnWinY / 2;
const timeStep = 1000;

class fibBox {
    constructor(i, x, y, flip) {
        this.i = i;
        this.val = fib[i];
        this.x = x;
        this.y = y;
        this.cx = x - this.val*scale/2;
        this.cy = y - this.val*scale/2;
        this.dx = 0;
        this.dy = 0;
        this.s = 1;
        this.flip = flip;
        this.size = this.val * scale
        this.class = `box-${this.i}`
    }
    display() {
        const box = d3.select(".workspace")
            .append("g")
            .classed(this.class, true)
        box.append("rect") 
            .attr("x", this.cx)
            .attr("y", this.cy)
            .attr("width", this.size)
            .attr("height", this.size)
            .attr("stroke", textColor)
            .attr("fill", "#00000000")
        if (this.flip) {
            box.append("line")
                .attr("x1", this.cx + this.size)
                .attr("y1", this.cy)
                .attr("x2", this.cx)
                .attr("y2", this.cy + this.size)
                .attr("stroke", textColor)
        } else {
            box.append("line")
                .attr("x1", this.cx)
                .attr("y1", this.cy)
                .attr("x2", this.cx + this.size)
                .attr("y2", this.cy + this.size)
                .attr("stroke", textColor)
        }
        box.append("text")
            .attr("x", this.cx + this.size/2)
            .attr("y", this.cy + this.size/2)
            .attr("fill", highlightColor)
            .attr("font", fontFamily)
            .text(`${this.val}:${this.i}`)
        
        for (let j = 0; j < this.val - 1; j++) {
            box.append("line")
                .attr("x1", this.cx + this.size/this.val*(j+1))
                .attr("y1", this.cy)
                .attr("x2", this.cx + this.size/this.val*(j+1))
                .attr("y2", this.cy + this.size)
                .attr("stroke", textColor + "20")
            box.append("line")
                .attr("x1", this.cx)
                .attr("y1", this.cy + this.size/this.val*(j+1))
                .attr("x2", this.cx + this.size)
                .attr("y2", this.cy + this.size/this.val*(j+1))
                .attr("stroke", textColor + "20")
        }
    }
    transform(dx, dy, ds, dur, del) {
        this.s = this.s*ds
        this.dx += dx*this.s*scale-(this.x*ds-this.x);
        this.dy += dy*this.s*scale-(this.y*ds-this.y);
        this.x = this.x*ds;
        this.y = this.y*ds;        

        d3.select(`.${this.class}`)
            .transition()
            .duration(dur)
            .delay(del)
            .attr("transform", `matrix(${this.s} 0 0 ${this.s} ${this.dx} ${this.dy})`)
        
        this.cx = this.x - this.val;
        this.cy = this.y - this.val;
    }
}

class fibBox2 {
    constructor(i, cx, cy, flip) {
        this.i = i;
        this.cx = cx;
        this.cy = cy;
        this.val = fib[i];
        this.size = this.val * scale;
        this.x = cx - this.size / 2;
        this.y = cy - this.size / 2;
        this.dx = 0;
        this.dy = 0;
        this.scale = 1;
        this.flip = flip;
        this.class = `box-${this.i}`
    }
    display() {
        const box = d3.select(".workspace")
            .append("g")
            .classed(this.class, true)
        box.append("rect") 
            .attr("x", this.x)
            .attr("y", this.y)
            .attr("width", this.size)
            .attr("height", this.size)
            .attr("stroke", textColor)
            .attr("fill", "#00000000")
        if (this.flip) {
            box.append("line")
                .attr("x1", this.x + this.size)
                .attr("y1", this.y)
                .attr("x2", this.x)
                .attr("y2", this.y + this.size)
                .attr("stroke", textColor)
        } else {
            box.append("line")
                .attr("x1", this.x)
                .attr("y1", this.y)
                .attr("x2", this.x + this.size)
                .attr("y2", this.y + this.size)
                .attr("stroke", textColor)
        }
        box.append("text")
            .attr("x", this.x + this.size/2)
            .attr("y", this.y + this.size/2)
            .attr("fill", highlightColor)
            .attr("font", fontFamily)
            .text(`${this.val}:${this.i}`)
        
        for (let j = 0; j < this.val - 1; j++) {
            box.append("line")
                .attr("x1", this.x + this.size/this.val*(j+1))
                .attr("y1", this.y)
                .attr("x2", this.x + this.size/this.val*(j+1))
                .attr("y2", this.y + this.size)
                .attr("stroke", textColor + "20")
            box.append("line")
                .attr("x1", this.x)
                .attr("y1", this.y + this.size/this.val*(j+1))
                .attr("x2", this.x + this.size)
                .attr("y2", this.y + this.size/this.val*(j+1))
                .attr("stroke", textColor + "20")
        }
    }
}

async function clear() {
    d3.select(".workspace")
        .selectAll("g")
        .remove()
}

async function setup() {
    const container = d3.select(".animation")
        .append("svg")
        .classed("container", true)
        .attr("height", AnWinY)
        .attr("width", AnWinX)
    container.append("g")
        .classed("animationBorder", true)
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", AnWinY)
        .attr("width", AnWinX)
        .attr("stroke", textColor)
        .attr("fill", "#00000000")
    container.append("g")
        .classed("workspace", true)
}

async function sequence() {
    clear();
    d3.select(".workspace")
        .append("line")
        .attr("x1", AnWinCx)
        .attr("y1", 0)
        .attr("x2", AnWinCx)
        .attr("y2", AnWinY)
        .attr("stroke", highlightColor)
    d3.select(".workspace")
        .append("line")
        .attr("x1", 0)
        .attr("y1", AnWinCy)
        .attr("x2", AnWinX)
        .attr("y2", AnWinCy)
        .attr("stroke", highlightColor)
    for (let i = 1; i < 7; i++) {
        let box = new fibBox2(i, AnWinCx, AnWinCy, i % 2);
        box.display();
        console.log(i, box.cx, box.x);
    }
}

async function test() {
    clear();
    d3.select(".workspace")
        .append("line")
        .attr("x1", AnWinCx)
        .attr("y1", 0)
        .attr("x2", AnWinCx)
        .attr("y2", AnWinY)
        .attr("stroke", highlightColor)
    d3.select(".workspace")
        .append("line")
        .attr("x1", 0)
        .attr("y1", AnWinCy)
        .attr("x2", AnWinX)
        .attr("y2", AnWinCy)
        .attr("stroke", highlightColor)

    const dxTest =[
        [0, 0, -1, 3/2, 5/2, 0],
        [0, 0, -1, 3/2, 5/2, 0],
        [0, 0, 1/2, -3/4, 5/2, 0],
        [0, 0, 0, 0, 5/2, 0],
        [0, 0, 0, 0, -3/2, 0],
        [0, 0, 0, 0, 0, 0],
    ];
    const dyTest =[
        [0, -1/2, 0, 9/4, 0, 0],
        [0, 1/2, 0, 3/4, 0, 0],
        [0, 0, 0, 3/2, 0, 0],
        [0, 0, 0, -1, 0, 0],
        [0, 0, 0, 0, 0, -4],
        [0, 0, 0, 0, 0, 0],
    ];
    for (let i = 1; i < 7; i++) {
        let box = new fibBox(i, AnWinCx, AnWinCy, i % 2);
        box.display();
        console.log(i, box.cx, box.x, box.val);
        // box.transform(0, 0, 1/1000, 0, 0);
        // for (let j = 0; j < 6; j++) {
        //     let curScale = (j % 2) ? fib[j]/fib[j+2] : 1;
        //     curScale *= (j+1 == i) ? 1000 * 34 : 1;
        //     const dx = dxTest[i-1][j];
        //     const dy = dyTest[i-1][j];
        //     // box.transform(dx, dy, curScale, timeStep, j*timeStep);
        //     box.transform(dx, dy, curScale, timeStep, 0);
        //     console.log(i, j, box.cx, box.cy)
        // }
    }
}

async function main() {
    await setup();
    await sequence();    
    // await test();
}

window.main = main;