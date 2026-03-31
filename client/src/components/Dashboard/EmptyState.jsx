import React from "react";
import { motion } from "framer-motion";

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-sm border-2 border-dashed border-gray-100 text-center"
    >
      <div className="w-20 h-20 bg-gray-50 rounded-sm flex items-center justify-center mb-6">
        {Icon && <Icon className="w-10 h-10 text-gray-300" />}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 bg-green-600 text-white rounded-sm font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
