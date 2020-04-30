const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const MIDDLE_OF_SCREEN = GAME_WIDTH / 2;
const DIVIDER_WIDTH = 4;

const ROAD_WIDTH = 100;
const LIGHT_GRAY = 0xC0C0C0;

const SPAWN_RATE = 1000;

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 200 }
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update,
  }
};

const game = new Phaser.Game(config);

const PLAYER_ASSET = {
  key: "player",
  path: "assets/player.png"
};

const CHICKEN_ASSET = {
  key: "chicken",
  path: "assets/chicken.png"
};

const DINOSAUR_ASSET = {
  key: "dinosaur",
  path: "assets/dinosaur.png"
};

const ROAD_ASSET = {
  key: "dotted-single-line-road",
  path: "assets/dotted-single-line-road.png"
}

const ASSETS = [
  PLAYER_ASSET,
  CHICKEN_ASSET,
  DINOSAUR_ASSET,
  ROAD_ASSET
]

const ENEMIES = [
  CHICKEN_ASSET,
  DINOSAUR_ASSET
];

// @type DCLState
let state;

class DCLState {
  constructor(player, scoreLabel) {
    this.player = player;
    this.scoreLabel = scoreLabel;
    this.isPlaying = true;
    this.enemies = [];
    this.score = 0;
  }

  cleanUpOffscreenEnemies() {
    this.enemies = _.filter(this.enemies, (enemy) => {
      if (enemy.x > GAME_WIDTH || 
        enemy.x < 0 ||
        enemy.y > GAME_HEIGHT ||
        enemy.y < 0) {
          enemy.destroy();
          this.score += 100
          this.scoreLabel.setText(`Score: ${this.score}`);
          return false;
        } else {
          return true;
        }
    });
  }

  
}

const setBackground = (scene) => {
  scene.add.image(50, MIDDLE_OF_SCREEN, ROAD_ASSET.key);
  scene.add.rectangle(102, MIDDLE_OF_SCREEN, DIVIDER_WIDTH, GAME_WIDTH, LIGHT_GRAY);
  scene.add.image(150 + (DIVIDER_WIDTH / 2), MIDDLE_OF_SCREEN, ROAD_ASSET.key);
  scene.add.rectangle(202, MIDDLE_OF_SCREEN, DIVIDER_WIDTH, GAME_WIDTH, LIGHT_GRAY);
  scene.add.image(250 + (DIVIDER_WIDTH / 2), MIDDLE_OF_SCREEN, ROAD_ASSET.key);
  scene.add.rectangle(302, MIDDLE_OF_SCREEN, DIVIDER_WIDTH, GAME_WIDTH, LIGHT_GRAY);
  scene.add.image(350 + (DIVIDER_WIDTH / 2), MIDDLE_OF_SCREEN, ROAD_ASSET.key);
  scene.add.rectangle(402, MIDDLE_OF_SCREEN, DIVIDER_WIDTH, GAME_WIDTH, LIGHT_GRAY);
  scene.add.image(450 + (DIVIDER_WIDTH / 2), MIDDLE_OF_SCREEN, ROAD_ASSET.key);
  scene.add.rectangle(502, MIDDLE_OF_SCREEN, DIVIDER_WIDTH, GAME_WIDTH, LIGHT_GRAY);
  scene.add.image(550 + (DIVIDER_WIDTH / 2), MIDDLE_OF_SCREEN, ROAD_ASSET.key);
  scene.add.rectangle(602, MIDDLE_OF_SCREEN, DIVIDER_WIDTH, GAME_WIDTH, LIGHT_GRAY);
  scene.add.image(650 + (DIVIDER_WIDTH / 2), MIDDLE_OF_SCREEN, ROAD_ASSET.key);
  scene.add.rectangle(702, MIDDLE_OF_SCREEN, DIVIDER_WIDTH, GAME_WIDTH, LIGHT_GRAY);
  scene.add.image(750 + (DIVIDER_WIDTH / 2), MIDDLE_OF_SCREEN, ROAD_ASSET.key);
}

function preload() {
  ASSETS.forEach((asset) => {
    this.load.image(asset.key, asset.path);
  });
}

function create() {
  setBackground(this);
  let player = this.physics.add.image(MIDDLE_OF_SCREEN, 100, PLAYER_ASSET.key);
  player.setVelocity(100, 200);
  player.setBounce(1, 1);
  player.setCollideWorldBounds(true);
  
  let scoreLabel = this.add.text(0, 0, "");
  state = new DCLState(player, scoreLabel);

  const addEnemy = () => {
    const hitEnemy = () => {
      this.physics.pause();
      state.isPlaying = false;
    }

    if (state.isPlaying) {
      let asset = _.sample(ENEMIES);
      let enemy = this.physics.add.image(Phaser.Math.Between(0, GAME_WIDTH), 16, asset.key);
      enemy.setVelocity(100, 200);
      enemy.setBounce(1, 1);
      this.physics.add.collider(enemy, state.enemies);
      this.physics.add.overlap(state.player, enemy, hitEnemy, null, this);
      state.enemies.push(enemy);
    }
  }

  this.time.addEvent({
    loop: true,
    delay: SPAWN_RATE,
    callback: addEnemy
  });

  this.input.on('pointermove', (pointer) => {
    this.physics.moveToObject(player, pointer, 300);
  })


}

function update(time, delta) {
  state.cleanUpOffscreenEnemies()
}