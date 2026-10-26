import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, Check } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/courierData';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: 'privacy' | 'terms';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#E3DBD0] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#E8E2D8] flex items-center justify-between bg-[#F4EFE6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D8] flex items-center justify-center text-[#121316]">
              {activeTab === 'privacy' ? (
                <Lock className="w-5 h-5 text-[#84CC16]" />
              ) : (
                <FileText className="w-5 h-5 text-[#84CC16]" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#121316]">
                {activeTab === 'privacy' ? 'Privacy & Data Protection Policy' : 'Terms & Conditions of Carriage'}
              </h3>
              <p className="text-xs text-[#5C616D] font-mono">
                {COMPANY_DETAILS.name} &bull; Operational Hub OL8, Greater Manchester
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#7A808C] hover:text-[#121316] rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#E8E2D8] bg-[#F4EFE6]/60 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-[#84CC16] text-[#121316]'
                : 'border-transparent text-[#7A808C] hover:text-[#121316]'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeTab === 'terms'
                ? 'border-[#84CC16] text-[#121316]'
                : 'border-transparent text-[#7A808C] hover:text-[#121316]'
            }`}
          >
            Terms & Conditions of Carriage
          </button>
        </div>

        {/* Body Text */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-[#4A4E57] leading-relaxed">
          {activeTab === 'privacy' ? (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-bold text-[#121316] mb-1">1. Data Controller Information</h4>
                <p>
                  This Privacy Policy outlines how <strong>MFT Courier</strong> (“we”, “us”, or “our”) collects, uses, and safeguards personal and commercial data collected during our road courier and logistics operations in the United Kingdom. MFT Courier operates from Greater Manchester (OL8) and is the Data Controller responsible for your personal data under the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#121316] mb-1">2. Information We Collect</h4>
                <p>To arrange and execute dedicated carriage services, we collect:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 pl-2 text-xs">
                  <li><strong>Contact Information:</strong> Customer name, business entity name, phone numbers, email addresses.</li>
                  <li><strong>Transit & Consignment Data:</strong> Collection addresses, recipient addresses, contact names, delivery notes, and special site access instructions.</li>
                  <li><strong>Proof of Delivery (POD):</strong> Signatures, timestamps, and recipient confirmation upon goods handover.</li>
                  <li><strong>Billing & Transaction Details:</strong> Invoicing addresses, VAT details, and bank transfer transaction histories.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#121316] mb-1">3. Lawful Basis for Processing</h4>
                <p>
                  We process data primarily on the basis of <strong>contractual necessity</strong> (to fulfill the courier carriage agreement requested by you), <strong>legal obligation</strong> (retaining accounting and tax records under UK HMRC regulations), and <strong>legitimate interests</strong> (communicating operational dispatch updates and maintaining road freight records).
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#121316] mb-1">4. Direct Communications & WhatsApp</h4>
                <p>
                  When you communicate with our dispatch desk via WhatsApp (+44 7501 419198) or direct telephone (07501419198), message contents and attached route specifications are used strictly for vehicle dispatch and operational coordination. We do not sell or rent client data to marketing third parties.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#121316] mb-1">5. Data Retention & Your Rights</h4>
                <p>
                  Operational delivery documentation is retained for 12 months, and commercial financial records are retained for 6 years in accordance with statutory UK requirements. You retain the right to request access, correction, or deletion of personal data by contacting us at <strong>info@mftcourier.co.uk</strong>.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-bold text-[#121316] mb-1">1. General Terms of Carriage</h4>
                <p>
                  All carriage, storage, and courier services performed by <strong>MFT Courier</strong> are undertaken subject to these Terms & Conditions. By requesting a quotation or dispatching a vehicle with MFT Courier, the Customer acknowledges and agrees to be bound by these provisions.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#121316] mb-1">2. Quotation, Booking & Route Execution</h4>
                <p>
                  Quotations provided via WhatsApp, phone (07501419198), or email are based on road distances, vehicle payload requirements, and immediate availability. MFT Courier operates direct point-to-point dedicated transit without intermediate co-loading. The Customer is responsible for ensuring accuracy of collection and delivery postcodes and contact details.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#121316] mb-1">3. Customer Obligations & Packaging</h4>
                <p>
                  The Customer warrants that all goods presented for carriage are adequately packaged, crated, or palletized to withstand normal road transit vibrations. Any special lifting requirements (such as tail-lift hydraulic loading) must be disclosed prior to vehicle dispatch. Hazardous or prohibited goods (including ADR Class 1 explosives, illegal contraband, and uncontained toxic chemicals) will be refused.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#121316] mb-1">4. Waiting Time & Demurrage</h4>
                <p>
                  A standard grace period of 30 minutes for loading and 30 minutes for unloading is included with each dedicated booking. Excess loading or unloading delays caused by site congestion or unavailable receiving staff may incur demurrage at standard commercial hourly rates.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#121316] mb-1">5. Transit Liability & Claims</h4>
                <p>
                  Goods in transit are covered up to the limits specified in the commercial booking confirmation. Any damage or discrepancy must be noted upon the proof of delivery (POD) at the time of handover and notified to MFT Courier in writing at <strong>info@mftcourier.co.uk</strong> within 7 business days of delivery.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#121316] mb-1">6. Governing Law</h4>
                <p>
                  These Terms and Conditions and any dispute arising from our carriage services shall be governed by and construed in accordance with the laws of England and Wales.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-[#E8E2D8] bg-[#F4EFE6] flex items-center justify-between">
          <div className="text-xs text-[#5C616D] font-mono">
            Direct Inquiries: <a href="mailto:info@mftcourier.co.uk" className="text-[#121316] underline">info@mftcourier.co.uk</a>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#121316] rounded-xl hover:bg-[#23252A] transition-colors cursor-pointer"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
