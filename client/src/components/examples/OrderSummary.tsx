import OrderSummary, { OrderItem } from '../OrderSummary';
import { MenuItem } from '../MenuSection';

// todo: remove mock functionality
const mockMenuItems: MenuItem[] = [
  {
    id: 'bunuelo-clasico',
    name: 'Buñuelo Clásico',
    description: 'Buñuelo tradicional con miel',
    price: 1500,
    category: 'traditional'
  },
  {
    id: 'bunuelo-hawaiano',
    name: 'Buñuelo Hawaiano',
    description: 'Buñuelo relleno de piña y queso',
    price: 3000,
    category: 'special'
  }
];

const mockOrderItems: OrderItem[] = [
  { item: mockMenuItems[0], quantity: 2 },
  { item: mockMenuItems[1], quantity: 1 }
];

const mockDeliveryData = {
  phone: '3001234567',
  address: 'Calle 123 #45-67',
  neighborhood: 'Centro',
  paymentMethod: 'transfer'
};

export default function OrderSummaryExample() {
  return (
    <OrderSummary
      items={mockOrderItems}
      customerName="Juan Pérez"
      orderType="delivery"
      deliveryData={mockDeliveryData}
      turnNumber="E001"
      onEditOrder={() => console.log('Edit order clicked')}
      onDownloadTicket={() => console.log('Download ticket clicked')}
      onConfirmOrder={() => console.log('Confirm order clicked')}
    />
  );
}