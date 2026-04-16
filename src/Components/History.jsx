import React, { useEffect, useState } from "react";
import { getGames } from "../Api/api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { IoArrowBack } from "react-icons/io5";
import { IoTrophyOutline } from "react-icons/io5";

export default function History() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await getGames();
      setGames(res.data);
    } catch (err) {
      toast.error("Failed to load history");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-8">
      <Toaster />

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <IoTrophyOutline /> Game History
          </h1>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition"
          >
            <IoArrowBack /> Back to Game
          </button>
        </div>

        {/* EMPTY STATE */}
        {games.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-gray-400 text-lg">No games played yet 😔</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {games.map((g, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition"
              >
                {/* PLAYERS */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">
                    {g.player1} vs {g.player2}
                  </h2>

                  <span className="text-sm text-gray-400">
                    #{i + 1}
                  </span>
                </div>

                {/* WINNER */}
                <div className="mb-2">
                  <span className="text-gray-400">Winner: </span>
                  <span className="text-green-400 font-bold">
                    {g.finalWinner}
                  </span>
                </div>

                {/* ROUNDS */}
                <div className="text-sm text-gray-300">
                  Total Rounds: {g.rounds?.length || 0}
                </div>

                {/* ROUND DETAILS */}
                <div className="mt-3 border-t border-white/10 pt-3 text-sm">
                  {g.rounds?.map((r, idx) => (
                    <p key={idx} className="text-gray-400">
                      🔹 {r.p1Choice} vs {r.p2Choice} →{" "}
                      <span className="text-yellow-400">
                        {r.winner}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}