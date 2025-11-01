import { useState } from "react";
import { X } from "lucide-react";

interface SellModalProps {
  onSelect: (option: "book" | "dispatch") => void;
  onClose: () => void;
}

export function SellModal({ onSelect, onClose }: SellModalProps) {
  const [selected, setSelected] = useState<"book" | "dispatch" | null>(null);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl relative w-full max-w-lg"
        style={{
          maxHeight: '90vh',
          padding: '40px 30px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-black mb-6 text-center font-bold text-xl sm:text-2xl">
          What would you like to record?
        </h2>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {/* Book Sale */}
          <button
            onClick={() => setSelected("book")}
            className="w-full bg-white border-4 rounded-2xl flex items-center p-4 transition-all hover:shadow-lg"
            style={{
              borderColor: selected === "book" ? '#E53935' : '#E0E0E0',
              minHeight: '70px',
              transition: 'all 250ms ease',
            }}
          >
            <div className="flex items-center">
              <div
                className="rounded-full border-4 mr-3"
                style={{
                  width: '24px',
                  height: '24px',
                  borderColor: selected === "book" ? '#E53935' : '#E0E0E0',
                  backgroundColor: selected === "book" ? '#E53935' : 'transparent',
                }}
              />
              <span className="text-black text-sm sm:text-base">Book Sale</span>
            </div>
          </button>

          {/* Direct Dispatch */}
          <button
            onClick={() => setSelected("dispatch")}
            className="w-full bg-white border-4 rounded-2xl flex items-center p-4 transition-all hover:shadow-lg"
            style={{
              borderColor: selected === "dispatch" ? '#E53935' : '#E0E0E0',
              minHeight: '70px',
              transition: 'all 250ms ease',
            }}
          >
            <div className="flex items-center">
              <div
                className="rounded-full border-4 mr-3"
                style={{
                  width: '24px',
                  height: '24px',
                  borderColor: selected === "dispatch" ? '#E53935' : '#E0E0E0',
                  backgroundColor: selected === "dispatch" ? '#E53935' : 'transparent',
                }}
              />
              <span className="text-black text-sm sm:text-base">Direct Dispatch</span>
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <button
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
          className="w-full text-white rounded-2xl shadow-lg transition-opacity disabled:opacity-40"
          style={{
            backgroundColor: '#E53935',
            height: '60px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Continue
        </button>

        {/* Back Link */}
        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-500 text-center hover:text-black transition-colors text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
