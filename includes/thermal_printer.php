<?php
// ===== ACTUALIZADO: includes/thermal_printer.php =====

/**
 * Clase ThermalPrinter para impresora JALPOS80U (POS-80C en Windows)
 * Conexión: copy /b hacia \\localhost\POS-80C
 * Compatible con WAMP/XAMPP
 */

class ThermalPrinter {
    private $printerName = "POS-80C"; // Nombre compartido en Windows
    private $lineWidth   = 42;        // Ancho real de caracteres para 80mm
    
    public function __construct($printerName = "POS-80C") {
        $this->printerName = $printerName;
    }

    /** ========================
     *   IMPRIMIR PEDIDO COMPLETO
     *  ======================== */
    public function printOrderTicket($orderData) {
        $esc = "\x1B";
        $ticket = '';

        // Inicialización
        $ticket .= $esc . "@"; 
        $ticket .= $esc . "t" . chr(0); // Codificación CP437

        // ENCABEZADO
        $ticket .= $esc . "a" . chr(1); // Centrado
        $ticket .= $esc . "!" . chr(0x18); // Texto grande y negrita
        $ticket .= "EL REY DE LOS BUNUELOS\n";
        $ticket .= $esc . "!" . chr(0x08); // Solo negrita
        $ticket .= "TICKET DE PEDIDO\n";
        $ticket .= $esc . "!" . chr(0x00); // Normal
        $ticket .= str_repeat("=", $this->lineWidth) . "\n\n";

        // DATOS DEL PEDIDO
        $ticket .= $esc . "a" . chr(0); // Alineación izquierda
        $ticket .= $esc . "!" . chr(0x08); // Negrita
        $ticket .= "CODIGO: " . $orderData['order_code'] . "\n";
        $ticket .= $esc . "!" . chr(0x00); // Normal
        
        $ticket .= "Cliente: " . $orderData['customer_name'] . "\n";
        $ticket .= "Turno: #" . $this->getTurnNumber($orderData['order_code']) . "\n";
        $ticket .= "Tipo: " . $this->getOrderTypeLabel($orderData['order_type']) . "\n";
        $ticket .= "Cola: " . ucfirst($orderData['queue_type']) . "\n";
        $ticket .= "Fecha: " . date('d/m/Y H:i:s') . "\n";
        
        // INFORMACIÓN DE ENTREGA SI ES DOMICILIO
        if ($orderData['order_type'] === 'delivery' && $orderData['delivery']) {
            $delivery = $orderData['delivery'];
            
            $ticket .= "\n--- DATOS DE ENTREGA ---\n";
            
            // NOMBRE DE QUIEN RECIBE (PRIMERO)
            if (!empty($delivery['receiver_name'])) {
                $ticket .= "Recibe: " . $delivery['receiver_name'] . "\n";
            }
            
            // Teléfono principal
            if (!empty($delivery['phone'])) {
                $ticket .= "Telefono: " . $delivery['phone'] . "\n";
            }
            
            // Teléfono de quien recibe (si es diferente)
            if (!empty($delivery['receiver_phone']) && $delivery['receiver_phone'] !== $delivery['phone']) {
                $ticket .= "Tel. Recibe: " . $delivery['receiver_phone'] . "\n";
            }
            
            // Dirección
            if (!empty($delivery['address'])) {
                $ticket .= "Direccion: " . $delivery['address'] . "\n";
            }
            
            // Barrio
            if (!empty($delivery['neighborhood'])) {
                $ticket .= "Barrio: " . $delivery['neighborhood'] . "\n";
            }
            
            // Referencias
            if (!empty($delivery['delivery_references'])) {
                $ticket .= "Referencias: " . $delivery['delivery_references'] . "\n";
            }
            
            // MÉTODO DE PAGO
            if (!empty($delivery['payment_method'])) {
                $paymentLabels = [
                    'cash' => 'Efectivo',
                    'transfer' => 'Transferencia',
                    'whatsapp' => 'WhatsApp Pay'
                ];
                $paymentText = $paymentLabels[$delivery['payment_method']] ?? ucfirst($delivery['payment_method']);
                $ticket .= "Pago: " . $paymentText . "\n";
                
                // Estado de pago justo después del método de pago
                $paymentStatus = $orderData['payment_status'] ?? 'pending';
                $paymentStatusText = $this->getPaymentStatusLabel($paymentStatus);
                $ticket .= "Estado Pago: " . strtoupper($paymentStatusText) . "\n";
            }
        }
        
        $ticket .= str_repeat("-", $this->lineWidth) . "\n\n";

        // PRODUCTOS ORDENADOS
        $ticket .= $esc . "!" . chr(0x08); // Negrita
        $ticket .= "PRODUCTOS PEDIDOS:\n\n";
        $ticket .= $esc . "!" . chr(0x00); // Normal
        
        $total = 0;
        foreach ($orderData['items'] as $item) {
            $qty = $item['quantity'];
            $name = $item['name'];
            $unitPrice = $item['unit_price'];
            $subtotal = $item['subtotal'];
            $total += $subtotal;

            // Línea principal del producto
            $productLine = $qty . "x " . $name;
            $priceStr = "$" . number_format($subtotal, 0, ',', '.');
            
            $spaces = $this->lineWidth - strlen($productLine) - strlen($priceStr);
            $spaces = max(1, $spaces);

            $ticket .= $productLine . str_repeat(".", $spaces) . $priceStr . "\n";
            
            // Mostrar precio unitario si hay más de uno
            if ($qty > 1) {
                $unitStr = "  (c/u $" . number_format($unitPrice, 0, ',', '.') . ")";
                $ticket .= $unitStr . "\n";
            }
        }
        
        $ticket .= "\n" . str_repeat("=", $this->lineWidth) . "\n";

        // TOTAL
        $ticket .= $esc . "a" . chr(1); // Centrado
        $ticket .= $esc . "!" . chr(0x38); // Texto extra grande
        $ticket .= "TOTAL: $" . number_format($total, 0, ',', '.') . "\n";
        $ticket .= $esc . "!" . chr(0x00); // Normal
        $ticket .= $esc . "a" . chr(0); // Izquierda
        
        // MENSAJE FINAL
        $ticket .= "\n" . str_repeat("=", $this->lineWidth) . "\n";
        $ticket .= $esc . "a" . chr(1); // Centrado
        $ticket .= "Gracias por elegir\n";
        $ticket .= "El Rey de los Bunuelos!\n";      
        $ticket .= "Direccion Cll 15 Kra 34a\n";
        $ticket .= "Tel y Nequi: 304 330 7274\n\n";
        $ticket .= "Espera tu turno para recoger\n";
        $ticket .= "tu pedido\n";
        $ticket .= "Conserva este ticket como\n";
        $ticket .= "comprobante de compra\n";
        
        // ESTADO DEL PEDIDO - sin estado de pago aquí
        $ticket .= "\n" . str_repeat("-", $this->lineWidth) . "\n";
        $ticket .= $esc . "!" . chr(0x08); // Negrita
        $ticket .= "ESTADO: " . strtoupper($this->getStatusLabel($orderData['status'])) . "\n";
        $ticket .= $esc . "!" . chr(0x00); // Normal

        // Espacios antes del corte
        $ticket .= "\n\n\n\n\n";
        $ticket .= $esc . "i"; // Comando de corte

        return $this->sendToPrinter($ticket);
    }

    /** ========================
     *   REPORTE DIARIO DETALLADO
     *  ======================== */
    public function printDailySalesReport($stats, $date) {
        $esc = "\x1B";
        $ticket = '';

        $ticket .= $esc . "@"; // Inicializar
        
        // ENCABEZADO
        $ticket .= $esc . "a" . chr(1); // Centrado
        $ticket .= $esc . "!" . chr(0x18); // Grande y negrita
        $ticket .= "REPORTE DE VENTAS\n";
        $ticket .= $esc . "!" . chr(0x08); // Solo negrita
        $ticket .= "EL REY DE LOS BUNUELOS\n";
        $ticket .= $esc . "!" . chr(0x00); // Normal
        $ticket .= "Fecha: " . date('d/m/Y', strtotime($date)) . "\n";
        $ticket .= "Generado: " . date('d/m/Y H:i:s') . "\n\n";

        $ticket .= str_repeat("=", $this->lineWidth) . "\n";
        
        // RESUMEN DE PEDIDOS
        $ticket .= $esc . "a" . chr(0); // Izquierda
        $ticket .= $esc . "!" . chr(0x08); // Negrita
        $ticket .= "RESUMEN DEL DIA:\n";
        $ticket .= $esc . "!" . chr(0x00); // Normal
        $ticket .= str_repeat("-", $this->lineWidth) . "\n";

        $ticket .= sprintf("%-25s %15s\n", "Total Pedidos:", $stats['total_orders']);
        $ticket .= sprintf("%-25s %15s\n", "Pendientes:", $stats['pending_orders']);
        $ticket .= sprintf("%-25s %15s\n", "En Preparacion:", $stats['preparing_orders']);
        $ticket .= sprintf("%-25s %15s\n", "Listos:", $stats['ready_orders']);
        $ticket .= sprintf("%-25s %15s\n", "Entregados:", $stats['delivered_orders']);
        
        $ticket .= str_repeat("-", $this->lineWidth) . "\n";

        // INGRESOS
        $ticket .= $esc . "a" . chr(1); // Centrado
        $ticket .= $esc . "!" . chr(0x18); // Grande
        $ticket .= "INGRESOS TOTALES:\n";
        $ticket .= $esc . "!" . chr(0x38); // Extra grande
        $ticket .= "$" . number_format($stats['today_revenue'], 0, ',', '.') . " COP\n";
        $ticket .= $esc . "!" . chr(0x00); // Normal
        
        // PROMEDIO POR PEDIDO
        $averageOrder = $stats['total_orders'] > 0 ? $stats['today_revenue'] / $stats['total_orders'] : 0;
        $ticket .= $esc . "a" . chr(0); // Izquierda
        $ticket .= "\n" . str_repeat("=", $this->lineWidth) . "\n";
        $ticket .= sprintf("%-25s %15s\n", "Pedido Promedio:", "$" . number_format($averageOrder, 0, ',', '.'));
        
        // EFICIENCIA
        $efficiency = $stats['total_orders'] > 0 ? ($stats['delivered_orders'] / $stats['total_orders']) * 100 : 0;
        $ticket .= sprintf("%-25s %14.1f%%\n", "Eficiencia:", $efficiency);
        
        $ticket .= str_repeat("=", $this->lineWidth) . "\n";
        
        // PIE DE PÁGINA
        $ticket .= $esc . "a" . chr(1); // Centrado
        $ticket .= "\nReporte generado por el sistema\n";
        $ticket .= "El Rey de los Bunuelos\n";
        $ticket .= "Administrador: Admin\n";

        // Espacios y corte
        $ticket .= "\n\n\n";
        $ticket .= $esc . "i"; // Corte

        return $this->sendToPrinter($ticket);
    }

    /** ========================
     *   PRUEBA DE CONEXIÓN
     *  ======================== */
    public function testConnection() {
        $esc = "\x1B";
        $ticket = '';
        
        $ticket .= $esc . "@"; // Inicializar
        
        $ticket .= $esc . "a" . chr(1); // Centrado
        $ticket .= $esc . "!" . chr(0x18); // Grande
        $ticket .= "PRUEBA DE IMPRESORA\n";
        $ticket .= $esc . "!" . chr(0x00); // Normal
        
        $ticket .= str_repeat("=", $this->lineWidth) . "\n";
        $ticket .= $esc . "a" . chr(0); // Izquierda
        
        $ticket .= "Impresora: " . $this->printerName . "\n";
        $ticket .= "Fecha: " . date('d/m/Y H:i:s') . "\n";
        $ticket .= "Ancho de linea: " . $this->lineWidth . " caracteres\n";
        
        $ticket .= str_repeat("-", $this->lineWidth) . "\n";
        $ticket .= "Prueba de caracteres:\n";
        $ticket .= "1234567890123456789012345678901234567890123\n";
        $ticket .= "ABCDEFGHIJKLMNOPQRSTUVWXYZ\n";
        $ticket .= "abcdefghijklmnopqrstuvwxyz\n";
        $ticket .= "ñÑáéíóúüÁÉÍÓÚÜ\n";
        $ticket .= "¡¿#$%&*+-=<>[]{}()@\n";
        
        $ticket .= str_repeat("-", $this->lineWidth) . "\n";
        $ticket .= $esc . "a" . chr(0); // Izquierda
        $ticket .= "Texto alineado a la izquierda\n";
        
        $ticket .= $esc . "a" . chr(1); // Centrado
        $ticket .= "Texto centrado\n";
        
        $ticket .= $esc . "a" . chr(2); // Derecha
        $ticket .= "Texto a la derecha\n";
        
        $ticket .= $esc . "a" . chr(0); // Volver a izquierda
        $ticket .= str_repeat("=", $this->lineWidth) . "\n";
        
        $ticket .= $esc . "a" . chr(1); // Centrado
        $ticket .= $esc . "!" . chr(0x08); // Negrita
        $ticket .= "PRUEBA COMPLETADA\n";
        $ticket .= $esc . "!" . chr(0x00); // Normal
        
        $ticket .= "\n\n\n" . $esc . "i"; // Corte

        return $this->sendToPrinter($ticket);
    }

    /** ========================
     *   FUNCIONES AUXILIARES
     *  ======================== */
    
    private function getTurnNumber($orderCode) {
        // Extraer los últimos 2-3 dígitos del código como número de turno
        return substr($orderCode, -3);
    }
    
    private function getOrderTypeLabel($orderType) {
        $labels = [
            'physical' => 'En Local',
            'delivery' => 'Domicilio'
        ];
        return $labels[$orderType] ?? $orderType;
    }
    
    private function getStatusLabel($status) {
        $labels = [
            'pending' => 'Pendiente',
            'preparing' => 'En Preparacion',
            'ready' => 'Listo',
            'delivered' => 'Entregado'
        ];
        return $labels[$status] ?? $status;
    }

    // NUEVA FUNCIÓN: Etiquetas de estado de pago
    private function getPaymentStatusLabel($paymentStatus) {
        $labels = [
            'pending' => 'Pendiente',
            'paid' => 'Pagado',
            'failed' => 'Fallo'
        ];
        return $labels[$paymentStatus] ?? $paymentStatus;
    }

    /** ========================
     *   ENVÍO A IMPRESORA
     *  ======================== */
    private function sendToPrinter($data) {
        try {
            // Crear archivo temporal
            $tmpFile = tempnam(sys_get_temp_dir(), 'bunuelos_ticket_');
            
            if (file_put_contents($tmpFile, $data) === false) {
                throw new Exception("No se pudo crear archivo temporal");
            }

            // Comando para enviar a impresora en Windows
            $cmd = sprintf('copy /b "%s" "\\\\localhost\\%s" 2>nul', $tmpFile, $this->printerName);
            
            // Ejecutar comando
            exec($cmd, $output, $returnCode);
            
            // Limpiar archivo temporal
            if (file_exists($tmpFile)) {
                unlink($tmpFile);
            }

            if ($returnCode === 0) {
                return [
                    'success' => true, 
                    'message' => 'Ticket enviado correctamente a ' . $this->printerName
                ];
            } else {
                return [
                    'success' => false, 
                    'error' => 'Error al enviar a impresora ' . $this->printerName . '. Código: ' . $returnCode
                ];
            }
            
        } catch (Exception $e) {
            return [
                'success' => false, 
                'error' => 'Error en el sistema de impresión: ' . $e->getMessage()
            ];
        }
    }
}
?>