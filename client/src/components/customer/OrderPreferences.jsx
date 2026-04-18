import { Truck, ShoppingBag, Table2, Clock } from 'lucide-react';
import { getOrderPreferences, clearOrderPreferences } from '../../utils/orderPreferences';
import { useNavigate } from 'react-router-dom';

export default function OrderPreferences() {
  const navigate = useNavigate();
  const preferences = getOrderPreferences();
  
  if (!preferences) return null;
  
  const getIcon = (method) => {
    switch(method) {
      case 'delivery': return <Truck size={16} />;
      case 'takeaway': return <ShoppingBag size={16} />;
      case 'dine-in': return <Table2 size={16} />;
      case 'pre-order': return <Clock size={16} />;
      default: return null;
    }
  };
  
  const getLabel = (method) => {
    switch(method) {
      case 'delivery': return 'Delivery';
      case 'takeaway': return 'Takeaway';
      case 'dine-in': return 'Dine-In';
      case 'pre-order': return 'Pre-Order';
      default: return method;
    }
  };
  
  const handleChangeOrder = () => {
    clearOrderPreferences();
    navigate('/dashboard');
  };
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-amber-600">{getIcon(preferences.deliveryMethod)}</span>
          <span className="text-sm font-medium text-amber-800">
            Order Type: {getLabel(preferences.deliveryMethod)}
          </span>
          {preferences.scheduledDateTime && (
            <span className="text-xs text-amber-600">
              • Scheduled for {new Date(preferences.scheduledDateTime).toLocaleString()}
            </span>
          )}
          {preferences.tableNumber && (
            <span className="text-xs text-amber-600">
              • Table {preferences.tableNumber} • {preferences.guestCount} Guests
            </span>
          )}
        </div>
        <button
          onClick={handleChangeOrder}
          className="text-xs text-amber-600 hover:underline"
        >
          Change Order Type
        </button>
      </div>
    </div>
  );
}