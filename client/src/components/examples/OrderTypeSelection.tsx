import OrderTypeSelection from '../OrderTypeSelection';

export default function OrderTypeSelectionExample() {
  return (
    <OrderTypeSelection 
      onSelectType={(type) => console.log('Selected order type:', type)} 
    />
  );
}