const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 25,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: { x: 215, y: 160 },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 8,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const ennemy = new Fighter({
  position: {
    x: 950,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: { x: 215, y: 167 },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 8,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

const keys = {
  q: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  // Fighter
  player.update();
  ennemy.update();

  player.velocity.x = 0;
  ennemy.velocity.x = 0;

  // player movement
  if (keys.q.pressed && player.lastKey === "q") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // ennemy movement
  if (keys.ArrowLeft.pressed && ennemy.lastKey === "ArrowLeft") {
    ennemy.velocity.x = -5;
    ennemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && ennemy.lastKey === "ArrowRight") {
    ennemy.velocity.x = 5;
    ennemy.switchSprite("run");
  } else {
    ennemy.switchSprite("idle");
  }

  if (ennemy.velocity.y < 0) {
    ennemy.switchSprite("jump");
  } else if (ennemy.velocity.y > 0) {
    ennemy.switchSprite("fall");
  }

  // detect for collision
  if (
    rectangularCollision(player, ennemy) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    player.isAttacking = false;
    ennemy.takeHit();
    gsap.to("#ennemyHealth", { width: ennemy.health + "%" });
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // detect for collision
  if (
    rectangularCollision(ennemy, player) &&
    ennemy.isAttacking &&
    ennemy.framesCurrent === 2
  ) {
    ennemy.isAttacking = false;
    player.takeHit();
    gsap.to("#playerHealth", { width: player.health + "%" });
  }
  if (ennemy.isAttacking && ennemy.framesCurrent === 2) {
    ennemy.isAttacking = false;
  }

  if (ennemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, ennemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "q":
        keys.q.pressed = true;
        player.lastKey = "q";
        break;
      case "z":
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        break;
      default:
        break;
    }
  }

  if (!ennemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        ennemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        ennemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        ennemy.velocity.y = -20;
        break;
      case "ArrowDown":
        ennemy.attack();
        break;

      default:
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "q":
      keys.q.pressed = false;
      break;

    default:
      break;
  }
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;

    default:
      break;
  }
});
