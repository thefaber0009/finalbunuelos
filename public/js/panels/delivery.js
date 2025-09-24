// Delivery Panel JavaScript - Versión actualizada con appState

class DeliveryPanel {
    constructor() {
        this.form = null;
        this.formFields = {};
        this.validators = {};
        this.selectedFile = null;
        this.bankData = {
            bancolombia: {
                name: 'Bancolombia',
                number: '123-456789-01',
                holder: 'El Rey de los Buñuelos'
            },
            nequi: {
                name: 'Nequi',
                number: '300 123 4567',
                holder: 'El Rey de los Buñuelos'
            }
        };
        this.init();
    }

    init() {
        this.ensureAppStateExists();
        this.form = document.getElementById('deliveryForm');
        
        if (this.form) {
            this.setupFormFields();
            this.setupValidators();
            this.setupEventListeners();
            this.addAnimations();
        }

        // Escuchar cambios en el estado global
        this.setupStateListeners();
    }

    // Asegurar que el objeto appState existe
    ensureAppStateExists() {
        if (typeof window.appState === 'undefined') {
            console.log('Creating global appState object from delivery panel...');
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

        // Mantener compatibilidad con app
        if (!window.app || typeof window.app !== 'object' || window.app.tagName) {
            console.log('App object is DOM element or undefined, creating reference to appState');
            window.app = window.appState;
        }
    }

    setupStateListeners() {
        // Escuchar cuando se muestre la vista de delivery
        window.addEventListener('viewChanged', (e) => {
            if (e.detail.viewId === 'deliveryView') {
                this.prefillCustomerData();
            }
        });
    }

    setupFormFields() {
        this.formFields = {
            fullName: document.getElementById('fullName'),
            phone: document.getElementById('phone'),
            address: document.getElementById('address'),
            neighborhood: document.getElementById('neighborhood'),
            references: document.getElementById('references'),
            receiptFile: document.getElementById('receiptFile')
        };
    }

    setupValidators() {
        this.validators = {
            fullName: (value) => {
                const trimmed = value.trim();
                return {
                    isValid: trimmed.length >= 3 && /^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed),
                    message: 'Nombre debe tener al menos 3 caracteres y solo letras'
                };
            },
            phone: (value) => {
                const cleaned = value.replace(/\D/g, '');
                return {
                    isValid: cleaned.length >= 10,
                    message: 'Teléfono debe tener al menos 10 dígitos'
                };
            },
            address: (value) => {
                const trimmed = value.trim();
                return {
                    isValid: trimmed.length >= 10,
                    message: 'Dirección debe ser más específica (mín. 10 caracteres)'
                };
            },
            neighborhood: (value) => {
                const trimmed = value.trim();
                return {
                    isValid: trimmed.length >= 2,
                    message: 'Barrio requerido'
                };
            },
            paymentMethod: (value) => {
                return {
                    isValid: ['transfer', 'cash', 'whatsapp'].includes(value),
                    message: 'Selecciona un método de pago'
                };
            }
        };
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation for text inputs
        ['fullName', 'phone', 'address', 'neighborhood'].forEach(fieldName => {
            const field = this.formFields[fieldName];
            if (field && this.validators[fieldName]) {
                field.addEventListener('input', (e) => this.validateField(fieldName, e.target.value));
                field.addEventListener('blur', (e) => this.validateField(fieldName, e.target.value, true));
                field.addEventListener('focus', (e) => this.onFieldFocus(fieldName));
            }
        });

        // Special handlers
        if (this.formFields.phone) {
            this.formFields.phone.addEventListener('input', (e) => this.formatPhoneNumber(e));
        }
        if (this.formFields.fullName) {
            this.formFields.fullName.addEventListener('input', (e) => this.capitalizeInput(e));
        }
        if (this.formFields.neighborhood) {
            this.formFields.neighborhood.addEventListener('input', (e) => this.capitalizeInput(e));
        }
        
        // File upload handler
        if (this.formFields.receiptFile) {
            this.formFields.receiptFile.addEventListener('change', (e) => this.handleFileUpload(e));
        }
    }

    addAnimations() {
        // Entrance animation when view becomes visible
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.id === 'deliveryView' && 
                    mutation.target.style.display !== 'none') {
                    this.animateEntrance();
                }
            });
        });

        const deliveryView = document.getElementById('deliveryView');
        if (deliveryView) {
            observer.observe(deliveryView, { 
                attributes: true, 
                attributeFilter: ['style'] 
            });
        }
    }

    animateEntrance() {
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                group.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Focus first field after animation
        setTimeout(() => {
            if (this.formFields.fullName) {
                this.formFields.fullName.focus();
            }
        }, 200);
    }

    validateField(fieldName, value, showMessage = false) {
        const field = this.formFields[fieldName];
        const validator = this.validators[fieldName];
        
        if (!field || !validator) return true;

        const result = validator(value);
        
        // Update field styling
        field.classList.remove('error', 'success');
        if (value.length > 0) {
            field.classList.add(result.isValid ? 'success' : 'error');
        }

        // Show/hide validation message
        if (showMessage || (!result.isValid && value.length > 0)) {
            this.showValidationMessage(fieldName, result.message, result.isValid);
        } else {
            this.hideValidationMessage(fieldName);
        }

        return result.isValid;
    }

    showValidationMessage(fieldName, message, isSuccess = false) {
        const field = this.formFields[fieldName];
        const formGroup = field.closest('.form-group');
        
        let msgElement = formGroup.querySelector('.validation-message');
        
        if (!msgElement) {
            msgElement = document.createElement('span');
            msgElement.className = 'validation-message';
            formGroup.appendChild(msgElement);
        }
        
        msgElement.textContent = message;
        msgElement.classList.toggle('success', isSuccess);
        msgElement.classList.add('show');
    }

    hideValidationMessage(fieldName) {
        const field = this.formFields[fieldName];
        const formGroup = field.closest('.form-group');
        const msgElement = formGroup.querySelector('.validation-message');
        
        if (msgElement) {
            msgElement.classList.remove('show');
        }
    }

    onFieldFocus(fieldName) {
        const field = this.formFields[fieldName];
        const formGroup = field.closest('.form-group');
        
        // Add focus animation
        formGroup.style.transform = 'scale(1.02)';
        formGroup.style.transition = 'transform 0.2s ease';
        
        field.addEventListener('blur', () => {
            formGroup.style.transform = 'scale(1)';
        }, { once: true });
    }

    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Format as Colombian phone number
        if (value.length <= 3) {
            value = value;
        } else if (value.length <= 6) {
            value = value.replace(/(\d{3})(\d{0,3})/, '$1 $2');
        } else {
            value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1 $2 $3');
        }
        
        e.target.value = value.trim();
    }

    capitalizeInput(e) {
        const value = e.target.value;
        const capitalized = value.replace(/\b\w/g, l => l.toUpperCase());
        
        if (capitalized !== value) {
            e.target.value = capitalized;
        }
    }

    handlePaymentMethodChange(e) {
        const transferOptions = document.getElementById('transferOptions');
        const isTransfer = e.target.value === 'transfer';
        const isWhatsApp = e.target.value === 'whatsapp';
        
        if (isTransfer) {
            transferOptions.style.display = 'block';
            transferOptions.style.opacity = '0';
            transferOptions.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                transferOptions.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                transferOptions.style.opacity = '1';
                transferOptions.style.transform = 'translateY(0)';
            }, 10);
        } else {
            transferOptions.style.display = 'none';
            
            // Reset bank selection
            const bankRadios = document.querySelectorAll('input[name="bankOption"]');
            bankRadios.forEach(radio => radio.checked = false);
            this.hideBankData();
        }
        
        if (isWhatsApp) {
            // Redirect to WhatsApp with pre-filled message
            const message = encodeURIComponent('Hola! Quiero hacer un pedido de buñuelos. ¿Me pueden ayudar con el proceso de pago?');
            const whatsappNumber = '573001234567'; // Reemplazar con el número real
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
            
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 500);
        }
    }

    handleBankSelection(e) {
        const bankType = e.target.value;
        
        if (bankType && this.bankData[bankType]) {
            this.showBankData(bankType);
        } else {
            this.hideBankData();
        }
    }

    showBankData(bankType) {
        const bankData = document.getElementById('bankData');
        const bankName = document.getElementById('bankName');
        const bankNumber = document.getElementById('bankNumber');
        const bankHolder = document.getElementById('bankHolder');
        
        if (!bankData || !bankName || !bankNumber || !bankHolder) {
            console.error('Bank data elements not found');
            return;
        }
        
        const data = this.bankData[bankType];
        
        bankName.textContent = data.name;
        bankNumber.textContent = data.number;
        bankHolder.textContent = data.holder;
        
        bankData.style.display = 'block';
        bankData.style.opacity = '0';
        bankData.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            bankData.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            bankData.style.opacity = '1';
            bankData.style.transform = 'translateY(0)';
        }, 10);
    }

    hideBankData() {
        const bankData = document.getElementById('bankData');
        if (bankData) {
            bankData.style.display = 'none';
        }
        
        // Reset file upload
        this.selectedFile = null;
        this.hideUploadPreview();
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            
            if (file.size > maxSize) {
                this.showAlert('El archivo es muy grande. Máximo 5MB.', 'error');
                e.target.value = '';
                return;
            }
            
            if (!allowedTypes.includes(file.type)) {
                this.showAlert('Tipo de archivo no válido. Solo imágenes (JPG, PNG) o PDF.', 'error');
                e.target.value = '';
                return;
            }
            
            this.selectedFile = file;
            this.showUploadPreview(file);
        }
    }

    showUploadPreview(file) {
        const preview = document.getElementById('uploadPreview');
        if (!preview) return;
        
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        const fileIcon = file.type.includes('pdf') ? '📄' : '🖼️';
        
        preview.innerHTML = `
            <span class="file-icon">${fileIcon}</span>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${fileSize} MB</div>
            </div>
            <button type="button" class="remove-file" onclick="window.deliveryPanel.removeFile()">✕</button>
        `;
        
        preview.style.display = 'flex';
        preview.classList.add('show');
    }

    hideUploadPreview() {
        const preview = document.getElementById('uploadPreview');
        if (preview) {
            preview.style.display = 'none';
            preview.classList.remove('show');
        }
    }

    removeFile() {
        this.selectedFile = null;
        if (this.formFields.receiptFile) {
            this.formFields.receiptFile.value = '';
        }
        this.hideUploadPreview();
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        console.log('=== DELIVERY FORM SUBMITTED ===');
        
        // Get selected payment method
        const paymentMethodRadio = document.querySelector('input[name="paymentMethod"]:checked');
        const paymentMethod = paymentMethodRadio ? paymentMethodRadio.value : '';
        
        // Validate all fields
        let isValid = true;
        const deliveryData = {};
        
        // Validate text fields
        for (const [fieldName, field] of Object.entries(this.formFields)) {
            if (field && field.type !== 'file' && this.validators[fieldName]) {
                const value = field.value || '';
                deliveryData[fieldName] = value;
                
                if (!this.validateField(fieldName, value, true)) {
                    isValid = false;
                }
            } else if (field && field.type !== 'file') {
                deliveryData[fieldName] = field.value || '';
            }
        }
        
        // Validate payment method
        if (!paymentMethod) {
            this.showAlert('Selecciona un método de pago', 'error');
            isValid = false;
        } else {
            deliveryData.paymentMethod = paymentMethod;
        }
        
        // Additional validation for transfer payment
        if (paymentMethod === 'transfer') {
            const bankOptionRadio = document.querySelector('input[name="bankOption"]:checked');
            if (!bankOptionRadio) {
                this.showAlert('Selecciona un banco para la transferencia', 'error');
                isValid = false;
            } else {
                deliveryData.bankOption = bankOptionRadio.value;
            }
            
            if (!this.selectedFile) {
                this.showAlert('Sube el comprobante de transferencia', 'error');
                isValid = false;
            } else {
                deliveryData.receiptFile = this.selectedFile;
            }
        }

        if (!isValid) {
            this.focusFirstError();
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // GUARDAR DATOS EN APPSTATE
            console.log('1. Saving delivery data to appState:', deliveryData);
            
            // Verificar que appState existe
            if (!window.appState) {
                throw new Error('AppState not found');
            }
            
            // Guardar los datos en appState
           // Reemplaza desde la línea ~500 en adelante en handleSubmit:
        
        window.appState.deliveryData = deliveryData;
        
        console.log('Datos guardados correctamente');
        
        // SOLUCIÓN SIMPLE: Navegación directa sin delays
        document.getElementById('deliveryView').style.display = 'none';
        
        setTimeout(() => {
            if (window.appState && window.appState.showView) {
                window.appState.showView('summaryView');
            }
        }, 100);
        
    } catch (error) {
        console.error('Error processing delivery data:', error);
        this.showAlert(`Error: ${error.message}`, 'error');
    } finally {
        this.setLoadingState(false);
    }
}

    setLoadingState(loading) {
        const deliveryView = document.getElementById('deliveryView');
        const submitBtn = this.form.querySelector('button[type="submit"]');
        
        if (loading) {
            if (deliveryView) deliveryView.classList.add('loading');
            if (submitBtn) {
                submitBtn.innerHTML = 'Procesando...';
                submitBtn.disabled = true;
            }
        } else {
            if (deliveryView) deliveryView.classList.remove('loading');
            if (submitBtn) {
                submitBtn.innerHTML = 'Continuar con el Pedido';
                submitBtn.disabled = false;
            }
        }
    }

    async animateSuccess() {
        return new Promise(resolve => {
            const card = this.form.closest('.card');
            if (card) {
                card.classList.add('form-success');
                
                setTimeout(() => {
                    card.classList.remove('form-success');
                    resolve();
                }, 600);
            } else {
                resolve();
            }
        });
    }

    focusFirstError() {
        const errorField = this.form.querySelector('.form-input.error, .form-select.error');
        if (errorField) {
            errorField.focus();
            errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    showAlert(message, type = 'info') {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `delivery-alert alert-${type}`;
        alertDiv.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            z-index: 1000;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-size: 0.875rem;
            font-weight: 500;
        `;
        
        const colors = {
            info: { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' },
            error: { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' },
            success: { bg: '#d1fae5', color: '#065f46', border: '#10b981' },
            warning: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' }
        };
        
        const style = colors[type] || colors.info;
        alertDiv.style.backgroundColor = style.bg;
        alertDiv.style.color = style.color;
        alertDiv.style.border = `2px solid ${style.border}`;
        
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        
        // Animate in
        setTimeout(() => {
            alertDiv.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            alertDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        }, type === 'error' ? 5000 : 3000);
    }

    prefillCustomerData() {
        // Pre-fill name from customer info if available
        if (window.appState && window.appState.customerName && this.formFields.fullName) {
            this.formFields.fullName.value = window.appState.customerName;
            this.validateField('fullName', window.appState.customerName);
        }
    }

    reset() {
        if (this.form) {
            this.form.reset();
            
            // Remove validation states
            Object.values(this.formFields).forEach(field => {
                if (field && field.classList) {
                    field.classList.remove('error', 'success');
                }
            });
            
            // Hide validation messages
            this.form.querySelectorAll('.validation-message').forEach(msg => {
                msg.classList.remove('show');
            });
            
            // Hide transfer options
            const transferOptions = document.getElementById('transferOptions');
            if (transferOptions) {
                transferOptions.style.display = 'none';
            }
            
            // Reset file upload
            this.selectedFile = null;
            this.hideUploadPreview();
        }
    }
}

// Global functions for form handling
function handleDeliveryForm(e) {
    if (window.deliveryPanel) {
        window.deliveryPanel.handleSubmit(e);
    }
}

function handlePaymentMethodChange(e) {
    if (window.deliveryPanel) {
        window.deliveryPanel.handlePaymentMethodChange(e);
    }
}

function handleBankSelection(e) {
    if (window.deliveryPanel) {
        window.deliveryPanel.handleBankSelection(e);
    }
}

function handleFileUpload(e) {
    if (window.deliveryPanel) {
        window.deliveryPanel.handleFileUpload(e);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Delivery Panel...');
    window.deliveryPanel = new DeliveryPanel();
    
    // Pre-fill data when view becomes active
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.id === 'deliveryView' && 
                mutation.target.style.display !== 'none') {
                setTimeout(() => {
                    if (window.deliveryPanel) {
                        window.deliveryPanel.prefillCustomerData();
                    }
                }, 100);
            }
        });
    });
    
    const deliveryView = document.getElementById('deliveryView');
    if (deliveryView) {
        observer.observe(deliveryView, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
    }
    
    console.log('Delivery Panel initialized successfully');
});