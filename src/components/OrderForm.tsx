import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  onBack: () => void;
}

export interface OrderFormData {
  model: string;
  quantity: number;
  supplierName: string;
  billNo: string;
  orderedBy: string;
  date: string;
  remarks: string;
}

export function OrderForm({ onSubmit, onBack }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    model: "",
    quantity: 0,
    supplierName: "",
    billNo: "",
    orderedBy: "",
    date: new Date().toISOString().split('T')[0],
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof OrderFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm flex items-center px-4 py-6 sm:px-8">
        <button onClick={onBack} className="mr-3">
          <ArrowLeft className="text-black" size={24} />
        </button>
        <h1 className="text-black font-bold text-xl sm:text-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>Order Stock</h1>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto px-4 py-4 pb-24 sm:px-8">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              style={{ fontFamily: 'Inter, sans-serif' }}
              required
            />
          </div>

          {/* Supplier Name */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Supplier Name
            </label>
            <input
              type="text"
              value={formData.supplierName}
              onChange={(e) => handleChange("supplierName", e.target.value)}
              className="w-full outline-none text-black bg-gray-50 px-3 py-2 rounded-xl text-sm"
              style={{ fontFamily: 'Inter, sans-serif' }}
              required
            />
          </div>

          {/* Bill No */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Bill No
            </label>
            <input
              type="text"
              value={formData.billNo}
              onChange={(e) => handleChange("billNo", e.target.value)}
              className="w-full outline-none text-black bg-gray-50 px-3 py-2 rounded-xl text-sm"
              style={{ fontFamily: 'Inter, sans-serif' }}
              required
            />
          </div>

          {/* Ordered By */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Ordered By
            </label>
            <input
              type="text"
              value={formData.orderedBy}
              onChange={(e) => handleChange("orderedBy", e.target.value)}
              className="w-full outline-none text-black bg-gray-50 px-3 py-2 rounded-xl text-sm"
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
          <div className="bg-white rounded-2xl shadow-md p-4">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              rows={3}
              className="w-full outline-none text-black bg-gray-50 px-3 py-2 rounded-xl resize-none text-sm"
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
            Submit Order
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

      {/* Footer */}
      <div className="bg-white shadow-sm flex items-center justify-center py-4">
      </div>
    </div>
  );
}