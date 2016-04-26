//add a shadows effect to blocks
//the distance from center and from bottom determines its angle, it will be a grey triangle draw
//BEFORE the square that goes towards center.
//The triangle have points on both bottom edges and will point towards center and up
//by it's center

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
    function cubePush(size, range) {
        var j = rand(size, range);
        for(var i = 0; i < j; i++) {
            game.cubeArray.push(cubeObj());
        }
    }

    //instead of just moving once on keydown,
    //keydown fires interval that moves blocks,
    //interval is killed on keyup
    /*(leftCnt and rightCnt are used to prevent
            multiple keydown events from having an effect)*/

    function playerListen() {
        addEventListener('keydown', function(evt) {
            if (evt.keyCode === 37 && game.leftCnt === 0) {
                game.leftIntvl = intervalFunc(move,1);
                game.userTurn.x -= 10;
                /*if (game.rightCnt) {
                    game.userTurn.x -= 10;
                }*/
                game.leftCnt++;
            }
            if (evt.keyCode === 39 && game.rightCnt === 0) {
                game.rightIntvl = intervalFunc(move,-1);
                game.userTurn.x += 10;
                /*if (game.leftCnt) {
                    game.userTurn.x += 10;
                }*/
                game.rightCnt++;
            }
        },false);

        addEventListener('keyup', function(evt) {
            if (evt.keyCode === 37) {
                clearInterval(game.leftIntvl);
                game.userTurn.x = game.user.x;
                game.leftCnt = 0;
            }
            if (evt.keyCode === 39) {
                clearInterval(game.rightIntvl);
                game.userTurn.x = game.user.x;
                game.rightCnt = 0;
            }
        },false);
    }

    function intervalFunc(func,sign) {
        return setInterval(function() {
            func(sign);
        },25,false);
    }


    //moves blocks when user keys in left or right arrow
    function move(sign) {
        game.cubeArray.forEach(function(AE) {
            AE.x += sign * game.moveSpd * AE.y / cnvs.width;
        });
    }

    //determines distance from center x of an elem and
    //uses that and distance from bottom to calculate xSpd relative to position
    //cent means centered, a 2 comes in if centered, a 1 if not
    function xSpdByPos(elem,multiplier,cent) {
        var xPos = cnvs.width/2 - (elem.x + elem.side/2);
        var yPos = elem.y + elem.side/cent;
        return -(multiplier/6 + yPos / cnvs.height) * xPos / cnvs.width/2 * 5;
    }

    //A block's xspeed is determined by it's x distance from the center
    //and also from it's y distance from the bottom
    //updates block position based off of current x,y and then splices extra blocks
    //also redraws blocks and user's block
    function update() {
        var spliced = [], adjustedXSpd, shadow;

        ctx.clearRect(0, 0, cnvs.width, cnvs.height);
        //draw crappy shadows first
        game.cubeArray.forEach(function(AE) {
            shadow = -xSpdByPos(AE, 6, 1) * AE.side;
            drawShadow(AE,shadow);
        });
        game.cubeArray.forEach(function(AE,i) {
            AE.y += game.speed;
            //they get bigger as they approach
            AE.side = 5 + AE.y / cnvs.height * 10;
            //xSpd determined by
            AE.x += xSpdByPos(AE, game.speed, 2);
            drawBlock(AE);
            //splice if below bottom
            if (AE.y > cnvs.height + Math.pow(game.speed,3))
                spliced.push(i);
        });

        spliced.forEach(function(AE) {
            game.cubeArray.splice(AE,1);
        });
        drawUser(game.userTurn.x, game.userTurn.y);
        if (collisions()) {
            clearInterval(game.intervalCubes);
            clearInterval(game.intervalUpdate);
            console.log(game.score);
        }
    }


    function collisions() {
        U = game.userTurn;
        if (game.cubeArray.some(function(AE) {
            if (AE.x < U.x && AE.x + AE.side > U.x && AE.y < U.y && AE.y + AE.side > U.y)
                return true;
        }))
            return true;
        else
            return false;
    }

    function drawUser(startX,startY) {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(startX,startY);
        ctx.lineTo(game.user.x + 4, cnvs.height);
        ctx.lineTo(game.user.x - 4, cnvs.height);
        ctx.fill();
    }

    function drawBlock(elem) {
        ctx.fillStyle = elem.color;
        ctx.fillRect(elem.x,elem.y,elem.side,elem.side);
    }

    function drawShadow(elem,shadow) {
        var sign = 1;
        if (shadow < 0) {
            sign = 0;
        }
        ctx.fillStyle = 'grey';
        ctx.beginPath();
        ctx.moveTo(elem.x, elem.y + elem.side + 3);
        ctx.lineTo(elem.x + elem.side, elem.y + elem.side + 3);
        if (shadow)
            ctx.lineTo(elem.x + elem.side/2 + shadow, elem.y + 3);
        else
            ctx.lineTo(elem.x + shadow - elem.side/2, elem.y + 3);
        ctx.fill();
    }

    function init() {
        values = {cubeArray: [],
                  score: 0,
                  speed: 3,
                  moveSpd: 3,
                  user: {x: cnvs.width/2, y: cnvs.height - 20},
                  userTurn: {x: cnvs.width/2, y: cnvs.height - 20},
                  density: {size: 6, range: 13},
                  intervalCubes: setInterval(function()
                    { cubePush(values.density.size, 
                               values.density.range );
                    },250,false),
                  intervalUpdate: setInterval(update,20,false),
                  //v The below are for user input handling v
                  intervalSpeed: setInterval(function() {
                    values.speed += .05;
                    values.moveSpd += .01;
                    values.score ++;
                  },2000,false),
                  leftIntvl: null,
                  rightIntvl: null,
                  leftCnt: 0,
                  rightCnt: 0
        }
        playerListen();
        return values;
    }

    function cubeObj() {
        return {x: rand(cnvs.width * 2, -cnvs.width / 2), y: 0, side: 3, color: 'black'};
    }

    function rand(size,start) {
        return Math.floor(Math.random() * size + start);
    }
})();