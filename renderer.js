// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const {ipcRenderer} = require('electron');
const { webFrame } = require('electron')
function log(msg) {
    ipcRenderer.send('log', `-${msg}`);
}

var initalZoom = undefined

function setZoom(zoomFactor) {
    adjustedZoomFactor = initalZoom * zoomFactor
    webFrame.setZoomFactor(adjustedZoomFactor)
    // window.electronAPI.setZoom(zoom)
}

// Right after the line where you changed the document.location

setTimeout(() => {
    log(`fontSize: ${parseFloat(getComputedStyle(document.body).fontSize)}`)
    // console.log('Hello from renderer.js')
    // setZoom(1.25)
}, 100)

const refreshBtn = document.getElementById('refresh')
const input = document.getElementById('input')
refreshBtn.addEventListener('click', () => {
    const value = input.value
    window.electronAPI.testSignal(value)
})

// window.addEventListener('keydown', (ev) => { console.log('keydown:',  ev.which, 'ctrl key pressed', ev.ctrlKey); });
window.addEventListener('wheel', (ev) => {
    if(!initalZoom) {
        console.log('setting inital zoom')
        initalZoom = webFrame.getZoomFactor()
    }
    if(ev.ctrlKey) {
        log(`initalZoom: ${initalZoom}`)
        let delta = .1
        if(ev.deltaY > 0) {
            log('zoom in');
        } else {
            log('zoom out');
            delta = -delta
        }
        log(`delta: ${delta}`)
        let currentZoom = webFrame.getZoomFactor()
        log(`currentZoom: ${currentZoom}`)
        let zoomFactor = (currentZoom + delta) / initalZoom
        log(`zoomFactor: ${zoomFactor}`)
        ipcRenderer.send('resize-me-please', zoomFactor)
        setZoom(zoomFactor)
    }
});

document.getElementById('input').value = 'version 1.0.2 baby!'