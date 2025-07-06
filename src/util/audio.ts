import hitAudio from "/sound/hit.mp3";
import coinAudio from "/sound/coin.mp3";
import explosionAudio from "/sound/explosion.mp3";
import deadlyAudio from "/sound/deadly.mp3";
import healAudio from "/sound/heal.mp3";
import clickAudio from "/sound/click.mp3";

const GameAudio = {
    hit: () => new Audio(hitAudio).play(),
    coin: () => new Audio(coinAudio).play(),
    explosion: () => new Audio(explosionAudio).play(),
    deadly: () => new Audio(deadlyAudio).play(),
    heal: () => new Audio(healAudio).play(),
    click: () => new Audio(clickAudio).play()
};

export default GameAudio;
