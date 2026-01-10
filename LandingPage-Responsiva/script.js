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

    (function () {
    const waWidget = document.getElementById("waWidget");
    const waFab = document.getElementById("waFab");
    const waPanel = document.getElementById("waPanel");
    const waClose = document.getElementById("waClose");
    const waCta = document.getElementById("waCta");

    // Coloque seu link aqui (troque o número e a mensagem):
    // Exemplo: https://wa.me/5511999999999?text=Oi%2C%20precisa%20de%20ajuda%3F
    const WHATSAPP_LINK = "https://wa.me/5511954234299?text=Oi%2C%20precisa%20de%20ajuda%3F";

    waCta.href = WHATSAPP_LINK;

    function openWidget() {
        waWidget.classList.add("is-open");
        waPanel.setAttribute("aria-hidden", "false");
    }

    function closeWidget() {
        waWidget.classList.remove("is-open");
        waPanel.setAttribute("aria-hidden", "true");
    }

    waFab.addEventListener("click", () => {
        if (waWidget.classList.contains("is-open")) closeWidget();
        else openWidget();
    });

    waClose.addEventListener("click", closeWidget);

    // Fechar clicando fora
    document.addEventListener("click", (e) => {
        const clickedInside = waWidget.contains(e.target);
        if (!clickedInside) closeWidget();
    });

    // ESC fecha
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeWidget();
    });
    })();
