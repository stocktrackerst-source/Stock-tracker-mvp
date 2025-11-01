import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";

interface BookFormProps {
  onSubmit: (data: BookFormData) => void;
  onBack: () => void;
}

export interface BookFormData {
  model: string;
  quantity: number;
  customerName: string;
  bookingId: string;
  date: string;
  enteredBy: string;
  remarks: string;
  status: "hold" | "sold";
}

export function BookForm({ onSubmit, onBack }: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>({
    model: "",
    quantity: 0,
    customerName: "",
    bookingId: `BK-${Date.now().toString().slice(-6)}`, // Auto-generated
    date: new Date().toISOString().split('T')[0],
    enteredBy: "",
    remarks: "",
    status: "hold",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof BookFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm flex items-center px-4 py-6 sm:px-8">
        <button onClick={onBack} className="mr-3">
          <ArrowLeft className="text-black" size={24} />
        </button>
        <h1 className="text-black font-bold text-xl sm:text-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>Book Sale</h1>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto px-4 py-4 pb-24 sm:px-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status Toggle: Hold / Sold */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <label className="block text-gray-600 mb-3 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Status
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleChange("status", "hold")}
                className="flex-1 py-3 rounded-xl transition-all text-sm"
                style={{
                  backgroundColor: formData.status === "hold" ? '#FF9800' : '#F5F5F5',
                  color: formData.status === "hold" ? '#FFFFFF' : '#000000',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 250ms ease',
                }}
              >
                Hold
              </button>
              <button
                type="button"
                onClick={() => handleChange("status", "sold")}
                className="flex-1 py-3 rounded-xl transition-all text-sm"
                style={{
                  backgroundColor: formData.status === "sold" ? '#4CAF50' : '#F5F5F5',
                  color: formData.status === "sold" ? '#FFFFFF' : '#000000',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 250ms ease',
                }}
              >
                Sold
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formData.status === "hold" ? "Item reserved for future dispatch" : "Item sold and dispatched immediately"}
            </p>
          </div>

          {/* Model Search */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Model Search
            </label>
            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-xl" style={{ border: '1px solid #E0E0E0' }}>
              <Search className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                value={formData.model}
                onChange={(e) => handleChange("model", e.target.value)}
                className="flex-1 outline-none text-black bg-transparent text-sm"
                style={{ fontFamily: 'Inter, sans-serif' }}
                placeholder="Type to search model..."
                required
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 0)}
              className="w-full outline-none text-black bg-gray-50 px-3 py-2 rounded-xl text-sm"
              style={{ fontFamily: 'Inter, sans-serif', border: '1px solid #E0E0E0' }}
              required
            />
          </div>

          {/* Customer Name */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Customer Name
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              className="w-full outline-none text-black bg-gray-50 px-3 py-2 rounded-xl text-sm"
              style={{ fontFamily: 'Inter, sans-serif', border: '1px solid #E0E0E0' }}
              required
            />
          </div>

          {/* Booking ID (Auto-generated) */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Booking ID
            </label>
            <input
              type="text"
              value={formData.bookingId}
              className="w-full outline-none text-black bg-gray-100 px-3 py-2 rounded-xl text-sm"
              style={{ fontFamily: 'Inter, sans-serif' }}
              disabled
            />
          </div>

          {/* Date Picker */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Select Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full outline-none text-black bg-gray-50 px-3 py-2 rounded-xl text-sm"
              style={{ 
                fontFamily: 'Inter, sans-serif', 
                border: '1px solid #E0E0E0',
              }}
              required
            />
            <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Format: {formData.date ? formatDateForDisplay(formData.date) : 'DD/MM/YYYY'}
            </p>
          </div>

          {/* Entered By */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Entered By
            </label>
            <input
              type="text"
              value={formData.enteredBy}
              onChange={(e) => handleChange("enteredBy", e.target.value)}
              className="w-full outline-none text-black bg-gray-50 px-3 py-2 rounded-xl text-sm"
              style={{ fontFamily: 'Inter, sans-serif', border: '1px solid #E0E0E0' }}
              required
            />
          </div>

          {/* Remarks */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              rows={3}
              className="w-full outline-none text-black bg-gray-50 px-3 py-2 rounded-xl resize-none text-sm"
              style={{ fontFamily: 'Inter, sans-serif', border: '1px solid #E0E0E0' }}
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
            Confirm Booking
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
