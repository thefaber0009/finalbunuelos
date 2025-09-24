import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Phone, MapPin, CreditCard, ArrowLeft } from "lucide-react";

interface DeliveryFormData {
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

interface DeliveryFormProps {
  onSubmit: (data: DeliveryFormData) => void;
  onBack: () => void;
}

export default function DeliveryForm({ onSubmit, onBack }: DeliveryFormProps) {
  const [formData, setFormData] = useState<DeliveryFormData>({
    fullName: '',
    phone: '',
    receiverName: '',
    receiverPhone: '',
    address: '',
    neighborhood: '',
    references: '',
    paymentMethod: 'transfer'
  });
  
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const handleInputChange = (field: keyof DeliveryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, transferReceipt: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => setReceiptPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            data-testid="button-back"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">
              Información de Domicilio
            </h1>
            <p className="text-amber-800">
              Complete los datos para la entrega a domicilio
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">
                Información de Contacto
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" data-testid="label-full-name">Nombre Completo *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Ingresa tu nombre completo"
                  required
                  data-testid="input-full-name"
                />
              </div>
              <div>
                <Label htmlFor="phone" data-testid="label-phone">Teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Ej: 3001234567"
                  required
                  data-testid="input-phone"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">
                Dirección de Entrega
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address" data-testid="label-address">Dirección Completa *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Calle, carrera, número, apartamento"
                  required
                  data-testid="input-address"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="neighborhood" data-testid="label-neighborhood">Barrio *</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                    placeholder="Nombre del barrio"
                    required
                    data-testid="input-neighborhood"
                  />
                </div>
                <div>
                  <Label htmlFor="receiverPhone" data-testid="label-receiver-phone">Teléfono quien recibe</Label>
                  <Input
                    id="receiverPhone"
                    type="tel"
                    value={formData.receiverPhone}
                    onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                    placeholder="Si es diferente al tuyo"
                    data-testid="input-receiver-phone"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="references" data-testid="label-references">Referencias de Ubicación</Label>
                <Textarea
                  id="references"
                  value={formData.references}
                  onChange={(e) => handleInputChange('references', e.target.value)}
                  placeholder="Puntos de referencia, detalles para encontrar la dirección"
                  className="min-h-20"
                  data-testid="input-references"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">
                Método de Pago
              </h2>
            </div>
            <RadioGroup 
              value={formData.paymentMethod}
              onValueChange={(value) => handleInputChange('paymentMethod', value)}
              data-testid="radio-payment-method"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer">Transferencia Bancaria</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Efectivo contra entrega</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <Label htmlFor="whatsapp">Enviar comprobante por WhatsApp</Label>
              </div>
            </RadioGroup>

            {formData.paymentMethod === 'transfer' && (
              <div className="mt-4 space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-800 mb-2">
                    Datos para transferencia:
                  </p>
                  <div className="text-sm text-amber-700 space-y-1">
                    <p><strong>Banco:</strong> Bancolombia</p>
                    <p><strong>Número:</strong> 123-456789-01</p>
                    <p><strong>Titular:</strong> El Rey de los Buñuelos</p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="receipt" data-testid="label-receipt">Subir Comprobante *</Label>
                  <div className="mt-2">
                    <label htmlFor="receipt" className="cursor-pointer">
                      <div className="border-2 border-dashed border-amber-300 rounded-lg p-6 hover:border-primary transition-colors">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                          <p className="text-sm text-amber-700">
                            {receiptPreview ? 'Cambiar comprobante' : 'Subir comprobante de transferencia'}
                          </p>
                        </div>
                      </div>
                    </label>
                    <input
                      id="receipt"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      data-testid="input-receipt"
                    />
                  </div>
                  
                  {receiptPreview && (
                    <div className="mt-4">
                      <img 
                        src={receiptPreview} 
                        alt="Preview del comprobante"
                        className="max-w-xs rounded-lg border border-amber-200"
                        data-testid="img-receipt-preview"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.paymentMethod === 'whatsapp' && (
              <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  Envía tu comprobante al WhatsApp: <strong>+57 315 015 9193</strong>
                </p>
              </div>
            )}
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" size="lg" data-testid="button-submit-delivery">
              Continuar con el Pedido
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}