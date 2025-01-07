import {init} from "./core.js";
import {initSoundMonitor, updateSoundData} from "./soundMonitor.js";

const gameContent = document.getElementById('gameContent')
const GAME_HEIGHT = 600

function generateGameContent(size = 600) {

    initSoundMonitor().then(() => {
        gameContent.innerHTML = ''

        gameContent.style.width = size + 'px'
        gameContent.style.height = GAME_HEIGHT + 'px'

        const canvasEl = document.createElement('canvas')
        const $ = canvasEl.getContext('2d')

        init(canvasEl, $, size, GAME_HEIGHT, 60, gameContent)

        //
        setInterval(()=>{
            let buffer = updateSoundData()
            // console.log(buffer)
            if (buffer.some(value => value !== 0)) {
                console.log('有频率数据变化');
            }else {
                console.log('无频率数据变化');
            }
        },1000)
    }).catch((err) => {
        gameContent.innerHTML = err
    })
}

generateGameContent()