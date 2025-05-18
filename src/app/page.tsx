"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const questions = [
    {
      question: "React",
      image: "/monster1.jpg",
    },
    {
      question: "TypeScript",
      image: "/monster2.jpg",
    },
    {
      question: "Next.js",
      image: "/monster3.jpg",
    },
    {
      question: "Tailwind CSS",
      image: "/monster4.jpg",
    },
    {
      question: "Node.js",
      image: "/monster5.jpg",
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setCurrentPosition(0);
    setIsComplete(false);
    setStartTime(Date.now());
    setEndTime(null);
  };

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    const handleKyeDown = async (e: KeyboardEvent) => {
      if (isComplete) return;

      const currentQuestion = questions[currentQuestionIndex];
      if (e.key.toLowerCase() === currentQuestion.question[currentPosition].toLowerCase()) {
        setCurrentPosition((prev) => prev + 1);
      }
      if (currentPosition === currentQuestion.question.length - 1) {
        if (currentQuestionIndex === questions.length - 1) {
          setIsComplete(true);
          setEndTime(Date.now());
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
          setCurrentPosition(0);
        }
      }
    };
    window.addEventListener("keydown", handleKyeDown);
    return () => window.removeEventListener("keydown", handleKyeDown);
  }, [currentQuestionIndex, currentPosition, isComplete]);

  const calculateScore = () => {
    if (!startTime || !endTime) return null;
    const timeInSeconds = (endTime - startTime) / 1000;
    return timeInSeconds.toFixed(2);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">
      {!isComplete ? (
        <div className="text-center w-full h-screen flex flex-col items-center justify-center relative">
          <Image
            src={questions[currentQuestionIndex].image}
            alt={questions[currentQuestionIndex].question}
            fill
            style={{ objectFit: "cover" }}
            className="brightness-50"
          />
          <div className="relative z-10 text-6xl font-bold">
            {questions[currentQuestionIndex].question.split("").map((char, index) => (
              <span
                key={index}
                style={{
                  color: index < currentPosition ? "#FF0000" : "white",
                }}
              >
                {char}
              </span>
            ))}
          </div>
          <div className="relative z-10 mt-8 text-white text-2xl">
            進捗: {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>
      ) : (
        <div className="text-center w-full h-screen flex flex-col items-center justify-center bg-gray-900">
          <h1 className="text-6xl font-bold text-white mb-8">ゲームクリア！</h1>
          <p className="text-2xl text-white mb-4">
            クリアタイム: {calculateScore()} 秒
          </p>
          <button
            onClick={resetGame}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
          >
            もう一度プレイ
          </button>
        </div>
      )}
    </main>
  );
}
