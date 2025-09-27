const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('header');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        navMenu.classList.remove('active');
    });
});

// Scroll direction detection for navbar hide/show
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop) {
        // Scrolling down
        header.classList.add('hide-nav');
    } else {
        // Scrolling up
        header.classList.remove('hide-nav');
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Prevent negative scroll
});

// Neuron Animation
const canvas = document.getElementById('neuron-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const nodes = [];
const numNodes = window.innerWidth < 640 ? 40 : 100;
for (let i = 0; i < numNodes; i++) {
    nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: window.innerWidth < 640 ? 3 : 5
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 100})`;
                ctx.lineWidth = 1;
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
    }

    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffaa'; // 'rgba(255, 255, 255, 0.8)'
        ctx.fill();

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
    });

    requestAnimationFrame(animate);
}
animate();

// Tambahkan di akhir script.js
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch('/contact', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        const messageEl = document.getElementById('form-message');
        messageEl.textContent = result.message;
        messageEl.style.display = 'block';
        messageEl.style.color = '#60a5fa';
        form.reset();
    } catch (error) {
        const messageEl = document.getElementById('form-message');
        messageEl.textContent = 'Error mengirim pesan.';
        messageEl.style.display = 'block';
        messageEl.style.color = '#ef4444';
    }
});