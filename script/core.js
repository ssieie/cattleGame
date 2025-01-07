import Render from './render.js'

let RenderInstance = null

const instances = {
    Map: null,
}

function initMap(w, h, canvas, mapData) {
    // instances.Map = new Map(w, h, canvas, mapData)
}

function initPlayer(w, h, canvas, data) {
    // instances.Player = new Player(w, h, canvas, data)
}


function initRender(fps = 30) {
    RenderInstance = new Render(fps, canvas)

    // RenderInstance.run(instances)
}

const canvas = {
    cvs: null,
    pen: null
}
export function init(cvs, pen, w, h, fps, target, data) {
    canvas.cvs = cvs
    canvas.pen = pen

    canvas.cvs.width = w
    canvas.cvs.height = h
    canvas.cvs.style = `background-color:rgba(230,230,230,1)`
    target.appendChild(canvas.cvs)

    initRender(fps)

}

export function exit() {
    RenderInstance.clear()
    RenderInstance = null
    instances.Map = null
    instances.Player = null
}