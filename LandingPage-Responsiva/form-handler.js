// ========================================
// 📧 SISTEMA DE COTAÇÃO MRN CORRETORA
// ========================================

// 🔧 CONFIGURAÇÃO DO EMAILJS
// ⚠️  IMPORTANTE: Substitua os valores abaixo pelas suas credenciais do EmailJS
const EMAIL_CONFIG = {
    // 📝 COLE SEU SERVICE ID AQUI (ex: service_abc123)
    serviceID: 'service_ab6yoye',
    
    // 📝 USE EXATAMENTE ESTE NOME NO TEMPLATE
    templateID: 'template_cotacao_mrn',
    
    // 📝 COLE SUA PUBLIC KEY AQUI (ex: user_xyz789abc)
    userID: 'bPzYYP5mGaL1x1wsA',
    
    // ✅ EMAIL DE DESTINO (já configurado)
    destinationEmail: 'mrrnunescorretora@gmail.com'
};

// 🚀 INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Iniciando sistema de cotação...');
    
    // Verificar se EmailJS está carregado
    if (typeof emailjs !== 'undefined') {
        // Inicializar EmailJS com sua Public Key
        emailjs.init(EMAIL_CONFIG.userID);
        console.log('✅ EmailJS carregado e inicializado');
    } else {
        console.log('⚠️  EmailJS não carregado - usando método mailto como fallback');
    }
    
    // Configurar o formulário
    setupFormHandler();
});

// 📋 CONFIGURAÇÃO DO FORMULÁRIO
function setupFormHandler() {
    const form = document.querySelector('#cotacao-form');
    if (!form) {
        console.error('❌ Formulário de cotação não encontrado');
        return;
    }
    
    console.log('✅ Formulário encontrado e configurado');
    
    // Event listener para submit
    form.addEventListener('submit', handleFormSubmit);
    
    // Validação em tempo real
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrorMessage);
    });
    
    // Máscara para telefone brasileiro
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhone);
    }
}

// 📤 ENVIO DO FORMULÁRIO
async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('📨 Tentativa de envio do formulário...');
    
    const form = e.target;
    const submitButton = form.querySelector('.submit-button');
    const originalButtonText = submitButton.textContent;
    
    // Validar dados
    if (!validateForm(form)) {
        showMessage('❌ Por favor, corrija os erros antes de enviar.', 'error');
        return;
    }
    
    // Coletar dados
    const formData = collectFormData(form);
    console.log('📊 Dados coletados:', formData);
    
    // UI Loading
    submitButton.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Enviando...';
    submitButton.disabled = true;
    showMessage('📤 Enviando sua cotação...', 'info');
    
    try {
        // Tentar envio via EmailJS
        if (typeof emailjs !== 'undefined' && 
            EMAIL_CONFIG.serviceID !== 'SEU_SERVICE_ID_AQUI' && 
            EMAIL_CONFIG.userID !== 'SUA_PUBLIC_KEY_AQUI') {
            
            console.log('📧 Enviando via EmailJS...');
            await sendViaEmailJS(formData);
            console.log('✅ Email enviado via EmailJS');
            
        } else {
            console.log('📬 Enviando via mailto (fallback)...');
            await sendViaMailto(formData);
            console.log('✅ Email enviado via mailto');
        }
        
        // Sucesso
        showMessage('🎉 Cotação enviada com sucesso! Entraremos em contato em breve.', 'success');
        form.reset();
        trackFormSubmission(formData);
        
    } catch (error) {
        console.error('❌ Erro ao enviar:', error);
        showMessage('❌ Erro ao enviar cotação. Tente novamente ou ligue para (11) 99999-9999.', 'error');
    } finally {
        // Restaurar botão
        submitButton.innerHTML = '<i class="bx bx-send"></i> Solicitar Cotação';
        submitButton.disabled = false;
    }
}

// 📊 COLETA DE DADOS
function collectFormData(form) {
    const formData = new FormData(form);
    return {
        name: formData.get('name')?.trim() || '',
        email: formData.get('email')?.trim() || '',
        phone: formData.get('phone')?.trim() || '',
        service: formData.get('service') || '',
        message: formData.get('message')?.trim() || '',
        timestamp: new Date().toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'Acesso direto'
    };
}

// 📧 ENVIO VIA EMAILJS
async function sendViaEmailJS(data) {
    const templateParams = {
        to_email: EMAIL_CONFIG.destinationEmail,
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        service_type: getServiceTypeName(data.service),
        message: data.message,
        timestamp: data.timestamp,
        referrer: data.referrer
    };
    
    console.log('📧 Parâmetros do template:', templateParams);
    
    const response = await emailjs.send(
        EMAIL_CONFIG.serviceID,
        EMAIL_CONFIG.templateID,
        templateParams
    );
    
    console.log('✅ Resposta EmailJS:', response);
    return response;
}

// 📬 ENVIO VIA MAILTO (FALLBACK)
async function sendViaMailto(data) {
    const subject = encodeURIComponent(`🛡️ Nova Cotação MRN - ${getServiceTypeName(data.service)} - ${data.name}`);
    const body = encodeURIComponent(formatEmailBody(data));
    const mailtoUrl = `mailto:${EMAIL_CONFIG.destinationEmail}?subject=${subject}&body=${body}`;
    
    console.log('📬 Abrindo cliente de email...');
    window.open(mailtoUrl, '_blank');
    
    // Simular delay para UX
    return new Promise(resolve => setTimeout(resolve, 1500));
}

// 📝 FORMATAÇÃO DO EMAIL
function formatEmailBody(data) {
    return `
🛡️ NOVA COTAÇÃO - MRN CORRETORA

📋 DADOS DO CLIENTE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Nome: ${data.name}
📧 Email: ${data.email}
📱 Telefone: ${data.phone}
🛡️ Tipo de Seguro: ${getServiceTypeName(data.service)}

💬 MENSAGEM:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message}

ℹ️ INFORMAÇÕES TÉCNICAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 Data/Hora: ${data.timestamp}
🌐 Origem: ${data.referrer}

──────────────────────────────────────────────────
📧 Esta cotação foi enviada pelo site da MRN Corretora
📞 Para contato direto: (11) 954234299
🌐 Site: https://mrncorretora.com.br
`.trim();
}

// 🏷️ TIPOS DE SERVIÇO
function getServiceTypeName(serviceValue) {
    const services = {
        'auto': '🚗 Seguro Auto',
        'residencial': '🏠 Seguro Residencial',
        'saude': '❤️ Seguro Saúde',
        'vida': '🛡️ Seguro Vida',
        'empresarial': '🏢 Seguro Empresarial'
    };
    return services[serviceValue] || '❓ Não especificado';
}

// ✅ VALIDAÇÃO DO FORMULÁRIO
function validateForm(form) {
    let isValid = true;
    const fields = ['name', 'email', 'phone', 'service', 'message'];
    
    console.log('🔍 Validando formulário...');
    
    fields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    console.log(isValid ? '✅ Formulário válido' : '❌ Formulário inválido');
    return isValid;
}

// 🔍 VALIDAÇÃO DE CAMPO
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    clearFieldError(field);
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Nome é obrigatório';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Nome deve ter pelo menos 2 caracteres';
                isValid = false;
            } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
                errorMessage = 'Nome deve conter apenas letras';
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = 'Email é obrigatório';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Email inválido';
                isValid = false;
            }
            break;
            
        case 'phone':
            const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            if (!value) {
                errorMessage = 'Telefone é obrigatório';
                isValid = false;
            } else if (!phoneRegex.test(value)) {
                errorMessage = 'Formato: (11) 99999-9999';
                isValid = false;
            }
            break;
            
        case 'service':
            if (!value) {
                errorMessage = 'Selecione um tipo de seguro';
                isValid = false;
            }
            break;
            
        case 'message':
            if (!value) {
                errorMessage = 'Mensagem é obrigatória';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// ❌ MOSTRAR ERRO NO CAMPO
function showFieldError(field, message) {
    field.classList.add('error');
    
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
        font-weight: 500;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

// ✅ LIMPAR ERRO DO CAMPO
function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) errorMessage.remove();
}

function clearErrorMessage(e) {
    const field = e.target;
    if (field.value.trim()) {
        clearFieldError(field);
    }
}

// 📱 MÁSCARA TELEFONE BRASILEIRO
function formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    e.target.value = value;
}

// 💬 SISTEMA DE MENSAGENS
function showMessage(message, type) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) existingMessage.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.innerHTML = `<i class="bx ${getMessageIcon(type)}"></i> ${message}`;
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8'
    };
    
    messageDiv.style.cssText = `
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
        text-align: center;
        font-weight: 500;
        animation: slideDown 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    `;
    
    if (!document.querySelector('#message-styles')) {
        const style = document.createElement('style');
        style.id = 'message-styles';
        style.textContent = `
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    const form = document.querySelector('#cotacao-form');
    form.parentNode.insertBefore(messageDiv, form);
    
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

function getMessageIcon(type) {
    const icons = {
        success: 'bx-check-circle',
        error: 'bx-error-circle',
        info: 'bx-info-circle'
    };
    return icons[type] || icons.info;
}

// 📊 TRACKING E ANALYTICS
function trackFormSubmission(data) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cotacao_enviada', {
            event_category: 'formulario',
            event_label: data.service,
            value: 1
        });
    }
    
    console.log('📊 Cotação registrada:', {
        tipo: data.service,
        timestamp: data.timestamp
    });
}

// 🌍 EXPORTAR PARA USO GLOBAL
window.FormHandler = {
    setupFormHandler,
    handleFormSubmit,
    validateForm,
    showMessage
};

console.log('✅ Sistema de cotação MRN carregado com sucesso!');