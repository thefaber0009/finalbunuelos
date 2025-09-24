
document.addEventListener('DOMContentLoaded', function() {
    // Asegurar que appState existe y agregar métodos faltantes
    if (!window.appState) {
        console.error('AppState not found! Make sure it\'s defined in HTML');
        return;
    }
    
    // Agregar propiedades faltantes si no existen
    if (!window.appState.currentView) {
        window.appState.currentView = 'orderTypeView';
    }
    
    // Mejorar el método showView si existe
    if (window.appState.showView) {
        const originalShowView = window.appState.showView;
        window.appState.showView = function(viewId) {
            console.log('Navigating to view:', viewId);
            
            // Usar el método original
            originalShowView.call(this, viewId);
            
            // Agregar funcionalidad adicional
            this.currentView = viewId;
            this.onViewChanged(viewId);
        };
    }
    
    // Agregar método onViewChanged
    window.appState.onViewChanged = function(viewId) {
        switch(viewId) {
            case 'menuView':
                if (window.menuPanel && this.quantities) {
                    window.menuPanel.syncQuantities(this.quantities);
                }
                break;
            case 'summaryView':
                if (window.summaryPanel) {
                    window.summaryPanel.showSummary();
                }
                break;
        }
    };
    
    // Mantener referencia app = appState para compatibilidad
    window.app = window.appState;
    
    console.log('Main app initialized with appState');
    console.log('Menu items loaded:', typeof menuItems !== 'undefined' ? menuItems.length : 'undefined');
    console.log('CSRF Token:', typeof window.CSRF_TOKEN !== 'undefined' ? 'loaded' : 'missing');
    
    // Show initial view
    window.appState.showView('orderTypeView');
    
    // Setup global error handling
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        showGlobalAlert('Ocurrió un error inesperado. Por favor recarga la página.', 'error');
    });
    
    // Setup global unhandled promise rejection handling
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        showGlobalAlert('Error de conexión. Verifica tu internet e intenta nuevamente.', 'warning');
    });
    
    // Debug: Log when panels are ready
    const checkPanels = setInterval(() => {
        const panels = {
            orderTypePanel: window.orderTypePanel,
            customerInfoPanel: window.customerInfoPanel,
            menuPanel: window.menuPanel,
            deliveryPanel: window.deliveryPanel,
            summaryPanel: window.summaryPanel
        };
        
        const readyPanels = Object.keys(panels).filter(key => panels[key]);
        console.log('Panels ready:', readyPanels);
        
        if (readyPanels.length === 5) {
            console.log('All panels initialized successfully');
            clearInterval(checkPanels);
        }
    }, 1000);
    
    // Clear the check after 10 seconds
    setTimeout(() => clearInterval(checkPanels), 10000);
});

// Global navigation function
function goBack() {
    console.log('Going back from:', window.appState.currentView);
    
    switch(window.appState.currentView) {
        case 'customerInfoView':
            window.appState.showView('orderTypeView');
            break;
        case 'menuView':
            window.appState.showView('customerInfoView');
            break;
        case 'deliveryView':
            window.appState.showView('menuView');
            break;
        case 'summaryView':
            if (window.appState.orderType === 'delivery') {
                window.appState.showView('deliveryView');
            } else {
                window.appState.showView('menuView');
            }
            break;
        default:
            window.appState.showView('orderTypeView');
    }
}

// Global functions for menu panel - CRITICAL: These must be globally available
function updateQuantity(itemId, change) {
    console.log('Global updateQuantity called:', itemId, change);
    if (window.menuPanel) {
        window.menuPanel.updateQuantity(itemId, change);
    } else {
        console.error('MenuPanel not initialized yet');
        // Fallback: try to initialize if not ready
        setTimeout(() => {
            if (window.menuPanel) {
                window.menuPanel.updateQuantity(itemId, change);
            }
        }, 100);
    }
}

function continueOrder() {
    console.log('Global continueOrder called');
    if (window.menuPanel) {
        window.menuPanel.continueOrder();
    } else {
        console.error('MenuPanel not initialized yet');
    }
}

// Global functions for other panels
function selectOrderType(type) {
    console.log('Global selectOrderType called:', type);
    if (window.orderTypePanel) {
        window.orderTypePanel.selectOrderType(type);
    } else {
        // Fallback to direct implementation
        window.appState.orderType = type;
        const orderTypeText = type === 'physical' ? 'Pedido en local' : 'Pedido a domicilio';
        const orderTypeElement = document.getElementById('orderTypeText');
        if (orderTypeElement) {
            orderTypeElement.textContent = orderTypeText;
        }
        window.appState.showView('customerInfoView');
    }
}

function handleCustomerForm(e) {
    console.log('Global handleCustomerForm called');
    if (window.customerInfoPanel) {
        window.customerInfoPanel.handleSubmit(e);
    }
}

function handleDeliveryForm(e) {
    console.log('Global handleDeliveryForm called');
    if (window.deliveryPanel) {
        window.deliveryPanel.handleSubmit(e);
    }
}

function handlePaymentMethodChange(e) {
    console.log('Global handlePaymentMethodChange called');
    if (window.deliveryPanel) {
        window.deliveryPanel.handlePaymentMethodChange(e);
    }
}

function confirmOrder() {
    console.log('Global confirmOrder called');
    if (window.summaryPanel) {
        window.summaryPanel.confirmOrder();
    }
}

function downloadTicket() {
    console.log('Global downloadTicket called');
    if (window.summaryPanel) {
        window.summaryPanel.downloadTicket();
    }
}

// Global utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}

// Global alert system
function showGlobalAlert(message, type = 'info') {
    // Remove existing alerts
    document.querySelectorAll('.global-alert').forEach(alert => alert.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `global-alert alert-${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-weight: 500;
        max-width: 90vw;
        text-align: center;
        animation: slideDown 0.3s ease;
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
    
    // Auto remove
    setTimeout(() => {
        alertDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 300);
    }, type === 'error' ? 8000 : 5000);
}

// Add global animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%);
        }
    }
    
    /* Global view transition */
    .view {
        transition: opacity 0.3s ease;
    }
    
    .view[style*="display: none"] {
        opacity: 0;
    }
    
    .view[style*="display: block"] {
        opacity: 1;
    }
`;
document.head.appendChild(style);