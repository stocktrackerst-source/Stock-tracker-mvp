import { useState } from "react";
import { Search, Settings, User } from "lucide-react";

interface InventoryItem {
  id: number;
  model: string;
  category: string;
  opening: number;
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
  onLogout: () => void;
}

export function ResponsiveDashboard({ inventory, searchTerm, onSearchChange, onAdminClick, onItemClick, onLogout }: DashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Get unique categories
  const categories = ["All", ...Array.from(new Set(inventory.map(item => item.category)))];
  
  // Filter inventory by search and category
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Check if item has booking due within 7 days (mock logic)
  const isDueSoon = (item: InventoryItem) => {
    const reserved = Math.max(0, item.booked - item.dispatched);
    return reserved > 0 && item.booked > 0;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm flex items-center justify-between relative px-4 py-6 sm:px-8">
        {/* Left: Settings + Logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAdminClick}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
            aria-label="Settings"
            style={{
              minWidth: '44px',
              minHeight: '44px',
              transition: 'all 300ms ease-out',
            }}
          >
            <Settings className="text-black" size={24} />
          </button>
          <button
            onClick={onLogout}
            className="text-sm sm:text-base hover:underline transition-all"
            style={{ 
              color: '#1976D2', 
              fontFamily: 'Inter, Poppins, Roboto, sans-serif',
              minHeight: '44px',
              transition: 'all 300ms ease-out',
            }}
          >
            Logout
          </button>
        </div>
        
        {/* Center: Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-black font-bold text-xl sm:text-2xl text-center whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif', color: '#1976D2' }}>
            Stock Tracker
          </h1>
        </div>

        {/* Right: Reserved for future */}
        <div className="w-20"></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto px-4 py-4 pb-24 sm:px-8" style={{ padding: '16px', paddingBottom: '80px' }}>
        {/* Global Search Bar */}
        <div className="bg-white rounded-2xl shadow-md mb-4 flex items-center px-4 h-16 sm:h-20" style={{ borderColor: '#E0E0E0', borderWidth: '1px' }}>
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            placeholder="Search model or category"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 outline-none text-black bg-transparent text-sm sm:text-base"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>

        {/* Category Filter Chips - Horizontal Scroll */}
        <div className="mb-6 overflow-x-auto -mx-4 px-4 pb-2">
          <div className="flex gap-2" style={{ minWidth: 'min-content' }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm"
                style={{
                  backgroundColor: selectedCategory === category ? '#1976D2' : '#FFFFFF',
                  color: selectedCategory === category ? '#FFFFFF' : '#000000',
                  fontFamily: 'Inter, sans-serif',
                  border: '1px solid #E0E0E0',
                  boxShadow: selectedCategory === category ? '0 2px 6px rgba(25, 118, 210, 0.3)' : 'none',
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Table Cards */}
        <div className="space-y-4">
          {filteredInventory.map((item) => {
            const available = item.opening + item.delivered - item.dispatched;
            const reserved = Math.max(0, item.booked - item.dispatched);
            const hasDueSoon = isDueSoon(item);

            return (
              <div
                key={item.id}
                onClick={() => onItemClick(item)}
                className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-all relative"
                style={{ fontFamily: 'Inter, sans-serif', transition: 'all 250ms ease' }}
              >
                {/* Due Soon Indicator */}
                {hasDueSoon && (
                  <div 
                    className="absolute top-4 right-4 w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#FF9800' }}
                    title="Due soon"
                  />
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Model Name</div>
                    <div className="text-black text-sm font-medium">{item.model}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Category</div>
                    <div className="text-black text-sm font-medium">{item.category}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Available</div>
                    <div className="text-sm font-medium" style={{ color: '#4CAF50' }}>{available}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Reserved</div>
                    {reserved > 0 ? (
                      <span
                        className="inline-block px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: '#1976D2', color: '#FFFFFF' }}
                      >
                        {reserved}
                      </span>
                    ) : (
                      <div className="text-sm font-medium text-gray-400">0</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No items found
          </div>
        )}
      </div>
    </div>
  );
}
