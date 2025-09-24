// Customer Info Panel JavaScript - VERSIÓN CORREGIDA

class CustomerInfoPanel {
    constructor() {
        this.form = null;
        this.nameInput = null;
        this.init();
        this.ensureAppStateExists();
    }

    // NUEVO: Asegurar que appState existe
    ensureAppStateExists() {
        if (typeof window.appState === 'undefined') {
            console.log('Creating appState from CustomerInfoPanel...');
            window.appState = {
                customerName: '',
                orderType: '',
                quantities: {},
                deliveryData: null,
                orderCode: '',
                currentView: 'customerInfoView',
                showView: function(viewId) {
                    console.log('Switching to view:', viewId);
                    document.querySelectorAll('.view').forEach(view => {
                        view.style.display = 'none';
                    });
                    const targetView = document.getElementById(viewId);
                    if (targetView) {
                        targetView.style.display = 'block';
                        this.currentView = viewId;
                        console.log('View switched successfully to:', viewId);
                    } else {
                        console.error('View not found:', viewId);
                    }
                }
            };
        }
        
        // Mantener compatibilidad: si app no es un objeto válido, crear referencia
        if (!window.app || typeof window.app !== 'object' || window.app.tagName) {
            console.log('App object is DOM element or undefined, creating reference to appState');
            window.app = window.appState;
        }
    }

    init() {
        this.form = document.getElementById('customerForm');
        this.nameInput = document.getElementById('customerName');
        
        if (this.form && this.nameInput) {
            this.setupEventListeners();
            this.setupValidation();
            this.addAnimations();
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.nameInput.addEventListener('input', (e) => this.handleInput(e));
        this.nameInput.addEventListener('focus', (e) => this.handleFocus(e));
        this.nameInput.addEventListener('blur', (e) => this.handleBlur(e));
    }

    setupValidation() {
        // Real-time validation
        this.nameInput.addEventListener('input', (e) => {
            this.validateName(e.target.value);
        });
    }

    addAnimations() {
        // Entrance animation when view becomes active
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.id === 'customerInfoView' && 
                    mutation.target.style.display !== 'none') {
                    this.animateEntrance();
                }
            });
        });

        const customerInfoView = document.getElementById('customerInfoView');
        if (customerInfoView) {
            observer.observe(customerInfoView, { 
                attributes: true, 
                attributeFilter: ['style'] 
            });
        }
    }

    animateEntrance() {
        const view = document.getElementById('customerInfoView');
        if (!view) return;
        
        view.classList.add('active');
        
        // Animate form elements
        const elements = view.querySelectorAll('.card > *');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    validateName(name) {
        const trimmedName = name.trim();
        const isValid = trimmedName.length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName);
        
        this.nameInput.classList.remove('error', 'success');
        
        if (name.length > 0) {
            this.nameInput.classList.add(isValid ? 'success' : 'error');
        }
        
        return isValid;
    }

    handleInput(e) {
        // Remove any extra spaces and capitalize first letters
        const value = e.target.value.replace(/\s+/g, ' ');
        const capitalized = value.replace(/\b\w/g, l => l.toUpperCase());
        
        if (capitalized !== value) {
            e.target.value = capitalized;
        }
    }

    handleFocus(e) {
        const formGroup = e.target.closest('.form-group');
        if (formGroup) {
            formGroup.style.transform = 'translateY(-2px)';
        }
    }

    handleBlur(e) {
        const formGroup = e.target.closest('.form-group');
        if (formGroup) {
            formGroup.style.transform = 'translateY(0)';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const customerName = formData.get('customerName').trim();
        
        console.log('Customer form submitted:', customerName);
        
        if (!this.validateName(customerName)) {
            this.showError('Por favor ingresa un nombre válido (mínimo 2 caracteres, solo letras)');
            this.nameInput.focus();
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Store customer name - USING appState consistently
            if (!window.appState) {
                console.error('AppState not found! Creating it...');
                window.appState = {
                    customerName: '',
                    orderType: '',
                    quantities: {},
                    deliveryData: null,
                    orderCode: '',
                    showView: function(viewId) {
                        console.log('Switching to view:', viewId);
                        document.querySelectorAll('.view').forEach(view => {
                            view.style.display = 'none';
                        });
                        const targetView = document.getElementById(viewId);
                        if (targetView) {
                            targetView.style.display = 'block';
                            console.log('View switched successfully to:', viewId);
                        } else {
                            console.error('View not found:', viewId);
                        }
                    }
                };
            }
            
            window.appState.customerName = customerName;
            
            // Ensure app reference exists
            if (!window.app || typeof window.app !== 'object' || window.app.tagName) {
                window.app = window.appState;
            }
            
            // Update greeting for next view
            const greetingElement = document.getElementById('customerGreeting');
            if (greetingElement) {
                greetingElement.textContent = `¡Hola ${customerName}!`;
            }
            
            // Add success animation
            await this.animateSuccess();
            
            // Navigate to menu - USING appState consistently
            if (window.appState && window.appState.showView) {
                window.appState.showView('menuView');
                if (window.menuPanel) {
                    window.menuPanel.updateOrderSummary();
                }
            } else {
                console.error('AppState.showView not available!');
            }
            
            // Debug logging
            console.log('Customer name set in appState:', window.appState.customerName);
            console.log('Current appState after customer info:', window.appState);
            
        } catch (error) {
            console.error('Error processing customer info:', error);
            this.showError('Ocurrió un error. Por favor intenta nuevamente.');
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        const form = this.form;
        const button = form.querySelector('button[type="submit"]');
        
        if (loading) {
            form.classList.add('loading');
            button.innerHTML = '<span>Procesando...</span>';
            button.disabled = true;
        } else {
            form.classList.remove('loading');
            button.innerHTML = 'Continuar al Menú';
            button.disabled = false;
        }
    }

    async animateSuccess() {
        return new Promise(resolve => {
            const input = this.nameInput;
            input.style.borderColor = '#10b981';
            input.style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                input.style.transform = 'scale(1)';
                resolve();
            }, 300);
        });
    }

    showError(message) {
        // Create or update error message
        let errorDiv = this.form.querySelector('.error-message');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.5rem;
                padding: 0.5rem;
                background: rgba(239, 68, 68, 0.1);
                border-radius: 6px;
                border-left: 3px solid #ef4444;
            `;
            this.nameInput.parentNode.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv && errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    reset() {
        if (this.form) {
            this.form.reset();
            this.nameInput.classList.remove('error', 'success');
            
            // Remove any error messages
            const errorDiv = this.form.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.remove();
            }
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing CustomerInfoPanel...');
    window.customerInfoPanel = new CustomerInfoPanel();
    console.log('CustomerInfoPanel initialized successfully');
});