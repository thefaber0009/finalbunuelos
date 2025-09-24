// Dashboard JavaScript - El Rey de los Buñuelos
// Version: 2.0 - Mejorado con manejo de errores y validaciones

class DashboardManager {
    constructor() {
        this.notificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
        this.audioContext = null;
        this.turnCounters = {
            tradicional: parseInt(localStorage.getItem("turnCounter_tradicional") || "4"),
            especiales: parseInt(localStorage.getItem("turnCounter_especiales") || "4")
        };
        this.autoRefreshInterval = null;
        this.csrfToken = this.getCSRFToken();
        
        this.init();
    }

    // Inicialización
    init() {
        this.initAudio();
        this.setupEventListeners();
        this.updateNotificationButton();
        this.updateQueueCounters();
        this.startAutoRefresh();
        
        // Permitir audio en primera interacción
        document.addEventListener('click', () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
        
        // Mostrar notificación de bienvenida
        setTimeout(() => {
            this.showNotification('Dashboard cargado correctamente', 'success');
        }, 1000);
    }

    // Obtener CSRF Token
    getCSRFToken() {
        const tokenElement = document.querySelector('meta[name="csrf-token"]');
        if (tokenElement) {
            return tokenElement.getAttribute('content');
        }
        // Fallback: generar un token temporal si no existe
        return document.querySelector('[data-csrf]')?.dataset.csrf || '';
    }

    // Setup Event Listeners
    setupEventListeners() {
        const notificationToggleBtn = document.getElementById('notificationToggle');
        if (notificationToggleBtn) {
            notificationToggleBtn.addEventListener('click', () => this.toggleNotifications());
        }

        // Prevenir envío de formulario por ENTER accidental
        const filtersForm = document.getElementById('filtersForm');
        if (filtersForm) {
            filtersForm.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
                    e.preventDefault();
                }
            });
        }
    }

    // Sistema de Audio
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Audio no soportado en este navegador');
        }
    }

    playNotificationSound() {
        if (!this.notificationsEnabled || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        } catch (e) {
            console.warn('Error reproduciendo sonido:', e);
        }
    }

    playTestSound() {
        if (!this.audioContext) this.initAudio();
        this.playNotificationSound();
        this.showNotification('Sonido de prueba reproducido', 'success');
    }

    // Sistema de Notificaciones
    toggleNotifications() {
        this.notificationsEnabled = !this.notificationsEnabled;
        localStorage.setItem('notificationsEnabled', this.notificationsEnabled);
        this.updateNotificationButton();
        
        const status = this.notificationsEnabled ? 'activadas' : 'desactivadas';
        this.showNotification(`Notificaciones ${status}`, 'success');
    }

    updateNotificationButton() {
        const btn = document.getElementById('notificationToggle');
        if (btn) {
            btn.textContent = this.notificationsEnabled ? '🔔 Notificaciones: ON' : '🔕 Notificaciones: OFF';
            btn.classList.toggle('active', this.notificationsEnabled);
        }
    }

    showNotification(message, type = 'success', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <span>${message}</span>
                <button class="close-notification" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, duration);
        
        if (this.notificationsEnabled && (type === 'success' || type === 'info')) {
            this.playNotificationSound();
        }
    }

    // Navegación entre secciones
    showSection(sectionName) {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));

        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => tab.classList.remove('active'));

        const targetSection = document.getElementById(sectionName + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        const clickedTab = Array.from(tabs).find(tab => {
            const text = tab.textContent.toLowerCase();
            return text.includes(sectionName.toLowerCase()) ||
                   (sectionName === 'orders' && text.includes('pedidos')) ||
                   (sectionName === 'printer' && text.includes('impresora')) ||
                   (sectionName === 'queues' && text.includes('turnos'));
        });
        
        if (clickedTab) {
            clickedTab.classList.add('active');
        }
    }

    // Loading indicator
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // Manejo de errores HTTP mejorado
    async handleApiResponse(response, operation = 'operación') {
        if (!response.ok) {
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorData.message || errorMessage;
            } catch (e) {
                // Si no se puede parsear el JSON, usar el mensaje por defecto
            }
            
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || `Error en ${operation}`);
        }
        
        return data;
    }

    // Gestión de pedidos
    async updateOrderStatus(orderId, newStatus) {
        if (!orderId || !newStatus) {
            this.showNotification('Datos inválidos para actualizar pedido', 'error');
            return;
        }

        try {
            this.showLoading();
            
            const response = await fetch('../api/order_update_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: parseInt(orderId),
                    status: newStatus,
                    csrf_token: this.csrfToken
                })
            });
            
            await this.handleApiResponse(response, 'actualización de estado');
            
            const statusLabels = {
                pending: 'Pendiente',
                preparing: 'En Preparación',
                ready: 'Listo',
                delivered: 'Entregado'
            };
            
            this.showNotification(`Pedido actualizado a ${statusLabels[newStatus] || newStatus}`, 'success');
            
            // Refrescar datos en lugar de recargar la página
            await this.refreshData();
            
        } catch (error) {
            console.error('Error actualizando estado del pedido:', error);
            this.showNotification(`Error: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async updatePaymentStatus(orderId, paymentStatus) {
        if (!orderId || !paymentStatus) {
            this.showNotification('Datos inválidos para actualizar pago', 'error');
            return;
        }

        try {
            this.showLoading();
            
            const response = await fetch('../api/update_payment_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: parseInt(orderId),
                    payment_status: paymentStatus,
                    csrf_token: this.csrfToken
                })
            });
            
            await this.handleApiResponse(response, 'actualización de pago');
            
            const statusLabels = {
                paid: 'Pagado',
                failed: 'Fallido',
                pending: 'Pendiente'
            };
            
            this.showNotification(`Estado de pago actualizado: ${statusLabels[paymentStatus] || paymentStatus}`, 'success');
            
            await this.refreshData();
            
        } catch (error) {
            console.error('Error actualizando estado de pago:', error);
            this.showNotification(`Error: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Sistema de impresión
    updatePrinterStatus(message, type) {
        const statusEl = document.getElementById('printerStatus');
        if (statusEl) {
            statusEl.textContent = 'Estado: ' + message;
            
            // Remover clases anteriores
            statusEl.classList.remove('ready', 'busy', 'error');
            
            switch(type) {
                case 'success':
                case 'ready':
                    statusEl.classList.add('ready');
                    break;
                case 'error':
                    statusEl.classList.add('error');
                    break;
                case 'info':
                default:
                    statusEl.classList.add('busy');
            }
        }
    }

    async printTicket(orderId) {
        if (!orderId) {
            this.showNotification('ID de pedido inválido', 'error');
            return;
        }

        try {
            this.updatePrinterStatus('Imprimiendo ticket...', 'info');
            
            const response = await fetch('../api/print_ticket.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'print_order',
                    order_id: parseInt(orderId),
                    csrf_token: this.csrfToken
                })
            });
            
            await this.handleApiResponse(response, 'impresión de ticket');
            
            this.updatePrinterStatus('✅ Ticket impreso correctamente', 'success');
            setTimeout(() => this.updatePrinterStatus('Listo para usar', 'ready'), 3000);
            this.showNotification('Ticket impreso correctamente', 'success');
            
        } catch (error) {
            console.error('Error imprimiendo ticket:', error);
            this.updatePrinterStatus(`❌ Error: ${error.message}`, 'error');
            this.showNotification(`Error de impresión: ${error.message}`, 'error');
        }
    }

    async testPrinter() {
        try {
            this.updatePrinterStatus('Probando conexión...', 'info');
            
            const response = await fetch('../api/print_ticket.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'test_printer',
                    csrf_token: this.csrfToken
                })
            });
            
            await this.handleApiResponse(response, 'prueba de impresora');
            
            this.updatePrinterStatus('✅ Impresora funcionando correctamente', 'success');
            setTimeout(() => this.updatePrinterStatus('Listo para usar', 'ready'), 3000);
            this.showNotification('Impresora funcionando correctamente', 'success');
            
        } catch (error) {
            console.error('Error probando impresora:', error);
            this.updatePrinterStatus(`❌ Error: ${error.message}`, 'error');
            this.showNotification(`Error en la impresora: ${error.message}`, 'error');
        }
    }

    async printDailyReport() {
        try {
            this.updatePrinterStatus('Generando reporte...', 'info');
            
            const response = await fetch('../api/print_ticket.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'daily_report',
                    csrf_token: this.csrfToken
                })
            });
            
            await this.handleApiResponse(response, 'generación de reporte');
            
            this.updatePrinterStatus('✅ Reporte impreso correctamente', 'success');
            setTimeout(() => this.updatePrinterStatus('Listo para usar', 'ready'), 3000);
            this.showNotification('Reporte del día impreso', 'success');
            
        } catch (error) {
            console.error('Error imprimiendo reporte:', error);
            this.updatePrinterStatus(`❌ Error: ${error.message}`, 'error');
            this.showNotification(`Error al imprimir reporte: ${error.message}`, 'error');
        }
    }

    // Gestión de filtros
    clearFilters() {
        const form = document.getElementById('filtersForm');
        if (form) {
            // Limpiar todos los selects
            const selects = form.querySelectorAll('select');
            selects.forEach(select => {
                select.value = '';
            });
            
            // Enviar formulario para aplicar filtros vacíos
            form.submit();
        }
    }

    // Refrescar datos
    async refreshData() {
        try {
            // Preservar filtros actuales
            const params = new URLSearchParams(window.location.search);
            const currentUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
            
            // Recargar página manteniendo filtros
            window.location.href = currentUrl;
            
        } catch (error) {
            console.error('Error refrescando datos:', error);
            this.showNotification('Error al actualizar datos', 'error');
        }
    }

    // Auto-refresh inteligente
    startAutoRefresh() {
        // Cancelar refresh anterior si existe
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
        
        // Auto-refresh cada 30 segundos, pero solo si no hay acciones en curso
        this.autoRefreshInterval = setInterval(() => {
            // No refrescar si hay modales abiertos o operaciones en curso
            const loadingOverlay = document.getElementById('loadingOverlay');
            const isLoading = loadingOverlay && loadingOverlay.style.display !== 'none';
            
            if (!isLoading) {
                this.refreshData();
            }
        }, 30000);
    }

    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
    }

    // Gestión de turnos
    updateQueueCounters() {
        const tradicionalElement = document.getElementById("tradicionalCounter");
        const especialesElement = document.getElementById("especialesCounter");
        
        if (tradicionalElement) {
            tradicionalElement.textContent = this.turnCounters.tradicional;
        }
        if (especialesElement) {
            especialesElement.textContent = this.turnCounters.especiales;
        }
    }

    adjustQueue(queueType, change) {
        if (!this.turnCounters.hasOwnProperty(queueType)) {
            this.showNotification('Tipo de cola inválido', 'error');
            return;
        }
        
        this.turnCounters[queueType] = Math.max(0, this.turnCounters[queueType] + change);
        localStorage.setItem(
            `turnCounter_${queueType}`,
            this.turnCounters[queueType].toString()
        );
        this.updateQueueCounters();
        this.showNotification(
            `Contador ${queueType} actualizado: ${this.turnCounters[queueType]}`,
            "success"
        );
    }

    resetQueue(queueType) {
        if (!confirm(`¿Estás seguro de resetear la fila ${queueType}?`)) return;
        
        this.turnCounters[queueType] = 0;
        localStorage.setItem(`turnCounter_${queueType}`, "0");
        this.updateQueueCounters();
        this.showNotification(`Fila ${queueType} reseteada`, "success");
    }

    resetAllQueues() {
        if (!confirm("¿Estás seguro de resetear TODAS las filas de turnos?")) return;
        
        this.turnCounters.tradicional = 0;
        this.turnCounters.especiales = 0;
        localStorage.setItem("turnCounter_tradicional", "0");
        localStorage.setItem("turnCounter_especiales", "0");
        this.updateQueueCounters();
        this.showNotification("Todas las filas han sido reseteadas", "success");
    }
}

// Instancia global del dashboard
let dashboard;

// Funciones globales para mantener compatibilidad con HTML
function showSection(sectionName) {
    dashboard.showSection(sectionName);
}

function updateOrderStatus(orderId, newStatus) {
    dashboard.updateOrderStatus(orderId, newStatus);
}

function updatePaymentStatus(orderId, paymentStatus) {
    dashboard.updatePaymentStatus(orderId, paymentStatus);
}

function printTicket(orderId) {
    dashboard.printTicket(orderId);
}

function testPrinter() {
    dashboard.testPrinter();
}

function printDailyReport() {
    dashboard.printDailyReport();
}

function playTestSound() {
    dashboard.playTestSound();
}

function clearFilters() {
    dashboard.clearFilters();
}

function refreshData() {
    dashboard.refreshData();
}

function adjustQueue(queueType, change) {
    dashboard.adjustQueue(queueType, change);
}

function resetQueue(queueType) {
    dashboard.resetQueue(queueType);
}

function resetAllQueues() {
    dashboard.resetAllQueues();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    dashboard = new DashboardManager();
});

// Limpiar al salir de la página
window.addEventListener('beforeunload', function() {
    if (dashboard) {
        dashboard.stopAutoRefresh();
    }
});