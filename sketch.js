p5.disableFriendlyErrors = true; // disables FES
var released = true;

let gameWidth = 400,
  gameHeight = 600;
let PATH = "img/";
let txtFont, numberFont;
// Game Object
const game = {
  //GameStates
  // -1 - Preload
  // 0 - Mainscreen
  // 1 - Playing
  // 2 - End
  // 3 - Restart
  ////////////////////////
  //Quality
  // 0 - Low
  // 1 - High
  gameProps: {
    // Screen size
    cWidth: gameWidth,
    cHeight: gameHeight * 0.9,
    fHeight: gameHeight * 0.1,
    // Game state
    gameState: -1,
    // Quality
    quality: 0,
    // Gravity
    gravity: 0,
    // Pipe values
    pipeDistance: 0,
    pipeSpeed: 0,
    pipeWidth: 0,
    pipeHeight: 0,
    nPipes: 0,
    // Score
    score: 0,
    // Load images path
    path: "img/",
    // Background image
    backImage: [],
    floorImage: [],
    loaded: {
      backImg: false,
      floorImg: false,
      pipeImg: false,
      birdImg: false,
    },
    sounds: {
      fall: {},
      jump: {},
      coin: {},
      punch: {},
    },
  },
  gameMsg: {
    loading: "Chargement...",
    title: "Oiseau Volant",
    gameOver: "C'est fini",
    score: "SCORE",
  },
  pipes: [],
  nFloors: 0,
  posXFloor: [],
  count: 0,
  textTr: 0,

  //Game functions
  setup: function () {
    this.gameProps.gravity = gameHeight / 1500;
    // Create bird
    this.bird = new Bird(
      {
        posX: int(this.gameProps.cWidth / 5),
        posY: int(this.gameProps.cHeight / 3),
        bWidth: int(this.gameProps.cHeight / 12),
        bHeight: int(this.gameProps.cHeight / 14),
        jumpSpeed: (this.gameProps.cHeight / 80).toFixed(1),
        anSpeed: 4,
      },
      this.gameProps
    );
    // Update Pipes constant
    this.gameProps.pipeSpeed = this.gameProps.cHeight / 180;
    this.gameProps.pipeDistance = int(this.bird.bWidth * 5.5);
    this.gameProps.pipeWidth = int(this.bird.bWidth * 1.7);
    this.gameProps.pipeHeight = int(this.bird.bHeight * 3.7);
    // Create Pipes
    this.gameProps.nPipes =
      int(
        (this.gameProps.cWidth + this.gameProps.pipeWidth) /
          this.gameProps.pipeDistance
      ) + 1;
    for (let i = 0; i < this.gameProps.nPipes; i++) {
      this.pipes[i] = new Pipe(
        {
          posX: this.gameProps.cWidth + this.gameProps.pipeDistance * i,
          posY: 200,
          hWidth: this.gameProps.pipeWidth,
          hHeight: this.gameProps.pipeHeight,
        },
        this.gameProps
      );
    }
    // Load background
    this.gameProps.backImage[0] = loadImage(
      this.gameProps.path + "background_xs.png",
      () => {
        this.gameProps.backImage[0].resize(0, this.gameProps.cHeight);
      }
    );
    this.gameProps.backImage[1] = loadImage(
      this.gameProps.path + "background_s.png",
      () => {
        this.gameProps.loaded.backImg = true;
        this.gameProps.backImage[1].resize(0, this.gameProps.cHeight);
      }
    );
    // Load floor image
    this.gameProps.floorImage[0] = loadImage(
      this.gameProps.path + "floor_xs.png",
      () => {
        this.gameProps.floorImage[0].resize(0, 3 * this.gameProps.fHeight);
      }
    );
    this.gameProps.floorImage[1] = loadImage(
      this.gameProps.path + "floor_s.png",
      () => {
        // Define the number of floors to animate correctly
        this.gameProps.loaded.floorImg = true;
        this.gameProps.floorImage[1].resize(0, 3 * this.gameProps.fHeight);
        this.nFloors =
          Math.ceil(
            this.gameProps.cWidth / this.gameProps.floorImage[1].width
          ) + 1;
        for (let i = 0; i < this.nFloors; i++) {
          this.posXFloor[i] = this.gameProps.floorImage[1].width * i;
        }
      }
    );
    // Load sounds
    this.gameProps.sounds.coin = loadSound("sounds/coin.mp3");
    this.gameProps.sounds.fall = loadSound("sounds/fall.mp3");
    this.gameProps.sounds.jump = loadSound("sounds/jump.mp3");
    this.gameProps.sounds.punch = loadSound("sounds/punch.mp3");
  },
  mouseClick: function () {
    if (
      mouseX > this.gameProps.cWidth - 40 &&
      mouseX < this.gameProps.cWidth - 10 &&
      mouseY > 10 &&
      mouseY < 40
    ) {
      this.gameProps.quality = this.gameProps.quality == 0 ? 1 : 0;
    } else {
      switch (this.gameProps.gameState) {
        case 0:
          this.bird.jump();
          this.gameProps.sounds.jump.play();
          this.gameProps.gameState = 1;
          break;
        case 1:
          this.bird.jump();
          this.gameProps.sounds.jump.play();
          break;
        case 2:
          if (this.count > 50) {
            this.gameProps.gameState = 0;
            this.restart();
          }
          break;
        default:
      }
    }
  },
  play: function () {
    background(255);
    switch (this.gameProps.gameState) {
      case 0:
        // Draw the background
        push();
        imageMode(CENTER);
        image(
          this.gameProps.backImage[this.gameProps.quality],
          this.gameProps.cWidth / 2,
          this.gameProps.cHeight / 2
        );
        pop();
        // Draw the bird
        this.bird.animate(this.gameProps, true);
        // Draw the floor
        this.drawFloor(true);
        // Draw the title
        push();
        textAlign(CENTER);
        textSize(this.gameProps.cWidth / 9);
        textFont(txtFont);
        fill("#a8e65b");
        //External Stroke
        stroke("#edfbdc");
        strokeWeight(this.gameProps.cWidth / 40);
        text(
          this.gameMsg.title,
          this.gameProps.cWidth / 2,
          this.gameProps.cHeight / 5
        );
        //Internal Stroke
        stroke("#523545");
        strokeWeight(this.gameProps.cWidth / 100);
        text(
          this.gameMsg.title,
          this.gameProps.cWidth / 2,
          this.gameProps.cHeight / 5
        );
        pop();

        break;
      case 1:
        // Draw the background
        push();
        imageMode(CENTER);
        image(
          this.gameProps.backImage[this.gameProps.quality],
          this.gameProps.cWidth / 2,
          this.gameProps.cHeight / 2
        );
        pop();
        // Reset text transparence
        this.textTr = 0;
        // Draw, move, count score and check collisions
        this.pipes.forEach((pipe) => {
          pipe.movePipe(this.gameProps);
          pipe.draw(this.gameProps);
          pipe.checkScore(this.bird, this.gameProps);
          pipe.checkCollision(this.bird, this.gameProps);
        });

        // Draw the bird
        this.bird.physics(this.gameProps);
        this.bird.animate(this.gameProps, true);

        // Show the score
        this.showScore();

        // Draw the floor
        this.drawFloor(true);

        break;
      case 2:
        // Draw the background
        push();
        imageMode(CENTER);
        image(
          this.gameProps.backImage[this.gameProps.quality],
          this.gameProps.cWidth / 2,
          this.gameProps.cHeight / 2
        );
        pop();
        // Draw each pipe
        this.pipes.forEach((pipe) => {
          pipe.draw(this.gameProps);
        });
        // Draw the bird
        this.bird.physics(this.gameProps);
        this.bird.animate(this.gameProps, false);
        // Draw the floor
        this.drawFloor(false);
        // Show light
        this.count++;

        if (this.count < 5) {
          push();
          fill("rgba(255,255,255,0.75)");
          rect(0, 0, width, height);
          pop();
        } else {
          // Draw the title
          if (this.textTr < 255) this.textTr += 50;
          push();
          textAlign(CENTER);
          textSize(this.gameProps.cWidth / 7);
          textFont(txtFont);
          fill(255, 184, 0, this.textTr);
          //External Stroke
          stroke(237, 251, 220, this.textTr);
          strokeWeight(this.gameProps.cWidth / 30);
          text(
            this.gameMsg.gameOver,
            this.gameProps.cWidth / 2,
            this.gameProps.cHeight / 4
          );

          //Internal Stroke
          stroke(82, 53, 69, this.textTr);
          strokeWeight(this.gameProps.cWidth / 70);
          text(
            this.gameMsg.gameOver,
            this.gameProps.cWidth / 2,
            this.gameProps.cHeight / 4
          );
          pop();

          // Draw the menu
          push();
          fill("#dbda96");
          stroke(82, 53, 69);
          strokeWeight(this.gameProps.cWidth / 130);
          rect(
            this.gameProps.cWidth / 6,
            (3 * this.gameProps.cHeight) / 8,
            (4 * this.gameProps.cWidth) / 6,
            this.gameProps.cHeight / 3
          );
          pop();

          // Show score
          push();
          textAlign(CENTER);
          textFont(txtFont);
          fill("#d2aa4f");
          textSize(this.gameProps.cHeight / 20);
          text(
            this.gameMsg.score,
            this.gameProps.cWidth / 2,
            (15 * this.gameProps.cHeight) / 32
          );
          stroke(0);
          strokeWeight(6);
          textSize(this.gameProps.cHeight / 10);
          fill(255);
          text(
            this.gameProps.score,
            this.gameProps.cWidth / 2,
            (5 * this.gameProps.cHeight) / 8
          );
          pop();
        }

        break;
      default:
        // Show loading screen
        background(10);
        push();
        textFont(txtFont);
        textAlign(CENTER);
        fill("rgb(240,240,240)");
        textSize(int(this.gameProps.cWidth / 12));
        text(
          this.gameMsg.loading,
          this.gameProps.cWidth / 2,
          this.gameProps.cHeight / 2
        );
        pop();
        // Check if all images loaded correctly
        let loaded = true;
        Object.keys(this.gameProps.loaded).forEach((img) => {
          loaded = loaded && this.gameProps.loaded[img];
        });
        if (loaded) this.gameProps.gameState = 0;
    }
    // Draw quality button
    push();
    textAlign(CENTER);
    textFont(txtFont);
    textSize(20);

    if (this.gameProps.quality == 0) {
      fill("#A8E65BBF");
      rect(this.gameProps.cWidth - 40, 10, 30, 30);
      fill("#523545");
      text("L", this.gameProps.cWidth - 25, 33);
    } else {
      fill("#edfbdc");
      rect(this.gameProps.cWidth - 40, 10, 30, 30);
      fill("#523545");
      text("H", this.gameProps.cWidth - 25, 33);
    }
    pop();
  },
  restart: function () {
    this.count = 0;
    // Restart the score
    this.gameProps.score = 0;
    // Restart the bird
    this.bird.restart({
      posX: int(this.gameProps.cWidth / 5),
      posY: int(this.gameProps.cHeight / 3),
    });
    // Restart the pipes
    for (let i = 0; i < this.gameProps.nPipes; i++) {
      this.pipes[i].restart(
        { posX: this.gameProps.cWidth + this.gameProps.pipeDistance * i },
        this.gameProps
      );
    }
  },
  drawFloor: function (move = false) {
    // Draw the floor
    for (let i = 0; i < this.nFloors; i++) {
      if (move) {
        this.posXFloor[i] -= this.gameProps.pipeSpeed;
        if (this.posXFloor[i] < -this.gameProps.floorImage[0].width)
          this.posXFloor[i] =
            (this.nFloors - 1) * this.gameProps.floorImage[0].width - 100;
      }

      image(
        this.gameProps.floorImage[this.gameProps.quality],
        this.posXFloor[i],
        height - this.gameProps.fHeight
      );
    }
  },
  showVariables: function () {
    textSize(12);
    textAlign(LEFT);
    fill("RED");
    text(
      "bWidth: " + this.bird.bWidth + "  -  bHeight: " + this.bird.bHeight,
      10,
      10
    );
    text("Speed: " + int(this.bird.speed), 10, 22);
    text(
      "PosX: " + int(this.bird.posX) + "  PosY: " + int(this.bird.posY),
      10,
      34
    );
    text("Score: " + this.gameProps.score, 10, 46);
    text("GameState: " + this.gameProps.gameState, 10, 58);
    text("CurrentSprite: " + this.bird.cSprite, 10, 70);
    text("Angle: " + int(this.bird.angle) + " °", 10, 82);
    text("FPS: " + int(frameRate()), 10, 94);
    text("#Pipes: " + this.gameProps.nPipes, 10, 106);
    text("Pipe distance: " + this.gameProps.pipeDistance, 10, 118);
    text("Pipe width: " + this.gameProps.pipeWidth, 10, 130);
    text("Jump Speed: " + this.bird.jumpSpeed, 10, 142);
    text("Gravity: " + this.gameProps.gravity, 10, 154);
    let loadStr = "";
    Object.keys(this.gameProps.loaded).forEach((img) => {
      loadStr += this.gameProps.loaded[img] + ", ";
    });
    text("Loaded: " + Object.keys(this.gameProps.loaded), 10, 166);
    text("                " + loadStr, 10, 178);
    text("XFloor1: " + this.posXFloor[0], 10, 190);
    text("XFloor2: " + this.posXFloor[1], 10, 202);
  },
  showScore: function () {
    push();
    textAlign(CENTER);
    textFont(txtFont);
    stroke(0);
    strokeWeight(6);
    textSize(this.gameProps.cHeight / 12);
    fill(255);
    text(
      this.gameProps.score,
      this.gameProps.cWidth / 2,
      this.gameProps.cHeight / 8 - 4
    );
    pop();
  },
};

// Preload
function preload() {
  txtFont = loadFont("fonts/txtFont.ttf");
  numberFont = loadFont("fonts/numbers-font.ttf");
}
// Setup
function setup() {
  createCanvas(gameWidth, gameHeight);
  //frameRate(50);
  // Create the game
  game.setup();
}

function draw() {
  // Start the game
  game.play();
  //game.showVariables();
  //text("FPS: " + int(frameRate()), 10, 10);
}

// Fix double tap Bug
function mouseReleased() {
  released = true;
  return false;
}
function mousePressed() {
  if (!released) {
    return;
  }
  released = false;

  // Call game function
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    game.mouseClick();
  }
}
