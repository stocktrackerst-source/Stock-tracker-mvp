import { ArrowLeft, FileText, Package, ShoppingCart, Truck } from "lucide-react";

type RecordType = "orders" | "received" | "booked" | "dispatched";

interface AdminRecordTypeSelectorProps {
  onBack: () => void;
  onSelectType: (type: RecordType) => void;
}

export function AdminRecordTypeSelector({ onBack, onSelectType }: AdminRecordTypeSelectorProps) {
  const recordTypes = [
    { 
      id: "orders" as RecordType, 
      label: "Orders", 
      icon: FileText, 
      color: "#2196F3" 
    },
    { 
      id: "received" as RecordType, 
      label: "Received", 
      icon: Package, 
      color: "#4CAF50" 
    },
    { 
      id: "booked" as RecordType, 
      label: "Booked", 
      icon: ShoppingCart, 
      color: "#FF9800" 
    },
    { 
      id: "dispatched" as RecordType, 
      label: "Dispatched", 
      icon: Truck, 
      color: "#E53935" 
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm flex items-center px-4 py-6 sm:px-8">
        <button onClick={onBack} className="mr-3">
          <ArrowLeft className="text-black" size={24} />
        </button>
        <h1 
          className="text-black font-bold text-xl sm:text-2xl" 
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Select Record Type
        </h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto px-4 py-8 pb-24 sm:px-8">
        <div className="w-full max-w-2xl mx-auto">
          {/* 2-Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            {recordTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => onSelectType(type.id)}
                  className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg active:scale-95"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    minHeight: '160px',
                  }}
                >
                  <div
                    className="rounded-full p-4 mb-3"
                    style={{
                      backgroundColor: `${type.color}15`,
                    }}
                  >
                    <Icon 
                      size={32} 
                      style={{ color: type.color }}
                    />
                  </div>
                  <span 
                    className="text-black font-medium text-base sm:text-lg"
                    style={{ color: type.color }}
                  >
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white shadow-sm flex items-center justify-center py-3">
      </div>
    </div>
  );
}
