import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Truck } from "lucide-react";

interface OrderTypeSelectionProps {
  onSelectType: (type: 'physical' | 'delivery') => void;
}

export default function OrderTypeSelection({ onSelectType }: OrderTypeSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 font-serif">
            🧄 El Rey de los Buñuelos
          </h1>
          <p className="text-lg text-amber-800 font-medium">
            Los mejores buñuelos de la ciudad
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 hover-elevate cursor-pointer bg-white/80 backdrop-blur-sm border-2 border-amber-200 hover:border-primary transition-all duration-300">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Store className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Pedido Físico
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Visita nuestro local y disfruta de buñuelos recién hechos. 
                  Perfecto para llevar o disfrutar en el momento.
                </p>
              </div>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Entrega inmediata</li>
                <li>• Buñuelos recién hechos</li>
                <li>• Sin costo de envío</li>
              </ul>
              <Button 
                onClick={() => onSelectType('physical')}
                className="w-full"
                size="lg"
                data-testid="button-select-physical"
              >
                Seleccionar Pedido Físico
              </Button>
            </div>
          </Card>

          <Card className="p-8 hover-elevate cursor-pointer bg-white/80 backdrop-blur-sm border-2 border-amber-200 hover:border-primary transition-all duration-300">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Truck className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Pedido a Domicilio
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Recibe tus buñuelos favoritos directamente en tu hogar. 
                  Comodidad y sabor a la puerta de tu casa.
                </p>
              </div>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Entrega a domicilio</li>
                <li>• Empaque especial</li>
                <li>• Seguimiento del pedido</li>
              </ul>
              <Button 
                onClick={() => onSelectType('delivery')}
                className="w-full"
                size="lg"
                data-testid="button-select-delivery"
              >
                Seleccionar Domicilio
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}