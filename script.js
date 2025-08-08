// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .stat, .contact-item, .value-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Calculate exact node centers and update SVG lines
function updateNetworkConnections() {
    const nodes = document.querySelectorAll('.network-node');
    const svg = document.querySelector('.network-svg');
    
    if (!nodes.length || !svg) {
        console.log('Nodes or SVG not found');
        return;
    }
    
    console.log('Found', nodes.length, 'nodes and SVG');
    
    // Clear existing lines
    svg.innerHTML = '';
    
    // Calculate centers for each node
    const nodeCenters = [];
    nodes.forEach((node, index) => {
        const rect = node.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();
        
        // Calculate center relative to SVG
        const centerX = ((rect.left + rect.width/2) - svgRect.left) / svgRect.width * 100;
        const centerY = ((rect.top + rect.height/2) - svgRect.top) / svgRect.height * 100;
        
        nodeCenters.push({ x: centerX, y: centerY, index: index + 1 });
        console.log(`Node ${index + 1}: center at (${centerX.toFixed(2)}%, ${centerY.toFixed(2)}%)`);
    });
    
    // Define connections (which nodes connect to which)
    const connections = [
        // Node 1 connections
        { from: 1, to: 9 }, { from: 1, to: 12 }, { from: 1, to: 10 },
        // Node 2 connections
        { from: 2, to: 4 }, { from: 2, to: 9 }, { from: 2, to: 10 },
        // Node 3 connections
        { from: 3, to: 1 }, { from: 3, to: 12 }, { from: 3, to: 5 },
        // Node 5 connections
        { from: 5, to: 1 }, { from: 5, to: 12 }, { from: 5, to: 7 },
        // Node 7 connections
        { from: 7, to: 10 }, { from: 7, to: 11 }, { from: 7, to: 12 },
        // Node 9 connections
        { from: 9, to: 12 }, { from: 9, to: 10 },
        // Node 8 connections
        { from: 8, to: 4 }, { from: 8, to: 6 }, { from: 8, to: 10 }, { from: 8, to: 11 },
        // Node 6 connections
        { from: 6, to: 4 }, { from: 6, to: 10 },
        // Node 4 connections
        { from: 4, to: 10 },
        // Node 10 connections
        { from: 10, to: 5 },
        // Node 11 connections
        { from: 11, to: 12 }, { from: 11, to: 4 }, { from: 11, to: 10 },
    ];
    
    // Create SVG lines
    connections.forEach((conn, index) => {
        const fromNode = nodeCenters.find(n => n.index === conn.from);
        const toNode = nodeCenters.find(n => n.index === conn.to);
        
        if (fromNode && toNode) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute('x1', fromNode.x + '%');
            line.setAttribute('y1', fromNode.y + '%');
            line.setAttribute('x2', toNode.x + '%');
            line.setAttribute('y2', toNode.y + '%');
            line.setAttribute('stroke', '#00d4aa');
            line.setAttribute('stroke-width', '1.5');
            line.setAttribute('opacity', '0.3');
            // Choose different animation for each line
            const animations = ['fadeInOut', 'fadeInOut2', 'fadeInOut3'];
            const animationName = animations[index % animations.length];
            line.style.animationDelay = (index * 0.4) + 's';
            line.style.animation = animationName + ' 8s ease-in-out infinite';
            line.style.filter = 'drop-shadow(0 0 2px rgba(0, 212, 170, 0.2))';
            
            svg.appendChild(line);
            console.log(`Created line from node ${conn.from} to node ${conn.to}`);
        }
    });
    
    console.log('Created', connections.length, 'lines');
}

// Update connections when layout is ready and on resize (debounced)
function onLayoutReady(callback) {
    // Wait for fonts (affecting layout) and next frame to ensure precise positions
    const proceed = () => requestAnimationFrame(() => requestAnimationFrame(callback));
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(proceed).catch(proceed);
    } else {
        if (document.readyState === 'complete') {
            proceed();
        } else {
            window.addEventListener('load', proceed, { once: true });
        }
    }
}

function debounce(fn, wait) {
    let timeoutId = null;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), wait);
    };
}

document.addEventListener('DOMContentLoaded', function() {
    const svg = document.querySelector('.network-svg');
    if (svg) svg.style.visibility = 'hidden';
    onLayoutReady(() => {
        updateNetworkConnections();
        if (svg) svg.style.visibility = 'visible';
    });
    window.addEventListener('resize', debounce(() => {
        updateNetworkConnections();
    }, 150));
});