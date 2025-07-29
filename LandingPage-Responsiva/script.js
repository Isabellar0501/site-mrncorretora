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

// Inicialização do Carrossel de Seguradoras - CORRIGIDO
function initCarrossel() {
    // Verificar se o Swiper está disponível
    if (typeof Swiper === 'undefined') {
        console.error('❌ Swiper não encontrado. Verifique se o arquivo swiper-bundle.min.js foi carregado.');
        return;
    }

    console.log('✅ Swiper encontrado, inicializando carrossel...');
    
    // Verificar se o container existe
    const swiperContainer = document.querySelector('.elementor-image-carousel-wrapper');
    if (!swiperContainer) {
        console.error('❌ Container do carrossel não encontrado');
        return;
    }

    console.log('✅ Container encontrado, criando instância do Swiper...');
    
    try {
        const swiper = new Swiper('.elementor-image-carousel-wrapper', {
            // Configurações básicas
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            centeredSlides: false,
            
            // Autoplay
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            
            // Velocidade
            speed: 800,
            
            // Navegação
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            
            // Paginação
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            
            // Responsivo
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 10
                },
                480: {
                    slidesPerView: 2,
                    spaceBetween: 15
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 20
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 20
                },
                1200: {
                    slidesPerView: 5,
                    spaceBetween: 20
                }
            },
            
            // Efeitos
            effect: 'slide',
            grabCursor: true,
            
            // Callbacks
            on: {
                init: function() {
                    console.log('✅ Swiper inicializado com sucesso!');
                },
                slideChange: function() {
                    console.log('Slide mudou para:', this.activeIndex);
                }
            }
        });
        
        console.log('✅ Carrossel de seguradoras criado:', swiper);
        
        // Pausar autoplay ao hover
        swiperContainer.addEventListener('mouseenter', () => {
            if (swiper.autoplay) {
                swiper.autoplay.stop();
            }
        });
        
        swiperContainer.addEventListener('mouseleave', () => {
            if (swiper.autoplay) {
                swiper.autoplay.start();
            }
        });
        
        return swiper;
        
    } catch (error) {
        console.error('❌ Erro ao inicializar Swiper:', error);
        
        // Fallback: mostrar como grid
        const wrapper = swiperContainer.querySelector('.swiper-wrapper');
        if (wrapper) {
            wrapper.style.display = 'flex';
            wrapper.style.flexWrap = 'wrap';
            wrapper.style.justifyContent = 'center';
            wrapper.style.gap = '1rem';
        }
    }
}

// Intersection Observer para animações - SIMPLIFICADO
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

// Inicialização quando o DOM carrega - CORRIGIDO
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado, inicializando componentes...');
    
    // Observar seções para animações
    const sections = document.querySelectorAll('.stats, .services, .about');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Inicializar carrossel imediatamente quando a página carregar
    // Se o Swiper ainda não carregou, tentar novamente em intervalos
    let attempts = 0;
    const maxAttempts = 10;
    
    function tryInitCarrossel() {
        attempts++;
        console.log(`Tentativa ${attempts} de inicializar carrossel...`);
        
        if (typeof Swiper !== 'undefined') {
            initCarrossel();
        } else if (attempts < maxAttempts) {
            console.log('Swiper ainda não carregou, tentando novamente em 100ms...');
            setTimeout(tryInitCarrossel, 100);
        } else {
            console.error('❌ Swiper não carregou após várias tentativas');
        }
    }
    
    // Tentar inicializar imediatamente
    tryInitCarrossel();
});

// Header scroll effect
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

// Form validation and submission (mantendo o sistema original)
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !phone || !service || !message) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um email válido.');
                return;
            }
            
            // Simulação de envio
            const submitButton = document.querySelector('.submit-button');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Enviando...';
            submitButton.disabled = true;
            
            // Simular envio (substituir por integração real)
            setTimeout(() => {
                alert('Cotação solicitada com sucesso! Entraremos em contato em breve.');
                this.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
});

// Parallax effect para o hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.home::before');
    const speed = scrolled * 0.5;
    
    if (parallax) {
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Adicionar efeito de digitação no título principal
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

// Lazy loading para imagens
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

// Adicionar efeito de hover nos cards de serviços
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Scroll to top functionality
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

// Adicionar animação de entrada para elementos
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

// Debug do carrossel
window.debugCarrossel = function() {
    console.log('🔍 Debug do Carrossel:');
    console.log('- Swiper disponível:', typeof Swiper !== 'undefined');
    console.log('- Container encontrado:', !!document.querySelector('.elementor-image-carousel-wrapper'));
    console.log('- Slides encontrados:', document.querySelectorAll('.swiper-slide').length);
    console.log('- Paginação encontrada:', !!document.querySelector('.swiper-pagination'));
};

console.log('✅ Script principal carregado com sucesso!');
console.log('💡 Use window.debugCarrossel() no console para debug');