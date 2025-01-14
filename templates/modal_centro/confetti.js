const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const confettiParticles = [];

const colors = ["#0066FF", "#FF6600", "#6600FF", "#C000FF", "#581845"];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle() {
  return {
    x: randomBetween(0, canvas.width),
    y: randomBetween(0, canvas.height),
    size: randomBetween(5, 10),
    color: colors[Math.floor(Math.random() * colors.length)],
    speedX: randomBetween(-3, 3),
    speedY: randomBetween(2, 5),
    rotation: randomBetween(0, 360),
    rotationSpeed: randomBetween(-5, 5),
  };
}

function updateParticles() {
  confettiParticles.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;

    // Reset particles that move off-screen
    if (p.y > canvas.height) {
      p.y = -10;
      p.x = randomBetween(0, canvas.width);
    }
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiParticles.forEach((p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  });
}

function loop() {
  updateParticles();
  drawParticles();
  requestAnimationFrame(loop);
}

// Initialize particles
for (let i = 0; i < 100; i++) {
  confettiParticles.push(createParticle());
}

// Start animation
loop();

// Adjust canvas size on resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
