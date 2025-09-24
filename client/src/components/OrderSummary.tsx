import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, Download } from "lucide-react";
import { MenuItem } from "./MenuSection";

export interface OrderItem {
  item: MenuItem;
  quantity: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  customerName: string;
  orderType: 'physical' | 'delivery';
  deliveryData?: any;
  onEditOrder: () => void;
  onDownloadTicket: () => void;
  onConfirmOrder: () => void;
  turnNumber?: string;
}

export default function OrderSummary({ 
  items, 
  customerName, 
  orderType,
  deliveryData,
  onEditOrder, 
  onDownloadTicket, 
  onConfirmOrder,
  turnNumber 
}: OrderSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotal = () => {
    return items.reduce((total, { item, quantity }) => total + (item.price * quantity), 0);
  };

  const getQueueType = (items: OrderItem[]) => {
    const hasSpecial = items.some(({ item }) => item.category === 'special');
    const hasTraditional = items.some(({ item }) => item.category === 'traditional');
    
    if (hasSpecial && hasTraditional) return 'mixtos';
    if (hasSpecial) return 'especiales';
    return 'tradicionales';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            Resumen del Pedido
          </h1>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {orderType === 'physical' ? 'Pedido Físico' : 'Pedido a Domicilio'}
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">
                Información del Cliente
              </h2>
            </div>
            <div className="space-y-2">
              <p><strong>Nombre:</strong> {customerName}</p>
              {deliveryData && (
                <>
                  <p><strong>Teléfono:</strong> {deliveryData.phone}</p>
                  <p><strong>Dirección:</strong> {deliveryData.address}, {deliveryData.neighborhood}</p>
                  <p><strong>Método de pago:</strong> {deliveryData.paymentMethod === 'transfer' ? 'Transferencia' : deliveryData.paymentMethod === 'cash' ? 'Efectivo' : 'WhatsApp'}</p>
                </>
              )}
            </div>
          </Card>

          {/* Order Items */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Productos Ordenados
            </h2>
            <div className="space-y-3">
              {items.map(({ item, quantity }) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{quantity}x {formatPrice(item.price)}</p>
                    <p className="text-sm text-gray-600">{formatPrice(item.price * quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Queue Info */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">
                Información del Turno
              </h2>
            </div>
            <div className="text-center bg-amber-50 p-4 rounded-lg">
              <p className="text-sm text-amber-800 mb-2">Fila asignada:</p>
              <Badge variant="default" className="text-lg px-4 py-2 mb-2">
                {getQueueType(items).charAt(0).toUpperCase() + getQueueType(items).slice(1)}
              </Badge>
              {turnNumber && (
                <p className="text-2xl font-bold text-primary mt-2">
                  Turno: {turnNumber}
                </p>
              )}
            </div>
          </Card>

          {/* Total */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-2 border-primary">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-primary" data-testid="text-order-total">
                {formatPrice(calculateTotal())}
              </span>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              onClick={onConfirmOrder}
              className="w-full"
              size="lg"
              data-testid="button-confirm-order"
            >
              Confirmar Pedido
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={onEditOrder}
                data-testid="button-edit-order"
              >
                Editar Pedido
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={onDownloadTicket}
                data-testid="button-download-ticket"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Ticket
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}