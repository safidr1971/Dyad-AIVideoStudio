import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, collection, query, where, getDocs, orderBy } from '../lib/firebase';
import { DashboardLayout } from '../components/DashboardLayout';
import { CreditCard, Zap, Plus, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CreditsBilling: React.FC = () => {
  const { user, userProfile, addCredits } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'creditTransactions'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const handlePurchase = async (amount: number, name: string, costUSD: number) => {
    if (!confirm(`Confirm purchase of ${amount} credits for $${costUSD}? (Live Firebase transaction)`)) return;
    
    await addCredits(amount, `Purchased ${amount} Credits ($${costUSD})`);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    fetchTransactions();
    alert(`Successfully added ${amount} credits to your Firestore account!`);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-400" />
            <span>Credits & Billing</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your credit balance and transaction history in Firestore.</p>
        </div>
      </div>

      {/* Current Balance Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-pink-900/20 to-[#121217] border border-white/10 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Current Verified Balance</span>
          <div className="text-4xl md:text-5xl font-black text-white mt-1 flex items-center gap-3">
            <Zap className="w-8 h-8 text-purple-400 fill-purple-400" />
            <span>{userProfile?.credits || 0} Credits</span>
          </div>
          <p className="text-xs text-zinc-400 mt-2">Active Plan: <strong className="text-white capitalize">{userProfile?.plan || 'Creator'}</strong> • Project ID: ai-video-studio-fac95</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secured by Firestore</span>
          </div>
        </div>
      </div>

      {/* Credit Refill Packs */}
      <h2 className="text-lg font-bold text-white mb-6">Refill Credit Packs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Starter Pack</div>
            <div className="text-3xl font-black text-white mb-2">250 Credits</div>
            <p className="text-sm text-zinc-400 mb-6">$19 one-time payment</p>
          </div>
          <button 
            onClick={() => handlePurchase(250, 'Starter Pack (250 Credits)', 19)}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
          >
            Buy 250 Credits
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-900/40 via-purple-900/10 to-transparent border-2 border-purple-500 flex flex-col justify-between">
          <div>
            <div className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-2">Pro Booster Pack</div>
            <div className="text-3xl font-black text-white mb-2">1,000 Credits</div>
            <p className="text-sm text-zinc-300 mb-6">$49 one-time payment (Best Value)</p>
          </div>
          <button 
            onClick={() => handlePurchase(1000, 'Pro Booster Pack (1000 Credits)', 49)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:opacity-90 transition-all"
          >
            Buy 1,000 Credits
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="text-sm font-semibold text-pink-400 uppercase tracking-wider mb-2">Mega Agency Pack</div>
            <div className="text-3xl font-black text-white mb-2">3,500 Credits</div>
            <p className="text-sm text-zinc-400 mb-6">$129 one-time payment</p>
          </div>
          <button 
            onClick={() => handlePurchase(3500, 'Mega Agency Pack (3500 Credits)', 129)}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
          >
            Buy 3,500 Credits
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <h2 className="text-lg font-bold text-white mb-6">Credit Transaction History</h2>
      <div className="rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">No transactions recorded yet.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-6 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{tx.description}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Type: <span className="capitalize">{tx.type}</span></div>
                </div>
                <div className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-zinc-300'}`}>
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Credits
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
