// src/components/sidebar/EditProfileModal.jsx   (or keep as ProfilePopup.jsx if you want)
import { useState } from "react";
import { X } from "lucide-react";

export default function EditProfileModal({ profile, onClose, onSave }) {
  const [temp, setTemp] = useState(profile);

  const handleSave = () => {
    onSave(temp);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-[9999] w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-gray-950/90 to-black/90 p-8 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-3xl font-black text-transparent">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={28} />
          </button>
        </div>

        {/* Avatar */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-6xl shadow-2xl shadow-purple-500/50">
            Gamer
          </div>
          <button className="rounded-xl border border-purple-500/50 bg-purple-500/20 px-5 py-2 text-sm font-semibold text-purple-300 transition hover:border-purple-400 hover:bg-purple-500/30">
            Change Avatar
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-purple-300">Username</label>
            <input
              type="text"
              value={temp.username}
              onChange={(e) => setTemp({ ...temp, username: e.target.value })}
              className="w-full rounded-xl border border-purple-500/40 bg-white/5 px-5 py-4 text-white placeholder-gray-500 backdrop-blur transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-purple-300">Bio</label>
            <textarea
              rows={3}
              value={temp.bio}
              onChange={(e) => setTemp({ ...temp, bio: e.target.value })}
              className="w-full resize-none rounded-xl border border-purple-500/40 bg-white/5 px-5 py-4 text-white placeholder-gray-500 backdrop-blur transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="Tell the world who you are..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-purple-300">Level</label>
            <input
              type="number"
              value={temp.level}
              onChange={(e) => setTemp({ ...temp, level: Number(e.target.value) || 1 })}
              className="w-full rounded-xl border border-purple-500/40 bg-white/5 px-5 py-4 text-white backdrop-blur [appearance:textfield] focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-600 px-8 py-3 font-semibold text-gray-400 transition hover:border-gray-500 hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-3 font-bold text-white shadow-lg shadow-purple-500/40 transition-all hover:scale-105 hover:shadow-purple-500/60"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}