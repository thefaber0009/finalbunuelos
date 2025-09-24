// Menu Panel JavaScript - Versión corregida para usar datos del PHP + Bebidas

class MenuPanel {
    constructor() {
        this.quantities = {};
        this.menuItems = [];
        this.initialized = false;
        this.eventListenersAdded = false;
        this.init();
    }

    init() {
        // CAMBIO: Combinar menuItems del PHP con las bebidas definidas aquí
        const phpMenuItems = window.menuItems || [];
        const bebidasItems = this.getBebidasItems();
        
        // Combinar ambos arrays
        this.menuItems = [...phpMenuItems, ...bebidasItems];
        
        console.log('MenuPanel combinando:', phpMenuItems.length, 'items de PHP +', bebidasItems.length, 'bebidas');
        console.log('Total items:', this.menuItems.length);
        console.log('IDs disponibles:', this.menuItems.map(item => item.id));
        
        // También hacer disponible globalmente para el summary
        window.menuItems = this.menuItems;
        
        this.setupEventListeners();
        this.addAnimations();
        this.initialized = true;
        console.log('MenuPanel initialized with', this.menuItems.length, 'items total');
    }

    getBebidasItems() {
        return [
            // Malta
            {
                id: 'malta-1500ml',
                name: 'Malta Litro y Medio',
                description: 'Malta 1.5 litros',
                price: 6000,
                category: 'bebidas'
            },
            {
                id: 'malta-1000ml',
                name: 'Malta Litro',
                description: 'Malta 1 litro',
                price: 4000,
                category: 'bebidas'
            },
            {
                id: 'malta-personal',
                name: 'Malta Personal',
                description: 'Malta personal',
                price: 3000,
                category: 'bebidas'
            },
            {
                id: 'malta-lata',
                name: 'Malta Lata',
                description: 'Malta en lata',
                price: 3000,
                category: 'bebidas'
            },
            {
                id: 'malta-mini',
                name: 'Malta Mini',
                description: 'Malta mini',
                price: 1500,
                category: 'bebidas'
            },
            
            // Valle
            {
                id: 'valle-1500ml',
                name: 'Valle 1.5 Litros',
                description: 'Valle 1.5 litros',
                price: 4000,
                category: 'bebidas'
            },
            {
                id: 'valle-personal',
                name: 'Valle Personal',
                description: 'Valle personal',
                price: 2000,
                category: 'bebidas'
            },
            
            // Coca Cola
            {
                id: 'coca-cola-1500ml',
                name: 'Coca Cola 1.5 Litros',
                description: 'Coca Cola 1.5 litros',
                price: 6500,
                category: 'bebidas'
            },
            {
                id: 'coca-cola-1000ml',
                name: 'Coca Cola Litro',
                description: 'Coca Cola 1 litro',
                price: 4500,
                category: 'bebidas'
            },
            {
                id: 'coca-cola-personal',
                name: 'Coca Cola Personal',
                description: 'Coca Cola personal',
                price: 3000,
                category: 'bebidas'
            },
            {
                id: 'coca-cola-mega',
                name: 'Coca Cola Mega',
                description: 'Coca Cola mega',
                price: 11000,
                category: 'bebidas'
            },
            
            // Cuatro
            {
                id: 'cuatro-4500ml',
                name: 'Cuatro 4.5 Litros',
                description: 'Cuatro 4.5 litros',
                price: 5000,
                category: 'bebidas'
            },
            {
                id: 'cuatro-personal',
                name: 'Cuatro Personal',
                description: 'Cuatro personal',
                price: 2500,
                category: 'bebidas'
            },
            
            // Kola Román
            {
                id: 'kola-roman-1500ml',
                name: 'Kola Román 1.5 Litros',
                description: 'Kola Román 1.5 litros',
                price: 4500,
                category: 'bebidas'
            },
            {
                id: 'kola-roman-personal',
                name: 'Kola Román Personal',
                description: 'Kola Román personal',
                price: 2500,
                category: 'bebidas'
            },
            
            // Jugo Hit
            {
                id: 'jugo-hit-1500ml',
                name: 'Jugo Hit 1.5 Litros',
                description: 'Jugo Hit 1.5 litros',
                price: 5000,
                category: 'bebidas'
            },
            {
                id: 'jugo-hit-personal',
                name: 'Jugo Hit Personal',
                description: 'Jugo Hit personal',
                price: 3000,
                category: 'bebidas'
            },
            
            // Jugo Pul
            {
                id: 'jugo-pul-1500ml',
                name: 'Jugo Pul 1.5 Litros',
                description: 'Jugo Pul 1.5 litros',
                price: 6500,
                category: 'bebidas'
            },
            {
                id: 'jugo-pul-1000ml',
                name: 'Jugo Pul Litro',
                description: 'Jugo Pul 1 litro',
                price: 5500,
                category: 'bebidas'
            },
            {
                id: 'jugo-pul-personal',
                name: 'Jugo Pul Personal',
                description: 'Jugo Pul personal',
                price: 3000,
                category: 'bebidas'
            },
            
            // Avenas
            {
                id: 'avenas-bolsa',
                name: 'Avenas Bolsa',
                description: 'Avenas en bolsa',
                price: 2000,
                category: 'bebidas'
            }
        ];
    }

    setupEventListeners() {
        if (this.eventListenersAdded) {
            console.log('Event listeners already added, skipping...');
            return;
        }

        // Event delegation para botones de cantidad
        document.addEventListener('click', (e) => {
            if (e.target.matches('.qty-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const itemId = this.getItemIdFromButton(e.target);
                console.log('Button clicked for item:', itemId);
                
                let change = 0;
                if (e.target.classList.contains('plus') || e.target.textContent.trim() === '+') {
                    change = 1;
                } else if (e.target.classList.contains('minus') || e.target.textContent.trim() === '-') {
                    change = -1;
                }
                
                if (change !== 0 && itemId) {
                    console.log('Updating quantity:', itemId, change);
                    this.updateQuantity(itemId, change);
                }
            }

            // Botón continuar
            if (e.target.id === 'continueBtn') {
                e.preventDefault();
                e.stopPropagation();
                this.continueOrder();
            }
        });

        this.eventListenersAdded = true;
        console.log('Event listeners added successfully');
    }

    addAnimations() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.id === 'menuView' && 
                    mutation.target.style.display !== 'none') {
                    this.animateMenuItems();
                }
            });
        });

        const menuView = document.getElementById('menuView');
        if (menuView) {
            observer.observe(menuView, { 
                attributes: true, 
                attributeFilter: ['style'] 
            });
        }
    }

    animateMenuItems() {
        // Animar secciones expandibles
        const sections = document.querySelectorAll('.menu-section-expandable');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Animar resumen del pedido
        const orderSummary = document.querySelector('.summary-card');
        if (orderSummary) {
            orderSummary.style.opacity = '0';
            orderSummary.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                orderSummary.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                orderSummary.style.opacity = '1';
                orderSummary.style.transform = 'translateY(0)';
            }, 300);
        }
    }

    getItemIdFromButton(button) {
        const menuItem = button.closest('.menu-item');
        return menuItem ? menuItem.dataset.itemId : null;
    }

    updateQuantity(itemId, change) {
        if (!itemId) {
            console.error('No itemId provided to updateQuantity');
            return;
        }

        console.log('MenuPanel.updateQuantity called:', itemId, change);

        const currentQty = this.quantities[itemId] || 0;
        const newQty = Math.max(0, currentQty + change);
        
        this.quantities[itemId] = newQty;
        
        // Actualizar display
        const qtyDisplay = document.getElementById(`qty-${itemId}`);
                          
        if (qtyDisplay) {
            qtyDisplay.textContent = newQty;
            
            // Agregar animación de actualización
            qtyDisplay.classList.add('updated');
            qtyDisplay.style.transform = 'scale(1.2)';
            qtyDisplay.style.background = newQty > 0 ? '#FEF3C7' : '#F3F4F6';
            
            setTimeout(() => {
                qtyDisplay.style.transform = 'scale(1)';
                qtyDisplay.classList.remove('updated');
            }, 200);
        } else {
            console.error('Quantity display not found for item:', itemId);
        }

        // Animación del item
        const menuItem = document.querySelector(`[data-item-id="${itemId}"]`);
        if (menuItem && change > 0) {
            menuItem.style.transform = 'scale(1.02)';
            menuItem.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.2)';
            
            setTimeout(() => {
                menuItem.style.transform = 'scale(1)';
                menuItem.style.boxShadow = '';
            }, 300);
        }

        console.log('Quantity updated successfully:', itemId, newQty);
        this.updateOrderSummary();
        
        // AGREGAR: Sincronizar con appState
        if (window.appState) {
            window.appState.quantities = { ...this.quantities };
            console.log('Quantities synced to appState:', window.appState.quantities);
        }
    }

    updateOrderSummary() {
        console.log('Updating order summary...');
        
        const orderItems = document.getElementById('orderItems');
        const orderTotal = document.getElementById('orderTotal');
        const emptyCart = document.getElementById('emptyCart');
        const totalAmount = document.getElementById('totalAmount');
        const continueBtn = document.getElementById('continueBtn');
        
        if (!orderItems || !orderTotal || !emptyCart) {
            console.error('Order summary elements not found');
            return;
        }
        
        const items = this.getOrderItems();
        console.log('Order items for summary:', items);
        
        if (items.length === 0) {
            orderItems.innerHTML = '';
            orderTotal.style.display = 'none';
            emptyCart.style.display = 'block';
            console.log('Cart is empty, showing empty state');
            return;
        }
        
        emptyCart.style.display = 'none';
        orderTotal.style.display = 'block';
        
        let html = '';
        let total = 0;
        
        items.forEach((item) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            html += `
                <div class="order-item">
                    <span class="order-item-name">${item.quantity}x ${item.name}</span>
                    <span class="order-item-price">${this.formatCurrency(subtotal)}</span>
                </div>
            `;
        });
        
        orderItems.innerHTML = html;
        if (totalAmount) {
            totalAmount.textContent = this.formatCurrency(total);
        }
        
        // Actualizar texto del botón basado en el tipo de pedido
        const buttonText = window.appState?.orderType === 'delivery' ? 'Ver Resumen' : 'Ver Resumen';
        if (continueBtn) {
            continueBtn.textContent = buttonText;
        }

        console.log('Order summary updated successfully, total:', this.formatCurrency(total));
    }

    getOrderItems() {
        // CAMBIO: Usar this.menuItems que ya incluye las bebidas
        return this.menuItems.filter(item => this.quantities[item.id] > 0)
                           .map(item => ({
                               ...item,
                               quantity: this.quantities[item.id]
                           }));
    }

    continueOrder() {
        console.log('Continue order clicked');
        
        const items = this.getOrderItems();
        if (items.length === 0) {
            this.showAlert('Por favor selecciona al menos un producto', 'warning');
            return;
        }

        // CAMBIO: Almacenar cantidades en appState
        if (window.appState) {
            window.appState.quantities = { ...this.quantities };
            console.log('Quantities stored in appState:', window.appState.quantities);
        }
        
        // Agregar animación de transición
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.style.transform = 'scale(0.95)';
            continueBtn.textContent = 'Procesando...';
            
            setTimeout(() => {
                if (window.appState?.orderType === 'delivery') {
                    window.appState.showView('deliveryView');
                } else {
                    if (window.summaryPanel) {
                        window.summaryPanel.showSummary();
                    } else {
                        window.appState.showView('summaryView');
                    }
                }
            }, 300);
        }
    }

    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `menu-alert alert-${type}`;
        alertDiv.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            z-index: 1000;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-size: 0.9rem;
            font-weight: 500;
        `;
        
        const colors = {
            info: { bg: '#DBEAFE', color: '#1E40AF', border: '#3B82F6' },
            warning: { bg: '#FEF3C7', color: '#92400E', border: '#F59E0B' },
            success: { bg: '#D1FAE5', color: '#065F46', border: '#10B981' },
            error: { bg: '#FEE2E2', color: '#991B1B', border: '#EF4444' }
        };
        
        const style = colors[type] || colors.info;
        alertDiv.style.backgroundColor = style.bg;
        alertDiv.style.color = style.color;
        alertDiv.style.border = `2px solid ${style.border}`;
        
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        
        // Animar entrada
        setTimeout(() => {
            alertDiv.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remover
        setTimeout(() => {
            alertDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        }, 3000);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    reset() {
        this.quantities = {};
        
        // Resetear todos los displays de cantidad
        document.querySelectorAll('.qty-display, .quantity-display').forEach(el => {
            el.textContent = '0';
            el.style.background = '#F3F4F6';
        });
        
        // Resetear resumen del pedido
        this.updateOrderSummary();
    }

    syncQuantities(quantities) {
        this.quantities = { ...quantities };
        
        // Actualizar displays
        Object.keys(quantities).forEach(itemId => {
            const qtyDisplay = document.getElementById(`qty-${itemId}`);
            if (qtyDisplay) {
                qtyDisplay.textContent = quantities[itemId];
                qtyDisplay.style.background = quantities[itemId] > 0 ? '#FEF3C7' : '#F3F4F6';
            }
        });
        
        this.updateOrderSummary();
    }

    isInitialized() {
        return this.initialized;
    }
}

// Función global para toggle de secciones
function toggleMenuSection(sectionId) {
    const section = document.getElementById(`section-${sectionId}`);
    const arrow = document.getElementById(`arrow-${sectionId}`);
    
    if (!section || !arrow) {
        console.error('Section or arrow not found:', sectionId);
        return;
    }
    
    if (section.style.display === 'none') {
        // Abrir sección
        section.style.display = 'block';
        arrow.textContent = '▼';
        
        // Animación suave de apertura
        section.style.opacity = '0';
        section.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 10);
    } else {
        // Cerrar sección
        arrow.textContent = '▶';
        section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        section.style.opacity = '0';
        section.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            section.style.display = 'none';
        }, 300);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing MenuPanel...');
    
    setTimeout(() => {
        if (!window.menuPanel) {
            window.menuPanel = new MenuPanel();
        }
        
        setTimeout(() => {
            if (window.menuPanel && window.menuPanel.isInitialized()) {
                console.log('MenuPanel successfully initialized');
            } else {
                console.error('MenuPanel failed to initialize');
            }
        }, 100);
    }, 250);
});