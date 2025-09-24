import { useState } from 'react';
import MenuSection, { MenuItem } from '../MenuSection';

// todo: remove mock functionality
const mockMenuItems: MenuItem[] = [
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
  }
];

export default function MenuSectionExample() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleUpdateQuantity = (itemId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  return (
    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-100 min-h-screen">
      <MenuSection
        title="🧄 Buñuelos Tradicionales"
        items={mockMenuItems}
        quantities={quantities}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}