import AdminDashboard from '../AdminDashboard';

// todo: remove mock functionality
const mockOrders = [
  {
    id: '1',
    orderCode: 'REY001234',
    customerName: 'María González',
    turnNumber: 'T005',
    queueType: 'tradicionales' as const,
    status: 'pending' as const,
    orderType: 'physical' as const,
    items: [
      { name: 'Buñuelo Clásico', quantity: 3, price: 1500 },
      { name: 'Buñuelo con Azúcar', quantity: 2, price: 2000 }
    ],
    total: 8500,
    orderDate: new Date()
  },
  {
    id: '2',
    orderCode: 'REY001235',
    customerName: 'Carlos Rodríguez',
    turnNumber: 'E003',
    queueType: 'especiales' as const,
    status: 'preparing' as const,
    orderType: 'delivery' as const,
    items: [
      { name: 'Buñuelo Hawaiano', quantity: 2, price: 3000 },
      { name: 'Buñuelo de Arequipe', quantity: 1, price: 2000 }
    ],
    total: 8000,
    orderDate: new Date(Date.now() - 30 * 60 * 1000),
    deliveryData: {
      phone: '3001234567',
      address: 'Calle 123 #45-67',
      neighborhood: 'Centro',
      paymentMethod: 'Transferencia',
      transferReceipt: 'receipt_001.jpg'
    }
  },
  {
    id: '3',
    orderCode: 'REY001236',
    customerName: 'Ana Martínez',
    turnNumber: 'M001',
    queueType: 'mixtos' as const,
    status: 'ready' as const,
    orderType: 'delivery' as const,
    items: [
      { name: 'Buñuelo Clásico', quantity: 1, price: 1500 },
      { name: 'Buñuelo Ranchero', quantity: 2, price: 3000 }
    ],
    total: 7500,
    orderDate: new Date(Date.now() - 60 * 60 * 1000),
    deliveryData: {
      phone: '3109876543',
      address: 'Carrera 45 #67-89',
      neighborhood: 'Norte',
      paymentMethod: 'Efectivo'
    }
  }
];

export default function AdminDashboardExample() {
  return (
    <AdminDashboard
      orders={mockOrders}
      onUpdateOrderStatus={(orderId, status) => console.log('Update order status:', orderId, status)}
      onSendWhatsApp={(orderId) => console.log('Send WhatsApp:', orderId)}
      onPrintTicket={(orderId) => console.log('Print ticket:', orderId)}
      onViewReceipt={(receiptUrl) => console.log('View receipt:', receiptUrl)}
    />
  );
}