import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'traditional' | 'special';
  image?: string;
}

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  quantities: Record<string, number>;
  onUpdateQuantity: (itemId: string, change: number) => void;
}

export default function MenuSection({ title, items, quantities, onUpdateQuantity }: MenuSectionProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm border border-amber-200">
      <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
        {title}
      </h3>
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4 border border-amber-100">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-base">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
                <div className="text-lg font-bold text-primary">
                  {formatPrice(item.price)}
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  disabled={!quantities[item.id] || quantities[item.id] <= 0}
                  data-testid={`button-decrease-${item.id}`}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <div className="min-w-12 text-center">
                  <span className="text-lg font-semibold text-gray-900 bg-amber-50 px-3 py-1 rounded-md">
                    {quantities[item.id] || 0}
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  data-testid={`button-increase-${item.id}`}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}