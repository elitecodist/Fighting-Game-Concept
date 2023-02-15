const GameViewport = {
    WIDTH: 384,
    HEIGHT: 224,
};

window.onload = function() {
    const canvasElem = document.querySelector('canvas');
    const context = canvasElem.getContext('2d');

    canvasElem.width = GameViewport.WIDTH;
    canvasElem.height = GameViewport.HEIGHT;

    const [ken, background] = document.querySelectorAll('img');

    const position = {
        x: GameViewport.WIDTH/2 - ken.width/2,
        y: 110,
    };

    let velocity = 5;

    function frame() {
        position.x += velocity;

        if (position.x > GameViewport.WIDTH - ken.width || position.x < 0){
            velocity = -velocity;
        }

        // context.clearRect(0, 0, GameViewport.WIDTH, GameViewport.HEIGHT);
        context.drawImage(background, 0, 0);

        // context.strokeStyle = 'yellow';
        // context.moveTo(0,0);
        // context.lineTo(GameViewport.WIDTH, GameViewport.HEIGHT);
        // context.moveTo(GameViewport.WIDTH, 0);
        // context.lineTo(0, GameViewport.HEIGHT);
        // context.stroke();
    
        context.drawImage(ken, position.x, position.y);

        window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);

    // console.log(context);
}