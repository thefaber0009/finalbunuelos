<!-- Delivery Form -->
<div id="deliveryView" class="view" style="display: none;">
    <div class="container-sm">
        <a href="#" class="btn-back" onclick="goBack(); return false;">
            ← Atrás
        </a>
        
        <div class="card">
            <h1>Información de Entrega</h1>
            <p class="subtitle">Completa los datos para recibir tu pedido</p>
            
            <form id="deliveryForm">
                <div class="form-group">
                    <label class="form-label" for="fullName">
                        Nombre completo <span class="required">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="fullName" 
                        name="fullName" 
                        class="form-input" 
                        placeholder="Escribe tu nombre completo"
                        required 
                        autocomplete="name"
                    >
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="phone">
                        Teléfono <span class="required">*</span>
                    </label>
                    <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        class="form-input" 
                        placeholder="Ej: 300 123 4567"
                        required 
                        autocomplete="tel"
                    >
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="address">
                        Dirección <span class="required">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="address" 
                        name="address" 
                        class="form-input" 
                        placeholder="Calle 123 # 45-67"
                        required 
                        autocomplete="street-address"
                    >
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="neighborhood">
                        Barrio <span class="required">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="neighborhood" 
                        name="neighborhood" 
                        class="form-input" 
                        placeholder="Nombre del barrio"
                        required 
                        autocomplete="address-level2"
                    >
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="references">
                        Referencias
                    </label>
                    <textarea 
                        id="references" 
                        name="references" 
                        class="form-textarea" 
                        placeholder="Casa blanca con portón negro, al lado del parque, etc."
                        rows="3"
                    ></textarea>
                </div>
                
                <!-- Método de Pago con Radio Buttons -->
                <div class="form-group">
                    <label class="form-label">
                        Método de Pago <span class="required">*</span>
                    </label>
                    
                    <div class="payment-methods">
                        <!-- Transferencia Bancaria -->
                        <div class="payment-option">
                            <input 
                                type="radio" 
                                id="transferRadio" 
                                name="paymentMethod" 
                                value="transfer" 
                                class="payment-radio"
                                onchange="handlePaymentMethodChange(event)"
                            >
                            <label for="transferRadio" class="payment-label">
                                <span class="payment-icon">💳</span>
                                <span class="payment-text">Transferencia Bancaria</span>
                            </label>
                        </div>
                        
                        <!-- Efectivo -->
                        <div class="payment-option">
                            <input 
                                type="radio" 
                                id="cashRadio" 
                                name="paymentMethod" 
                                value="cash" 
                                class="payment-radio"
                                onchange="handlePaymentMethodChange(event)"
                            >
                            <label for="cashRadio" class="payment-label">
                                <span class="payment-icon">💵</span>
                                <span class="payment-text">Efectivo contra entrega</span>
                            </label>
                        </div>
                        
                        <!-- WhatsApp -->
                        <div class="payment-option">
                            <input 
                                type="radio" 
                                id="whatsappRadio" 
                                name="paymentMethod" 
                                value="whatsapp" 
                                class="payment-radio"
                                onchange="handlePaymentMethodChange(event)"
                            >
                            <label for="whatsappRadio" class="payment-label">
                                <span class="payment-icon">📱</span>
                                <span class="payment-text">Enviar comprobante por WhatsApp</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Opciones de Transferencia -->
                <div id="transferOptions" class="transfer-section" style="display: none;">
                    <h3 class="transfer-title">Selecciona tu banco:</h3>
                    
                    <div class="bank-options">
                        <!-- Bancolombia -->
                        <div class="bank-option">
                            <input 
                                type="radio" 
                                id="bancolombia" 
                                name="bankOption" 
                                value="bancolombia" 
                                class="bank-radio"
                                onchange="handleBankSelection(event)"
                            >
                            <label for="bancolombia" class="bank-label">
                                <span class="bank-icon">🏦</span>
                                <span class="bank-text">Bancolombia</span>
                            </label>
                        </div>
                        
                        <!-- Nequi -->
                        <div class="bank-option">
                            <input 
                                type="radio" 
                                id="nequi" 
                                name="bankOption" 
                                value="nequi" 
                                class="bank-radio"
                                onchange="handleBankSelection(event)"
                            >
                            <label for="nequi" class="bank-label">
                                <span class="bank-icon">📱</span>
                                <span class="bank-text">Nequi</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Datos Bancarios -->
                    <div id="bankData" class="bank-data" style="display: none;">
                        <div class="bank-info">
                            <h4 id="bankTitle">Datos para transferencias</h4>
                            <div class="bank-details">
                                <div class="detail-item">
                                    <span class="detail-label">Banco:</span>
                                    <span id="bankName" class="detail-value">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Número:</span>
                                    <span id="bankNumber" class="detail-value">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Titular:</span>
                                    <span id="bankHolder" class="detail-value">El Rey de los Buñuelos</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Upload de Comprobante -->
                        <div class="receipt-upload">
                            <label for="receiptFile" class="upload-area">
                                <div class="upload-content">
                                    <span class="upload-icon">☁️</span>
                                    <span class="upload-text">Subir comprobante de transferencia</span>
                                    <span class="upload-hint">Arrastra el archivo aquí o haz clic para seleccionar</span>
                                </div>
                                <input 
                                    type="file" 
                                    id="receiptFile" 
                                    name="receiptFile" 
                                    accept="image/*,.pdf"
                                    style="display: none;"
                                    onchange="handleFileUpload(event)"
                                >
                            </label>
                            <div id="uploadPreview" class="upload-preview" style="display: none;"></div>
                        </div>
                    </div>
                </div>
                
                <button type="submit" class="btn-primary">
                    Continuar con el Pedido
                </button>
            </form>
        </div>
    </div>
</div>