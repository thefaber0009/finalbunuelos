import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Filter,
  Download,
  Printer,
  MessageSquare,
  Eye,
  Edit,
  Bell,
  Volume2
} from "lucide-react";

interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  turnNumber: string;
  queueType: 'tradicionales' | 'especiales' | 'mixtos';
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  orderType: 'physical' | 'delivery';
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  orderDate: Date;
  deliveryData?: {
    phone: string;
    address: string;
    neighborhood: string;
    paymentMethod: string;
    transferReceipt?: string;
  };
}

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onSendWhatsApp: (orderId: string) => void;
  onPrintTicket: (orderId: string) => void;
  onViewReceipt: (receiptUrl: string) => void;
}

export default function AdminDashboard({ 
  orders, 
  onUpdateOrderStatus,
  onSendWhatsApp,
  onPrintTicket,
  onViewReceipt
}: AdminDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterQueue, setFilterQueue] = useState<string>('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const filteredOrders = orders.filter(order => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    if (filterType !== 'all' && order.orderType !== filterType) return false;
    if (filterQueue !== 'all' && order.queueType !== filterQueue) return false;
    return true;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Listo';
      case 'delivered': return 'Entregado';
      default: return 'Desconocido';
    }
  };

  const getStats = () => {
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      totalRevenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
    };
  };

  const stats = getStats();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard - El Rey de los Buñuelos
              </h1>
              <p className="text-gray-600">Panel administrativo de pedidos</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant={notificationsEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                data-testid="button-toggle-notifications"
              >
                {notificationsEnabled ? <Bell className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {notificationsEnabled ? 'Notificaciones ON' : 'Notificaciones OFF'}
              </Button>
              <Button variant="outline" size="sm" data-testid="button-refresh">
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="stat-pending">
                  {stats.pending}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">En Preparación</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="stat-preparing">
                  {stats.preparing}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Listos</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="stat-ready">
                  {stats.ready}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ventas</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="stat-revenue">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40" data-testid="select-filter-status">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="preparing">Preparando</SelectItem>
                <SelectItem value="ready">Listos</SelectItem>
                <SelectItem value="delivered">Entregados</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40" data-testid="select-filter-type">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Tipos</SelectItem>
                <SelectItem value="physical">Físico</SelectItem>
                <SelectItem value="delivery">Domicilio</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterQueue} onValueChange={setFilterQueue}>
              <SelectTrigger className="w-40" data-testid="select-filter-queue">
                <SelectValue placeholder="Fila" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Filas</SelectItem>
                <SelectItem value="tradicionales">Tradicionales</SelectItem>
                <SelectItem value="especiales">Especiales</SelectItem>
                <SelectItem value="mixtos">Mixtos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Orders Grid */}
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        #{order.orderCode}
                      </h3>
                      <p className="text-gray-600">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(order.status)} mb-2`}>
                        {getStatusLabel(order.status)}
                      </Badge>
                      <p className="text-sm text-gray-500">
                        {order.turnNumber} - {order.queueType}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <Badge variant={order.orderType === 'delivery' ? 'default' : 'secondary'}>
                      {order.orderType === 'delivery' ? 'Domicilio' : 'Físico'}
                    </Badge>
                    <span className="text-gray-600">
                      {order.orderDate.toLocaleString('es-CO')}
                    </span>
                    <span className="font-semibold text-primary">
                      {formatPrice(order.total)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                  </div>

                  {order.deliveryData && (
                    <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                      <p><strong>Teléfono:</strong> {order.deliveryData.phone}</p>
                      <p><strong>Dirección:</strong> {order.deliveryData.address}, {order.deliveryData.neighborhood}</p>
                      <p><strong>Pago:</strong> {order.deliveryData.paymentMethod}</p>
                    </div>
                  )}
                </div>

                <div className="lg:w-64 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPrintTicket(order.id)}
                      data-testid={`button-print-${order.id}`}
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                    {order.deliveryData && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSendWhatsApp(order.id)}
                        data-testid={`button-whatsapp-${order.id}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {order.deliveryData?.transferReceipt && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => onViewReceipt(order.deliveryData!.transferReceipt!)}
                      data-testid={`button-view-receipt-${order.id}`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Comprobante
                    </Button>
                  )}

                  <div className="space-y-2">
                    {order.status === 'pending' && (
                      <Button
                        className="w-full"
                        onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                        data-testid={`button-start-preparing-${order.id}`}
                      >
                        Comenzar Preparación
                      </Button>
                    )}
                    
                    {order.status === 'preparing' && (
                      <Button
                        className="w-full"
                        onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                        data-testid={`button-mark-ready-${order.id}`}
                      >
                        Marcar Listo
                      </Button>
                    )}
                    
                    {order.status === 'ready' && (
                      <Button
                        className="w-full"
                        onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                        data-testid={`button-mark-delivered-${order.id}`}
                      >
                        Marcar Entregado
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay pedidos
            </h3>
            <p className="text-gray-600">
              Los nuevos pedidos aparecerán aquí automáticamente
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}