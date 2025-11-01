import { Search, Settings } from "lucide-react";

interface InventoryItem {
  id: number;
  model: string;
  ordered: number;
  delivered: number;
  booked: number;
  dispatched: number;
  available: number;
}

interface DashboardProps {
  inventory: InventoryItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAdminClick: () => void;
  onItemClick: (item: InventoryItem) => void;
}

export function EnhancedDashboard({ inventory, searchTerm, onSearchChange, onAdminClick, onItemClick }: DashboardProps) {
  const filteredInventory = inventory.filter(item =>
    item.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary totals
  const totalOrdered = inventory.reduce((sum, item) => sum + item.ordered, 0);
  const totalDelivered = inventory.reduce((sum, item) => sum + item.delivered, 0);
  const totalBooked = inventory.reduce((sum, item) => sum + item.booked, 0);
  const totalDispatched = inventory.reduce((sum, item) => sum + item.dispatched, 0);
  const totalAvailable = inventory.reduce((sum, item) => sum + item.available, 0);

  const summaryCards = [
    { label: "Ordered", value: totalOrdered, color: "#2196F3" },
    { label: "Delivered", value: totalDelivered, color: "#4CAF50" },
    { label: "Booked", value: totalBooked, color: "#FF9800" },
    { label: "Dispatched", value: totalDispatched, color: "#E53935" },
    { label: "Available", value: totalAvailable, color: "#9E9E9E" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white shadow-sm flex flex-col items-center justify-center relative" style={{ height: '150px', padding: '0 60px' }}>
        {/* Admin Button - Top Right */}
        <button
          onClick={onAdminClick}
          className="absolute right-16 top-1/2 -translate-y-1/2 p-3 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Admin Panel"
        >
          <Settings className="text-black" size={32} />
        </button>
        
        <h1 className="text-black mb-2 font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>Inventory Dashboard</h1>
        <p className="text-gray-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
          Digital Munim | Last updated today 8:00 PM
        </p>
      </div>

      {/* Content Area with padding */}
      <div className="flex-1 overflow-auto" style={{ padding: '20px 60px 180px 60px' }}>
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-md mb-5 flex items-center px-6" style={{ height: '100px' }}>
          <Search className="text-gray-400 mr-4" size={24} />
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 outline-none text-black bg-transparent"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>

        {/* Summary Cards - Horizontally Scrollable */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-4 pb-4" style={{ minWidth: 'min-content' }}>
            {summaryCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md flex-shrink-0 p-6"
                style={{
                  width: '320px',
                  height: '140px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="text-gray-500 text-sm">{card.label}</div>
                  <div 
                    className="text-4xl"
                    style={{ color: card.color }}
                  >
                    {card.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Table Cards */}
        <div className="space-y-5">
          {filteredInventory.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <div className="grid grid-cols-6 gap-4">
                <div>
                  <div className="text-gray-500 text-sm mb-2">Model</div>
                  <div className="text-black">{item.model}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-2">Ordered</div>
                  <div className="text-black" style={{ color: '#2196F3' }}>{item.ordered}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-2">Delivered</div>
                  <div className="text-black" style={{ color: '#4CAF50' }}>{item.delivered}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-2">Booked</div>
                  <div className="text-black" style={{ color: '#FF9800' }}>{item.booked}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-2">Dispatched</div>
                  <div className="text-black" style={{ color: '#E53935' }}>{item.dispatched}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-2">Available</div>
                  <div className="text-black" style={{ color: '#9E9E9E' }}>{item.available}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white shadow-sm flex items-center justify-center py-6">
      </div>
    </div>
  );
}