"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

type Score = {
  score: number;
  userName: string;
}

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
  const [scores, setScores] = useState<Score[]>([]);
  const bgmRef = useRef<HTMLAudioElement>(null);
  const shotSoundRef = useRef<HTMLAudioElement>(null);


  useEffect(() =>{
    bgmRef.current = new Audio("/bgm.mp3");
    bgmRef.current.loop = true;
    shotSoundRef.current = new Audio("/shot.mp3");


  })
useEffect(() =>{
  if(isStarted && bgmRef.current){
    bgmRef.current.play();
  }
  if(isComplete && bgmRef.current){
    bgmRef.current.pause();
  }

})



  const addResult = async (userName: string, startTime: number) => {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const timeInSeconds = totalTime / 1000;
    const baseScore = 10000;
    const timeDeduction = timeInSeconds * 100;
    const score = baseScore - timeDeduction;

    await fetch("http://localhost:3000/api/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({score, userName}),
    });

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

  const fetchScores = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/result");
      const data = await response.json();
      console.log("API data:", data);
      return data || [];
    } catch (error) {
      console.error("Error fetching scores:", error);
      return [];
    }
  };
  
  useEffect(() => {
    const handleKyeDown = async (e: KeyboardEvent) => {
      if (isComplete) return;
      
      const currentQuestion = questions[currentQuestionIndex];
      if (e.key.toLowerCase() === currentQuestion.question[currentPosition].toLowerCase()) {
        setCurrentPosition((prev) => prev + 1);
      }
      if (currentPosition === currentQuestion.question.length - 1) {
        if (currentQuestionIndex === questions.length - 1) {
          if(shotSoundRef.current){
            shotSoundRef.current.currentTime = 0;
            shotSoundRef.current.play();
          }
          setIsComplete(true);
          setEndTime(Date.now());
          if (startTime) {
            const {totalTime, score} = await addResult(userName, startTime);
            setTotalTime(totalTime);
            setTotalScore(score);
          }
        } else {
          if(shotSoundRef.current){
            shotSoundRef.current.currentTime = 0;
            shotSoundRef.current.play();
          }
          setCurrentQuestionIndex((prev) => prev + 1);
          setCurrentPosition(0);
        }
      }
    };
    window.addEventListener("keydown", handleKyeDown);
    return () => window.removeEventListener("keydown", handleKyeDown);
  }, [currentQuestionIndex, currentPosition, isComplete]);

  useEffect(() => {
    if (isComplete) {
      fetchScores().then(setScores);
    }
  }, [isComplete]);

  const handleStart = async () => {
    if(!userName) {
      alert("名前を入力してください");
      return;
    }
    const fetchedScores = await fetchScores();
    setScores(fetchedScores);
    console.log("setScores直後:", fetchedScores);
    setStartTime(Date.now());
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

  console.log("描画時scores:", scores);

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
        <div className="text-center w-full min-h-screen flex flex-col items-center justify-center bg-black">
          <h1 className="text-6xl font-bold text-white mb-8">Result</h1>
          <p className="text-2xl text-white mb-4">
            Player: {userName}
          </p>
          <p className="text-2xl text-white mb-4">
            {/* Time: {calculateScore()} sec */}
            Your Time: {(totalTime / 1000).toFixed(2)} seconds
          </p>
          <p className="text-2xl text-white mb-4">
            Your Score: {totalScore}
          </p>
          <div className="mt-8"><h3 className="text-white">Ranking</h3>
          {scores.length === 0?(
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-white">Loading...</p>
            </div>
          ):
          (
            <div className="flex flex-col items-center justify-center py-8">
              {scores.map((score, index) => (
                <div key={index} className="flex justify-between items-center p-3">
                  <span className="text-white">{index + 1}. {score.userName}</span>
                  <span className="text-red-500">{score.score}</span>
                </div>
              ))}
            </div>
          )} 
          </div>

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
