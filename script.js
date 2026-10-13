const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

const heart = document.getElementById("heart");
const name = document.getElementById("name");
const message = document.getElementById("message");
const button = document.getElementById("startButton");

let particles = [];
let started = false;
let animationFrame;
let startTime = 0;

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function getHeartPoint(t) {
    return {
        x: 16 * Math.pow(Math.sin(t), 3),
        y: -(
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t)
        )
    };
}

function createParticles() {
    particles = [];

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 - 35;
    const scale = Math.min(window.innerWidth / 42, 13);

    for (let i = 0; i < 850; i++) {
        const t = Math.random() * Math.PI * 2;
        const point = getHeartPoint(t);

        const spread = Math.random();

        const targetX = centerX + point.x * scale * spread;
        const targetY = centerY + point.y * scale * spread;

        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            targetX,
            targetY,
            size: Math.random() * 2 + 0.8,
            speed: Math.random() * 0.035 + 0.015,
            alpha: Math.random() * 0.5 + 0.5,
            red: Math.floor(Math.random() * 70 + 180)
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((p) => {
        if (started) {
            p.x += (p.targetX - p.x) * p.speed;
            p.y += (p.targetY - p.y) * p.speed;
        } else {
            p.y -= 0.15;
            if (p.y < -5) p.y = window.innerHeight + 5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${p.red - 100}, ${p.red}, ${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ff1744";
        ctx.fill();
    });

    ctx.shadowBlur = 0;

    if (started) {
        const elapsed = performance.now() - startTime;

        if (elapsed > 2800) {
            heart.classList.add("show");
        }

        if (elapsed > 4000) {
            name.classList.add("show");
        }

        if (elapsed > 5200) {
            message.classList.add("show");
            button.textContent = "Made with love ❤️";
            button.disabled = true;
        }
    }

    animationFrame = requestAnimationFrame(drawParticles);
}

button.addEventListener("click", () => {
    if (started) return;

    started = true;
    startTime = performance.now();

    button.textContent = "Creating something special...";
    button.disabled = true;

    createParticles();
});

createParticles();
drawParticles();