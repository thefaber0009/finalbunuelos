<!-- Order Type Selection -->
<div id="orderTypeView" class="view">
    <div class="container">
        <div class="admin-link">
            <a href="login.php" class="btn btn-secondary btn-sm">Admin</a>
        </div>
        
        <div class="header-section">
            <div class="crown-icon">👑</div>
            <h1>El Rey de los Buñuelos</h1>
            <p class="subtitle">Los mejores buñuelos de la ciudad</p>
        </div>
        
        <div class="order-type-cards">
            <div class="order-card physical-card" onclick="selectOrderType('physical')">
                <div class="card-icon">
                    <div class="icon-bg physical-bg">
                        <span class="icon-emoji">🏪</span>
                        <span class="icon-badge">4 PM</span>
                    </div>
                </div>
                <h3>Pedido Físico</h3>
                <p class="card-description">Visita nuestro local y disfruta de buñuelos recién hechos</p>
                <ul class="features-list">
                    <li>• Entrega inmediata</li>
                    <li>• Buñuelos recién hechos</li>
                    <li>• Sin costo de envío</li>
                </ul>
                <button class="selection-btn physical-btn">Seleccionar Pedido Físico</button>
            </div>
            
            <div class="order-card delivery-card" onclick="selectOrderType('delivery')">
                <div class="card-icon">
                    <div class="icon-bg delivery-bg">
                        <span class="icon-emoji">🚚</span>
                    </div>
                </div>
                <h3>Pedido a Domicilio</h3>
                <p class="card-description">Recibe tus buñuelos favoritos directamente en tu hogar</p>
                <ul class="features-list">
                    <li>• Entrega a domicilio</li>
                    <li>• Empaque especial</li>
                    <li>• Seguimiento del pedido</li>
                </ul>
                <button class="selection-btn delivery-btn">Seleccionar Domicilio</button>
            </div>
        </div>
    </div>
</div>