<!-- Order Summary -->
<div id="summaryView" class="view" style="display: none;">
    <div class="summary-container">
        <div class="summary-header">
            <h1 class="summary-title">Resumen Final</h1>
        </div>

        <div class="summary-content">
            <div id="finalSummary">
                <!-- Content will be dynamically generated -->
            </div>
        </div>

        <div class="action-buttons">
            <button class="btn btn-secondary" onclick="downloadTicket()" id="downloadBtn">
                <span class="btn-icon">📥</span>
                <span>Descargar Ticket</span>
            </button>
            <button class="btn btn-primary" onclick="confirmOrder()" id="confirmBtn">
                <span class="btn-icon">✅</span>
                <span>Confirmar Pedido</span>
            </button>
        </div>
    </div>
</div>