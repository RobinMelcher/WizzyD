function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomWall() {
  return getRndInteger(1, 4);
}

var goblinSpeed = 1;
var canvasWidth = 900;
var canvasHeight = 700;

const getCursorPosition = (canvas, event, wizard) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  //console.log(x, y)
  mousePos = [x, y];
  ballx = wizard.x + 64;
  bally = wizard.y + 64;

  var bx = x - ballx;
  var by = y - bally;
  var d = Math.sqrt(bx * bx + by * by);
  ballDir = [bx / d, by / d];

  ballArray.push({
    x: wizard.x + 64,
    y: wizard.y + 64,
    dirx: ballDir[0],
    diry: ballDir[1],
    speed: 5,
    ballExist: true,
  });
};

function createHeart(ghost, heartArray) {
  heartArray.push({
    x: ghost.x,
    y: ghost.y,
    heartExist: true,
    sprite: heartSprite,
  });
}

var heartSprite = document.getElementById("heartImage");

var wizard = {
  x: 386,
  y: 286,
  dirx: 0,
  diry: 0,
  speed: 10,
  wizardAlive: true,
  lives: 3,
  sprite: document.getElementById("wizzyPic"),
};

function moveGhost(ghost, wizard) {
  var hx = wizard.x + 64 - ghost.x;
  var hy = wizard.y + 64 - ghost.y;
  var d = Math.sqrt(hx * hx + hy * hy);
  ghost.dirx = hx / d;
  ghost.diry = hy / d;
  ghost.x += ghost.dirx * ghost.speed;
  ghost.y += ghost.diry * ghost.speed;
}

function createGhost() {
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

function moveGoblin(goblin, wizard) {
  var gx = wizard.x + 64 - goblin[0];
  var gy = wizard.y + 64 - goblin[1];
  var d = Math.sqrt(gx * gx + gy * gy);
  var goblinDir = [gx / d, gy / d];
  goblin[0] += goblinDir[0] * goblinSpeed;
  goblin[1] += goblinDir[1] * goblinSpeed;

  return goblin;
}

function getGoblinxy() {
  wallSpawn = randomWall();
  if (wallSpawn == 1) {
    x = getRndInteger(0, 10);
    y = getRndInteger(0, 700);
  } else if (wallSpawn == 2) {
    x = getRndInteger(0, 900);
    y = getRndInteger(0, 10);
  } else if (wallSpawn == 3) {
    x = getRndInteger(890, 900);
    y = getRndInteger(0, 700);
  } else if (wallSpawn == 4) {
    x = getRndInteger(0, 900);
    y = getRndInteger(690, 700);
  }
  return [x, y];
}

function drop(ghost, heartArray) {
  createHeart(ghost, heartArray);
}

function main() {
  var startBTN = {
    height: 128,
    width: 256,
    x: 322,
    y: 286,
  };

  var gameState = "menu";
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var ballImage = document.getElementById("ballImage");
  var wizzyPic = document.getElementById("wizzyPic");
  var goblin1 = document.getElementById("goblin1");
  var ghostPic = document.getElementById("ghostPic");
  var startPic = document.getElementById("startPic");

  var goblin = getGoblinxy();
  var score = 0;
  ctx.font = "50px Arial";

  canvas.addEventListener("mousedown", (e) => {
    // you want to create another if statements here to check for game state and in the menu state make a separate getcursorposition function /
    if (gameState == "menu") {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (
        e.x > startBTN.x &&
        e.x < startBTN.x + startBTN.width &&
        e.y > startBTN.y &&
        e.y < startBTN.y + startBTN.height
      ) {
        gameState = "playing";
      }
    }
    getCursorPosition(canvas, e, wizard);
  });

  canvas.addEventListener("keydown", (e) => {
    console.log(e);
    moveWizard(canvas, e, wizard);
  });

  function moveWizard(canvas, e, wizard) {
    console.log(e.keyCode);
    if (e.code == "KeyA") {
      wizard.x -= wizard.speed;
    }
    if (e.code == "KeyD") {
      wizard.x += wizard.speed;
    }
    if (e.code == "KeyW") {
      wizard.y -= wizard.speed;
    }
    if (e.code == "KeyS") {
      wizard.y += wizard.speed;
    }
  }

  heartArray = [];
  ghostArray = [];
  ballArray = [];

  function loop() {
    if (gameState == "menu") {
      ctx.drawImage(startPic, startBTN.x, startBTN.y);
    } else if (gameState == "playing") {
      if (wizard.lives > 0) {
        for (var heart of heartArray) {
          if (heart.heartExist) {
            var d = Math.sqrt(
              (wizard.x + 64 - heart.x) ** 2 + (wizard.y + 64 - heart.y) ** 2
            );

            if (d < 50) {
              heart.heartExist = false;
              wizard.lives += 1;
            }
          }
        }

        for (var ghost of ghostArray) {
          if (ghost.ghostAlive) {
            moveGhost(ghost, wizard);
            var d = Math.sqrt(
              (wizard.x + 64 - ghost.x) ** 2 + (wizard.y + 64 - ghost.y) ** 2
            );

            if (d < 2) {
              wizard.lives -= 1;
              ghost.ghostAlive = false;
              ghostArray.push(createGhost());
            }

            for (var ball of ballArray) {
              if (ball.ballExist) {
                var d = Math.sqrt(
                  (ball.x - ghost.x + 64) ** 2 + (ball.y - ghost.y + 64) ** 2
                );
                if (d < 64) {
                  if (getRndInteger(0, 30) == 1) {
                    drop(ghost, heartArray);
                  }

                  ghost.ghostAlive = false;
                  ghostArray.push(createGhost());
                  if (score == 190 || score == 490 || score == 1490) {
                    ghostArray.push(createGhost());
                  }
                  score += 10;
                }
              }
            }
          }
        }

        var d = Math.sqrt(
          (wizard.x + 64 - goblin[0]) ** 2 + (wizard.y + 64 - goblin[1]) ** 2
        );
        if (d < 2) {
          wizard.lives -= 1;
          goblin = getGoblinxy();
        }
      } else {
        alert("Game over Wizzo!");
        ghostArray = [];
        heartArray = [];
        wizard.lives = 3;
        score = 0;
      }

      for (var ball of ballArray) {
        if (ball.ballExist) {
          var d = Math.sqrt(
            (ball.x - goblin[0] + 64) ** 2 + (ball.y - goblin[1] + 64) ** 2
          );
          if (d < 64) {
            if (score == 190) {
              ghostArray.push(createGhost());
            }
            if (score == 490) {
              ghostArray.push(createGhost());
            }
            if (score == 990) {
              ghostArray.push(createGhost());
            }

            goblin = getGoblinxy();
            score += 10;
          }
        }
      }

      if (score < 100) {
        goblinSpeed = 1;
      } else if (score >= 100 && score < 200) {
      } else if (score >= 300 && score < 400) {
        goblinSpeed = 2;
      } else if (score >= 500 && score < 600) {
        goblinSpeed = 2;
      } else if (score >= 1000) {
        goblinSpeed = 3;
      }

      for (var ghost of ghostArray) {
        if (score >= 1000) {
          ghost.speed = 2;
        }
      }

      ctx.clearRect(0, 0, 900, 700);

      for (var ball of ballArray) {
        if (ball.ballExist) {
          if (ball.x < 0 || ball.x > 0 || ball.y < 0 || ball.y > 800) {
            ballExist = false;
          }
          ball.x += ball.dirx * ball.speed;
          ball.y += ball.diry * ball.speed;
          ctx.drawImage(ballImage, ball.x, ball.y);
        }
      }
      goblin = moveGoblin(goblin, wizard);
      for (var ghost of ghostArray) {
        if (ghost.ghostAlive) {
          ctx.drawImage(ghostPic, ghost.x - 64, ghost.y - 64);
        }
      }

      for (var heart of heartArray) {
        if (heart.heartExist) {
          ctx.drawImage(heartImage, heart.x, heart.y);
        }
      }

      for (let hearts = 0; hearts < wizard.lives; hearts++) {
        var offset = hearts * 70;
        ctx.drawImage(heartImage, 30 + offset, 640);
      }

      ctx.strokeText("score" + score, 600, 690);
      ctx.drawImage(goblin1, goblin[0] - 64, goblin[1] - 64);
      ctx.drawImage(wizzyPic, wizard.x, wizard.y);
      //console.log(goblin);
      window.requestAnimationFrame(loop);
    }
  }

  window.requestAnimationFrame(loop);
}

main();
