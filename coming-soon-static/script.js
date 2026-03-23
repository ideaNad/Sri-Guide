function updateCountdown() {
    const now = new Date();
    const target = new Date();
    target.setHours(0, 0, 0, 0);

    // If midnight today has passed, count down to midnight tomorrow
    if (now.getTime() > target.getTime()) {
        target.setDate(target.getDate() + 1);
    }

    const difference = target.getTime() - now.getTime();

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const m = Math.floor((difference / 1000 / 60) % 60);
    const s = Math.floor((difference / 1000) % 60);

    document.getElementById('days').innerText = String(d).padStart(2, '0');
    document.getElementById('hours').innerText = String(h).padStart(2, '0');
    document.getElementById('minutes').innerText = String(m).padStart(2, '0');
    document.getElementById('seconds').innerText = String(s).padStart(2, '0');
}

// Update every second
setInterval(updateCountdown, 1000);

// Run once on load
updateCountdown();

// Coming Soon interaction
const toast = document.getElementById('toast');
const links = document.querySelectorAll('.coming-soon-link');

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showToast();
    });
});

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Fluid Elastic Cursor Logic
const dot = document.getElementById('cursor-dot');
const circle = document.getElementById('cursor-circle');

let mouse = { x: 0, y: 0 };
let dotPos = { x: 0, y: 0 };
let circlePos = { x: 0, y: 0 };

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animateCursor() {
    // Dot follows precisely
    dotPos.x = mouse.x;
    dotPos.y = mouse.y;

    // Circle follows with elastic easing (lag)
    circlePos.x += (mouse.x - circlePos.x) * 0.15;
    circlePos.y += (mouse.y - circlePos.y) * 0.15;

    dot.style.left = `${dotPos.x}px`;
    dot.style.top = `${dotPos.y}px`;
    
    circle.style.left = `${circlePos.x}px`;
    circle.style.top = `${circlePos.y}px`;

    requestAnimationFrame(animateCursor);
}

animateCursor();

// Hover interactions
const interactives = document.querySelectorAll('a, button, .time-box');
interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
        circle.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        circle.classList.remove('hover');
    });
});
