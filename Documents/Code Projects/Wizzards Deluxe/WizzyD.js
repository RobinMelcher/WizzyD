
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

function randomWall(){
    return getRndInteger(1, 4);
}

var goblinSpeed = 1;


const getCursorPosition = (canvas, event, wizard) => {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    //console.log(x, y)
    mousePos = [x, y];
    ballx = wizard.x + 64;
    bally = wizard.y + 64;

    var bx = x - ballx;
    var by = y - bally;
    var d = Math.sqrt(bx * bx + by * by);
    ballDir = [bx/d, by/d];

    ballArray.push({
        x: wizard.x + 64,
        y: wizard.y + 64,
        dirx: ballDir[0],
        diry: ballDir[1],
        speed: 5,
        ballExist: true,
    })
}
    
    

    


var heartSprite = document.getElementById("heartImage");

var wizard = {
        
    x: 436,
    y: 336,
    dirx: 0,
    diry: 0,
    speed: 1,
    wizardAlive: true,
    lives: 3,
    sprite: document.getElementById("wizzyPic"),
    
} 




function moveGhost(ghost, wizard){
    var hx = wizard.x + 64 - ghost.x;
    var hy = wizard.y + 64 - ghost.y;
    var d = Math.sqrt(hx * hx + hy * hy);
    ghost.dirx = hx/d;
    ghost.diry = hy/d;
    ghost.x += ghost.dirx * ghost.speed;
    ghost.y += ghost.diry * ghost.speed;
}  

function createGhost(){

    ghost = getGoblinxy();
    return {
        x: ghost[0],
        y: ghost[1],
        dirx: 0,
        diry: 0,
        speed: 1,
        ghostAlive: true,
        sprite: document.getElementById("ghostPic"),
    };
}



function moveGoblin(goblin, wizard){
    
    var gx = wizard.x + 64 - goblin[0];
    var gy = wizard.y + 64 - goblin[1];
    var d = Math.sqrt(gx*gx + gy*gy);
    var goblinDir = [gx/d, gy/d];
    goblin[0] += goblinDir[0] * goblinSpeed;
    goblin[1] += goblinDir[1] * goblinSpeed;


    return goblin;
}


function getGoblinxy(){
    wallSpawn = randomWall();
    if (wallSpawn == 1){
        x = getRndInteger(0, 10);
        y = getRndInteger(0, 800);
    } else 
    if (wallSpawn == 2){
        x = getRndInteger(0, 1000);
        y = getRndInteger(0, 10);
    } else 
    if (wallSpawn == 3){
        x = getRndInteger(990, 1000);
        y = getRndInteger(0, 800);
    } else 
    if (wallSpawn == 4){
        x = getRndInteger(0,1000);
        y = getRndInteger(790, 800);
    }
    return [x, y];
    

}

function main(){ 

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var ballImage = document.getElementById("ballImage");
    var wizzyPic = document.getElementById("wizzyPic");
    var goblin1 = document.getElementById("goblin1");
    var ghostPic = document.getElementById("ghostPic");
    

    var goblin = getGoblinxy();
    var score = 0;
    ctx.font = "50px Arial";
    ctx.drawImage(wizzyPic, wizard.x, wizard.y);
  
    canvas.addEventListener('mousedown', (e) => {
        getCursorPosition(canvas, e, wizard)
    })

    ghostArray = [];
    ballArray = [];

    function loop() {

        

        if(wizard.lives > 0){
            for (var ghost of ghostArray){

                if(ghost.ghostAlive){
                    moveGhost(ghost, wizard);
                    var d = Math.sqrt((wizard.x + 64 - ghost.x)**2 + (wizard.y + 64 - ghost.y)**2);
                
                    if (d < 2){
                        wizard.lives -= 1;
                        ghost.ghostAlive = false;
                        ghostArray.push(createGhost());
                    }

                for(var ball of ballArray){ 
                    
                    if(ball.ballExist){
                        var d = Math.sqrt((ball.x - ghost.x + 64 )**2 + (ball.y - ghost.y +64 )**2)
                        if(d < 64){
                            
                            ghost.ghostAlive = false;
                            ghostArray.push(createGhost());
                            if(score == 190){
                                ghostArray.push(createGhost());
                            }
                            score += 10;
                        
                        
                        }
                    }
                }
            }
            
            }
            var d = Math.sqrt((wizard.x + 64 - goblin[0])**2 + (wizard.y + 64 - goblin[1])**2);
            if (d < 2){
            wizard.lives -= 1;
            //document.getElementById("lives").innerHTML = wizard.lives;
            goblin = getGoblinxy();
            }
        }else{
            alert("Game over Wizzo!");
            ghostArray = [];
            wizard.lives = 3;
            score = 0;
            //document.getElementById("score").innerHTML = score;
            //document.getElementById("lives").innerHTML = wizard.lives;
        }

        
        for (var ball of ballArray){
            if (ball.ballExist){

                var d = Math.sqrt((ball.x - goblin[0] + 64 )**2 + (ball.y - goblin[1] +64 )**2)
                if(d < 64){
                    
                    
                    
                    if(score == 190){
                        ghostArray.push(createGhost());
                    }
                    if(score == 390){
                        ghostArray.push(createGhost());
                    }
                    if(score == 590){
                        ghostArray.push(createGhost());
                    }

                    
                    goblin = getGoblinxy();
                    score += 10;
                    //document.getElementById("score").innerHTML = score;
                    
                }
            }
        }

        if(score < 100){
            goblinSpeed = 1;
        }else if(score >= 100 && score < 200){
            goblinSpeed = 2;
        }else if(score >= 300 && score < 400){
            goblinSpeed = 3;
            ghost.speed = 2;
        }else if(score >= 500 && score < 600){
            goblinSpeed = 4;
        }else if(score >= 700 && score < 800){
            goblinSpeed = 5;
            ghost.speed = 3;
        }

        
        ctx.clearRect(0, 0, 1000, 800);

        for (var ball of ballArray){
            if(ball.ballExist){
                if (ball.x < 0 || ball.x > 0  || ball.y < 0 || ball.y > 800){
                    ballExist = false
                }
                ball.x += ball.dirx * ball.speed;
                ball.y += ball.diry * ball.speed;
                ctx.drawImage(ballImage, ball.x, ball.y);
            }
        }
        goblin = moveGoblin(goblin, wizard);
        for (var ghost of ghostArray){
            if(ghost.ghostAlive){
                ctx.drawImage(ghostPic, ghost.x - 64, ghost.y - 64);
            }
        }

        for (let hearts = 0; hearts < wizard.lives; hearts++){
            var offset = hearts * 70;
            ctx.drawImage(heartImage, 30 + offset, 740);

        };

        ctx.strokeText("score" + score, 700, 790);
        ctx.drawImage(goblin1, goblin[0] -64, goblin[1]-64);
        ctx.drawImage(wizzyPic, wizard.x, wizard.y);
        //console.log(goblin);
        window.requestAnimationFrame(loop)

    }

    window.requestAnimationFrame(loop)

}

main();