// Order Type Panel JavaScript - VERSIÓN CORREGIDA

class OrderTypePanel {
    constructor() {
        this.init();
        this.ensureAppStateExists();
    }

    // NUEVO: Asegurar que appState existe
    ensureAppStateExists() {
        if (typeof window.appState === 'undefined') {
            console.log('Creating appState from OrderTypePanel...');
            window.appState = {
                customerName: '',
                orderType: '',
                quantities: {},
                deliveryData: null,
                orderCode: '',
                currentView: 'orderTypeView',
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
        this.setupEventListeners();
        this.addAnimations();
    }

    setupEventListeners() {
        // Add click handlers for order type cards
        const orderTypeCards = document.querySelectorAll('#orderTypeView .card[onclick]');
        orderTypeCards.forEach(card => {
            card.addEventListener('mouseenter', this.onCardHover);
            card.addEventListener('mouseleave', this.onCardLeave);
        });
    }

    addAnimations() {
        // Add entrance animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        const cards = document.querySelectorAll('#orderTypeView .card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }

    onCardHover(e) {
        const button = e.target.querySelector('.btn');
        if (button) {
            button.style.transform = 'scale(1.05)';
        }
    }

    onCardLeave(e) {
        const button = e.target.querySelector('.btn');
        if (button) {
            button.style.transform = 'scale(1)';
        }
    }

    selectOrderType(type) {
        console.log('Order type selected:', type);
        
        // CORREGIDO: Usar appState en lugar de app
        if (window.appState) {
            window.appState.orderType = type;
        } else {
            console.error('AppState not found!');
            return;
        }
        
        // Update UI text
        const orderTypeText = type === 'physical' ? 'Pedido en local' : 'Pedido a domicilio';
        const orderTypeElement = document.getElementById('orderTypeText');
        if (orderTypeElement) {
            orderTypeElement.textContent = orderTypeText;
        }
        
        // Add selection animation
        const selectedCard = document.querySelector(`#orderTypeView .card[onclick*="${type}"]`);
        if (selectedCard) {
            selectedCard.style.transform = 'scale(0.95)';
            selectedCard.style.borderColor = '#10b981';
            
            setTimeout(() => {
                // CORREGIDO: Usar appState.showView
                if (window.appState && window.appState.showView) {
                    window.appState.showView('customerInfoView');
                } else {
                    console.error('AppState.showView not found!');
                }
            }, 200);
        } else {
            // Fallback directo
            if (window.appState && window.appState.showView) {
                window.appState.showView('customerInfoView');
            }
        }
        
        // Debug logging
        console.log('OrderType set in appState:', window.appState?.orderType);
        console.log('Current appState:', window.appState);
    }
}

// Global function for onclick handlers
function selectOrderType(type) {
    console.log('Global selectOrderType called with:', type);
    
    if (window.orderTypePanel) {
        window.orderTypePanel.selectOrderType(type);
    } else {
        console.error('OrderTypePanel not initialized yet, trying fallback...');
        
        // Fallback implementation
        if (window.appState) {
            window.appState.orderType = type;
            const orderTypeText = type === 'physical' ? 'Pedido en local' : 'Pedido a domicilio';
            const orderTypeElement = document.getElementById('orderTypeText');
            if (orderTypeElement) {
                orderTypeElement.textContent = orderTypeText;
            }
            if (window.appState.showView) {
                window.appState.showView('customerInfoView');
            }
        } else {
            console.error('Neither orderTypePanel nor appState available!');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing OrderTypePanel...');
    window.orderTypePanel = new OrderTypePanel();
    console.log('OrderTypePanel initialized successfully');
});