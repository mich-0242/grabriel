const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2 + 100;

const branches = [];
const hearts = [];
const fallingHearts = [];
const colors = ['#fc0000', '#f93535', '#fa6161', '#e74b4b ', '#d13a3a '];

let started = false;
const seedTime = 1000; // 1 segundo mostrando solo la semilla

class Branch {
  constructor(x, y, angle, length, depth) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = length;
    this.depth = depth;
    this.grown = 0;
    this.spawned = false;
  }

  grow() {
    const speed = 1.5;
    if (this.grown < this.length) {
      this.grown += speed;
    } else if (!this.spawned) {
      const newLen = this.length * 0.75;
      const spread = Math.PI / 6;
      const nx = this.x + this.length * Math.cos(this.angle);
      const ny = this.y + this.length * Math.sin(this.angle);

      if (this.depth < 6) {
        branches.push(new Branch(nx, ny, this.angle - spread, newLen, this.depth + 1));
        branches.push(new Branch(nx, ny, this.angle + spread, newLen, this.depth + 1));
      }

      for (let i = 0; i < 15; i++) {
        const angleOffset = (Math.random() - 0.5) * Math.PI;
        const dist = Math.random() * 20;
        const hx = nx + dist * Math.cos(this.angle + angleOffset);
        const hy = ny + dist * Math.sin(this.angle + angleOffset);
        hearts.push({
          x: hx,
          y: hy,
          size: Math.random() * 6 + 5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      this.spawned = true;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = '#19933b';
    ctx.lineWidth = Math.max(1, 6 - this.depth);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x + this.grown * Math.cos(this.angle),
      this.y + this.grown * Math.sin(this.angle)
    );
    ctx.stroke();
  }
}

function drawHeart(x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 20, size / 20);
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(0, -3, -5, -15, -15, -15);
  ctx.bezierCurveTo(-35, -15, -35, 15, 0, 35);
  ctx.bezierCurveTo(35, 15, 35, -15, 15, -15);
  ctx.bezierCurveTo(5, -15, 0, -3, 0, 0);
  ctx.fill();
  ctx.restore();
}

function drawSeed() {
  ctx.beginPath();
  ctx.fillStyle = "#804000";
  ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
  ctx.fill();
}

function createFallingHeart() {
  const x = centerX + (Math.random() - 0.5) * 200;
  const y = centerY - 180;
  const size = Math.random() * 6 + 4;
  fallingHearts.push({
    x,
    y,
    size,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: Math.random() * 0.5 + 0.5,
    sway: (Math.random() - 0.5) * 1.5,
    angle: 0
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Línea divisora debajo del árbol
  ctx.beginPath();
  ctx.moveTo(0, centerY + 10); // justo debajo del tronco
  ctx.lineTo(canvas.width, centerY + 10);
  ctx.strokeStyle = "#aaa"; // color gris claro
  ctx.lineWidth = 1;
  ctx.stroke();

  drawSeed();

  if (started) {
    for (let b of branches) {
      b.grow();
      b.draw();
    }

    for (let h of hearts) {
      drawHeart(h.x, h.y, h.size, h.color);
    }

    for (let f of fallingHearts) {
      f.y += f.speed;
      f.angle += f.sway;
      f.x += Math.sin(f.angle * 0.05);
      drawHeart(f.x, f.y, f.size, f.color);
    }

    // Limpiar corazones que se salen
    while (fallingHearts.length > 150) {
      fallingHearts.shift();
    }
  }

  requestAnimationFrame(animate);
}

setTimeout(() => {
  started = true;
  branches.push(new Branch(centerX, centerY, -Math.PI / 2, 60, 0));
}, seedTime);

animate();

setInterval(() => {
  if (started) {
    createFallingHeart();
  }
}, 200);

// Texto máquina de escribir
const message = "Para:✨Jose Gabriel Martínez Valdez✨\nEres lo más importante en mi vida, no sé qué nos depare al futuro, pero solo espero que estemos juntos, tú me haces ser mejor, cada día que pasa aprendo mas de ti, me encanta todo lo que eres\n tu voz, tu calidez, la forma en la que me tratas y cuidas quiero que esto sea algo dudadero,te quiero a ti, no necesito más nada solo a ti 💗💗 ";let index = 0;

function typeWriter() {
  if (index < message.length) {
    document.getElementById("typewriter").textContent += message.charAt(index);
    index++;
    setTimeout(typeWriter, 60);
  }
}
typeWriter();

// Temporizador desde el 18 de enero de 2025
const startDate = new Date("2025-05-17T00:00:00");

function updateTimer() {
  const now = new Date();
  const diff = now - startDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("timer").textContent =
    `${days} días ${hours} horas ${minutes} minutos ${seconds} segundos`;
}

setInterval(updateTimer, 1000);
updateTimer();
