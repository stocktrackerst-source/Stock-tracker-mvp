import { X } from "lucide-react";

interface DeleteConfirmationDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({ onConfirm, onCancel }: DeleteConfirmationDialogProps) {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl relative"
        style={{
          width: '700px',
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
        <h2 className="text-black mb-4 font-bold text-center">
          Delete Record
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-10">
          Are you sure you want to delete this entry? This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
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
            onClick={onConfirm}
            className="flex-1 text-white rounded-2xl shadow-md"
            style={{
              backgroundColor: '#E53935',
              height: '80px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
