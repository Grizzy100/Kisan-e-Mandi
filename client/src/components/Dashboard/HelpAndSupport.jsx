import { useState } from "react";
import RaiseTicketForm from "./RaiseTicketForm";
import { MdHelp } from "react-icons/md";

const HelpAndSupport = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 text-green-700 rounded-sm">
            <MdHelp className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Support & Enlistment</h1>
        </div>
        <p className="text-gray-500 text-sm max-w-lg">
          Need help with orders or want to enlist your crop for verification? 
          Raise a ticket and our team will get back to you shortly.
          <span className="block mt-1 font-semibold text-green-700">📞 Support: +91 98765 43210</span>
        </p>
      </div>

      {/* Content - Form is already a card */}
      <div className="flex justify-center">
        <RaiseTicketForm
          key={refreshKey}
          onTicketRaised={() => {
            setRefreshKey((k) => k + 1);
          }}
        />
      </div>
    </div>
  );
};

export default HelpAndSupport;
