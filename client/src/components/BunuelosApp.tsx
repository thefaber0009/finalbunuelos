import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import OrderTypeSelection from './OrderTypeSelection';
import MenuSection, { MenuItem } from './MenuSection';
import DeliveryForm from './DeliveryForm';
import OrderSummary, { OrderItem } from './OrderSummary';
import AdminDashboard from './AdminDashboard';
import bunuelosTradicionales from '@assets/generated_images/Traditional_Colombian_buñuelos_photo_c45e5679.png';
import bunuelosEspeciales from '@assets/generated_images/Special_filled_buñuelos_varieties_d649fd40.png';

type OrderType = 'physical' | 'delivery';
type AppView = 'orderType' | 'customerInfo' | 'menu' | 'deliveryForm' | 'orderSummary' | 'admin';

interface DeliveryData {
  fullName: string;
  phone: string;
  receiverName: string;
  receiverPhone: string;
  address: string;
  neighborhood: string;
  references: string;
  paymentMethod: 'transfer' | 'cash' | 'whatsapp';
  transferReceipt?: File;
}

// todo: remove mock functionality
const menuItems: MenuItem[] = [
  {
    id: 'bunuelo-clasico',
    name: 'Buñuelo Clásico',
    description: 'Buñuelo tradicional con miel, receta original de la abuela',
    price: 1500,
    category: 'traditional'
  },
  {
    id: 'bunuelo-azucar',
    name: 'Buñuelo con Azúcar',
    description: 'Buñuelo espolvoreado con azúcar refinada',
    price: 2000,
    category: 'traditional'
  },
  {
    id: 'bunuelo-queso',
    name: 'Buñuelo de Queso Mozarella',
    description: 'Buñuelo relleno de queso mozarella derretido',
    price: 2500,
    category: 'traditional'
  },
  {
    id: 'bunuelo-hawaiano',
    name: 'Buñuelo Hawaiano',
    description: 'Buñuelo relleno de piña y queso, una combinación tropical',
    price: 3000,
    category: 'special'
  },
  {
    id: 'bunuelo-ranchero',
    name: 'Buñuelo Ranchero',
    description: 'Buñuelo relleno de salchicha y queso, sabor tradicional',
    price: 3000,
    category: 'special'
  },
  {
    id: 'bunuelo-mermelada',
    name: 'Buñuelo de Mermelada',
    description: 'Buñuelo relleno de mermelada de frutas',
    price: 2000,
    category: 'special'
  },
  {
    id: 'bunuelo-bocadillo',
    name: 'Buñuelo de Bocadillo',
    description: 'Buñuelo relleno de bocadillo de guayaba',
    price: 2000,
    category: 'special'
  },
  {
    id: 'bunuelo-arequipe',
    name: 'Buñuelo de Arequipe',
    description: 'Buñuelo relleno de arequipe casero',
    price: 2000,
    category: 'special'
  }
];

export default function BunuelosApp() {
  const [currentView, setCurrentView] = useState<AppView>('orderType');
  const [orderType, setOrderType] = useState<OrderType>('physical');
  const [customerName, setCustomerName] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [deliveryData, setDeliveryData] = useState<DeliveryData | undefined>();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSelectOrderType = (type: OrderType) => {
    setOrderType(type);
    setCurrentView('customerInfo');
  };

  const handleCustomerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    setCurrentView('menu');
  };

  const handleUpdateQuantity = (itemId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const handleContinueToDelivery = () => {
    if (orderType === 'delivery') {
      setCurrentView('deliveryForm');
    } else {
      setCurrentView('orderSummary');
    }
  };

  const handleDeliverySubmit = (data: DeliveryData) => {
    setDeliveryData(data);
    setCurrentView('orderSummary');
  };

  const handleBack = () => {
    if (currentView === 'customerInfo') {
      setCurrentView('orderType');
    } else if (currentView === 'menu') {
      setCurrentView('customerInfo');
    } else if (currentView === 'deliveryForm') {
      setCurrentView('menu');
    } else if (currentView === 'orderSummary') {
      if (orderType === 'delivery') {
        setCurrentView('deliveryForm');
      } else {
        setCurrentView('menu');
      }
    }
  };

  const getOrderItems = (): OrderItem[] => {
    return menuItems
      .filter(item => quantities[item.id] > 0)
      .map(item => ({
        item,
        quantity: quantities[item.id]
      }));
  };

  const hasSelectedItems = () => {
    return Object.values(quantities).some(qty => qty > 0);
  };

  const traditionalItems = menuItems.filter(item => item.category === 'traditional');
  const specialItems = menuItems.filter(item => item.category === 'special');

  // Admin access - simple password check (todo: implement proper auth)
  const handleAdminAccess = () => {
    const password = prompt('Ingrese la contraseña de administrador:');
    if (password === 'admin123') {
      setCurrentView('admin');
    }
  };

  if (currentView === 'admin') {
    return (
      <AdminDashboard
        orders={[]} // todo: connect to real data
        onUpdateOrderStatus={(orderId, status) => console.log('Update order:', orderId, status)}
        onSendWhatsApp={(orderId) => console.log('Send WhatsApp:', orderId)}
        onPrintTicket={(orderId) => console.log('Print ticket:', orderId)}
        onViewReceipt={(receiptUrl) => console.log('View receipt:', receiptUrl)}
      />
    );
  }

  if (currentView === 'orderType') {
    return (
      <div>
        <div className="fixed top-4 right-4 z-10 flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleDarkMode}
            data-testid="button-toggle-theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleAdminAccess}
            data-testid="button-admin-access"
          >
            Admin
          </Button>
        </div>
        <OrderTypeSelection onSelectType={handleSelectOrderType} />
      </div>
    );
  }

  if (currentView === 'customerInfo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <div className="max-w-md mx-auto">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            className="mb-4"
            data-testid="button-back-to-order-type"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cambiar tipo de pedido
          </Button>
          
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-amber-900 mb-2">
                Información del Cliente
              </h1>
              <p className="text-amber-800">
                {orderType === 'physical' ? 'Pedido en local' : 'Pedido a domicilio'}
              </p>
            </div>
            
            <form onSubmit={handleCustomerInfoSubmit} className="space-y-4">
              <div>
                <Label htmlFor="customerName" data-testid="label-customer-name">
                  Nombre completo *
                </Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ingresa tu nombre completo"
                  required
                  data-testid="input-customer-name"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                data-testid="button-continue-to-menu"
              >
                Continuar al Menú
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={handleBack}
              data-testid="button-back-to-customer-info"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Atrás
            </Button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-amber-900">
                Hola {customerName}!
              </h1>
              <p className="text-amber-800">Elige tus buñuelos favoritos</p>
            </div>
            
            <div></div> {/* Spacer for centering */}
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative">
                <img 
                  src={bunuelosTradicionales} 
                  alt="Buñuelos Tradicionales"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <MenuSection
                  title="🧄 Buñuelos Tradicionales"
                  items={traditionalItems}
                  quantities={quantities}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              </div>
              
              <div className="relative">
                <img 
                  src={bunuelosEspeciales} 
                  alt="Buñuelos Especiales"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <MenuSection
                  title="⭐ Buñuelos Especiales"
                  items={specialItems}
                  quantities={quantities}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="sticky top-4 p-6 bg-white/90 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Resumen del Pedido
                </h3>
                
                {hasSelectedItems() ? (
                  <div className="space-y-3">
                    {getOrderItems().map(({ item, quantity }) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{quantity}x {item.name}</span>
                        <span className="font-medium">
                          {(item.price * quantity).toLocaleString('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          })}
                        </span>
                      </div>
                    ))}
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span className="text-primary" data-testid="text-menu-total">
                          {getOrderItems()
                            .reduce((total, { item, quantity }) => total + (item.price * quantity), 0)
                            .toLocaleString('es-CO', {
                              style: 'currency',
                              currency: 'COP',
                              minimumFractionDigits: 0
                            })}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleContinueToDelivery}
                      className="w-full mt-4"
                      size="lg"
                      data-testid="button-continue-to-delivery"
                    >
                      {orderType === 'delivery' ? 'Continuar con Entrega' : 'Ver Resumen'}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>Selecciona algunos buñuelos para continuar</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'deliveryForm') {
    return (
      <DeliveryForm
        onSubmit={handleDeliverySubmit}
        onBack={handleBack}
      />
    );
  }

  if (currentView === 'orderSummary') {
    return (
      <OrderSummary
        items={getOrderItems()}
        customerName={customerName}
        orderType={orderType}
        deliveryData={deliveryData}
        turnNumber="T001" // todo: generate real turn number
        onEditOrder={handleBack}
        onDownloadTicket={() => console.log('Download ticket')}
        onConfirmOrder={() => {
          console.log('Order confirmed!');
          // todo: send to database
          alert('¡Pedido confirmado! Tu turno es T001');
          // Reset and go back to start
          setCurrentView('orderType');
          setCustomerName('');
          setQuantities({});
          setDeliveryData(undefined);
        }}
      />
    );
  }

  return null;
}