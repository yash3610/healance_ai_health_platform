import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Stethoscope, ShieldCheck } from 'lucide-react';

const PartDetailCard = ({ partName, partInfo, onClose }) => {
  return (
    <AnimatePresence>
      {partName && partInfo && (
        <>
          {/* Mobile: bottom sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed sm:hidden inset-x-0 bottom-0 z-50
                       bg-white rounded-t-2xl shadow-2xl border-t border-slate-200
                       max-h-[70vh] flex flex-col"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>
            <CardHeader partName={partName} onClose={onClose} />
            <CardContent partInfo={partInfo} />
          </motion.div>

          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed sm:hidden inset-0 z-40 bg-black/20"
            onClick={onClose}
          />

          {/* Desktop: side card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="absolute hidden sm:flex top-3 right-3 z-20
                       w-64 lg:w-72 max-h-[calc(100%-5rem)]
                       bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60
                       overflow-hidden flex-col"
          >
            <CardHeader partName={partName} onClose={onClose} />
            <CardContent partInfo={partInfo} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CardHeader = ({ partName, onClose }) => (
  <div className="bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 flex items-center justify-between flex-shrink-0">
    <h3 className="text-white font-bold text-sm sm:text-base">{partName}</h3>
    <button
      onClick={onClose}
      className="p-1 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
    >
      <X size={16} />
    </button>
  </div>
);

const CardContent = ({ partInfo }) => (
  <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3 overflow-y-auto scrollbar-hide flex-1 text-xs">
    <p className="text-slate-600 leading-relaxed">{partInfo.function}</p>

    <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
      <div className="bg-red-50 p-2.5 sm:p-3 rounded-xl">
        <div className="flex items-center gap-1.5 mb-1.5 text-red-600 font-bold text-[11px]">
          <AlertCircle size={12} /> Diseases
        </div>
        <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px]">
          {partInfo.diseases.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      </div>

      <div className="bg-blue-50 p-2.5 sm:p-3 rounded-xl">
        <div className="flex items-center gap-1.5 mb-1.5 text-blue-600 font-bold text-[11px]">
          <Stethoscope size={12} /> Tests
        </div>
        <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px]">
          {partInfo.tests.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>
    </div>

    <div className="bg-green-50 p-2.5 sm:p-3 rounded-xl">
      <div className="flex items-center gap-1.5 mb-1.5 text-green-700 font-bold text-[11px]">
        <ShieldCheck size={12} /> Prevention
      </div>
      <div className="flex flex-wrap gap-1">
        {partInfo.prevention.map((p, i) => (
          <span key={i} className="px-2 py-0.5 bg-white rounded-full text-[10px] font-medium text-green-700 border border-green-100">
            {p}
          </span>
        ))}
      </div>
    </div>

    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
      <span className="text-slate-500 font-medium text-[11px]">Metrics</span>
      <span className="font-bold text-slate-800 text-[11px]">{partInfo.metrics}</span>
    </div>
  </div>
);

export default PartDetailCard;
