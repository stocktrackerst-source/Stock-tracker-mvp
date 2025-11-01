import { useState } from "react";
import { Search, Download, Edit2, Trash2, ArrowLeft } from "lucide-react";

type TabType = "orders" | "received" | "booked" | "dispatched";

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

interface AdminPanelProps {
  onBack: () => void;
  onEdit: (type: TabType, record: any) => void;
  onDelete: (type: TabType, id: string) => void;
  orders: OrderRecord[];
  received: ReceivedRecord[];
  booked: BookedRecord[];
  dispatched: DispatchedRecord[];
}

export function AdminPanel({ 
  onBack, 
  onEdit, 
  onDelete,
  orders,
  received,
  booked,
  dispatched
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("orders");
  const [searchTerm, setSearchTerm] = useState("");

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
  const filteredBooked = filterRecords(booked);
  const filteredDispatched = filterRecords(dispatched);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white shadow-sm flex items-center justify-between" style={{ height: '150px', padding: '0 60px' }}>
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4">
            <ArrowLeft className="text-black" size={28} />
          </button>
          <h1 className="text-black font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>Admin Control Panel</h1>
        </div>
        
        {/* Download Report Button */}
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-600 transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Download size={20} />
          <span>Download Report</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto" style={{ padding: '20px 60px 180px 60px' }}>
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-md mb-5 flex items-center px-6" style={{ height: '100px' }}>
          <Search className="text-gray-400 mr-4" size={24} />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-black bg-transparent"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {[
            { id: "orders", label: "Orders" },
            { id: "received", label: "Received" },
            { id: "booked", label: "Booked" },
            { id: "dispatched", label: "Dispatched" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className="px-8 py-4 rounded-full transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? '#4CAF50' : '#FFFFFF',
                color: activeTab === tab.id ? '#FFFFFF' : '#000000',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                minWidth: '160px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-md p-6"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <div className="grid grid-cols-7 gap-4 items-center">
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Order ID</div>
                    <div className="text-black">{order.id}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Model</div>
                    <div className="text-black">{order.model}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Quantity</div>
                    <div className="text-black">{order.quantity}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Supplier</div>
                    <div className="text-black">{order.supplier}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Bill No</div>
                    <div className="text-black">{order.billNo}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Date</div>
                    <div className="text-black">{order.date}</div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => onEdit("orders", order)}
                      className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={20} className="text-blue-500" />
                    </button>
                    <button
                      onClick={() => onDelete("orders", order.id)}
                      className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-center text-gray-500 py-12">No orders found</div>
            )}
          </div>
        )}

        {/* Received Tab */}
        {activeTab === "received" && (
          <div className="space-y-4">
            {filteredReceived.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-2xl shadow-md p-6"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div>
                    <div className="text-gray-500 text-sm mb-1">ID</div>
                    <div className="text-black">{record.id}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Model</div>
                    <div className="text-black">{record.model}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Received Qty</div>
                    <div className="text-black">{record.receivedQty}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Received By</div>
                    <div className="text-black">{record.receivedBy}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Date</div>
                    <div className="text-black">{record.date}</div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => onEdit("received", record)}
                      className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={20} className="text-blue-500" />
                    </button>
                    <button
                      onClick={() => onDelete("received", record.id)}
                      className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredReceived.length === 0 && (
              <div className="text-center text-gray-500 py-12">No received records found</div>
            )}
          </div>
        )}

        {/* Booked Tab */}
        {activeTab === "booked" && (
          <div className="space-y-4">
            {filteredBooked.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-2xl shadow-md p-6"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <div className="grid grid-cols-7 gap-4 items-center">
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Booking ID</div>
                    <div className="text-black">{record.bookingId}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Model</div>
                    <div className="text-black">{record.model}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Quantity</div>
                    <div className="text-black">{record.quantity}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Customer</div>
                    <div className="text-black">{record.customerName}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Entered By</div>
                    <div className="text-black">{record.enteredBy}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Date</div>
                    <div className="text-black">{record.date}</div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => onEdit("booked", record)}
                      className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={20} className="text-blue-500" />
                    </button>
                    <button
                      onClick={() => onDelete("booked", record.id)}
                      className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredBooked.length === 0 && (
              <div className="text-center text-gray-500 py-12">No booked records found</div>
            )}
          </div>
        )}

        {/* Dispatched Tab */}
        {activeTab === "dispatched" && (
          <div className="space-y-4">
            {filteredDispatched.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-2xl shadow-md p-6"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <div className="grid grid-cols-7 gap-4 items-center">
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Dispatch ID</div>
                    <div className="text-black">{record.dispatchId}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Model</div>
                    <div className="text-black">{record.model}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Quantity</div>
                    <div className="text-black">{record.quantity}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Customer</div>
                    <div className="text-black">{record.customerName}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Dispatched By</div>
                    <div className="text-black">{record.dispatchedBy}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Date</div>
                    <div className="text-black">{record.date}</div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => onEdit("dispatched", record)}
                      className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={20} className="text-blue-500" />
                    </button>
                    <button
                      onClick={() => onDelete("dispatched", record.id)}
                      className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredDispatched.length === 0 && (
              <div className="text-center text-gray-500 py-12">No dispatched records found</div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white shadow-sm flex items-center justify-center py-4">
      </div>
    </div>
  );
}
