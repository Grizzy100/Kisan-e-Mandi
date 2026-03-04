import { useState } from "react";
import RaiseTicketForm from "./RaiseTicketForm";

const HelpAndSupport = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Crop Verification</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enlist your crop securely for buyers.
            <span className="ml-2">📞 +91 98765 43210</span>
          </p>
        </div>

        {/* Content */}
        <RaiseTicketForm
          onTicketRaised={() => {
            setRefreshKey((k) => k + 1);
          }}
        />
      </div>
    </div>
  );
};

export default HelpAndSupport;
