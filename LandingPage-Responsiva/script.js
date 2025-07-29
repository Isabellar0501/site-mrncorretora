// ========================================
// 🎠 CARROSSEL PERSONALIZADO - MRN CORRETORA
// ========================================

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

// ========================================
// 🎠 CLASSE DO CARROSSEL PERSONALIZADO
// ========================================

class CustomCarousel {
    constructor(containerSelector, options = {}) {
        // Elementos do DOM
        this.container = document.querySelector(containerSelector);
        this.track = this.container?.querySelector('.custom-carousel-track');
        this.slides = this.container?.querySelectorAll('.carousel-slide');
        this.prevBtn = this.container?.querySelector('#carouselPrev');
        this.nextBtn = this.container?.querySelector('#carouselNext');
        this.indicatorsContainer = this.container?.querySelector('#carouselIndicators');
        
        if (!this.container || !this.track || !this.slides.length) {
            console.error('❌ Elementos do carrossel não encontrados');
            return;
        }
        
        // Configurações
        this.options = {
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            infinite: true,
            speed: 600,
            responsive: [
                { breakpoint: 1200, settings: { slidesToShow: 4 } },
                { breakpoint: 768, settings: { slidesToShow: 3 } },
                { breakpoint: 480, settings: { slidesToShow: 2 } }
            ],
            ...options
        };
        
        // Estado do carrossel
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.slidesToShow = this.options.slidesToShow;
        this.maxIndex = Math.max(0, this.totalSlides - this.slidesToShow);
        this.isPlaying = this.options.autoplay;
        this.autoplayTimer = null;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.initialTransform = 0;
        
        console.log('🎠 Inicializando carrossel personalizado...');
        this.init();
    }
    
    init() {
        this.setupSlides();
        this.createIndicators();
        this.setupEventListeners();
        this.updateResponsive();
        this.updateCarousel();
        this.startAutoplay();
        
        console.log('✅ Carrossel inicializado com sucesso!');
        console.log(`📊 Total de slides: ${this.totalSlides}, Mostrando: ${this.slidesToShow}`);
    }
    
    setupSlides() {
        // Clonar slides para efeito infinito se necessário
        if (this.options.infinite && this.totalSlides > this.slidesToShow) {
            const firstSlides = Array.from(this.slides).slice(0, this.slidesToShow);
            const lastSlides = Array.from(this.slides).slice(-this.slidesToShow);
            
            // Adicionar clones no final
            firstSlides.forEach(slide => {
                const clone = slide.cloneNode(true);
                clone.classList.add('clone');
                this.track.appendChild(clone);
            });
            
            // Adicionar clones no início
            lastSlides.reverse().forEach(slide => {
                const clone = slide.cloneNode(true);
                clone.classList.add('clone');
                this.track.insertBefore(clone, this.track.firstChild);
            });
            
            // Atualizar referências
            this.allSlides = this.track.querySelectorAll('.carousel-slide');
            this.currentIndex = this.slidesToShow; // Começar após os clones
        } else {
            this.allSlides = this.slides;
        }
        
        // Definir largura dos slides
        this.updateSlideWidth();
    }
    
    updateSlideWidth() {
        const containerWidth = this.container.offsetWidth - 120; // Desconto para botões
        const slideWidth = containerWidth / this.slidesToShow;
        
        this.allSlides.forEach(slide => {
            slide.style.width = `${slideWidth - 20}px`; // Gap entre slides
        });
        
        this.slideWidth = slideWidth;
    }
    
    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        const indicatorCount = Math.ceil(this.totalSlides / this.slidesToShow);
        
        for (let i = 0; i < indicatorCount; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.setAttribute('data-slide', i);
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
        
        this.indicators = this.indicatorsContainer.querySelectorAll('.carousel-indicator');
    }
    
    setupEventListeners() {
        // Botões de navegação
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Touch/Mouse events para swipe
        this.track.addEventListener('mousedown', this.handleStart.bind(this));
        this.track.addEventListener('touchstart', this.handleStart.bind(this));
        this.track.addEventListener('mousemove', this.handleMove.bind(this));
        this.track.addEventListener('touchmove', this.handleMove.bind(this));
        this.track.addEventListener('mouseup', this.handleEnd.bind(this));
        this.track.addEventListener('touchend', this.handleEnd.bind(this));
        this.track.addEventListener('mouseleave', this.handleEnd.bind(this));
        
        // Pausar autoplay no hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
        
        // Responsive
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.updateResponsive();
                this.updateSlideWidth();
                this.updateCarousel();
            }, 250);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.container.matches(':hover')) {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            }
        });
    }
    
    handleStart(e) {
        this.isDragging = true;
        this.startX = this.getEventX(e);
        this.initialTransform = this.getCurrentTransform();
        this.track.classList.add('dragging');
        this.pauseAutoplay();
    }
    
    handleMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = this.getEventX(e);
        const deltaX = this.currentX - this.startX;
        const newTransform = this.initialTransform + deltaX;
        
        this.track.style.transform = `translateX(${newTransform}px)`;
    }
    
    handleEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.track.classList.remove('dragging');
        
        const deltaX = this.currentX - this.startX;
        const threshold = this.slideWidth / 3;
        
        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        } else {
            this.updateCarousel();
        }
        
        this.startAutoplay();
    }
    
    getEventX(e) {
        return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }
    
    getCurrentTransform() {
        const transform = window.getComputedStyle(this.track).transform;
        if (transform === 'none') return 0;
        const matrix = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
        return parseFloat(matrix[4]) || 0;
    }
    
    updateResponsive() {
        const width = window.innerWidth;
        let newSlidesToShow = this.options.slidesToShow;
        
        for (const breakpoint of this.options.responsive) {
            if (width <= breakpoint.breakpoint) {
                newSlidesToShow = breakpoint.settings.slidesToShow;
                break;
            }
        }
        
        if (newSlidesToShow !== this.slidesToShow) {
            this.slidesToShow = newSlidesToShow;
            this.maxIndex = Math.max(0, this.totalSlides - this.slidesToShow);
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            console.log(`📱 Responsive: ${this.slidesToShow} slides visíveis`);
        }
    }
    
    prevSlide() {
        if (this.options.infinite) {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.maxIndex;
            }
        } else {
            this.currentIndex = Math.max(0, this.currentIndex - this.options.slidesToScroll);
        }
        this.updateCarousel();
    }
    
    nextSlide() {
        if (this.options.infinite) {
            this.currentIndex++;
            if (this.currentIndex > this.maxIndex) {
                this.currentIndex = 0;
            }
        } else {
            this.currentIndex = Math.min(this.maxIndex, this.currentIndex + this.options.slidesToScroll);
        }
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index * this.slidesToShow, this.maxIndex));
        this.updateCarousel();
    }
    
    updateCarousel() {
        // Calcular transformação
        const translateX = -this.currentIndex * this.slideWidth;
        
        // Aplicar transformação com transição suave
        this.track.style.transition = this.isDragging ? 'none' : `transform ${this.options.speed}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Atualizar slides ativos
        this.updateActiveSlides();
        
        // Atualizar indicadores
        this.updateIndicators();
        
        // Atualizar botões
        this.updateButtons();
        
        // Callback de mudança
        this.onSlideChange();
    }
    
    updateActiveSlides() {
        this.allSlides.forEach((slide, index) => {
            const isActive = index >= this.currentIndex && index < this.currentIndex + this.slidesToShow;
            slide.classList.toggle('active', isActive);
        });
    }
    
    updateIndicators() {
        if (!this.indicators) return;
        
        const activeIndicatorIndex = Math.floor(this.currentIndex / this.slidesToShow);
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndicatorIndex);
        });
    }
    
    updateButtons() {
        if (!this.options.infinite) {
            if (this.prevBtn) {
                this.prevBtn.disabled = this.currentIndex === 0;
                this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.3' : '0.8';
            }
            if (this.nextBtn) {
                this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
                this.nextBtn.style.opacity = this.currentIndex >= this.maxIndex ? '0.3' : '0.8';
            }
        }
    }
    
    startAutoplay() {
        if (!this.options.autoplay || this.autoplayTimer) return;
        
        this.isPlaying = true;
        this.autoplayTimer = setInterval(() => {
            if (this.isPlaying && !this.isDragging) {
                this.nextSlide();
            }
        }, this.options.autoplaySpeed);
        
        console.log('▶️ Autoplay iniciado');
    }
    
    pauseAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
            this.isPlaying = false;
            console.log('⏸️ Autoplay pausado');
        }
    }
    
    stopAutoplay() {
        this.pauseAutoplay();
        this.options.autoplay = false;
    }
    
    onSlideChange() {
        // Evento personalizado para quando o slide muda
        const event = new CustomEvent('carouselChange', {
            detail: {
                currentIndex: this.currentIndex,
                totalSlides: this.totalSlides,
                slidesToShow: this.slidesToShow
            }
        });
        this.container.dispatchEvent(event);
    }
    
    // Métodos públicos para controle externo
    destroy() {
        this.pauseAutoplay();
        // Remover event listeners se necessário
        console.log('🗑️ Carrossel destruído');
    }
    
    refresh() {
        this.updateResponsive();
        this.updateSlideWidth();
        this.updateCarousel();
        console.log('🔄 Carrossel atualizado');
    }
}

// ========================================
// 🚀 INICIALIZAÇÃO DO CARROSSEL
// ========================================

let carousel;

function initCustomCarousel() {
    console.log('🎠 Tentando inicializar carrossel personalizado...');
    
    const carouselContainer = document.querySelector('.custom-carousel-wrapper');
    if (!carouselContainer) {
        console.error('❌ Container do carrossel não encontrado');
        return;
    }
    
    // Configurações do carrossel
    const carouselOptions = {
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        infinite: true,
        speed: 600,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 4 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 480, settings: { slidesToShow: 2 } }
        ]
    };
    
    // Criar instância do carrossel
    carousel = new CustomCarousel('.custom-carousel-wrapper', carouselOptions);
    
    // Event listener para mudanças
    carouselContainer.addEventListener('carouselChange', (e) => {
        console.log('🔄 Slide mudou:', e.detail);
    });
    
    console.log('✅ Carrossel personalizado inicializado!');
}

// ========================================
// 🎯 INTERSECTION OBSERVER PARA ANIMAÇÕES
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('stats')) {
                animateCounters();
                observer.unobserve(entry.target);
            }
            
            // Adicionar classe de animação para outros elementos
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// ========================================
// 🌟 INICIALIZAÇÃO PRINCIPAL
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado, inicializando componentes...');
    
    // Observar seções para animações
    const sections = document.querySelectorAll('.stats, .services, .about');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Inicializar carrossel personalizado
    setTimeout(() => {
        initCustomCarousel();
    }, 100);
});

// ========================================
// 📱 HEADER SCROLL EFFECT
// ========================================

window.addEventListener('scroll', () => {
    const header = document.querySelector('.navigation');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// ========================================
// ⌨️ EFEITO DE DIGITAÇÃO NO TÍTULO
// ========================================

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Inicializar efeito de digitação quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const mainTitle = document.querySelector('.home-text h1');
    if (mainTitle) {
        const originalText = mainTitle.textContent;
        setTimeout(() => {
            typeWriter(mainTitle, originalText, 150);
        }, 1000);
    }
});

// ========================================
// 🖱️ LAZY LOADING PARA IMAGENS
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// 🎨 EFEITOS DE HOVER NOS CARDS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Efeito de hover nos cards de serviços
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// ========================================
// 🔝 SCROLL TO TOP FUNCTIONALITY
// ========================================

const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="bx bx-up-arrow-alt"></i>';
scrollToTopBtn.className = 'scroll-to-top';

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// 🎬 ANIMAÇÕES DE ENTRADA
// ========================================

const observeElements = document.querySelectorAll('.stat-card, .service-card');
const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            elementObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

observeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    elementObserver.observe(el);
});

// ========================================
// 🐛 DEBUG E UTILITÁRIOS
// ========================================

// Debug do carrossel
window.debugCarousel = function() {
    console.log('🔍 Debug do Carrossel Personalizado:');
    console.log('- Carrossel instância:', carousel);
    console.log('- Container encontrado:', !!document.querySelector('.custom-carousel-wrapper'));
    console.log('- Slides encontrados:', document.querySelectorAll('.carousel-slide').length);
    console.log('- Indicadores encontrados:', document.querySelectorAll('.carousel-indicator').length);
    
    if (carousel) {
        console.log('- Index atual:', carousel.currentIndex);
        console.log('- Total de slides:', carousel.totalSlides);
        console.log('- Slides visíveis:', carousel.slidesToShow);
        console.log('- Autoplay ativo:', carousel.isPlaying);
    }
};

// Controles globais do carrossel
window.carouselControls = {
    next: () => carousel?.nextSlide(),
    prev: () => carousel?.prevSlide(),
    pause: () => carousel?.pauseAutoplay(),
    play: () => carousel?.startAutoplay(),
    goTo: (index) => carousel?.goToSlide(index),
    refresh: () => carousel?.refresh()
};

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

console.log('✅ Script personalizado carregado com sucesso!');
console.log('💡 Use window.debugCarousel() no console para debug');
console.log('🎮 Use window.carouselControls para controlar o carrossel');