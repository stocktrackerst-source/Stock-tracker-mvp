import { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface ReceiveFormProps {
  onSubmit: (data: ReceiveFormData) => void;
  onBack: () => void;
  pendingOrders: Array<{ model: string; orderedQty: number }>;
}

export interface ReceiveFormData {
  model: string;
  orderedQty: number;
  receivedQty: number;
  date: string;
  receivedBy: string;
  remarks: string;
}

export function ReceiveForm({ onSubmit, onBack, pendingOrders }: ReceiveFormProps) {
  const [formData, setFormData] = useState<ReceiveFormData>({
    model: "",
    orderedQty: 0,
    receivedQty: 0,
    date: new Date().toISOString().split('T')[0],
    receivedBy: "",
    remarks: "",
  });

  // Format date to DD/MM/YYYY for display
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleOrderSelect = (model: string) => {
    const order = pendingOrders.find(o => o.model === model);
    if (order) {
      setFormData(prev => ({
        ...prev,
        model: order.model,
        orderedQty: order.orderedQty,
        receivedQty: order.orderedQty, // Default to full quantity
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof ReceiveFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm flex items-center px-4 py-6 sm:px-8">
        <button onClick={onBack} className="mr-3">
          <ArrowLeft className="text-black" size={24} />
        </button>
        <h1 className="text-black font-bold text-xl sm:text-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>Receive Delivery</h1>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto px-4 py-4 pb-24 sm:px-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select from Pending Orders */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Select from Pending Orders
            </label>
            <select
              value={formData.model}
              onChange={(e) => handleOrderSelect(e.target.value)}
              className="w-full outline-none text-black bg-gray-50 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
              required
            >
              <option value="">-- Select an order --</option>
              {pendingOrders.map((order, index) => (
                <option key={index} value={order.model}>
                  {order.model} (Ordered: {order.orderedQty})
                </option>
              ))}
            </select>
          </div>

          {/* Model (Auto-filled) */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Model
            </label>
            <input
              type="text"
              value={formData.model}
              className="w-full outline-none text-black bg-gray-100 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
              disabled
            />
          </div>

          {/* Ordered Qty (Auto-filled) */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Ordered Quantity
            </label>
            <input
              type="number"
              value={formData.orderedQty}
              className="w-full outline-none text-black bg-gray-100 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
              disabled
            />
          </div>

          {/* Received Qty */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Received Quantity
            </label>
            <input
              type="number"
              value={formData.receivedQty}
              onChange={(e) => handleChange("receivedQty", parseInt(e.target.value) || 0)}
              className="w-full outline-none text-black bg-gray-50 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
              required
            />
          </div>

          {/* Date */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Select Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full outline-none text-black bg-gray-50 px-3 py-2 rounded-xl text-sm"
              style={{ fontFamily: 'Inter, sans-serif', border: '1px solid #E0E0E0' }}
              required
            />
            <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Format: {formData.date ? formatDateForDisplay(formData.date) : 'DD/MM/YYYY'}
            </p>
          </div>

          {/* Received By */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Received By
            </label>
            <input
              type="text"
              value={formData.receivedBy}
              onChange={(e) => handleChange("receivedBy", e.target.value)}
              className="w-full outline-none text-black bg-gray-50 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
              required
            />
          </div>

          {/* Remarks */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              rows={4}
              className="w-full outline-none text-black bg-gray-50 px-4 py-3 rounded-xl resize-none"
              style={{ fontFamily: 'Inter, sans-serif' }}
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full text-white rounded-2xl shadow-lg"
            style={{
              backgroundColor: '#4CAF50',
              height: '60px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Confirm Delivery
          </button>

          {/* Back Link */}
          <button
            type="button"
            onClick={onBack}
            className="w-full text-gray-500 text-center hover:text-black transition-colors text-sm"
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}