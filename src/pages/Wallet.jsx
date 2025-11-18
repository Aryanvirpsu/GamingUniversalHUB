export default function Wallet() {
  const transactions = [
    { game: "Cyberpunk 2077", amount: -59.99, date: "2 days ago", type: "purchase" },
    { game: "Steam Wallet", amount: 100.0, date: "5 days ago", type: "topup" },
    { game: "Elden Ring DLC", amount: -39.99, date: "1 week ago", type: "purchase" },
    { game: "Refund: Spider-Man", amount: 49.99, date: "2 weeks ago", type: "refund" },
  ];

  const iconBg = (type) =>
    type === "purchase"
      ? "bg-gradient-to-tr from-red-500 to-red-600"
      : type === "topup"
      ? "bg-gradient-to-tr from-emerald-500 to-emerald-600"
      : "bg-gradient-to-tr from-blue-500 to-blue-600";

  const amountColor = (amount) =>
    amount > 0 ? "text-emerald-400" : "text-red-400";

  const icon = (type) =>
    type === "purchase" ? "🛒" : type === "topup" ? "💳" : "↩️";

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Header */}
      <h1
        className="
          text-[clamp(1.75rem,5vw,2.5rem)] font-extrabold
          bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent
          mb-2
        "
      >
        💰 Wallet
      </h1>

      <p className="text-[#888] text-[clamp(0.9rem,2vw,1.1rem)] mb-8">
        Manage your funds and transactions
      </p>

      {/* Balance Cards */}
      <div
        className="
          grid gap-6 mb-12
          grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))]
        "
      >
        {/* Main Balance */}
        <div
          className="
            relative p-8 rounded-2xl shadow-[0_8px_32px_rgba(168,85,247,0.3)]
            bg-gradient-to-tr from-purple-500 to-pink-500 overflow-hidden
          "
        >
          <div
            className="
              absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10
            "
          />
          <div className="relative z-10">
            <p className="text-white/80 text-sm mb-2 font-medium">
              Available Balance
            </p>

            <h2
              className="
                text-white font-extrabold
                text-[clamp(2rem,5vw,2.5rem)] mb-4
              "
            >
              $234.58
            </h2>

            <button
              className="
                bg-white/20 px-6 py-3 rounded-lg text-white text-sm font-semibold
                backdrop-blur-md transition-all duration-300
                hover:bg-white/30 hover:-translate-y-1
              "
            >
              + Add Funds
            </button>
          </div>
        </div>

        {/* Pending */}
        <div
          className="
            bg-gradient-to-tr from-[#1a1a2e]/80 to-[#0f0f1e]/80
            p-8 rounded-2xl border border-white/5
          "
        >
          <p className="text-[#888] text-sm mb-2">Pending Transactions</p>
          <h3
            className="
              text-amber-400 font-bold 
              text-[clamp(1.75rem,4vw,2rem)] mb-2
            "
          >
            $59.99
          </h3>
          <p className="text-[#666] text-xs">Processing...</p>
        </div>

        {/* Rewards */}
        <div
          className="
            bg-gradient-to-tr from-[#1a1a2e]/80 to-[#0f0f1e]/80
            p-8 rounded-2xl border border-white/5
          "
        >
          <p className="text-[#888] text-sm mb-2">Rewards Points</p>
          <h3
            className="
              text-emerald-400 font-bold 
              text-[clamp(1.75rem,4vw,2rem)] mb-2
            "
          >
            1,247
          </h3>
          <p className="text-[#666] text-xs">≈ $12.47 value</p>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2
          className="
            text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-white
            mb-6
          "
        >
          Recent Transactions
        </h2>

        <div
          className="
            bg-gradient-to-tr from-[#1a1a2e]/60 to-[#0f0f1e]/60
            rounded-xl border border-white/5 overflow-hidden
          "
        >
          {transactions.map((tx, idx) => (
            <div
              key={idx}
              className="
                px-6 py-5 flex justify-between items-center flex-wrap gap-4
                cursor-pointer transition-colors
                hover:bg-purple-500/10
                border-b border-white/5 last:border-none
              "
            >
              <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                {/* Transaction Icon */}
                <div
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    text-2xl flex-shrink-0
                    ${iconBg(tx.type)}
                  `}
                >
                  {icon(tx.type)}
                </div>

                {/* Text */}
                <div>
                  <p
                    className="
                      text-white font-semibold
                      text-[clamp(0.95rem,2vw,1rem)] mb-1
                    "
                  >
                    {tx.game}
                  </p>
                  <p className="text-[#666] text-[clamp(0.75rem,1.8vw,0.8rem)]">
                    {tx.date}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div
                className={`
                  font-bold text-[clamp(1rem,2.5vw,1.25rem)]
                  ${amountColor(tx.amount)}
                `}
              >
                {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
