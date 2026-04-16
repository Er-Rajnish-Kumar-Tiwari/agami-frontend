import React, { useState } from "react";
import { saveGame } from "../Api/api";
import toast, { Toaster } from "react-hot-toast";

import { FaHandRock, FaHandPaper, FaHandScissors } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoTrophyOutline } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const choices = ["stone", "paper", "scissors"];

const icons = {
  stone: <FaHandRock size={32} />,
  paper: <FaHandPaper size={32} />,
  scissors: <FaHandScissors size={32} />,
};

function getWinner(p1, p2) {
  if (p1 === p2) return "Tie";
  if (
    (p1 === "stone" && p2 === "scissors") ||
    (p1 === "scissors" && p2 === "paper") ||
    (p1 === "paper" && p2 === "stone")
  ) return "Player 1";
  return "Player 2";
}

export default function Game() {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [started, setStarted] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [showHistory, setShowHistory] = useState(false);

  const playRound = (choice) => {
    if (rounds.length === 6) return;

    const p2Choice = choices[Math.floor(Math.random() * 3)];
    const winner = getWinner(choice, p2Choice);

    if (winner === "Player 1") setScore(s => ({ ...s, p1: s.p1 + 1 }));
    if (winner === "Player 2") setScore(s => ({ ...s, p2: s.p2 + 1 }));

    setRounds([...rounds, { p1Choice: choice, p2Choice, winner }]);

    toast.success(`Round ${rounds.length + 1}: ${winner}`);
  };

  const finishGame = async () => {
    let finalWinner = "Tie";
    if (score.p1 > score.p2) finalWinner = p1;
    else if (score.p2 > score.p1) finalWinner = p2;

    await saveGame({
      player1: p1,
      player2: p2,
      rounds,
      finalWinner,
    });

    toast.success("Game Saved Successfully 🎉");

    setTimeout(() => window.location.reload(), 1500);
  };

  const navigate=useNavigate();

  // START SCREEN
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-indigo-900">
        <Toaster />
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
          <h1 className="text-3xl text-white font-bold text-center mb-6">
             Start Game
          </h1>

          <div className="flex items-center bg-white/20 rounded-lg px-3 mb-4">
            <FiUser className="text-white" />
            <input
              placeholder="Player 1"
              className="w-full p-3 bg-transparent text-white outline-none"
              onChange={(e) => setP1(e.target.value)}
            />
          </div>

          <div className="flex items-center bg-white/20 rounded-lg px-3 mb-6">
            <FiUser className="text-white" />
            <input
              placeholder="Player 2"
              className="w-full p-3 bg-transparent text-white outline-none"
              onChange={(e) => setP2(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              if (!p1 || !p2) return toast.error("Enter player names");
              setStarted(true);
            }}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg hover:scale-105 transition"
          >
            Start Game 
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <Toaster />
      <div className="max-w-5xl mx-auto text-white">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <IoTrophyOutline /> Battle Arena
          </h1>

          <button
            onClick={() => navigate("/history")}
            className="flex items-center gap-1 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20"
          >
            <MdHistory /> History
          </button>
        </div>

        {/* SCORE */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 p-5 rounded-xl text-center backdrop-blur">
            <h2>{p1}</h2>
            <p className="text-3xl font-bold text-green-400">{score.p1}</p>
          </div>
          <div className="bg-white/10 p-5 rounded-xl text-center backdrop-blur">
            <h2>{p2}</h2>
            <p className="text-3xl font-bold text-blue-400">{score.p2}</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-center gap-6 flex-wrap mb-6">
          {choices.map((c) => (
            <button
              key={c}
              onClick={() => playRound(c)}
              className="bg-white/10 p-6 rounded-xl hover:scale-110 transition transform backdrop-blur border border-white/20"
            >
              {icons[c]}
              <p className="capitalize mt-2">{c}</p>
            </button>
          ))}
        </div>

        {/* ROUNDS */}
        <div className="bg-white/10 p-4 rounded-xl backdrop-blur">
          {rounds.map((r, i) => (
            <p key={i} className="border-b border-white/10 py-2">
              🔹 Round {i + 1}: {r.p1Choice} vs {r.p2Choice} → 
              <span className="ml-2 text-yellow-400">{r.winner}</span>
            </p>
          ))}
        </div>

        {/* FINISH */}
        {rounds.length === 6 && (
          <button
            onClick={finishGame}
            className="mt-6 w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-bold"
          >
            Finish Game 
          </button>
        )}

        {/* HISTORY MODAL */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl mb-4">Game History</h2>

              {rounds.length === 0 ? (
                <p>No history yet</p>
              ) : (
                rounds.map((r, i) => (
                  <p key={i}>
                    {r.p1Choice} vs {r.p2Choice} → {r.winner}
                  </p>
                ))
              )}

              <button
                onClick={() => setShowHistory(false)}
                className="mt-4 bg-red-500 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}