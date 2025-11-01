import { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface DispatchFormProps {
  onSubmit: (data: DispatchFormData) => void;
  onBack: () => void;
  bookedOrders: Array<{ model: string; quantity: number; customerName: string }>;
}

export interface DispatchFormData {
  model: string;
  quantity: number;
  customerName: string;
  dispatchId: string;
  dispatchedBy: string;
  date: string;
  remarks: string;
  source?: "hold" | "direct";
}

export function DispatchForm({ onSubmit, onBack, bookedOrders }: DispatchFormProps) {
  const [formData, setFormData] = useState<DispatchFormData>({
    model: "",
    quantity: 0,
    customerName: "",
    dispatchId: `DS-${Date.now().toString().slice(-6)}`, // Auto-generated
    dispatchedBy: "",
    date: new Date().toISOString().split('T')[0],
    remarks: "",
    source: "hold",
  });

  const handleBookingSelect = (model: string) => {
    const booking = bookedOrders.find(b => b.model === model);
    if (booking) {
      setFormData(prev => ({
        ...prev,
        model: booking.model,
        quantity: booking.quantity,
        customerName: booking.customerName,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof DispatchFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Format date to DD/MM/YYYY for display
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm flex items-center px-4 py-6 sm:px-8">
        <button onClick={onBack} className="mr-3">
          <ArrowLeft className="text-black" size={24} />
        </button>
        <h1 className="text-black font-bold text-xl sm:text-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>Dispatch to Customer</h1>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto px-4 py-4 pb-24 sm:px-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select from Booked Orders */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Select from Booked Orders
            </label>
            <select
              value={formData.model}
              onChange={(e) => handleBookingSelect(e.target.value)}
              className="w-full outline-none text-black bg-gray-50 px-3 py-2 rounded-xl text-sm"
              style={{ fontFamily: 'Inter, sans-serif', border: '1px solid #E0E0E0' }}
              required
            >
              <option value="">-- Select a booking --</option>
              {bookedOrders.map((booking, index) => (
                <option key={index} value={booking.model}>
                  {booking.model} - {booking.customerName} (Qty: {booking.quantity})
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

          {/* Quantity (Auto-filled) */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              className="w-full outline-none text-black bg-gray-100 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
              disabled
            />
          </div>

          {/* Customer Name (Auto-filled) */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Customer Name
            </label>
            <input
              type="text"
              value={formData.customerName}
              className="w-full outline-none text-black bg-gray-100 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
              disabled
            />
          </div>

          {/* Dispatch ID (Auto-generated) */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Dispatch ID
            </label>
            <input
              type="text"
              value={formData.dispatchId}
              className="w-full outline-none text-black bg-gray-100 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
              disabled
            />
          </div>

          {/* Dispatched By */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Dispatched By
            </label>
            <input
              type="text"
              value={formData.dispatchedBy}
              onChange={(e) => handleChange("dispatchedBy", e.target.value)}
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
              backgroundColor: '#E53935',
              height: '60px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Confirm Dispatch
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