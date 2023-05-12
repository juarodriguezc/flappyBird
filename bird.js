class Bird {
  constructor(
    { posX, posY, bWidth, bHeight, anSpeed = 5, jumpSpeed = 5 },
    gameProps
  ) {
    // Set the posX and posY of the bird
    this.posX = posX;
    this.posY = posY;
    // Set the width and the height of the bird
    this.bWidth = bWidth;
    this.bHeight = bHeight;
    // Set the angle of the bird
    this.angle = 0;
    // Define the speed of the bird
    this.speed = 0;
    this.jumpSpeed = jumpSpeed;
    this.posMX = this.posX + this.bWidth / 2;
    // Load sprites
    this.cSprite = 0;
    this.sprites = [[],[]];
    this.anSpeed = anSpeed;
    // Frame count
    this.fCount = 0;
    gameProps.loaded.birdImg = true;
    for (let i = 0; i < 3; i++) {
      // Low quality
      this.sprites[0][i] = loadImage(
        gameProps.path + "bird_" + (i + 1) + "xs.png",
        () => {
          this.sprites[0][i].resize(this.bWidth, this.bHeight);
              },
        () => {
          gameProps.loaded.birdImg = false;
        }
      );
      // High quality
      this.sprites[1][i] = loadImage(
        gameProps.path + "bird_" + (i + 1) + "s.png",
        () => {
          this.sprites[1][i].resize(this.bWidth, this.bHeight);
              },
        () => {
          gameProps.loaded.birdImg = false;
        }
      );
    }
  }
  restart({ posX, posY }) {
    // Set the posX and posY of the bird
    this.posX = posX;
    this.posY = posY;
    // Set the angle of the bird
    this.angle = 0;
    // Define the speed of the bird
    this.speed = 0;
    // Load sprites
    this.cSprite = 0;
  }
  animate(gameProps, anim) {
    // Increase Sprite pos in some States
    if (anim) {
      this.fCount++;
      if (this.fCount == this.anSpeed) {
        this.fCount = 0;
        this.cSprite = (this.cSprite + 1) % 3;
      }
    } else {
      this.fCount = 0;
      this.cSprite = 0;
    }

    push();
    angleMode(DEGREES);
    translate(this.posX + this.bWidth / 2, this.posY + this.bHeight / 2);
    rotate(this.angle);
    imageMode(CENTER);
    image(this.sprites[gameProps.quality][this.cSprite % 3], 0, 0);
    pop();
    
    
  }
  physics(gameProps) {
    if (this.posY > gameProps.cHeight - this.bHeight) {
      this.posY = gameProps.cHeight - this.bHeight;
      this.speed = 0;
      if (gameProps.gameState == 1) gameProps.sounds.punch.play();
      gameProps.gameState = 2;
    } else if (this.posY == gameProps.cHeight - this.bHeight) {
      this.posY = this.posY + this.speed;
    } else {
      this.speed = this.speed + gameProps.gravity;
      this.posY = this.posY + this.speed;
    }
    // Update the angle
    if (this.angle < 90 && this.angle >= -30)
      this.angle += (11 * this.speed) / 12;
    if (this.angle < -30) this.angle = -30;
    if (this.angle > 90) this.angle = 90;
  }
  jump(gameProps) {
    if (this.posY > 0) {
      if (this.speed >= 0) this.speed = -this.jumpSpeed;
      else this.speed = -int(this.jumpSpeed * 1.3);
      this.angle = -15;
    }
  }
}
