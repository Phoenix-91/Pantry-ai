import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, Clock, Play, Pause, RotateCcw, Flame } from 'lucide-react';

export const CookingModeModal = ({ recipe, isOpen, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const instructions = recipe?.instructions || [];
  const currentStep = instructions[currentStepIndex];

  // Set initial timer if current step has one
  useEffect(() => {
    if (currentStep?.timerMinutes) {
      setTimerSeconds(currentStep.timerMinutes * 60);
      setTimerActive(false);
    } else {
      setTimerSeconds(0);
      setTimerActive(false);
    }
  }, [currentStepIndex, currentStep]);

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  if (!isOpen || !recipe) return null;

  const toggleStepCompleted = (index) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-900 text-cream-50 flex flex-col overflow-hidden animate-in fade-in">
      
      {/* Header Bar */}
      <header className="px-6 py-4 bg-charcoal-800 border-b border-charcoal-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xs uppercase font-bold tracking-widest text-olive-400 bg-charcoal-700 px-2.5 py-1 rounded-full">
            Cooking Mode
          </span>
          <h2 className="font-serif text-lg font-bold text-cream-50 truncate max-w-md">
            {recipe.title}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs text-charcoal-400">
            Step {currentStepIndex + 1} of {instructions.length}
          </span>
          <button
            onClick={onClose}
            className="p-2 text-charcoal-400 hover:text-cream-50 rounded-full hover:bg-charcoal-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12 flex flex-col justify-between overflow-y-auto">
        
        {/* Step Progress Bar */}
        <div className="w-full bg-charcoal-800 h-2 rounded-full overflow-hidden mb-8">
          <div
            className="bg-olive-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentStepIndex + 1) / instructions.length) * 100}%` }}
          />
        </div>

        {/* Active Step Presentation */}
        <div className="space-y-6 my-auto">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-olive-400 uppercase tracking-widest">
              Step {currentStep?.stepNumber || currentStepIndex + 1}
            </span>
            {currentStep?.temperature && (
              <span className="flex items-center space-x-1.5 text-xs text-terracotta-400 bg-charcoal-800 px-3 py-1 rounded-full border border-charcoal-700">
                <Flame className="w-4 h-4 text-terracotta-400" />
                <span>{currentStep.temperature}</span>
              </span>
            )}
          </div>

          <h3 className="font-serif text-3xl md:text-4xl font-bold text-cream-50 leading-tight">
            {currentStep?.title || `Preparation Step`}
          </h3>

          <p className="text-xl md:text-2xl text-cream-200 leading-relaxed font-light">
            {currentStep?.instruction}
          </p>

          {/* Step Timer Widget (If step has timing) */}
          {currentStep?.timerMinutes && (
            <div className="p-4 bg-charcoal-800 rounded-2xl border border-charcoal-700 inline-flex items-center space-x-4">
              <Clock className="w-6 h-6 text-olive-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-charcoal-400">Step Timer</p>
                <p className="text-2xl font-mono font-bold text-cream-50">{formatTimer(timerSeconds)}</p>
              </div>
              <div className="flex items-center space-x-2 pl-2">
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className="p-2 rounded-xl bg-olive-700 hover:bg-olive-600 text-white transition-colors"
                >
                  {timerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => { setTimerActive(false); setTimerSeconds(currentStep.timerMinutes * 60); }}
                  className="p-2 rounded-xl bg-charcoal-700 hover:bg-charcoal-600 text-charcoal-300 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step Completed Checkbox */}
          <div className="pt-4">
            <button
              onClick={() => toggleStepCompleted(currentStepIndex)}
              className={`flex items-center space-x-3 px-5 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                completedSteps.has(currentStepIndex)
                  ? 'bg-olive-900/60 border-olive-500 text-olive-300'
                  : 'bg-charcoal-800 border-charcoal-700 text-charcoal-300 hover:bg-charcoal-700'
              }`}
            >
              <CheckCircle2 className={`w-5 h-5 ${completedSteps.has(currentStepIndex) ? 'text-olive-400' : 'text-charcoal-500'}`} />
              <span>{completedSteps.has(currentStepIndex) ? 'Step Completed' : 'Mark Step as Done'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Bottom Controls */}
        <div className="pt-8 border-t border-charcoal-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold text-sm">Previous Step</span>
          </button>

          <button
            onClick={() => {
              if (currentStepIndex < instructions.length - 1) {
                setCurrentStepIndex(prev => prev + 1);
              } else {
                onClose();
              }
            }}
            className="flex items-center space-x-2 px-8 py-3 rounded-2xl bg-olive-700 hover:bg-olive-600 text-cream-50 font-semibold text-sm transition-all shadow-soft"
          >
            <span>{currentStepIndex === instructions.length - 1 ? 'Finish Cooking 🎉' : 'Next Step'}</span>
            {currentStepIndex < instructions.length - 1 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </div>
  );
};
