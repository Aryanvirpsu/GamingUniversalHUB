// src/components/sidebar/ProfileTrigger.jsx
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";  // or ProfilePopup.jsx if you kept the name

export default function ProfileTrigger({ profile, setProfile, collapsed }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex w-full items-center gap-4 rounded-3xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-5 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-3xl shadow-lg">
          Gamer
        </div>
        {!collapsed && (
          <div className="text-left">
            <div className="font-bold text-white">{profile.username}</div>
            <div className="text-sm text-purple-300">Level {profile.level}</div>
          </div>
        )}
      </button>

      {isModalOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsModalOpen(false)}
          onSave={(updated) => {
            setProfile(updated);
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}