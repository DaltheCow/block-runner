(function() {
    function createCanvas(width, height) {
      var canvas = document.createElement('canvas');
      canvas.setAttribute('width', width || 200);
      canvas.setAttribute('height', height || 200);
      canvas.setAttribute('style', 'background-color: white; border: 1px solid black;');
      document.body.appendChild(canvas);
      return [canvas,canvas.getContext('2d')];
    }

    canvasArray = createCanvas(300,500);
    var cnvs = canvasArray[0], ctx = canvasArray[1];
    game = init();

    //spawns blocks
    function cubePush() {
        var j = rand(4,7);
        for(var i = 0; i < j; i++) {
            game.cubeArray.push(cubeObj());
        }
    }

    addEventListener('keydown', function(evt) {
        if(evt.keyCode === 37) {
            move(1);
        }
        else if (evt.keyCode === 39) {
            move(-1);
        }
    },false);

    //moves blocks when user keys in left or right arrow
    function move(sign) {
        game.cubeArray.forEach(function(AE) {
            AE.x += sign * 3 * AE.y / cnvs.width;
        });
    }
    //updates block position based off of current x,y and then splices extra blocks
    //also redraws blocks and user's block
    function update() {
        var spliced = [];
        ctx.clearRect(0, 0, cnvs.width, cnvs.height);
        game.cubeArray.forEach(function(AE,i) {
            AE.y += game.speed;
            drawBlock( AE.x, AE.y, AE.side, AE.color);
            if (AE.y > cnvs.height+20)
                spliced.push(i);
        });
        spliced.forEach(function(AE) {
            game.cubeArray.splice(AE,1);
        });
        drawBlock(cnvs.width/2-1.5, cnvs.height-3, 3, 'blue');
        //collisions();
    }


    function collisions() {
        game.cubeArray.forEach(function() {

        });
    }


    function drawBlock(x,y,size,color) {
        ctx.fillStyle = color;
        ctx.fillRect(x,y,size,size);
    }

    function init() {
        values = {cubeArray: [],
                  speed: 3,
                  intervalCubes: setInterval(cubePush,200,false),
                  intervalUpdate: setInterval(update,25,false)
        }
        return values;
    }

    function cubeObj() {
        return {x: rand(cnvs.width * 2, -cnvs.width / 2), y: 0, side: 10, color: 'black'};
    }

    function rand(size,start) {
        return Math.floor(Math.random() * size + start);
    }
})();