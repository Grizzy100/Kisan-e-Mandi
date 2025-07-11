// import React, { useState } from "react";

// const RaiseTicketForm = () => {
//   const [formData, setFormData] = useState({
//     cropType: "",
//     cropName: "",
//     date: "",
//     price: "",
//     description: "",
//     image: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files ? files[0] : value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Ticket Submitted:", formData);
//     // Backend call here
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-10 px-4">
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-green-100">
//         <h2 className="text-3xl font-extrabold text-green-700 mb-6 text-center">
//           Raise a Support Ticket
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
          
//           {/* Upload Image */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
//             <label
//               htmlFor="image-upload"
//               className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer text-gray-500 hover:border-green-400 hover:bg-green-50 transition"
//             >
//               {formData.image ? (
//                 <span className="text-green-700 font-medium">
//                   ✅ {formData.image.name}
//                 </span>
//               ) : (
//                 <>
//                   <svg
//                     className="w-10 h-10 mb-2 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M7 16V4m0 0l-4 4m4-4l4 4M17 16v-4m0 0l-4 4m4-4l4 4"
//                     />
//                   </svg>
//                   <span className="text-sm">Click or drag to upload image</span>
//                 </>
//               )}
//               <input
//                 id="image-upload"
//                 type="file"
//                 name="image"
//                 accept="image/*"
//                 onChange={handleChange}
//                 className="hidden"
//               />
//             </label>
//           </div>

//           {/* Crop Type */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
//             <select
//               name="cropType"
//               value={formData.cropType}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
//             >
//               <option value="">Select Type</option>
//               <option value="fruit">Fruit</option>
//               <option value="vegetable">Vegetable</option>
//               <option value="grain">Grain</option>
//               <option value="other">Other</option>
//             </select>
//           </div>

//           {/* Crop Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name</label>
//             <input
//               type="text"
//               name="cropName"
//               value={formData.cropName}
//               onChange={handleChange}
//               placeholder="e.g. Mango, Potato, Wheat"
//               className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//           </div>

//           {/* Submission Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Submission Date</label>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//           </div>

//           {/* Price */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Negotiated Price (₹)</label>
//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               placeholder="Expected price for your crop"
//               className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Provide any additional details..."
//               rows={4}
//               className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//           </div>

//           {/* Submit */}
//           <div className="pt-2">
//             <button
//               type="submit"
//               className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all"
//             >
//               Submit Ticket
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RaiseTicketForm;


import React, { useState } from "react";
import { toast } from "react-toastify";
import { createSupportTicket } from "../../api/supportAPI.js";
import axios from "axios";
import { getAuth } from "firebase/auth"; // ✅ Added this

const RaiseTicketForm = () => {
  const [formData, setFormData] = useState({
    cropType: "",
    cropName: "",
    date: "",
    price: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Cloudinary ENV:",
        import.meta.env.VITE_CLOUDINARY_CLOUDNAME,
        import.meta.env.VITE_CLOUDINARY_PRESET
      );

      let imageUrl = "";

      if (formData.image) {
        const imageData = new FormData();
        imageData.append("file", formData.image);
        imageData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUDNAME}/image/upload`,
          imageData
        );

        imageUrl = res.data.secure_url;
      }

      // ✅ Get current user from Firebase Auth
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      // ✅ Extract email from user
      const email = user.email;

      // ✅ Add email to payload
      const payload = {
        email,
        cropType: formData.cropType,
        cropName: formData.cropName,
        date: formData.date,
        negotiatedPrice: formData.price,
        description: formData.description,
        imageUrl: imageUrl || "",
        location: "India",
      };

      await createSupportTicket(payload);
      toast.success("Support ticket submitted and email sent!");

      setFormData({
        cropType: "",
        cropName: "",
        date: "",
        price: "",
        description: "",
        image: null,
      });
    } catch (error) {
      console.error("Ticket error:", error);
      toast.error("Something went wrong while submitting the ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-green-100">
        <h2 className="text-3xl font-extrabold text-green-700 mb-6 text-center">
          Raise a Support Ticket
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer text-gray-500 hover:border-green-400 hover:bg-green-50 transition"
            >
              {formData.image ? (
                <span className="text-green-700 font-medium">
                  ✅ {formData.image.name}
                </span>
              ) : (
                <>
                  <svg
                    className="w-10 h-10 mb-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0l-4 4m4-4l4 4M17 16v-4m0 0l-4 4m4-4l4 4"
                    />
                  </svg>
                  <span className="text-sm">Click or drag to upload image</span>
                </>
              )}
              <input
                id="image-upload"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Other Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crop Type
            </label>
            <select
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Type</option>
              <option value="fruit">Fruit</option>
              <option value="vegetable">Vegetable</option>
              <option value="grain">Grain</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crop Name
            </label>
            <input
              type="text"
              name="cropName"
              value={formData.cropName}
              onChange={handleChange}
              placeholder="e.g. Mango, Potato, Wheat"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submission Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Negotiated Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Expected price for your crop"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide any additional details..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all"
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicketForm;
