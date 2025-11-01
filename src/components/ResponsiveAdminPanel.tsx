import { useState } from "react";
import { Search, Download, ArrowLeft, Trash2 } from "lucide-react";

type TabType = "orders" | "received" | "booked" | "dispatched";

interface BookedRecord {
  id: string;
  model: string;
  quantity: number;
  customerName: string;
  bookingId: string;
  enteredBy: string;
  date: string;
  remarks: string;
}

interface DispatchedRecord {
  id: string;
  model: string;
  quantity: number;
  customerName: string;
  dispatchId: string;
  dispatchedBy: string;
  date: string;
  remarks: string;
}

interface OrderRecord {
  id: string;
  model: string;
  quantity: number;
  supplier: string;
  billNo: string;
  orderedBy: string;
  date: string;
  remarks: string;
}

interface ReceivedRecord {
  id: string;
  model: string;
  orderedQty: number;
  receivedQty: number;
  receivedBy: string;
  date: string;
  remarks: string;
}

interface ResponsiveAdminPanelProps {
  onBack: () => void;
  onDelete: (type: TabType, id: string) => void;
  initialTab?: TabType;
  orders?: OrderRecord[];
  received?: ReceivedRecord[];
  booked: BookedRecord[];
  dispatched: DispatchedRecord[];
}

export function ResponsiveAdminPanel({ 
  onBack, 
  onDelete,
  initialTab = "booked",
  orders = [],
  received = [],
  booked,
  dispatched
}: ResponsiveAdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookedFilter, setBookedFilter] = useState<"all" | "held">("all");

  const handleDownloadReport = () => {
    alert("📥 Report download feature will be implemented with backend integration");
  };

  const filterRecords = (records: any[]) => {
    return records.filter(record => 
      Object.values(record).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const filteredOrders = filterRecords(orders);
  const filteredReceived = filterRecords(received);
  
  // Filter booked records with status filter
  let filteredBooked = filterRecords(booked);
  if (bookedFilter === "held") {
    filteredBooked = filteredBooked.filter(record => record.status === "hold");
  }
  
  const filteredDispatched = filterRecords(dispatched);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm flex items-center justify-between px-4 py-4">
        <div className="flex items-center flex-1">
          <button onClick={onBack} className="mr-3">
            <ArrowLeft className="text-black" size={24} />
          </button>
          <h1 
            className="text-black font-bold text-lg sm:text-xl truncate" 
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '32px' }}
          >
            Admin Control Panel
          </h1>
        </div>
        
        {/* Download Report Button */}
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-xl shadow-md hover:bg-blue-600 transition-colors ml-2 flex-shrink-0"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Download size={16} />
          <span className="hidden sm:inline text-sm">Download</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto px-4 py-4 pb-24">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-md mb-4 flex items-center px-4 h-14 w-full max-w-md mx-auto">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            placeholder="Search by Model, ID, or Customer"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-black bg-transparent text-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>

        {/* Booked Tab Filter Chips */}
        {activeTab === "booked" && (
          <div className="flex gap-3 mb-4 w-full max-w-md mx-auto">
            <button
              onClick={() => setBookedFilter("all")}
              className="px-4 py-2 rounded-full text-sm transition-all"
              style={{
                backgroundColor: bookedFilter === "all" ? '#FF9800' : '#FFFFFF',
                color: bookedFilter === "all" ? '#FFFFFF' : '#000000',
                fontFamily: 'Inter, sans-serif',
                border: '1px solid #E0E0E0',
                transition: 'all 250ms ease',
              }}
            >
              All
            </button>
            <button
              onClick={() => setBookedFilter("held")}
              className="px-4 py-2 rounded-full text-sm transition-all"
              style={{
                backgroundColor: bookedFilter === "held" ? '#FF9800' : '#FFFFFF',
                color: bookedFilter === "held" ? '#FFFFFF' : '#000000',
                fontFamily: 'Inter, sans-serif',
                border: '1px solid #E0E0E0',
                transition: 'all 250ms ease',
              }}
            >
              Held Only
            </button>
          </div>
        )}

        {/* Toggle Buttons */}
        <div className="flex gap-3 mb-4 w-full max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className="flex-1 py-3 rounded-2xl transition-all shadow-md text-sm sm:text-base"
            style={{
              backgroundColor: activeTab === "orders" ? '#2196F3' : '#FFFFFF',
              color: activeTab === "orders" ? '#FFFFFF' : '#000000',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className="flex-1 py-3 rounded-2xl transition-all shadow-md text-sm sm:text-base"
            style={{
              backgroundColor: activeTab === "received" ? '#4CAF50' : '#FFFFFF',
              color: activeTab === "received" ? '#FFFFFF' : '#000000',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Received
          </button>
        </div>
        
        <div className="flex gap-3 mb-4 w-full max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("booked")}
            className="flex-1 py-3 rounded-2xl transition-all shadow-md text-sm sm:text-base"
            style={{
              backgroundColor: activeTab === "booked" ? '#FF9800' : '#FFFFFF',
              color: activeTab === "booked" ? '#FFFFFF' : '#000000',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Booked
          </button>
          <button
            onClick={() => setActiveTab("dispatched")}
            className="flex-1 py-3 rounded-2xl transition-all shadow-md text-sm sm:text-base"
            style={{
              backgroundColor: activeTab === "dispatched" ? '#E53935' : '#FFFFFF',
              color: activeTab === "dispatched" ? '#FFFFFF' : '#000000',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Dispatched
          </button>
        </div>

        {/* List Section */}
        <div className="w-full max-w-md mx-auto">
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-3">
              {filteredOrders.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden relative"
                  style={{ 
                    fontFamily: 'Inter, Poppins, Roboto, sans-serif',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 300ms ease-out',
                  }}
                >
                  {/* Colored Left Bar - Blue for Orders */}
                  <div
                    className="absolute left-0 top-0 bottom-0"
                    style={{
                      width: '6px',
                      backgroundColor: '#2196F3',
                    }}
                  />
                  <div className="p-4 pl-5">
                    {/* Model Name (Bold) */}
                    <div className="mb-3">
                      <div className="text-black" style={{ fontSize: '18px', fontWeight: '700' }}>
                        {record.model}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Order ID</div>
                        <div className="text-black" style={{ fontSize: '14px', fontWeight: '500' }}>
                          {record.id}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Qty</div>
                        <div className="text-black" style={{ fontSize: '14px', fontWeight: '600', color: '#2196F3' }}>
                          {record.quantity}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Supplier</div>
                        <div className="text-black truncate" style={{ fontSize: '14px' }}>
                          {record.supplier}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Date</div>
                        <div className="text-black" style={{ fontSize: '14px' }}>
                          {new Date(record.date).toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Remarks */}
                    {record.remarks && (
                      <div className="mb-3">
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Remarks</div>
                        <div className="text-gray-700" style={{ fontSize: '13px' }}>
                          {record.remarks}
                        </div>
                      </div>
                    )}

                    {/* Delete Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => onDelete("orders", record.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                        style={{
                          minWidth: '44px',
                          minHeight: '44px',
                          transition: 'all 300ms ease-out',
                        }}
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="text-center text-gray-500 py-12" style={{ fontSize: '26px' }}>
                  No order records found
                </div>
              )}
            </div>
          )}

          {/* Received Tab */}
          {activeTab === "received" && (
            <div className="space-y-3">
              {filteredReceived.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden relative"
                  style={{ 
                    fontFamily: 'Inter, Poppins, Roboto, sans-serif',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 300ms ease-out',
                  }}
                >
                  {/* Colored Left Bar - Green for Received */}
                  <div
                    className="absolute left-0 top-0 bottom-0"
                    style={{
                      width: '6px',
                      backgroundColor: '#4CAF50',
                    }}
                  />
                  <div className="p-4 pl-5">
                    {/* Model Name (Bold) */}
                    <div className="mb-3">
                      <div className="text-black" style={{ fontSize: '18px', fontWeight: '700' }}>
                        {record.model}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Receive ID</div>
                        <div className="text-black" style={{ fontSize: '14px', fontWeight: '500' }}>
                          {record.id}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Qty Received</div>
                        <div className="text-black" style={{ fontSize: '14px', fontWeight: '600', color: '#4CAF50' }}>
                          {record.receivedQty}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Received By</div>
                        <div className="text-black truncate" style={{ fontSize: '14px' }}>
                          {record.receivedBy}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Date</div>
                        <div className="text-black" style={{ fontSize: '14px' }}>
                          {new Date(record.date).toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Remarks */}
                    {record.remarks && (
                      <div className="mb-3">
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Remarks</div>
                        <div className="text-gray-700" style={{ fontSize: '13px' }}>
                          {record.remarks}
                        </div>
                      </div>
                    )}

                    {/* Delete Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => onDelete("received", record.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                        style={{
                          minWidth: '44px',
                          minHeight: '44px',
                          transition: 'all 300ms ease-out',
                        }}
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredReceived.length === 0 && (
                <div className="text-center text-gray-500 py-12" style={{ fontSize: '26px' }}>
                  No received records found
                </div>
              )}
            </div>
          )}

          {/* Booked Tab */}
          {activeTab === "booked" && (
            <div className="space-y-3">
              {filteredBooked.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden relative"
                  style={{ 
                    fontFamily: 'Inter, Poppins, Roboto, sans-serif',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 300ms ease-out',
                  }}
                >
                  {/* Colored Left Bar - Orange for Booked */}
                  <div
                    className="absolute left-0 top-0 bottom-0"
                    style={{
                      width: '6px',
                      backgroundColor: '#FF9800',
                    }}
                  />
                  <div className="p-4 pl-5">
                    {/* Model Name (Bold) + Status Badge */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-black" style={{ fontSize: '18px', fontWeight: '700' }}>
                        {record.model}
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-white"
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          backgroundColor: record.status === 'hold' ? '#FF9800' : '#4CAF50',
                        }}
                      >
                        {record.status === 'hold' ? 'HOLD' : 'SOLD'}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Booking ID</div>
                        <div className="text-black" style={{ fontSize: '14px', fontWeight: '500' }}>
                          {record.bookingId}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Qty</div>
                        <div className="text-black" style={{ fontSize: '14px', fontWeight: '600', color: '#FF9800' }}>
                          {record.quantity}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Customer</div>
                        <div className="text-black truncate" style={{ fontSize: '14px' }}>
                          {record.customerName}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Date</div>
                        <div className="text-black" style={{ fontSize: '14px' }}>
                          {new Date(record.date).toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Remarks */}
                    {record.remarks && (
                      <div className="mb-3">
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Remarks</div>
                        <div className="text-gray-700" style={{ fontSize: '13px' }}>
                          {record.remarks}
                        </div>
                      </div>
                    )}

                    {/* Delete Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => onDelete("booked", record.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                        style={{
                          minWidth: '44px',
                          minHeight: '44px',
                          transition: 'all 300ms ease-out',
                        }}
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredBooked.length === 0 && (
                <div className="text-center text-gray-500 py-12" style={{ fontSize: '26px' }}>
                  No booked records found
                </div>
              )}
            </div>
          )}

          {/* Dispatched Tab */}
          {activeTab === "dispatched" && (
            <div className="space-y-3">
              {filteredDispatched.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden relative"
                  style={{ 
                    fontFamily: 'Inter, Poppins, Roboto, sans-serif',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 300ms ease-out',
                  }}
                >
                  {/* Colored Left Bar - Red for Dispatched */}
                  <div
                    className="absolute left-0 top-0 bottom-0"
                    style={{
                      width: '6px',
                      backgroundColor: '#E53935',
                    }}
                  />
                  <div className="p-4 pl-5">
                    {/* Model Name (Bold) + Source Badge */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-black" style={{ fontSize: '18px', fontWeight: '700' }}>
                        {record.model}
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-white"
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          backgroundColor: record.source === 'hold' ? '#FF9800' : '#4CAF50',
                        }}
                      >
                        {record.source === 'hold' ? 'FROM HOLD' : 'DIRECT'}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Dispatch ID</div>
                        <div className="text-black" style={{ fontSize: '14px', fontWeight: '500' }}>
                          {record.dispatchId}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Qty</div>
                        <div className="text-black" style={{ fontSize: '14px', fontWeight: '600', color: '#E53935' }}>
                          {record.quantity}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Customer</div>
                        <div className="text-black truncate" style={{ fontSize: '14px' }}>
                          {record.customerName}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Date</div>
                        <div className="text-black" style={{ fontSize: '14px' }}>
                          {new Date(record.date).toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Remarks */}
                    {record.remarks && (
                      <div className="mb-3">
                        <div className="text-gray-500" style={{ fontSize: '12px' }}>Remarks</div>
                        <div className="text-gray-700" style={{ fontSize: '13px' }}>
                          {record.remarks}
                        </div>
                      </div>
                    )}

                    {/* Delete Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => onDelete("dispatched", record.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                        style={{
                          minWidth: '44px',
                          minHeight: '44px',
                          transition: 'all 300ms ease-out',
                        }}
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredDispatched.length === 0 && (
                <div className="text-center text-gray-500 py-12" style={{ fontSize: '26px' }}>
                  No dispatched records found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white shadow-sm flex items-center justify-center py-3">
      </div>
    </div>
  );
}