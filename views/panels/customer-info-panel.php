<!-- Customer Info -->
<div id="customerInfoView" class="view" style="display: none;">
    <div class="container">
        <div class="back-navigation">
            <button class="btn-back" onclick="goBack()">
                <span class="back-icon">←</span>
                <span class="back-text">Cambiar tipo de pedido</span>
            </button>
        </div>
        
        <div class="customer-info-wrapper">
            <div class="info-card">
                <div class="card-header">
                    <div class="header-icon">
                        <span class="user-emoji">👤</span>
                    </div>
                    <h1>Información del Cliente</h1>
                    <div id="orderTypeText" class="order-type-badge"></div>
                </div>
                
                <div class="card-body">
                    <form id="customerForm" class="customer-form">
                        <div class="form-group">
                            <label class="form-label" for="customerName">
                                <span class="label-icon">📝</span>
                                <span class="label-text">Nombre completo *</span>
                            </label>
                            <div class="input-wrapper">
                                <input type="text" id="customerName" name="customerName" class="form-input" placeholder="Ingresa tu nombre completo" required>
                                <div class="input-border"></div>
                            </div>
                            <div class="field-hint">Ejemplo: Juan Pérez García</div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn-continue">
                                <span class="btn-text">Continuar al Menú</span>
                                <span class="btn-icon">🍽️</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>