import Image from "next/image";
import { useState, useEffect } from "react";


export default function Home() {
  const questions =[
    {
      question: "React",
      image: "./monster1.png",
    },
    {
      question: "TypeScript",
      image: "./monster2.png",
    },
    {
      question: "Next.js",
      image: "./monster3.png",
    },
    {
      question: "Tailwind CSS",
      image: "./monster4.png",
    },
    {
      question: "Node.js",
      image: "./monster5.png",
    }
  ]
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const[currentPosition, setCurrentPosition] = useState(0);
const[isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const handleKyeDown = async (e: KeyboardEvent) => {
      const currentQuestion = questions[currentQuestionIndex];
      if(e.key.toLowerCase() === currentQuestion.question[currentPosition]){
        setCurrentPosition((prev) => prev + 1);
      }
      if(currentPosition === currentQuestion.question.length - 1){
        if(currentQuestionIndex === questions.length - 1){
          setIsComplete(true);
        }else{
          setCurrentQuestionIndex((prev) => prev + 1);
          setCurrentPosition(0);
        }
      }
    };
    window.addEventListener("keydown", handleKyeDown);
    return () => window.removeEventListener("keydown", handleKyeDown);
  }, [currentQuestionIndex, currentPosition, isComplete]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="text-center w-full h-screen bg-coverbg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${questions[currentQuestionIndex].image})`,
          backgroundColor: "rgba(0,0,0,0.7)",
          backgroundBlendMode: "overlay",
        }}
        >
          {  
          questions[currentQuestionIndex].question
          .split("")
          .map((char, index ) =>(
            <span key={index} 
            style={{
              color: index < currentQuestionIndex ? "#FF0000" : "white",
            }}
            >
              {char}
            </span>
          ))}
      </div>
    </main>
  );
  setCurrentQuestionIndex((prev) => prev + 1);
  setCurrentPosition(0);
}
