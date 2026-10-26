import React from 'react';
import { ArrowLeft, MessageSquare, Home } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/courierData';

interface NotFoundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotFoundModal: React.FC<NotFoundModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FAF8F5] border border-[#E3DBD0] rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-10 text-center space-y-6">
        {/* Shipping Container 404 Visual from uploaded asset */}
        <div className="max-w-xs mx-auto -mt-4">
          <img
            src="/assets/aistudio/error_404_page_4467ba9b.png"
            alt="MFT Courier 404 Freight Container"
            className="w-full h-auto drop-shadow-xl"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono text-[#65A30D] uppercase font-bold tracking-wider">
            Consignment Route Not Found &bull; Error 404
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#121316]">
            This Cargo Bay Doesn't Exist
          </h3>
          <p className="text-xs sm:text-sm text-[#4A4E57] max-w-sm mx-auto leading-relaxed">
            The page or document you are looking for has been moved, rescheduled, or does not exist. Our dispatch desk remains active 24/7.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#121316] rounded-xl hover:bg-[#23252A] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Home className="w-4 h-4 text-[#84CC16]" />
            <span>Return to Homepage</span>
          </button>

          <a
            href={COMPANY_DETAILS.whatsappQuoteUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#121316] bg-[#F4EFE6] border border-[#E3DBD0] rounded-xl hover:bg-[#EAE4D7] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#84CC16]" />
            <span>Contact Dispatch Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
};
