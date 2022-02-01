import Vertex from './Vertex.js'
import ArcList from './ArcList.js'
import Arc from './Arc.js';
let width = 1000;
let height = 400;
let mode = "draw";
let i = 1;
let radius = 0;
let ghostRadius = 0;
let arcList = new ArcList(null);
window.setup = () => {
    createCanvas(width, height);
}
let vertices = [];
let selectionProximity = 80;
window.draw = () => {
    background('rgba(220,220,200, 0.25)');
    if (mode == "radius") {
        ghostRadius = Math.hypot(mouseX - width / 2, mouseY - height / 2)/2;
    }
    if (mode == "algorithm") {
        arcList.draw();
    }
    for (let p of vertices) {
        if (mode == "radius") {
            fill('rgba(220,220,200, 0.05)');
            stroke('rgba(100,100,100, 0.25)');
            ellipse(p.x, p.y, 2*ghostRadius, 2*ghostRadius);
            stroke('rgba(255,0,0, 0.25)');
            ellipse(p.x, p.y, 2*radius, 2*radius);
        }
        p.draw()
    }
    if (mode == "algorithm" && i < vertices.length) {
        fill('rgba(220,220,200, 0.05)');
        stroke('rgba(255,0,0, 0.25)');
        ellipse(vertices[i].x, vertices[i].y, 2*radius, 2*radius);  
    }
}

/**
 * Puts everything into draw mode for drawing points
 */
let drawMode = () => {
    mode = "draw";
    radius = 0;
    ghostRadius = 0;
    document.getElementById("modeInstructions").innerText
        = "        DRAW MODE: Middle-Click (or Ctrl+Click) to add points, Left-Click to select point, DELETE to delete the selected point";
    let onClick = (event) => {
        for (let p of vertices) {
            p.unselect();
        }
        if (event.button == 1 || event.ctrlKey) //mouse center button
        {
            let v = new Vertex(mouseX, mouseY);
            vertices.push(v);
        }
        else if (event.button == 0)//left mouse button
        {
            let closest = null;
            let bestDistance = selectionProximity + 1;
            for (let p of vertices) {
                let dist = p.distance(mouseX, mouseY);
                if (dist < bestDistance) {
                    closest = p;
                    bestDistance = dist;
                }
            }
            if (closest != null) {
                closest.select();
            }
        }
    };
    let onKeyPress = (e) => {
        let key = e.keyCode ? e.keyCode : e.which;
        if (key != 46) {
            return;
        }
        let selected = -1;
        let i = 0;
        for (let p of vertices) {
            if (p.selected == true) {
                selected = i;
            }
            i++;
        }
        if (selected >= 0) {
            vertices.splice(selected, 1);
        }
    };
    window.onmousedown = onClick;
    window.onkeyup = onKeyPress;
}
/**
 * Puts everything into radius mode, used for selecting the Radius R
 */
let radiusMode = () => {
    vertices.sort((a, b) => {
        if (a.x > b.x) { return 1; }
        return -1;
    })
    mode = "radius"
    document.getElementById("modeInstructions").innerText
        = "        RADIUS MODE: Select the size of your circles by left clicking at the radius you want";
    let onClick = () => {
        radius = ghostRadius;
    }
    window.onmousedown = onClick;
    window.onkeyup = () => { };

    for (let p of vertices) {
        p.unselect();
    }
}
let algorithmMode = () => {
    mode = "algorithm"
    document.getElementById("modeInstructions").innerText
        = "        ALGORITHM MODE: Press SPACE to see the progression of the algorithm";
    arcList = new ArcList(new Arc(vertices[0].x, vertices[0].y, radius));
    i = 1;
    let onKeyPress = (e) => {
        let key = e.keyCode ? e.keyCode : e.which;
        if (key == 32) {
            if (i >= vertices.length) {
                algorithmMode();
            }
            else {
                arcList.addArc(new Arc(vertices[i].x, vertices[i].y, radius));
                i++;
            }
        }
    };
    window.onmousedown = () => { };
    window.onkeyup = onKeyPress;
}
drawMode();
let nextMode = () => {
    switch (mode) {
        case "draw":
            radiusMode();
            break;
        case "radius":
            algorithmMode();
            break;
        case "algorithm":
            drawMode();
            break;
    }
}
document.getElementById("nextButton").onmousedown = nextMode;