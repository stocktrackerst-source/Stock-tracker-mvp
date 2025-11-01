import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EditRecordModalProps {
  type: "orders" | "received" | "booked" | "dispatched";
  record: any;
  onSave: (updatedRecord: any) => void;
  onCancel: () => void;
}

export function EditRecordModal({ type, record, onSave, onCancel }: EditRecordModalProps) {
  const [formData, setFormData] = useState(record);

  useEffect(() => {
    setFormData(record);
  }, [record]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl relative overflow-auto"
        style={{
          width: '900px',
          maxHeight: '1400px',
          padding: '60px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 text-gray-500 hover:text-black transition-colors"
        >
          <X size={32} />
        </button>

        {/* Title */}
        <h2 className="text-black mb-8 font-bold text-center">
          Edit {type.charAt(0).toUpperCase() + type.slice(1)} Record
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {type === "orders" && (
            <>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  className="w-full outline-none text-black bg-white px-4 py-3 rounded-lg"
                  required
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 0)}
                  className="w-full outline-none text-black bg-white px-4 py-3 rounded-lg"
                  required
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => handleChange("supplier", e.target.value)}
                  className="w-full outline-none text-black bg-white px-4 py-3 rounded-lg"
                  required
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Remarks</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  rows={3}
                  className="w-full outline-none text-black bg-white px-4 py-3 rounded-lg resize-none"
                />
              </div>
            </>
          )}

          {type === "received" && (
            <>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Model</label>
                <input
                  type="text"
                  value={formData.model}
                  className="w-full outline-none text-black bg-gray-200 px-4 py-3 rounded-lg"
                  disabled
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Received Quantity</label>
                <input
                  type="number"
                  value={formData.receivedQty}
                  onChange={(e) => handleChange("receivedQty", parseInt(e.target.value) || 0)}
                  className="w-full outline-none text-black bg-white px-4 py-3 rounded-lg"
                  required
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Received By</label>
                <input
                  type="text"
                  value={formData.receivedBy}
                  onChange={(e) => handleChange("receivedBy", e.target.value)}
                  className="w-full outline-none text-black bg-white px-4 py-3 rounded-lg"
                  required
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Remarks</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  rows={3}
                  className="w-full outline-none text-black bg-white px-4 py-3 rounded-lg resize-none"
                />
              </div>
            </>
          )}

          {type === "booked" && (
            <>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  className="w-full outline-none text-black bg-white px-4 py-3 rounded-lg"
                  required
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 0)}
                  className="w-full outline-none text-black bg-white px-4 py-3 rounded-lg"
                  required
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                  className="w-full outline-none text-black bg-white px-4 py-3 rounded-lg"
                  required
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Remarks</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  rows={3}
                  className="w-full outline-none text-black bg-white px-4 py-3 rounded-lg resize-none"
                />
              </div>
            </>
          )}

          {type === "dispatched" && (
            <>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Model</label>
                <input
                  type="text"
                  value={formData.model}
                  className="w-full outline-none text-black bg-gray-200 px-4 py-3 rounded-lg"
                  disabled
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 0)}
                  className="w-full outline-none text-black bg-white px-4 py-3 rounded-lg"
                  required
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                  className="w-full outline-none text-black bg-white px-4 py-3 rounded-lg"
                  required
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-600 mb-2 text-sm">Remarks</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  rows={3}
                  className="w-full outline-none text-black bg-white px-4 py-3 rounded-lg resize-none"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 text-black rounded-2xl shadow-md"
              style={{
                backgroundColor: '#E0E0E0',
                height: '80px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 text-white rounded-2xl shadow-md"
              style={{
                backgroundColor: '#2196F3',
                height: '80px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
