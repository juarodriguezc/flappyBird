class Pipe {
  constructor({ posX, hWidth, hHeight }, gameProps) {
    this.posX = posX;
    this.posY = 0;
    this.updateHeight(gameProps);
    this.hWidth = hWidth;
    this.hHeight = hHeight;
    this.counted = false;
    // Load image
    gameProps.loaded.pipeImg = true;
    // Top of Pipe
    this.tImage = [];
    this.tImage[0] = loadImage(
      gameProps.path + "top_pipe_xs.png",
      () => {
        this.tImage[0].resize(
          this.hWidth + int(this.hWidth / 8),
          int(gameProps.cHeight / 15)
        );
      },
      () => {
        gameProps.loaded.pipeImg = false;
      }
    );
    this.tImage[1] = loadImage(
      gameProps.path + "top_pipe_s.png",
      () => {
        this.tImage[1].resize(
          this.hWidth + int(this.hWidth / 8),
          int(gameProps.cHeight / 15)
        );
      },
      () => {
        gameProps.loaded.pipeImg = false;
      }
    );
    // Bottom of pipe
    this.bImage = [];
    this.bImage[0] = loadImage(
      gameProps.path + "bottom_pipe_xs.png",
      () => {
        this.bImage[0].resize(this.hWidth, gameProps.cHeight);
      },
      () => {
        gameProps.loaded.pipeImg = false;
      }
    );
    this.bImage[1] = loadImage(
      gameProps.path + "bottom_pipe_s.png",
      () => {
        this.bImage[1].resize(this.hWidth, gameProps.cHeight);
      },
      () => {
        gameProps.loaded.pipeImg = false;
      }
    );
  }
  restart({ posX }, gameProps) {
    this.posX = posX;
    this.updateHeight(gameProps);
    this.counted = false;
  }
  updateHeight(gameProps) {
    // Random between 0 and 12
    let rPipe = Math.floor(Math.random() * 12);
    // Split the Height in 20 and choose between 4 and 16
    this.posY = ((4 + rPipe) * gameProps.cHeight) / 20;
  }
  draw(gameProps) {
    //Draw up Pipe
    image(
      this.bImage[gameProps.quality],
      this.posX,
      this.posY - gameProps.cHeight - this.hHeight / 2 - 10
    );
    image(
      this.tImage[gameProps.quality],
      this.posX - int(this.hWidth / 16),
      this.posY - this.hHeight / 2 - int(gameProps.cHeight / 15)
    );
    //Draw down Pipe
    image(
      this.bImage[gameProps.quality],
      this.posX,
      this.posY + this.hHeight / 2
    );
    image(
      this.tImage[gameProps.quality],
      this.posX - int(this.hWidth / 16),
      this.posY + this.hHeight / 2,
      this.hWidth + int(this.hWidth / 8)
    );
  }

  movePipe(gameProps) {
    if (this.posX + this.hWidth < 0) {
      this.updateHeight(gameProps);
      this.posX = gameProps.nPipes * gameProps.pipeDistance - this.hWidth;
      this.counted = false;
    } else this.posX -= gameProps.pipeSpeed;
  }
  checkScore(bird, gameProps) {
    if (this.counted === false && this.posX < bird.posX) {
      gameProps.score++;
      this.counted = true;
      // Play sound
      gameProps.sounds.coin.play();
    }
  }

  checkCollision(bird, gameProps) {
    //Draw the hole
    //push();
    //fill("BLUE");

    //Check collision vertical Front
    if (
      (bird.posX + bird.bWidth > this.posX &&
        bird.posX + bird.bWidth < this.posX + this.hWidth) ||
      (bird.posX > this.posX && bird.posX < this.posX + this.hWidth)
    ) {
      // Check collision Pipe
      if (
        bird.posY < this.posY - this.hHeight / 2 ||
        bird.posY + bird.bHeight > this.posY + this.hHeight / 2
      ) {
        gameProps.gameState = 2;
        bird.speed = 4;
        gameProps.sounds.punch.play();
        gameProps.sounds.fall.play();
      }
    }

    //rect(this.posX, this.posY - this.hHeight / 2, this.hWidth, this.hHeight);
    //pop();
  }
}
