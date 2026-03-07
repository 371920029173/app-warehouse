"use client";

import { useState, useEffect, useRef } from "react";
import { Pupil } from "./Pupil";
import { EyeBall } from "./EyeBall";

interface AnimatedCharactersProps {
  isTyping?: boolean;
  showPassword?: boolean;
  passwordLength?: number;
}

export function AnimatedCharacters({
  isTyping = false,
  showPassword = false,
  passwordLength = 0,
}: AnimatedCharactersProps) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        setIsPurpleBlinking(true);
        setTimeout(() => {
          setIsPurpleBlinking(false);
          schedule();
        }, 150);
      }, Math.random() * 4000 + 3000);
      return t;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        setIsBlackBlinking(true);
        setTimeout(() => {
          setIsBlackBlinking(false);
          schedule();
        }, 150);
      }, Math.random() * 4000 + 3000);
      return t;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const t = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(t);
    }
    setIsLookingAtEachOther(false);
  }, [isTyping]);

  useEffect(() => {
    if (passwordLength > 0 && showPassword) {
      const t = setTimeout(() => {
        setIsPurplePeeking(true);
        setTimeout(() => setIsPurplePeeking(false), 800);
      }, Math.random() * 3000 + 2000);
      return () => clearTimeout(t);
    }
    setIsPurplePeeking(false);
  }, [passwordLength, showPassword]);

  const calcPos = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 3;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    };
  };

  const purplePos = calcPos(purpleRef);
  const blackPos = calcPos(blackRef);
  const yellowPos = calcPos(yellowRef);
  const orangePos = calcPos(orangeRef);
  const isHidingPassword = passwordLength > 0 && !showPassword;

  return (
    <div className="relative w-[550px] h-[400px] max-w-full mx-auto" style={{ minHeight: 400 }}>
      {/* Purple - back */}
      <div
        ref={purpleRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: 70,
          width: 180,
          height: isTyping || isHidingPassword ? 440 : 400,
          backgroundColor: "#6C3FF5",
          borderRadius: "10px 10px 0 0",
          zIndex: 1,
          transform:
            passwordLength > 0 && showPassword
              ? "skewX(0deg)"
              : isTyping || isHidingPassword
                ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
                : `skewX(${purplePos.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-2 transition-all duration-700 ease-in-out"
          style={{
            left:
              passwordLength > 0 && showPassword
                ? 20
                : isLookingAtEachOther
                  ? 55
                  : 45 + purplePos.faceX,
            top:
              passwordLength > 0 && showPassword
                ? 35
                : isLookingAtEachOther
                  ? 65
                  : 40 + purplePos.faceY,
          }}
        >
          <EyeBall
            size={18}
            pupilSize={7}
            maxDistance={5}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={isPurpleBlinking}
            forceLookX={
              passwordLength > 0 && showPassword
                ? (isPurplePeeking ? 4 : -4)
                : isLookingAtEachOther
                  ? 3
                  : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword
                ? (isPurplePeeking ? 5 : -4)
                : isLookingAtEachOther
                  ? 4
                  : undefined
            }
          />
          <EyeBall
            size={18}
            pupilSize={7}
            maxDistance={5}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={isPurpleBlinking}
            forceLookX={
              passwordLength > 0 && showPassword
                ? (isPurplePeeking ? 4 : -4)
                : isLookingAtEachOther
                  ? 3
                  : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword
                ? (isPurplePeeking ? 5 : -4)
                : isLookingAtEachOther
                  ? 4
                  : undefined
            }
          />
        </div>
      </div>

      {/* Black - middle */}
      <div
        ref={blackRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: 240,
          width: 120,
          height: 310,
          backgroundColor: "#2D2D2D",
          borderRadius: "8px 8px 0 0",
          zIndex: 2,
          transform:
            passwordLength > 0 && showPassword
              ? "skewX(0deg)"
              : isLookingAtEachOther
                ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                : isTyping || isHidingPassword
                  ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                  : `skewX(${blackPos.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-1.5 transition-all duration-700 ease-in-out"
          style={{
            left:
              passwordLength > 0 && showPassword
                ? 10
                : isLookingAtEachOther
                  ? 32
                  : 26 + blackPos.faceX,
            top:
              passwordLength > 0 && showPassword
                ? 28
                : isLookingAtEachOther
                  ? 12
                  : 32 + blackPos.faceY,
          }}
        >
          <EyeBall
            size={16}
            pupilSize={6}
            maxDistance={4}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={isBlackBlinking}
            forceLookX={
              passwordLength > 0 && showPassword ? -4 : isLookingAtEachOther ? 0 : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword ? -4 : isLookingAtEachOther ? -4 : undefined
            }
          />
          <EyeBall
            size={16}
            pupilSize={6}
            maxDistance={4}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={isBlackBlinking}
            forceLookX={
              passwordLength > 0 && showPassword ? -4 : isLookingAtEachOther ? 0 : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword ? -4 : isLookingAtEachOther ? -4 : undefined
            }
          />
        </div>
      </div>

      {/* Orange - front left semicircle */}
      <div
        ref={orangeRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: 0,
          width: 240,
          height: 200,
          backgroundColor: "#FF9B6B",
          borderRadius: "120px 120px 0 0",
          zIndex: 3,
          transform:
            passwordLength > 0 && showPassword
              ? "skewX(0deg)"
              : `skewX(${orangePos.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-2 transition-all duration-200 ease-out"
          style={{
            left:
              passwordLength > 0 && showPassword ? 50 : 82 + (orangePos.faceX || 0),
            top:
              passwordLength > 0 && showPassword ? 85 : 90 + (orangePos.faceY || 0),
          }}
        >
          <Pupil
            size={12}
            maxDistance={5}
            pupilColor="#2D2D2D"
            forceLookX={
              passwordLength > 0 && showPassword ? -5 : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword ? -4 : undefined
            }
          />
          <Pupil
            size={12}
            maxDistance={5}
            pupilColor="#2D2D2D"
            forceLookX={
              passwordLength > 0 && showPassword ? -5 : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword ? -4 : undefined
            }
          />
        </div>
      </div>

      {/* Yellow - front right */}
      <div
        ref={yellowRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: 310,
          width: 140,
          height: 230,
          backgroundColor: "#E8D754",
          borderRadius: "70px 70px 0 0",
          zIndex: 4,
          transform:
            passwordLength > 0 && showPassword
              ? "skewX(0deg)"
              : `skewX(${yellowPos.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-1.5 transition-all duration-200 ease-out"
          style={{
            left:
              passwordLength > 0 && showPassword ? 20 : 52 + (yellowPos.faceX || 0),
            top:
              passwordLength > 0 && showPassword ? 35 : 40 + (yellowPos.faceY || 0),
          }}
        >
          <Pupil
            size={12}
            maxDistance={5}
            pupilColor="#2D2D2D"
            forceLookX={
              passwordLength > 0 && showPassword ? -5 : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword ? -4 : undefined
            }
          />
          <Pupil
            size={12}
            maxDistance={5}
            pupilColor="#2D2D2D"
            forceLookX={
              passwordLength > 0 && showPassword ? -5 : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword ? -4 : undefined
            }
          />
        </div>
        <div
          className="absolute w-5 h-1 bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
          style={{
            left: passwordLength > 0 && showPassword ? 10 : 40 + (yellowPos.faceX || 0),
            top: passwordLength > 0 && showPassword ? 88 : 88 + (yellowPos.faceY || 0),
          }}
        />
      </div>
    </div>
  );
}
