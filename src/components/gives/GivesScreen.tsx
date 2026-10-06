import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Give, ExchangeAmount } from '../../types';
import { Plus, Check, Edit2, Pause, Play, Trash2, ShieldCheck, X } from 'lucide-react';

export const GivesScreen: React.FC = () => {
  const { currentBusiness, gives, createGive, updateGive } = useApp();
  const myGives = gives.filter((g) => g.businessId === currentBusiness.id);

  const [isCreating, setIsCreating] = useState(false);
  const [editingGiveId, setEditingGiveId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(`${currentBusiness.name} Business Credit`);
  const [category, setCategory] = useState(currentBusiness.category);
  const [description, setDescription] = useState(
    `Valid toward eligible goods, dining, or services at ${currentBusiness.name}. Single-use credit.`
  );
  const [selectedAmounts, setSelectedAmounts] = useState<ExchangeAmount[]>([50, 100, 200, 300, 500]);
  const [restrictions, setRestrictions] = useState('Not redeemable for cash. Single-use certificate.');
  const [expirationPolicy, setExpirationPolicy] = useState('90 days after issuance.');

  const toggleAmount = (amt: ExchangeAmount) => {
    if (selectedAmounts.includes(amt)) {
      if (selectedAmounts.length === 1) return; // keep at least 1
      setSelectedAmounts(selectedAmounts.filter((a) => a !== amt));
    } else {
      setSelectedAmounts([...selectedAmounts, amt].sort((a, b) => a - b));
    }
  };

  const handleSave = () => {
    if (editingGiveId) {
      updateGive(editingGiveId, {
        title,
        category,
        description,
        amounts: selectedAmounts,
        restrictions,
        expirationPolicy,
      });
      setEditingGiveId(null);
    } else {
      createGive({
        title,
        category,
        description,
        amounts: selectedAmounts,
        restrictions,
        expirationPolicy,
        active: true,
      });
      setIsCreating(false);
    }
  };

  const handleStartEdit = (give: Give) => {
    setEditingGiveId(give.id);
    setTitle(give.title);
    setCategory(give.category);
    setDescription(give.description);
    setSelectedAmounts(give.amounts);
    setRestrictions(give.restrictions);
    setExpirationPolicy(give.expirationPolicy);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Gives
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Define what {currentBusiness.name} is willing to exchange for business credits.
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreating(true);
            setEditingGiveId(null);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Create New Give
        </button>
      </div>

      {/* List of active Gives */}
      <div className="space-y-4">
        {myGives.map((give) => (
          <div
            key={give.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{give.title}</h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      give.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${give.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {give.active ? 'ACTIVE' : 'PAUSED'}
                  </span>
                </div>
                <p className="text-xs text-blue-600 font-semibold mt-0.5">{give.category}</p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateGive(give.id, { active: !give.active })}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  {give.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {give.active ? 'Pause Give' : 'Resume'}
                </button>
                <button
                  onClick={() => handleStartEdit(give)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  Edit
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{give.description}</p>

            {/* Denominations */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Supported Exchange Amounts:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {give.amounts.map((amt) => (
                  <span
                    key={amt}
                    className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-extrabold text-blue-700 font-tabular"
                  >
                    ${amt}
                  </span>
                ))}
              </div>
            </div>

            {/* Terms metadata */}
            <div className="pt-2 text-xs text-slate-400 flex flex-wrap gap-4 border-t border-slate-100">
              <span>Policy: <strong className="text-slate-600">{give.expirationPolicy}</strong></span>
              <span>Restrictions: <strong className="text-slate-600">{give.restrictions}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {(isCreating || editingGiveId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingGiveId ? 'Edit Give' : 'Create New Give'}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingGiveId(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Give Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Available Denominations (Check all supported)
                </label>
                <div className="flex gap-2">
                  {([50, 100, 200, 300, 500] as ExchangeAmount[]).map((amt) => {
                    const checked = selectedAmounts.includes(amt);
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => toggleAmount(amt)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          checked
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        ${amt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Restrictions</label>
                <input
                  type="text"
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingGiveId(null);
                  }}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  {editingGiveId ? 'Update Give' : 'Publish Give'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
