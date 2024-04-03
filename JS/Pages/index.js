import { POINT, PARTICLE, VECTOR } from '../Elements/CanvasElements.js';

const canvas = document.getElementById("canvas");

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight - 100;

const particles = [];
const ctx = canvas.getContext("2d");

ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#86B049";
ctx.lineWidth = 2;
ctx.strokeStyle = "rgba(255,255,255,1)";

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#86B049";

    particles.forEach((p1, i) => {
        p1.age();
        if (p1.getWeight() > 0) {
            p1.updatePosition(canvas.width, canvas.height);
            ctx.moveTo(p1.getPoint().getX(), p1.getPoint().getY());
            ctx.arc(p1.getPoint().getX(), p1.getPoint().getY(), p1.getWeight(), 0, Math.PI * 2);
            particles.forEach((p2, j) => {
                if (i !== j) {
                    if (distance(p1.getPoint(), p2.getPoint()) < 300) {
                        ctx.moveTo(p1.getPoint().getX(), p1.getPoint().getY());
                        ctx.lineTo(p2.getPoint().getX(), p2.getPoint().getY());
                        ctx.stroke();
                    }
                }
            });
        } else {
            particles.splice(i, 1);
        }
    });

    ctx.fill();
    ctx.closePath();

    requestAnimationFrame(draw);
}

canvas.addEventListener('click', (e) => {
    particles.push(new PARTICLE(new POINT(e.offsetX, e.offsetY), new VECTOR(Math.random() + 0.5, Math.random() * 360), (Math.random() * 6) + 10));
});

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.getX() - p2.getX(), 2) + Math.pow(p1.getY() - p2.getY(), 2));
}

draw();