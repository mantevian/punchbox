const GameAudio = {
    hit: () => new Audio("/sound/hit.mp3").play(),
    coin: () => new Audio("/sound/coin.mp3").play(),
    explosion: () => new Audio("/sound/explosion.mp3").play(),
    deadly: () => new Audio("/sound/deadly.mp3").play(),
    heal: () => new Audio("/sound/heal.mp3").play(),
    click: () => new Audio("/sound/click.mp3").play()
};

export default GameAudio;
