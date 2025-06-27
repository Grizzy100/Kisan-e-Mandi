import { useState } from "react";
import RaiseTicketForm from "./RaiseTicketForm";

const HelpAndSupport = () => {
  const [showForm, setShowForm] = useState(false);

  return showForm ? (
    <RaiseTicketForm />
  ) : (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="hover:bg-green-50 cursor-pointer p-6 rounded shadow" onClick={() => alert("Calling support...")}>
        <h3 className="text-xl font-bold text-green-700">Call Us</h3>
        <p>📞 +91 98765 43210</p>
      </div>

      <div
        className="hover:bg-green-50 cursor-pointer p-6 rounded shadow"
        onClick={() => setShowForm(true)}
      >
        <h3 className="text-xl font-bold text-green-700">Raise a Ticket</h3>
        <p>Click to submit a support request</p>
      </div>
    </div>
  );
};

export default HelpAndSupport;
