import { X } from "lucide-react";

interface InventoryItem {
  id: number;
  model: string;
  ordered: number;
  delivered: number;
  booked: number;
  dispatched: number;
  available: number;
}

interface ItemDetailsPopupProps {
  item: InventoryItem;
  onClose: () => void;
}

export function ItemDetailsPopup({ item, onClose }: ItemDetailsPopupProps) {
  const details = [
    { label: "Model", value: item.model, color: "#000000" },
    { label: "Ordered", value: item.ordered, color: "#2196F3" },
    { label: "Delivered", value: item.delivered, color: "#4CAF50" },
    { label: "Booked", value: item.booked, color: "#FF9800" },
    { label: "Dispatched", value: item.dispatched, color: "#E53935" },
    { label: "Available", value: item.available, color: "#9E9E9E" },
  ];

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl relative w-full max-w-lg"
        style={{
          padding: '24px',
          fontFamily: 'Inter, Poppins, Roboto, sans-serif',
          maxHeight: '90vh',
          overflowY: 'auto',
          transition: 'all 300ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (32×32 tap target) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-all active:scale-95"
          style={{
            width: '32px',
            height: '32px',
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 300ms ease-out',
          }}
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 
          className="text-black mb-6"
          style={{
            fontSize: '24px',
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
          Item Details
        </h2>

        {/* Details Grid */}
        <div className="space-y-3">
          {details.map((detail, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center"
              style={{
                transition: 'all 300ms ease-out',
              }}
            >
              <div 
                className="text-gray-600"
                style={{ fontSize: '14px', fontWeight: '500' }}
              >
                {detail.label}
              </div>
              <div 
                style={{ 
                  color: detail.color,
                  fontSize: '20px',
                  fontWeight: '700',
                }}
              >
                {detail.value}
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 text-white rounded-2xl shadow-lg active:scale-98 transition-all"
          style={{
            backgroundColor: '#4CAF50',
            height: '48px',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: 'Inter, Poppins, Roboto, sans-serif',
            minHeight: '44px',
            transition: 'all 300ms ease-out',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
