
<!-- Menu -->
<div id="menuView" class="view" style="display: none;">
    <div class="container">
        <div class="menu-header">
            <button class="btn-back-simple" onclick="goBack()">← Atrás</button>
            
            <div class="greeting-section">
                <h1 id="customerGreeting"></h1>
                <p class="greeting-subtitle">Elige tus buñuelos favoritos</p>
            </div>
        </div>
        
        <div class="menu-layout">
            <div class="menu-content">
                <!-- Sección Buñuelos Tradicionales -->
                <div class="menu-section-expandable">
                    <div class="section-header-clickable" onclick="toggleMenuSection('traditional')">
                        <div class="section-header-content">
                            <span class="section-icon">🧄</span>
                            <h2>Buñuelos Tradicionales</h2>
                            <span class="item-count">(2 opciones)</span>
                        </div>
                        <span class="expand-arrow" id="arrow-traditional">▼</span>
                    </div>
                    
                    <div class="menu-items-container" id="section-traditional" style="display: block;">
                        <!-- Buñuelo Clásico -->
                        <div class="menu-item" data-item-id="bunuelo-clasico">
                            <div class="item-details">
                                <h3 class="item-name">Buñuelo Clásico</h3>
                                <p class="item-description">El tradicional buñuelo de toda la vida, crujiente por fuera y suave por dentro</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$2.500</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-bunuelo-clasico">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Buñuelo de Queso -->
                        <div class="menu-item" data-item-id="bunuelo-queso">
                            <div class="item-details">
                                <h3 class="item-name">Buñuelo de Queso Mozzarella</h3>
                                <p class="item-description">Buñuelo relleno de queso mozzarella derretido</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$3.500</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-bunuelo-queso">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Sección Buñuelos Especiales -->
                <div class="menu-section-expandable">
                    <div class="section-header-clickable" onclick="toggleMenuSection('special')">
                        <div class="section-header-content">
                            <span class="section-icon">⭐</span>
                            <h2>Buñuelos Especiales</h2>
                            <span class="item-count">(5 opciones)</span>
                        </div>
                        <span class="expand-arrow" id="arrow-special">▶</span>
                    </div>
                    
                    <div class="menu-items-container" id="section-special" style="display: none;">
                        <!-- Buñuelo Hawaiano -->
                        <div class="menu-item" data-item-id="bunuelo-hawaiano">
                            <div class="item-details">
                                <h3 class="item-name">Buñuelo Hawaiano</h3>
                                <p class="item-description">Buñuelo tropical con piña y coco, sabor exótico único</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$4.200</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-bunuelo-hawaiano">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Buñuelo Ranchero -->
                        <div class="menu-item" data-item-id="bunuelo-ranchero">
                            <div class="item-details">
                                <h3 class="item-name">Buñuelo Ranchero</h3>
                                <p class="item-description">Buñuelo campesino con queso y hierbas finas, estilo tradicional</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$3.800</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-bunuelo-ranchero">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Buñuelo de Mermelada -->
                        <div class="menu-item" data-item-id="bunuelo-mermelada">
                            <div class="item-details">
                                <h3 class="item-name">Buñuelo de Mermelada</h3>
                                <p class="item-description">Buñuelo dulce relleno de mermelada de mora o fresa</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$3.600</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-bunuelo-mermelada">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Buñuelo de Bocadillo -->
                        <div class="menu-item" data-item-id="bunuelo-bocadillo">
                            <div class="item-details">
                                <h3 class="item-name">Buñuelo de Bocadillo</h3>
                                <p class="item-description">Buñuelo tradicional colombiano relleno de bocadillo de guayaba</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$4.000</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-bunuelo-bocadillo">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Buñuelo de Arequipe -->
                        <div class="menu-item" data-item-id="bunuelo-arequipe">
                            <div class="item-details">
                                <h3 class="item-name">Buñuelo de Arequipe</h3>
                                <p class="item-description">Buñuelo relleno de cremoso arequipe casero</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$4.500</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-bunuelo-arequipe">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Sección Bebidas (única funcional) -->
                <div class="menu-section-expandable">
                    <div class="section-header-clickable" onclick="toggleMenuSection('drinks')">
                        <div class="section-header-content">
                            <span class="section-icon">🥤</span>
                            <h2>Bebidas</h2>
                            <span class="item-count">(20 opciones)</span>
                        </div>
                        <span class="expand-arrow" id="arrow-drinks">▶</span>
                    </div>
                    
                    <div class="menu-items-container" id="section-drinks" style="display: none;">
                        <!-- Malta -->
                        <div class="menu-item" data-item-id="malta-1500ml">
                            <div class="item-details">
                                <h3 class="item-name">Malta Litro y Medio</h3>
                                <p class="item-description">Malta 1.5 litros</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$6.000</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-malta-1500ml">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="menu-item" data-item-id="malta-1000ml">
                            <div class="item-details">
                                <h3 class="item-name">Malta Litro</h3>
                                <p class="item-description">Malta 1 litro</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$4.000</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-malta-1000ml">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="menu-item" data-item-id="malta-personal">
                            <div class="item-details">
                                <h3 class="item-name">Malta Personal</h3>
                                <p class="item-description">Malta personal</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$3.000</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-malta-personal">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="menu-item" data-item-id="malta-lata">
                            <div class="item-details">
                                <h3 class="item-name">Malta Lata</h3>
                                <p class="item-description">Malta en lata</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$3.000</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-malta-lata">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="menu-item" data-item-id="malta-mini">
                            <div class="item-details">
                                <h3 class="item-name">Malta Mini</h3>
                                <p class="item-description">Malta mini</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$1.500</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-malta-mini">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <!-- Valle -->
                        <div class="menu-item" data-item-id="valle-1500ml">
                            <div class="item-details">
                                <h3 class="item-name">Valle 1.5 Litros</h3>
                                <p class="item-description">Valle 1.5 litros</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$4.000</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-valle-1500ml">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="menu-item" data-item-id="valle-personal">
                            <div class="item-details">
                                <h3 class="item-name">Valle Personal</h3>
                                <p class="item-description">Valle personal</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$2.000</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-valle-personal">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <!-- Coca Cola -->
                        <div class="menu-item" data-item-id="coca-cola-1500ml">
                            <div class="item-details">
                                <h3 class="item-name">Coca Cola 1.5 Litros</h3>
                                <p class="item-description">Coca Cola 1.5 litros</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$6.500</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-coca-cola-1500ml">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="menu-item" data-item-id="coca-cola-1000ml">
                            <div class="item-details">
                                <h3 class="item-name">Coca Cola Litro</h3>
                                <p class="item-description">Coca Cola 1 litro</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$4.500</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-coca-cola-1000ml">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="menu-item" data-item-id="coca-cola-personal">
                            <div class="item-details">
                                <h3 class="item-name">Coca Cola Personal</h3>
                                <p class="item-description">Coca Cola personal</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$3.000</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-coca-cola-personal">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="menu-item" data-item-id="coca-cola-mega">
                            <div class="item-details">
                                <h3 class="item-name">Coca Cola Mega</h3>
                                <p class="item-description">Coca Cola mega</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$11.000</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-coca-cola-mega">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <!-- Cuatro -->
                        <div class="menu-item" data-item-id="cuatro-4500ml">
                            <div class="item-details">
                                <h3 class="item-name">Cuatro 4.5 Litros</h3>
                                <p class="item-description">Cuatro 4.5 litros</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$5.000</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-cuatro-4500ml">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="menu-item" data-item-id="cuatro-personal">
                            <div class="item-details">
                                <h3 class="item-name">Cuatro Personal</h3>
                                <p class="item-description">Cuatro personal</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$2.500</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-cuatro-personal">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <!-- Kola Román -->
                        <div class="menu-item" data-item-id="kola-roman-1500ml">
                            <div class="item-details">
                                <h3 class="item-name">Kola Román 1.5 Litros</h3>
                                <p class="item-description">Kola Román 1.5 litros</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$4.500</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-kola-roman-1500ml">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="menu-item" data-item-id="kola-roman-personal">
                            <div class="item-details">
                                <h3 class="item-name">Kola Román Personal</h3>
                                <p class="item-description">Kola Román personal</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$2.500</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-kola-roman-personal">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <!-- Jugo Hit -->
                        <div class="menu-item" data-item-id="jugo-hit-1500ml">
                            <div class="item-details">
                                <h3 class="item-name">Jugo Hit 1.5 Litros</h3>
                                <p class="item-description">Jugo Hit 1.5 litros</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$5.000</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-jugo-hit-1500ml">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="menu-item" data-item-id="jugo-hit-personal">
                            <div class="item-details">
                                <h3 class="item-name">Jugo Hit Personal</h3>
                                <p class="item-description">Jugo Hit personal</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$3.000</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-jugo-hit-personal">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <!-- Jugo Pul -->
                        <div class="menu-item" data-item-id="jugo-pul-1500ml">
                            <div class="item-details">
                                <h3 class="item-name">Jugo Pul 1.5 Litros</h3>
                                <p class="item-description">Jugo Pul 1.5 litros</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$6.500</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-jugo-pul-1500ml">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="menu-item" data-item-id="jugo-pul-1000ml">
                            <div class="item-details">
                                <h3 class="item-name">Jugo Pul Litro</h3>
                                <p class="item-description">Jugo Pul 1 litro</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$5.500</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-jugo-pul-1000ml">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="menu-item" data-item-id="jugo-pul-personal">
                            <div class="item-details">
                                <h3 class="item-name">Jugo Pul Personal</h3>
                                <p class="item-description">Jugo Pul personal</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$3.000</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-jugo-pul-personal">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>

                        <!-- Avenas -->
                        <div class="menu-item" data-item-id="avenas-bolsa">
                            <div class="item-details">
                                <h3 class="item-name">Avenas Bolsa</h3>
                                <p class="item-description">Avenas en bolsa</p>
                            </div>
                            <div class="item-right">
                                <div class="item-price">$2.000</div>
                                <div class="quantity-controls">
                                    <button type="button" class="qty-btn minus">-</button>
                                    <span class="qty-display" id="qty-avenas-bolsa">0</span>
                                    <button type="button" class="qty-btn plus">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Order Summary -->
            <div class="order-summary-sidebar">
                <div class="summary-card">
                    <h3 class="summary-title">Resumen del Pedido</h3>
                    
                    <div id="orderItems" class="order-items"></div>
                    
                    <div id="orderTotal" class="order-total" style="display: none;">
                        <div class="total-line">
                            <span class="total-label">Total:</span>
                            <span id="totalAmount" class="total-price"></span>
                        </div>
                        <button id="continueBtn" class="summary-btn">Ver Resumen</button>
                    </div>
                    
                    <div id="emptyCart" class="empty-state">
                        <p>Selecciona algunos buñuelos para continuar</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// Función para toggle de secciones del menú
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
</script>