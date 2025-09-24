<?php
require __DIR__ . '/../vendor/autoload.php';


use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;

class ThermalPrinter {
    private $printer;

    public function __construct($printerName = "POS-80C") {
        try {
            // Conexión a impresora compartida en Windows
            $connector = new WindowsPrintConnector($printerName);
            $this->printer = new Printer($connector);
        } catch (Exception $e) {
            throw new Exception("No se pudo conectar con la impresora: " . $e->getMessage());
        }
    }

    public function printOrderTicket($orderData) {
        try {
            $this->printer->setJustification(Printer::JUSTIFY_CENTER);
            $this->printer->setEmphasis(true);
            $this->printer->text("🍩 El Rey de los Buñuelos 🍩\n");
            $this->printer->setEmphasis(false);
            $this->printer->feed();

            $this->printer->setJustification(Printer::JUSTIFY_LEFT);
            $this->printer->text("Orden: " . $orderData['order_code'] . "\n");
            $this->printer->text("Cliente: " . $orderData['customer_name'] . "\n");
            $this->printer->text("Tipo: " . $orderData['order_type'] . "\n");
            $this->printer->text("--------------------------------\n");

            foreach ($orderData['items'] as $item) {
                $this->printer->text($item['quantity'] . " x " . $item['name'] . "\n");
            }

            $this->printer->text("--------------------------------\n");
            $this->printer->setJustification(Printer::JUSTIFY_RIGHT);
            $this->printer->text("TOTAL: $" . number_format($orderData['total'], 0, ',', '.') . "\n");

            $this->printer->feed(3);
            $this->printer->cut();
            $this->printer->close();

            return ["success" => true, "message" => "Ticket impreso correctamente"];
        } catch (Exception $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }

    public function testConnection() {
        try {
            $this->printer->text("Impresora conectada correctamente\n");
            $this->printer->cut();
            $this->printer->close();
            return ["success" => true, "message" => "Test de impresión enviado"];
        } catch (Exception $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }
}
