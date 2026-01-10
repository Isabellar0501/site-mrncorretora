// Toggle Widget Content
function toggleWidget(type) {
    const card = document.querySelector(`.widget-card[data-type="${type}"]`);
    const allCards = document.querySelectorAll('.widget-card');
    const widgetsGrid = document.querySelector('.widgets-grid');

    // Se o card clicado já está ativo, fecha ele
    if (card.classList.contains('active')) {
        card.classList.remove('active');
        widgetsGrid.classList.remove('has-active');
        return;
    }

    // Fecha todos os outros cards
    allCards.forEach(c => {
        if (c !== card) {
            c.classList.remove('active');
        }
    });

    // Abre o card clicado
    card.classList.add('active');
    widgetsGrid.classList.add('has-active');

    // Scroll suave até o card
    setTimeout(() => {
        const cardTop = card.offsetTop - 100;
        window.scrollTo({
            top: cardTop,
            behavior: 'smooth'
        });
    }, 100);
}

// Fechar widget ao clicar fora
document.addEventListener('click', (e) => {
    const widgets = document.querySelectorAll('.widget-card');
    const widgetsGrid = document.querySelector('.widgets-grid');
    const clickedInsideWidget = e.target.closest('.widget-card');

    if (!clickedInsideWidget) {
        widgets.forEach(widget => {
            widget.classList.remove('active');
        });
        widgetsGrid.classList.remove('has-active');
    }
});

// Animação de entrada dos widgets
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const widgetObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            widgetObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Inicializar observador quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    const widgetCards = document.querySelectorAll('.widget-card');

    widgetCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        widgetObserver.observe(card);
    });

    // Abrir widget específico se houver hash na URL
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        const validTypes = ['auto', 'residencial', 'moto', 'vida', 'empresarial', 'celular'];
        if (validTypes.includes(hash)) {
            setTimeout(() => {
                toggleWidget(hash);
            }, 500);
        }
    }
});

// Adicionar funcionalidade de impressão
function printWidgetInfo(type) {
    const card = document.querySelector(`.widget-card[data-type="${type}"]`);
    if (card) {
        card.classList.add('active');
        setTimeout(() => {
            window.print();
        }, 300);
    }
}

// Adicionar atalhos de teclado
document.addEventListener('keydown', (e) => {
    // ESC para fechar todos os widgets
    if (e.key === 'Escape') {
        const widgetsGrid = document.querySelector('.widgets-grid');
        document.querySelectorAll('.widget-card').forEach(card => {
            card.classList.remove('active');
        });
        widgetsGrid.classList.remove('has-active');
    }

    // Números 1-6 para abrir widgets específicos
    const typeMap = {
        '1': 'auto',
        '2': 'residencial',
        '3': 'moto',
        '4': 'vida',
        '5': 'empresarial',
        '6': 'celular'
    };

    if (typeMap[e.key]) {
        toggleWidget(typeMap[e.key]);
    }
});

// Tracking de interações (Google Analytics, se configurado)
function trackWidgetInteraction(type, action) {
    // Se você tiver Google Analytics configurado, descomente:
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         'event_category': 'Widget Cotacao',
    //         'event_label': type
    //     });
    // }

    console.log(`Widget ${type} - ${action}`);
}

// Adicionar listeners para tracking
document.addEventListener('DOMContentLoaded', () => {
    // Track cliques nos botões de widget
    document.querySelectorAll('.widget-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.widget-card');
            const type = card.getAttribute('data-type');
            const isOpening = !card.classList.contains('active');
            trackWidgetInteraction(type, isOpening ? 'open' : 'close');
        });
    });

    // Track cliques nos botões de ação
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.widget-card');
            if (card) {
                const type = card.getAttribute('data-type');
                trackWidgetInteraction(type, 'solicitacao_cotacao');
            }
        });
    });

    document.querySelectorAll('.btn-whatsapp').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.widget-card');
            if (card) {
                const type = card.getAttribute('data-type');
                trackWidgetInteraction(type, 'whatsapp_click');
            }
        });
    });
});

// Scroll to top quando navegar para a página
window.addEventListener('load', () => {
    if (!window.location.hash) {
        window.scrollTo(0, 0);
    }
});

// Adicionar efeito de fade no hero
const hero = document.querySelector('.cotacao-hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        const opacity = 1 - (scrolled / heroHeight);

        if (scrolled < heroHeight) {
            hero.style.opacity = opacity;
        }
    });
}

// Prevenir múltiplos cliques rápidos
let clickTimeout;
const originalToggleWidget = toggleWidget;

toggleWidget = function(type) {
    if (clickTimeout) return;

    originalToggleWidget(type);

    clickTimeout = setTimeout(() => {
        clickTimeout = null;
    }, 300);
};

console.log('✅ Cotação script carregado com sucesso!');
console.log('💡 Atalhos de teclado: 1-6 para abrir widgets, ESC para fechar');
