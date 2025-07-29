// Menu Mobile Toggle
const menu = document.querySelector('.menu');
const navMenu = document.querySelector('.nav-menu');

menu.addEventListener('click', () => {
    menu.classList.toggle('ativo');
    navMenu.classList.toggle('ativo');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-item a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('ativo');
        navMenu.classList.remove('ativo');
    });
});

// FAQ Toggle Function
function togglePergunta(elemento) {
    elemento.parentElement.classList.toggle('aberta');
    const desc = elemento.nextElementSibling;
    
    if (desc.style.display === 'none' || desc.style.display === '') {
        desc.style.display = 'block';
    } else {
        desc.style.display = 'none';
    }
}

// Smooth scroll para links internos
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

// Animação de contadores
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const numericValue = target.replace(/[^0-9]/g, '');
        const prefix = target.replace(/[0-9]/g, '').trim();
        
        if (numericValue) {
            const increment = Math.ceil(numericValue / 100);
            let current = 0;
            
            const updateCounter = () => {
                if (current < numericValue) {
                    current += increment;
                    if (current > numericValue) current = numericValue;
                    
                    if (prefix) {
                        counter.textContent = prefix + ' ' + current.toLocaleString('pt-BR');
                    } else {
                        counter.textContent = current.toLocaleString('pt-BR');
                    }
                    
                    requestAnimationFrame(updateCounter);
                }
            };
            
            updateCounter();
        }
    });
}