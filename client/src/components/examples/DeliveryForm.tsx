import DeliveryForm from '../DeliveryForm';

export default function DeliveryFormExample() {
  return (
    <DeliveryForm
      onSubmit={(data) => console.log('Delivery form submitted:', data)}
      onBack={() => console.log('Back button clicked')}
    />
  );
}