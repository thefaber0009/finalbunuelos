// Modern Summary Panel JavaScript - Con sistema de turnos

class SummaryPanel {
    constructor() {
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addAnimations();
        this.ensureAppStateExists();
    }

    ensureAppStateExists() {
        if (typeof window.appState === 'undefined') {
            console.log('Creating global appState object from summary panel...');
            window.appState = {
                customerName: '',
                orderType: '',
                quantities: {},
                deliveryData: null,
                orderCode: '',
                queueType: '',
                turnNumber: 0,
                turnDisplay: '',
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
        
        if (!window.app || typeof window.app !== 'object' || window.app.tagName) {
            console.log('App object is DOM element or undefined, creating reference to appState');
            window.app = window.appState;
        }
    }

    setupEventListeners() {
        const confirmBtn = document.querySelector('#summaryView button[onclick="confirmOrder()"]');
        if (confirmBtn) {
            confirmBtn.removeAttribute('onclick');
            confirmBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.confirmOrder();
            });
        }

        const downloadBtn = document.querySelector('#summaryView button[onclick="downloadTicket()"]');
        if (downloadBtn) {
            downloadBtn.removeAttribute('onclick');
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadTicket();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('btn')) {
                e.target.click();
            }
            
            if (e.key === 'Escape') {
                this.goBackToEdit();
            }
        });

        // Event listener para botones de eliminar productos
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const itemId = e.target.getAttribute('data-item-id');
                console.log('Remove button clicked for item:', itemId);
                
                if (itemId) {
                    this.removeItem(itemId);
                } else {
                    console.error('No item ID found on remove button');
                    this.showAlert('Error: No se pudo identificar el producto', 'error');
                }
            }
        });

        this.setupTouchFeedback();
    }

    setupTouchFeedback() {
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('btn')) {
                e.target.style.transform = 'scale(0.95)';
            }
        });

        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('btn')) {
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 150);
            }
        });
    }

    addAnimations() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.id === 'summaryView' && 
                    mutation.target.style.display !== 'none') {
                    this.animateEntrance();
                }
            });
        });

        const summaryView = document.getElementById('summaryView');
        if (summaryView) {
            observer.observe(summaryView, { 
                attributes: true, 
                attributeFilter: ['style'] 
            });
        }

        this.setupHoverEffects();
    }

    setupHoverEffects() {
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.order-item-row')) {
                const item = e.target.closest('.order-item-row');
                item.style.transform = 'translateX(4px)';
                item.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.15)';
            }
            
            // Hover effect for remove button
            if (e.target.classList.contains('remove-item-btn')) {
                e.target.style.background = '#dc2626';
                e.target.style.transform = 'scale(1.1)';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.order-item-row')) {
                const item = e.target.closest('.order-item-row');
                item.style.transform = 'translateX(0)';
                item.style.boxShadow = '';
            }
            
            // Reset remove button
            if (e.target.classList.contains('remove-item-btn')) {
                e.target.style.background = '#ef4444';
                e.target.style.transform = 'scale(1)';
            }
        });
        
        // Add improved styles to match the design
        const style = document.createElement('style');
        style.textContent = `
            /* Back button improved design */
            .btn-back {
                background: linear-gradient(135deg, #4b5563, #6b7280) !important;
                color: white !important;
                border: none !important;
                padding: 0.75rem 1.25rem !important;
                border-radius: 12px !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 4px 12px rgba(75, 85, 99, 0.3) !important;
                display: flex !important;
                align-items: center !important;
                gap: 0.5rem !important;
                font-size: 0.95rem !important;
                font-weight: 600 !important;
            }
            
            .btn-back:hover {
                background: linear-gradient(135deg, #374151, #4b5563) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(75, 85, 99, 0.4) !important;
            }
            
            .back-icon {
                font-size: 1.2rem !important;
                font-weight: bold !important;
            }
            
            /* Improved order items design */
            .order-item-row {
                margin-bottom: 0.75rem !important;
                background: #4a5568 !important;
                border: 1px solid #718096 !important;
                border-radius: 12px !important;
                transition: all 0.3s ease !important;
                overflow: hidden !important;
                position: relative !important;
            }
            
            .item-content {
                display: flex !important;
                align-items: center !important;
                padding: 1rem 1.25rem !important;
                gap: 1rem !important;
            }
            
            .item-main {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                flex-grow: 1 !important;
                gap: 1rem !important;
            }
            
            .item-text {
                display: flex !important;
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 0.25rem !important;
                flex-grow: 1 !important;
            }
            
            .order-item-name {
                font-weight: 600 !important;
                color: #f7fafc !important;
                font-size: 1rem !important;
                line-height: 1.2 !important;
            }
            
            .item-category {
                font-size: 0.8rem !important;
                color: #cbd5e0 !important;
                text-transform: capitalize !important;
                font-weight: 500 !important;
            }
            
            .item-price {
                font-size: 1.1rem !important;
                font-weight: 700 !important;
                color: #f59e0b !important;
                text-align: right !important;
                white-space: nowrap !important;
            }
            
            .remove-item-btn {
                background: #e53e3e !important;
                color: white !important;
                border: none !important;
                border-radius: 50% !important;
                width: 32px !important;
                height: 32px !important;
                font-size: 18px !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-weight: bold !important;
                transition: all 0.2s ease !important;
                flex-shrink: 0 !important;
            }
            
            .remove-item-btn:hover {
                background: #c53030 !important;
                transform: scale(1.1) !important;
                box-shadow: 0 2px 8px rgba(229, 62, 62, 0.4) !important;
            }
            
            .order-item-row:hover {
                background: #5a6c7d !important;
                transform: translateX(4px) !important;
                box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2) !important;
            }
            
            /* Action buttons - updated layout without download button */
            .action-buttons {
                display: grid !important;
                grid-template-columns: 1fr 1.5fr !important;
                gap: 1rem !important;
                padding: 1.5rem !important;
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.02), rgba(251, 191, 36, 0.05)) !important;
                border-top: 1px solid rgba(245, 158, 11, 0.1) !important;
            }
            
            /* Responsive design improvements */
            @media (max-width: 768px) {
                .action-buttons {
                    grid-template-columns: 1fr !important;
                    gap: 0.75rem !important;
                    padding: 1rem !important;
                }
                
                .item-content {
                    padding: 0.875rem 1rem !important;
                }
                
                .item-main {
                    flex-direction: column !important;
                    align-items: flex-start !important;
                    gap: 0.5rem !important;
                }
                
                .item-price {
                    align-self: flex-end !important;
                    font-size: 1rem !important;
                }
                
                .remove-item-btn {
                    width: 28px !important;
                    height: 28px !important;
                    font-size: 16px !important;
                }
                
                .order-item-name {
                    font-size: 0.95rem !important;
                }
                
                .item-category {
                    font-size: 0.75rem !important;
                }
            }
            
            @media (max-width: 480px) {
                .item-content {
                    padding: 0.75rem 0.875rem !important;
                    gap: 0.75rem !important;
                }
                
                .remove-item-btn {
                    width: 26px !important;
                    height: 26px !important;
                    font-size: 14px !important;
                }
                
                .order-item-name {
                    font-size: 0.9rem !important;
                }
                
                .item-price {
                    font-size: 0.95rem !important;
                }
            }
            
            /* Back button container */
            .back-button-container {
                margin-bottom: 1.5rem !important;
                padding: 0 1.5rem !important;
            }
            
            @media (max-width: 768px) {
                .back-button-container {
                    padding: 0 1rem !important;
                    margin-bottom: 1rem !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    animateEntrance() {
        const summaryView = document.getElementById('summaryView');
        if (!summaryView) return;
        
        const sections = summaryView.querySelectorAll('.section, .action-buttons');
        
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 150);
        });

        setTimeout(() => {
            const orderItems = summaryView.querySelectorAll('.order-item-row');
            orderItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 100);
            });
        }, 300);
    }

    showSummary() {
        console.log('=== SHOWING SUMMARY ===');
        
        const summaryView = document.getElementById('summaryView');
        if (summaryView && summaryView.style.display === 'none') {
            console.log('Vista no visible, mostrando manualmente');
            summaryView.style.display = 'block';
        }
        
        const finalSummary = document.getElementById('finalSummary');
        if (!finalSummary) {
            console.error('finalSummary element not found!');
            return;
        }
        
        const items = this.getOrderItems();
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        let html = this.generateBackButton();
        html += this.generateCustomerSection();
        html += this.generateQueueSection(items);
        html += this.generateOrderSection(items, total);
        
        if (window.appState && window.appState.deliveryData) {
            html += this.generateDeliverySection();
        }
        
        html += this.generateActionButtons();
        
        finalSummary.innerHTML = html;
        
        // Eliminar botones duplicados del HTML original si existen
        this.removeDuplicateButtons();
        
        setTimeout(() => this.animateEntrance(), 100);
        
        console.log('=== SUMMARY COMPLETE ===');
    }

    removeDuplicateButtons() {
        // Buscar y eliminar botones duplicados que puedan estar en el HTML original
        const summaryView = document.getElementById('summaryView');
        if (summaryView) {
            // Eliminar action-buttons que no estén dentro de finalSummary
            const actionButtons = summaryView.querySelectorAll('.action-buttons');
            actionButtons.forEach(buttonGroup => {
                if (!buttonGroup.closest('#finalSummary')) {
                    buttonGroup.remove();
                }
            });
            
            // Eliminar botones sueltos
            const duplicateButtons = summaryView.querySelectorAll('button:not(#finalSummary button):not(.remove-item-btn):not(.back-btn)');
            duplicateButtons.forEach(btn => {
                if (btn.textContent.includes('Confirmar') || btn.textContent.includes('Descargar')) {
                    btn.remove();
                }
            });
        }
    }

    generateBackButton() {
        return `
            <div class="back-button-container" style="margin-bottom: 20px;">
                <button onclick="window.summaryPanel.goBackToEdit()" class="back-btn">
                    ← Volver a editar
                </button>
            </div>
        `;
    }

    generateActionButtons() {
        return `
            <div class="action-buttons" style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px;">
                <button onclick="window.summaryPanel.addMoreProducts()" class="btn btn-secondary">
                    + Agregar más productos
                </button>
                <div class="main-actions" style="display: flex; gap: 10px;">
                    <button id="downloadBtn" onclick="downloadTicket()" class="btn btn-secondary">
                        📄 Descargar Ticket
                    </button>
                    <button id="confirmBtn" onclick="confirmOrder()" class="btn btn-primary">
                        ✅ Confirmar Pedido
                    </button>
                </div>
            </div>
        `;
    }

    generateCustomerSection() {
        const customerName = (window.appState && window.appState.customerName) || 'Cliente';
        const orderType = (window.appState && window.appState.orderType) || 'physical';
        
        return `
            <div class="section customer-info">
                <h3 class="section-title">Cliente:</h3>
                <div class="customer-name">${customerName}</div>
            </div>
            
            <div class="section">
                <div class="order-type-badge">${orderType === 'physical' ? 'En local' : 'A domicilio'}</div>
            </div>
        `;
    }

    generateQueueSection(items) {
        console.log('=== DIAGNÓSTICO DE COLA ===');
        console.log('Items recibidos:', items);
        
        const categories = items.map(item => {
            console.log(`Producto: ${item.name}, Categoría: "${item.category}"`);
            return item.category;
        });
        
        console.log('Categorías detectadas:', categories);
        
        // Separar las verificaciones para debug
        const isBunuelos = categories.includes('bunuelos');
        const isBuñuelos = categories.includes('buñuelos');
        const isTradicionales = categories.includes('tradicionales');
        const isTraditional = categories.includes('traditional');
        const isTradicional = categories.includes('tradicional');
        const isEspeciales = categories.includes('especiales');
        const isSpecial = categories.includes('special');
        const isEspecial = categories.includes('especial');
        const isMixtos = categories.includes('mixtos');
        
        console.log('Verificaciones individuales:');
        console.log('- bunuelos:', isBunuelos);
        console.log('- buñuelos:', isBuñuelos);
        console.log('- tradicionales:', isTradicionales);
        console.log('- traditional:', isTraditional);
        console.log('- tradicional:', isTradicional);
        console.log('- especiales:', isEspeciales);
        console.log('- special:', isSpecial);
        console.log('- especial:', isEspecial);
        console.log('- mixtos:', isMixtos);
        
        const hasTradicionales = isBunuelos || isBuñuelos || isTradicionales || isTraditional || isTradicional;
        const hasEspeciales = isEspeciales || isSpecial || isEspecial;
        const hasMixtos = isMixtos;
        
        console.log('Resultados finales:');
        console.log('Has tradicionales:', hasTradicionales);
        console.log('Has especiales:', hasEspeciales);
        console.log('Has mixtos:', hasMixtos);
        
        let queueType = 'tradicionales';
        let queueColor = '#10b981';
        let queueIcon = '🥖';
        let turnPrefix = 'T';
        
        // Lógica corregida con prioridades claras
        if (hasMixtos) {
            // Productos específicamente marcados como mixtos
            queueType = 'mixtos';
            queueColor = '#f59e0b';
            queueIcon = '🍽️';
            turnPrefix = 'M';
            console.log('DETECTADO: Cola Mixtos (producto mixto específico)');
        } else if (hasTradicionales && hasEspeciales) {
            // Combinación de tradicionales + especiales
            queueType = 'mixtos';
            queueColor = '#f59e0b';
            queueIcon = '🍽️';
            turnPrefix = 'M';
            console.log('DETECTADO: Cola Mixtos (combinación de tradicionales + especiales)');
        } else if (hasEspeciales) {
            // Solo especiales
            queueType = 'especiales';
            queueColor = '#8b5cf6';
            queueIcon = '⭐';
            turnPrefix = 'E';
            console.log('DETECTADO: Cola Especiales (solo especiales)');
        } else if (hasTradicionales) {
            // Solo tradicionales
            queueType = 'tradicionales';
            queueColor = '#10b981';
            queueIcon = '🥖';
            turnPrefix = 'T';
            console.log('DETECTADO: Cola Tradicionales (solo tradicionales)');
        } else {
            // Fallback (bebidas u otros)
            console.log('DETECTADO: Cola Tradicionales (fallback - no se detectaron categorías conocidas)');
        }
        
        // Consultar la base de datos para obtener el turno real
        this.getNextTurnNumber(queueType).then(turnNumber => {
            const turnDisplay = `${turnPrefix}/${turnNumber}`;
            console.log('Turno asignado desde BD:', turnDisplay);
            
            if (window.appState) {
                window.appState.queueType = queueType;
                window.appState.turnDisplay = turnDisplay;
                window.appState.turnNumber = turnNumber;
            }
            
            // Actualizar la vista con el turno real
            const turnDisplayElement = document.querySelector('.turn-display');
            if (turnDisplayElement) {
                turnDisplayElement.textContent = turnDisplay;
                console.log('Vista actualizada con turno:', turnDisplay);
            }
            
            const queueNameElement = document.querySelector('.queue-name');
            if (queueNameElement) {
                queueNameElement.textContent = this.getQueueName(queueType);
            }
            
            // También actualizar el color del badge
            const queueBadge = document.querySelector('.queue-badge');
            if (queueBadge) {
                queueBadge.style.backgroundColor = `${queueColor}20`;
                queueBadge.style.borderColor = queueColor;
                queueBadge.style.color = queueColor;
            }
            
            const queueIconElement = document.querySelector('.queue-icon');
            if (queueIconElement) {
                queueIconElement.textContent = queueIcon;
            }
            
        }).catch(error => {
            console.error('Error getting turn number:', error);
        });
        
        // Mostrar turno temporal mientras se consulta la BD
        const tempTurnDisplay = `${turnPrefix}/...`;
        
        if (window.appState) {
            window.appState.queueType = queueType;
            window.appState.turnDisplay = tempTurnDisplay;
        }
        
        const queueNames = {
            'tradicionales': 'Turno Tradicionales',
            'especiales': 'Turno Especiales',
            'mixtos': 'Turno Mixtos'
        };
        
        console.log('=== FIN DIAGNÓSTICO ===');
        
        return `
            <div class="section queue-info">
                <h3 class="section-title">Turno de Preparación:</h3>
                <div class="queue-badge" style="background-color: ${queueColor}20; border: 2px solid ${queueColor}; color: ${queueColor}; padding: 15px; border-radius: 8px; text-align: center; margin: 10px 0;">
                    <div class="turn-display" style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">${tempTurnDisplay}</div>
                    <div class="queue-icon-name" style="font-size: 16px;">
                        <span class="queue-icon" style="font-size: 18px; margin-right: 8px;">${queueIcon}</span>
                        <span class="queue-name" style="font-weight: bold;">${queueNames[queueType]}</span>
                    </div>
                </div>
                <div class="queue-description" style="text-align: center; color: #666; font-size: 14px;">
                    ${queueType === 'tradicionales' ? 'Solo buñuelos tradicionales' : 
                      queueType === 'especiales' ? 'Solo buñuelos especiales' : 
                      'Buñuelos tradicionales y especiales'}
                </div>
            </div>
        `;
    }

    getQueueName(queueType) {
        const names = {
            'tradicionales': 'Turno Tradicionales',
            'especiales': 'Turno Especiales',
            'mixtos': 'Turno Mixtos'
        };
        return names[queueType] || 'Turno Tradicionales';
    }

    async getNextTurnNumber(queueType) {
        try {
            const response = await fetch('api/get_next_turn.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ queue_type: queueType })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                return result.turn_number;
            } else {
                throw new Error(result.error || 'Error getting turn number');
            }
        } catch (error) {
            console.error('Error fetching turn number:', error);
            // Fallback: devolver un número aleatorio para la vista previa
            return Math.floor(Math.random() * 50) + 1;
        }
    }

    generateOrderSection(items, total) {
        const itemsHtml = items.map(item => `
            <div class="order-item-row" data-item-id="${item.id}">
                <div class="item-info">
                    <div class="order-item-name">${item.quantity}x ${item.name}</div>
                    <div class="item-category">${this.getCategoryName(item.category)}</div>
                </div>
                <div class="item-price">${this.formatCurrency(item.price * item.quantity)}</div>
                <button class="remove-item-btn" onclick="window.summaryPanel.removeItem('${item.id}')" title="Eliminar producto">
                    ×
                </button>
            </div>
        `).join('');

        return `
            <div class="section order-info">
                <h3 class="section-title">Pedido:</h3>
                <div class="order-items-list">
                    ${itemsHtml}
                </div>
                <div class="order-total">
                    <div class="total-row">
                        <span>Total:</span>
                        <span id="finalTotalAmount">${this.formatCurrency(total)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getCategoryName(category) {
        const names = {
            'bunuelos': 'Tradicional',
            'especiales': 'Especial',
            'bebidas': 'Bebida'
        };
        return names[category] || category;
    }

    generateDeliverySection() {
        const data = window.appState.deliveryData;
        
        const paymentMethods = {
            'transfer': 'Transferencia',
            'cash': 'Efectivo',
            'whatsapp': 'WhatsApp'
        };

        return `
            <div class="section delivery-info">
                <h3 class="section-title">Entrega:</h3>
                <p><strong>Nombre:</strong> <span>${data.fullName}</span></p>
                <p><strong>Dirección:</strong> <span>${data.address}, ${data.neighborhood}</span></p>
                <p><strong>Teléfono:</strong> <span>${data.phone}</span></p>
                <p><strong>Pago:</strong> <span><span class="payment-method-badge">${paymentMethods[data.paymentMethod] || data.paymentMethod}</span></span></p>
                ${data.references ? `<p><strong>Referencias:</strong> <span>${data.references}</span></p>` : ''}
            </div>
        `;
    }

    getOrderItems() {
        let menuItems = window.menuItems;
        
        if (!menuItems && window.menuPanel && window.menuPanel.menuItems) {
            menuItems = window.menuPanel.menuItems;
        }
        
        if (!menuItems) {
            console.error('No menuItems found anywhere!');
            return [];
        }
        
        const quantities = (window.appState && window.appState.quantities) || {};
        
        const result = menuItems.filter(item => quantities[item.id] > 0)
                                .map(item => ({
                                    ...item,
                                    quantity: quantities[item.id]
                                }));
        
        return result;
    }

    async confirmOrder() {
        if (this.isProcessing) {
            console.log('Order already being processed, please wait...');
            return;
        }
        
        console.log('Confirming order...');
        this.isProcessing = true;
        
        const confirmBtn = document.getElementById('confirmBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        
        try {
            if (confirmBtn) {
                confirmBtn.classList.add('processing');
                confirmBtn.disabled = true;
                confirmBtn.textContent = 'Procesando...';
            }
            if (downloadBtn) {
                downloadBtn.disabled = true;
            }
            
            const items = this.getOrderItems();
            const orderData = {
                customerName: (window.appState && window.appState.customerName) || 'Cliente',
                orderType: (window.appState && window.appState.orderType) || 'physical',
                items: items,
                deliveryData: (window.appState && window.appState.deliveryData) || null,
                csrf_token: window.CSRF_TOKEN || ''
            };
            
            console.log('Order data to send:', orderData);
            
            const response = await fetch('api/orders_create.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            
            console.log('Response status:', response.status);
            
            const responseText = await response.text();
            console.log('Raw response:', responseText);
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response as JSON:', parseError);
                throw new Error('Respuesta del servidor inválida');
            }
            
            console.log('Parsed result:', result);
            
            if (result.success) {
                const orderCode = result.data.order_code || 'PED-' + Date.now().toString().slice(-6);
                const queueInfo = result.data.queue_info || {};
                const turnNumber = result.data.turn_number || 1;
                const turnDisplay = result.data.turn_display || 'T/1';
                
                if (window.appState) {
                    window.appState.orderCode = orderCode;
                    window.appState.queueType = result.data.queue_type || 'tradicionales';
                    window.appState.turnNumber = turnNumber;
                    window.appState.turnDisplay = turnDisplay;
                    window.appState.queueInfo = queueInfo;
                }
                
                // Generar y descargar ticket automáticamente
                await this.generateImageTicket(result.data);
                
                await this.showSuccessMessage(orderCode, queueInfo, turnDisplay);
                
                setTimeout(() => {
                    this.resetAppImmediately();
                }, 3000);
                
            } else {
                throw new Error(result.error || 'Error desconocido al procesar el pedido');
            }
            
        } catch (error) {
            console.error('Error confirming order:', error);
            this.showAlert(error.message || 'Error al procesar el pedido', 'error');
            
        } finally {
            this.isProcessing = false;
            if (confirmBtn) {
                confirmBtn.classList.remove('processing');
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Confirmar Pedido';
            }
            if (downloadBtn) {
                downloadBtn.disabled = false;
            }
        }
    }

    async generateImageTicket(orderData) {
        try {
            console.log('Generating image ticket...', orderData);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = 400;
            canvas.height = 750;
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            let y = 40;
            const lineHeight = 25;
            const margin = 20;
            
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            
            // Título
            ctx.font = 'bold 22px Arial';
            ctx.fillText('EL REY DE LOS BUÑUELOS', canvas.width / 2, y);
            y += lineHeight + 15;
            
            // Fecha y hora
            const date = new Date().toLocaleString('es-CO', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            ctx.font = '16px Arial';
            ctx.fillText(date, canvas.width / 2, y);
            y += lineHeight + 10;
            
            // Ticket de pedido
            ctx.font = 'bold 18px Arial';
            ctx.fillText('TICKET DE PEDIDO', canvas.width / 2, y);
            y += lineHeight + 15;
            
            // Línea separadora
            ctx.fillRect(margin, y, canvas.width - (margin * 2), 2);
            y += 25;
            
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            
            const customerName = (window.appState && window.appState.customerName) || 'Cliente';
            const orderType = (window.appState && window.appState.orderType) || 'physical';
            const turnDisplay = orderData.turn_display || window.appState?.turnDisplay || 'T/1';
            
            // Información del pedido
            ctx.fillText(`Cliente: ${customerName}`, margin, y);
            y += lineHeight;
            ctx.fillText(`Tipo: ${orderType === 'physical' ? 'En local' : 'A domicilio'}`, margin, y);
            y += lineHeight;
            ctx.fillText(`Turno: ${turnDisplay}`, margin, y);
            y += lineHeight;
            ctx.fillText(`Código: ${orderData.order_code}`, margin, y);
            y += lineHeight + 20;
            
            // Línea separadora
            ctx.fillRect(margin, y, canvas.width - (margin * 2), 1);
            y += 20;
            
            // Título de productos
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('PEDIDO', canvas.width / 2, y);
            y += lineHeight + 5;
            
            // Línea separadora
            ctx.fillRect(margin, y, canvas.width - (margin * 2), 1);
            y += 15;
            
            // Productos
            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            
            const items = this.getOrderItems();
            let total = 0;
            
            items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                // Cantidad y nombre
                const itemText = `${item.quantity}x ${item.name}`;
                ctx.fillText(itemText, margin, y);
                
                // Precio alineado a la derecha
                ctx.textAlign = 'right';
                ctx.fillText(this.formatCurrency(itemTotal), canvas.width - margin, y);
                ctx.textAlign = 'left';
                
                y += lineHeight;
            });
            
            y += 10;
            
            // Línea separadora
            ctx.fillRect(margin, y, canvas.width - (margin * 2), 1);
            y += 20;
            
            // Total
            ctx.font = 'bold 18px Arial';
            ctx.fillText('TOTAL:', margin, y);
            ctx.textAlign = 'right';
            ctx.fillText(this.formatCurrency(total), canvas.width - margin, y);
            ctx.textAlign = 'left';
            y += lineHeight + 20;
            
            // Información de entrega si existe
            if (window.appState && window.appState.deliveryData) {
                const data = window.appState.deliveryData;
                
                // Línea separadora
                ctx.fillRect(margin, y, canvas.width - (margin * 2), 1);
                y += 20;
                
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('INFORMACIÓN DE ENTREGA', canvas.width / 2, y);
                y += lineHeight + 5;
                
                ctx.font = '14px Arial';
                ctx.textAlign = 'left';
                
                ctx.fillText(`Nombre: ${data.fullName}`, margin, y);
                y += lineHeight;
                ctx.fillText(`Dirección: ${data.address}`, margin, y);
                y += lineHeight;
                ctx.fillText(`Barrio: ${data.neighborhood}`, margin, y);
                y += lineHeight;
                ctx.fillText(`Teléfono: ${data.phone}`, margin, y);
                y += lineHeight;
                
                const paymentMethods = {
                    'transfer': 'Transferencia',
                    'cash': 'Efectivo',
                    'whatsapp': 'WhatsApp'
                };
                ctx.fillText(`Pago: ${paymentMethods[data.paymentMethod] || data.paymentMethod}`, margin, y);
                y += lineHeight + 10;
            }
            
            // Línea separadora final
            ctx.fillRect(margin, y, canvas.width - (margin * 2), 2);
            y += 20;
            
            // Mensaje final
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('¡Gracias por tu pedido!', canvas.width / 2, y);
            
            // Convertir canvas a imagen y descargar
            const downloadPromise = new Promise((resolve, reject) => {
                try {
                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error('Error al generar la imagen'));
                            return;
                        }
                        
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `ticket-${turnDisplay.replace('/', '-')}-${orderData.order_code}.png`;
                        
                        // Forzar descarga
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                        
                        console.log('Image ticket downloaded successfully');
                        resolve();
                    }, 'image/png', 1.0);
                } catch (error) {
                    reject(error);
                }
            });
            
            await downloadPromise;
            this.showAlert('Ticket descargado automáticamente', 'success');
            
        } catch (error) {
            console.error('Error generating image ticket:', error);
            this.showAlert('Error al generar ticket en imagen: ' + error.message, 'error');
        }
    }

    async showSuccessMessage(orderCode, queueInfo, turnDisplay) {
        return new Promise(resolve => {
            const finalSummary = document.getElementById('finalSummary');
            
            const queueNames = {
                'tradicionales': 'Turno Tradicionales',
                'especiales': 'Turno Especiales',
                'mixtos': 'Turno Mixtos'
            };
            
            const queueColors = {
                'tradicionales': '#10b981',
                'especiales': '#8b5cf6',
                'mixtos': '#f59e0b'
            };
            
            const queueType = window.appState?.queueType || 'tradicionales';
            const queueName = queueNames[queueType];
            const queueColor = queueColors[queueType];
            
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.innerHTML = `
                <div class="success-icon">✅</div>
                <h2 class="success-title">¡Pedido Confirmado!</h2>
                <p class="success-subtitle">Tu pedido ha sido procesado exitosamente</p>
                
                <div class="turn-display-success" style="margin: 20px 0; padding: 20px; background-color: ${queueColor}20; border: 3px solid ${queueColor}; border-radius: 12px; color: ${queueColor};">
                    <div style="font-size: 48px; font-weight: bold; margin-bottom: 8px;">${turnDisplay}</div>
                    <div style="font-size: 18px; font-weight: bold;">${queueName}</div>
                </div>
                
                <div class="order-code">Código: ${orderCode}</div>
                <div class="download-info" style="margin: 10px 0; color: #10b981;">
                    📱 Ticket descargado automáticamente
                </div>
                <div style="margin-top: 15px;">
                    <button onclick="window.summaryPanel.resetAppImmediately()" class="btn btn-primary">Hacer Nuevo Pedido</button>
                </div>
            `;
            
            finalSummary.insertBefore(successDiv, finalSummary.firstChild);
            
            successDiv.style.opacity = '0';
            successDiv.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                successDiv.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                successDiv.style.opacity = '1';
                successDiv.style.transform = 'scale(1)';
                resolve();
            }, 100);
        });
    }

    resetAppImmediately() {
        console.log('Resetting app immediately for new order');
        
        if (window.appState) {
            window.appState.orderType = '';
            window.appState.customerName = '';
            window.appState.quantities = {};
            window.appState.deliveryData = null;
            window.appState.orderCode = '';
            window.appState.queueType = '';
            window.appState.turnNumber = 0;
            window.appState.turnDisplay = '';
            window.appState.queueInfo = null;
        }
        
        const forms = ['customerForm', 'deliveryForm'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) form.reset();
        });
        
        document.querySelectorAll('.quantity-display').forEach(el => {
            el.textContent = '0';
        });
        
        if (window.menuPanel) {
            window.menuPanel.reset();
        }
        
        if (window.deliveryPanel) {
            window.deliveryPanel.reset();
        }
        
        if (window.customerInfoPanel) {
            window.customerInfoPanel.reset();
        }
        
        this.isProcessing = false;
        const confirmBtn = document.getElementById('confirmBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        
        if (confirmBtn) {
            confirmBtn.classList.remove('processing');
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Confirmar Pedido';
        }
        if (downloadBtn) {
            downloadBtn.disabled = false;
        }
        
        if (window.appState && window.appState.showView) {
            window.appState.showView('orderTypeView');
        }
        
        this.showAlert('¡Listo para un nuevo pedido!', 'success');
    }

    downloadTicket() {
        console.log('Downloading text ticket...');
        
        const btn = document.getElementById('downloadBtn');
        if (btn) {
            btn.classList.add('processing');
        }
        
        setTimeout(() => {
            try {
                const items = this.getOrderItems();
                const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                let ticketContent = this.generateTicketContent(items, total);
                
                const blob = new Blob([ticketContent], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = url;
                const orderCode = (window.appState && window.appState.orderCode) || Date.now();
                const turnDisplay = (window.appState && window.appState.turnDisplay) || 'T-1';
                link.download = `ticket-${turnDisplay.replace('/', '-')}-${orderCode}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                URL.revokeObjectURL(url);
                
                this.showAlert('Ticket de texto descargado', 'success');
                
            } catch (error) {
                console.error('Error downloading ticket:', error);
                this.showAlert('Error al generar el ticket', 'error');
            } finally {
                if (btn) {
                    btn.classList.remove('processing');
                }
            }
        }, 1500);
    }

    generateTicketContent(items, total) {
        const date = new Date().toLocaleString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const customerName = (window.appState && window.appState.customerName) || 'Cliente';
        const orderType = (window.appState && window.appState.orderType) || 'physical';
        const orderCode = (window.appState && window.appState.orderCode) || '';
        const turnDisplay = (window.appState && window.appState.turnDisplay) || 'T/1';
        
        let content = `
========================================
      EL REY DE LOS BUÑUELOS
========================================

${date}

       TICKET DE PEDIDO

========================================
Cliente: ${customerName}
Tipo: ${orderType === 'physical' ? 'En local' : 'A domicilio'}
Turno: ${turnDisplay}
Código: ${orderCode}

----------------------------------------
                PEDIDO
----------------------------------------
`;

        items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            content += `${item.quantity}x ${item.name.padEnd(20)} ${this.formatCurrency(itemTotal).padStart(12)}\n`;
        });

        content += `
----------------------------------------
TOTAL: ${this.formatCurrency(total).padStart(27)}
----------------------------------------
`;

        if (window.appState && window.appState.deliveryData) {
            const data = window.appState.deliveryData;
            const paymentMethods = {
                'transfer': 'Transferencia',
                'cash': 'Efectivo',
                'whatsapp': 'WhatsApp'
            };
            
            content += `
INFORMACIÓN DE ENTREGA:
Nombre: ${data.fullName}
Dirección: ${data.address}, ${data.neighborhood}
Teléfono: ${data.phone}
Pago: ${paymentMethods[data.paymentMethod] || data.paymentMethod}
${data.references ? `Referencias: ${data.references}` : ''}
`;
        }

        content += `
========================================
        ¡Gracias por tu pedido!
========================================
`;

        return content;
    }

    showAlert(message, type = 'info') {
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        });

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        
        const icons = {
            info: 'ℹ️',
            error: '❌',
            success: '✅',
            warning: '⚠️'
        };
        
        alertDiv.innerHTML = `
            <span>${icons[type] || icons.info}</span>
            <span>${message}</span>
        `;
        
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
            transition: opacity 0.3s ease;
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
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        }, type === 'error' ? 6000 : 4000);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    resetApp() {
        this.resetAppImmediately();
    }

    goBackToEdit() {
        if (window.appState) {
            if (window.appState.orderType === 'delivery') {
                window.appState.showView('deliveryView');
            } else {
                window.appState.showView('menuView');
            }
        } else {
            this.showAlert('Navegando al panel anterior...', 'info');
        }
    }

    updateOrderData(newData) {
        if (window.appState) {
            Object.assign(window.appState, newData);
        }
        this.showSummary();
    }

    getOrderData() {
        if (!window.appState) return {};
        
        return {
            customerName: window.appState.customerName,
            orderType: window.appState.orderType,
            items: this.getOrderItems(),
            deliveryData: window.appState.deliveryData,
            queueType: window.appState.queueType,
            turnNumber: window.appState.turnNumber,
            turnDisplay: window.appState.turnDisplay,
            total: this.getOrderItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
    }

    triggerAnimations() {
        this.animateEntrance();
    }

    validateOrderData() {
        const items = this.getOrderItems();
        const errors = [];

        if (!window.appState || !window.appState.customerName || window.appState.customerName.trim() === '') {
            errors.push('Nombre del cliente es requerido');
        }

        if (!items || items.length === 0) {
            errors.push('Debe seleccionar al menos un producto');
        }

        if (window.appState && window.appState.orderType === 'delivery' && (!window.appState.deliveryData || !window.appState.deliveryData.address)) {
            errors.push('Información de entrega incompleta');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    showValidationErrors(errors) {
        errors.forEach((error, index) => {
            setTimeout(() => {
                this.showAlert(error, 'error');
            }, index * 1000);
        });
    }

    removeItem(itemId) {
        console.log('=== REMOVING ITEM ===');
        console.log('Item ID to remove:', itemId);
        console.log('Current appState.quantities:', window.appState?.quantities);
        
        if (!window.appState || !window.appState.quantities) {
            console.error('appState or quantities not found');
            this.showAlert('Error: No se encontraron cantidades', 'error');
            return;
        }
        
        // Verificar que el item existe
        if (!(itemId in window.appState.quantities)) {
            console.error('Item not found in quantities:', itemId);
            this.showAlert('Producto no encontrado en el pedido', 'error');
            return;
        }
        
        // Confirmar eliminación
        if (!confirm('¿Estás seguro de que quieres eliminar este producto del pedido?')) {
            console.log('User cancelled removal');
            return;
        }
        
        console.log('Removing item from appState.quantities');
        
        // Eliminar del appState
        delete window.appState.quantities[itemId];
        
        console.log('Updated appState.quantities:', window.appState.quantities);
        
        // Sincronizar con menuPanel si existe
        if (window.menuPanel && typeof window.menuPanel.updateQuantity === 'function') {
            console.log('Syncing with menuPanel');
            window.menuPanel.updateQuantity(itemId, 0);
        } else {
            console.log('menuPanel not available or updateQuantity method not found');
        }
        
        // Actualizar el display de cantidad en el menú
        const quantityDisplay = document.querySelector(`[data-item="${itemId}"] .quantity-display`);
        if (quantityDisplay) {
            console.log('Updating quantity display in menu');
            quantityDisplay.textContent = '0';
        } else {
            console.log('Quantity display element not found');
        }
        
        // Verificar si quedan productos
        const remainingItems = this.getOrderItems();
        console.log('Remaining items after removal:', remainingItems.length);
        
        if (remainingItems.length === 0) {
            this.showAlert('No hay productos en el pedido. Redirigiendo al menú...', 'info');
            setTimeout(() => {
                this.addMoreProducts();
            }, 2000);
            return;
        }
        
        // Regenerar el resumen
        console.log('Regenerating summary');
        this.showSummary();
        
        this.showAlert('Producto eliminado del pedido', 'success');
        console.log('=== ITEM REMOVAL COMPLETE ===');
    }

    // También voy a agregar una función de debug para verificar el estado
    debugAppState() {
        console.log('=== DEBUG APP STATE ===');
        console.log('window.appState exists:', !!window.appState);
        console.log('window.appState.quantities:', window.appState?.quantities);
        console.log('Current order items:', this.getOrderItems());
        console.log('=== END DEBUG ===');
    }

    addMoreProducts() {
        console.log('Adding more products');
        
        // Volver al panel de selección de productos
        if (window.appState && window.appState.showView) {
            window.appState.showView('menuView');
        } else {
            // Fallback manual
            document.querySelectorAll('.view').forEach(view => {
                view.style.display = 'none';
            });
            
            const menuView = document.getElementById('menuView');
            if (menuView) {
                menuView.style.display = 'block';
            }
        }
        
        this.showAlert('Puedes agregar más productos a tu pedido', 'info');
    }
}

// Global functions for onclick handlers
function confirmOrder() {
    if (window.summaryPanel) {
        const validation = window.summaryPanel.validateOrderData();
        if (!validation.isValid) {
            window.summaryPanel.showValidationErrors(validation.errors);
            return;
        }
        
        window.summaryPanel.confirmOrder();
    }
}

function downloadTicket() {
    if (window.summaryPanel) {
        window.summaryPanel.downloadTicket();
    }
}

function goBack() {
    if (window.summaryPanel) {
        window.summaryPanel.goBackToEdit();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Modern Summary Panel...');
    window.summaryPanel = new SummaryPanel();
    console.log('Modern Summary Panel initialized successfully');
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Summary Panel Error:', e.error);
    if (window.summaryPanel) {
        window.summaryPanel.showAlert('Ha ocurrido un error inesperado', 'error');
    }
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Summary Panel Promise Rejection:', e.reason);
    if (window.summaryPanel) {
        window.summaryPanel.showAlert('Error en la operación', 'error');
    }
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SummaryPanel;
}