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
  const [isStarted, setIsStarted] = useState(false);
  const [userName, setUserName] = useState("");
  const [totalTime, setTotalTime] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const addResult = (userName: string, startTime: number) => {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const timeInSeconds = totalTime / 1000;
    const baseScore = 10000;
    const timeDeduction = timeInSeconds * 100;
    const score = baseScore - timeDeduction;
    return {totalTime, score};
  };


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
          if (startTime) {
            const {totalTime, score} = addResult(userName, startTime);
            setTotalTime(totalTime);
            setTotalScore(score);
          }
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
          setCurrentPosition(0);
        }
      }
    };
    window.addEventListener("keydown", handleKyeDown);
    return () => window.removeEventListener("keydown", handleKyeDown);
  }, [currentQuestionIndex, currentPosition, isComplete]);
  const handleStart = () => {
    if(!userName) {
      alert("名前を入力してください");
      return;
    }
    setIsStarted(true);
  };
  
  if(!isStarted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="text-center p-8">
          <input 
            type="text" 
            placeholder="Enter your name..." 
            className="w-64 p-3 text-lg bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)}
          />
          <div className="mt-4">
            <button className="px-8 py-3 text-xl bg-red-900" onClick={handleStart}>StartGame</button>
          </div> 
        </div>
      </main>
    );
  }

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
          <h1 className="text-6xl font-bold text-white mb-8">Result</h1>
          <p className="text-2xl text-white mb-4">
            Your Name: {userName}
          </p>
          <p className="text-2xl text-white mb-4">
            {/* Time: {calculateScore()} sec */}
            Your Time: {(totalTime / 1000).toFixed(2)} seconds
          </p>
          <p className="text-2xl text-white mb-4">
            Your Score: {totalScore}
          </p>

          <button
            onClick={resetGame}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </main>
  );
}
