import { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface AddStockFormProps {
  onSubmit: (data: StockFormData) => void;
  onBack: () => void;
}

export interface StockFormData {
  model: string;
  quantity: number;
  ordered: number;
  billNo: string;
  date: string;
  enteredBy: string;
  remarks: string;
}

export function AddStockForm({ onSubmit, onBack }: AddStockFormProps) {
  const [formData, setFormData] = useState<StockFormData>({
    model: "",
    quantity: 0,
    ordered: 0,
    billNo: "",
    date: new Date().toISOString().split('T')[0],
    enteredBy: "",
    remarks: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof StockFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white shadow-sm flex items-center" style={{ height: '150px', padding: '0 60px' }}>
        <button onClick={onBack} className="mr-4">
          <ArrowLeft className="text-black" size={28} />
        </button>
        <h1 className="text-black" style={{ fontFamily: 'Inter, sans-serif' }}>Add Stock</h1>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto" style={{ padding: '20px 60px 180px 60px' }}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Model Search */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Model Search
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => handleChange("model", e.target.value)}
              className="w-full outline-none text-black bg-gray-50 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
              required
            />
          </div>

          {/* Quantity */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 0)}
              className="w-full outline-none text-black bg-gray-50 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
              required
            />
          </div>

          {/* Ordered */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Ordered
            </label>
            <input
              type="number"
              value={formData.ordered}
              onChange={(e) => handleChange("ordered", parseInt(e.target.value) || 0)}
              className="w-full outline-none text-black bg-gray-50 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
              required
            />
          </div>

          {/* Bill No */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Bill No
            </label>
            <input
              type="text"
              value={formData.billNo}
              onChange={(e) => handleChange("billNo", e.target.value)}
              className="w-full outline-none text-black bg-gray-50 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
              required
            />
          </div>

          {/* Date */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full outline-none text-black bg-gray-50 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
              required
            />
          </div>

          {/* Entered By */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Entered By
            </label>
            <input
              type="text"
              value={formData.enteredBy}
              onChange={(e) => handleChange("enteredBy", e.target.value)}
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
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full text-white rounded-2xl shadow-lg"
            style={{
              backgroundColor: '#4CAF50',
              height: '80px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Submit
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="bg-white shadow-sm flex items-center justify-center py-4">
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          KAFF Inventory System
        </p>
      </div>
    </div>
  );
}
