import { useEffect } from "react";
import confetti from "canvas-confetti";
import { playCompletionBeep } from "@/utils/audioHelper";

export function useCompletionFeedback(justCompleted: boolean) {
  useEffect(() => {
    if (!justCompleted) return;
    confetti({ particleCount: 20, spread: 50, origin: { y: 0.7 } });
    playCompletionBeep();
  }, [justCompleted]);
}
