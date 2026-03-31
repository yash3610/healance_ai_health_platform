import React from 'react';
import { Footprints, Coins, Gift, TrendingUp } from 'lucide-react';
import Button from '../../shared/ui/Button';

const WalkAndEarn = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Walk & Earn Rewards</h2>
          <p className="text-sm sm:text-base text-orange-100 mb-4 sm:mb-6">Convert your daily steps into Healance Coins and redeem exciting vouchers.</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="bg-white/20 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-3">
              <div className="bg-white p-2 rounded-full text-orange-500">
                <Coins size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs text-orange-100">Total Balance</p>
                <p className="text-xl sm:text-2xl font-bold">450 Coins</p>
              </div>
            </div>
            <Button variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50 border-none w-full sm:w-auto">
              Redeem Now
            </Button>
          </div>
        </div>
        <Footprints className="absolute -bottom-10 -right-10 w-40 h-40 sm:w-64 sm:h-64 text-white/10 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm sm:text-base">Today's Progress</h3>
          <div className="flex items-center justify-center py-4 sm:py-6">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#f97316" strokeWidth="10" strokeDasharray="283" strokeDashoffset="100" strokeLinecap="round" className="transform -rotate-90 origin-center" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900">6,240</span>
                <span className="text-xs text-slate-500">steps</span>
              </div>
            </div>
          </div>
          <p className="text-center text-xs sm:text-sm text-slate-600">3,760 steps to reach daily goal</p>
        </div>

        <div className="md:col-span-2 bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm sm:text-base">Rewards Store</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-200 p-4 rounded-xl flex gap-4 items-center hover:border-orange-200 transition-colors cursor-pointer">
              <div className="bg-green-100 p-3 rounded-lg text-green-600">
                <Gift size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Amazon Voucher</h4>
                <p className="text-xs text-slate-500">Worth $10</p>
                <p className="text-sm font-bold text-orange-500 mt-1">1000 Coins</p>
              </div>
            </div>
            <div className="border border-slate-200 p-4 rounded-xl flex gap-4 items-center hover:border-orange-200 transition-colors cursor-pointer">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <Gift size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Gym Membership</h4>
                <p className="text-xs text-slate-500">1 Month Free</p>
                <p className="text-sm font-bold text-orange-500 mt-1">5000 Coins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkAndEarn;
