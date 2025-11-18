import { useState } from "react";

export default function Settings() {
  const [compact, setCompact] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="mx-auto max-w-4xl w-full space-y-8 text-black dark:text-white">

      {/* Header */}
      <header>
        <h1 className="
          text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold
          bg-gradient-to-tr from-purple-700 to-purple-400 
          dark:from-white dark:to-purple-400 
          bg-clip-text text-transparent
        ">
          ⚙️ Settings
        </h1>

        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Customize your gaming experience
        </p>
      </header>

      {/* Appearance */}
      <section
        className="
          p-5 rounded-2xl border
          bg-white/40 dark:bg-slate-900/70
          border-black/10 dark:border-white/5
          backdrop-blur-md
          transition-colors
        "
      >
        <h2 className="text-black dark:text-white text-lg font-semibold mb-4">
          🎨 Appearance
        </h2>

        <div
          className="
            flex justify-between items-center 
            bg-black/10 dark:bg-purple-500/5 
            p-3 rounded-xl
          "
        >
          <span className="text-slate-700 dark:text-slate-300 text-sm">
            Compact Mode
          </span>
          <input
            type="checkbox"
            checked={compact}
            onChange={() => setCompact(!compact)}
          />
        </div>
      </section>

      {/* Notifications */}
      <section
        className="
          p-5 rounded-2xl border
          bg-white/40 dark:bg-slate-900/70
          border-black/10 dark:border-white/5
          backdrop-blur-md
          transition-colors
        "
      >
        <h2 className="text-black dark:text-white text-lg font-semibold mb-4">
          🔔 Notifications
        </h2>

        <div
          className="
            flex justify-between items-center 
            bg-black/10 dark:bg-purple-500/5 
            p-3 rounded-xl
          "
        >
          <span className="text-slate-700 dark:text-slate-300 text-sm">
            Enable Alerts
          </span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </div>
      </section>
    </div>
  );
}
