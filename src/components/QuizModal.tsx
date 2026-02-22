"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";
import {
  X,
  Brain,
  Zap,
  Target,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  RotateCcw,
  Save,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
  loading: () => <span className="text-xs text-gray-600">Loading...</span>,
});

type McqQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type ScenarioData = {
  scenario: string;
  hints: string[];
};

type EvaluationResult = {
  score: number;
  maxScore: number;
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
};

type McqRecord = {
  question: string;
  options: string[];
  correctIndex: number;
  selected: number;
  correct: boolean;
  explanation: string;
};

type ScenarioRecord = {
  question: string;
  answer: string;
  score: number;
  maxScore: number;
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
};

type SavePayload = {
  score: number;
  total: number;
  correct: number;
  bestScore: number;
  mcq?: McqRecord[];
  scenario?: ScenarioRecord;
};

type Props = {
  taskId: string;
  taskName: string;
  onClose: () => void;
  onSaveResult: (result: SavePayload) => void;
  existingBestScore?: number;
};

type Tab = "mcq" | "scenario";

export default function QuizModal({
  taskId,
  taskName,
  onClose,
  onSaveResult,
  existingBestScore,
}: Props) {
  const [tab, setTab] = useState<Tab>("mcq");

  // MCQ state
  const [mcqQuestions, setMcqQuestions] = useState<McqQuestion[]>([]);
  const [mcqLoading, setMcqLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [mcqAnswers, setMcqAnswers] = useState<
    { selected: number; correct: boolean }[]
  >([]);
  const [mcqRevealed, setMcqRevealed] = useState(false);
  const [mcqDone, setMcqDone] = useState(false);

  // Scenario state
  const [scenarioData, setScenarioData] = useState<ScenarioData | null>(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [showHints, setShowHints] = useState(false);

  // Combined score tracking
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const fetchMcq = useCallback(async () => {
    setMcqLoading(true);
    setError(null);
    setMcqQuestions([]);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setMcqAnswers([]);
    setMcqRevealed(false);
    setMcqDone(false);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskName, mode: "mcq" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate quiz");
      }
      const data = await res.json();
      setMcqQuestions(data.questions || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load quiz");
    }
    setMcqLoading(false);
  }, [taskName]);

  const fetchScenario = useCallback(async () => {
    setScenarioLoading(true);
    setError(null);
    setScenarioData(null);
    setUserAnswer("");
    setEvaluation(null);
    setShowHints(false);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskName, mode: "scenario" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate scenario");
      }
      const data = await res.json();
      setScenarioData(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load scenario"
      );
    }
    setScenarioLoading(false);
  }, [taskName]);

  useEffect(() => {
    if (tab === "mcq" && mcqQuestions.length === 0 && !mcqLoading && !mcqDone) {
      fetchMcq();
    }
    if (tab === "scenario" && !scenarioData && !scenarioLoading && !evaluation) {
      fetchScenario();
    }
  }, [tab, mcqQuestions.length, mcqLoading, mcqDone, fetchMcq, scenarioData, scenarioLoading, evaluation, fetchScenario]);

  const handleMcqSelect = (index: number) => {
    if (mcqRevealed) return;
    setSelectedAnswer(index);
  };

  const handleMcqConfirm = () => {
    if (selectedAnswer === null) return;
    const q = mcqQuestions[currentQ];
    const correct = selectedAnswer === q.correctIndex;
    setMcqAnswers((prev) => [...prev, { selected: selectedAnswer, correct }]);
    setMcqRevealed(true);
  };

  const handleMcqNext = () => {
    if (currentQ < mcqQuestions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelectedAnswer(null);
      setMcqRevealed(false);
    } else {
      setMcqDone(true);
    }
  };

  const handleSubmitScenario = async () => {
    if (!scenarioData || !userAnswer.trim()) return;
    setEvaluating(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: taskName,
          mode: "evaluate",
          question: scenarioData.scenario,
          answer: userAnswer,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to evaluate");
      }
      const data: EvaluationResult = await res.json();
      setEvaluation(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Evaluation failed");
    }
    setEvaluating(false);
  };

  const computeScore = () => {
    let totalPoints = 0;
    let maxPoints = 0;

    if (mcqAnswers.length > 0) {
      const mcqCorrect = mcqAnswers.filter((a) => a.correct).length;
      totalPoints += mcqCorrect;
      maxPoints += mcqAnswers.length;
    }

    if (evaluation) {
      totalPoints += evaluation.score;
      maxPoints += evaluation.maxScore;
    }

    if (maxPoints === 0) return { score: 0, total: 0, correct: 0 };

    const percent = Math.round((totalPoints / maxPoints) * 100);
    return { score: percent, total: maxPoints, correct: totalPoints };
  };

  const handleSave = () => {
    const { score, total, correct } = computeScore();
    const bestScore = Math.max(score, existingBestScore ?? 0);

    const payload: SavePayload = { score, total, correct, bestScore };

    if (mcqDone && mcqQuestions.length > 0) {
      payload.mcq = mcqQuestions.map((q, i) => ({
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        selected: mcqAnswers[i]?.selected ?? -1,
        correct: mcqAnswers[i]?.correct ?? false,
        explanation: q.explanation,
      }));
    }

    if (evaluation && scenarioData) {
      payload.scenario = {
        question: scenarioData.scenario,
        answer: userAnswer,
        score: evaluation.score,
        maxScore: evaluation.maxScore,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        modelAnswer: evaluation.modelAnswer,
      };
    }

    onSaveResult(payload);
    setSaved(true);
  };

  const hasResults = mcqDone || evaluation;
  const { score } = computeScore();

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-6"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-900 border border-white/[0.1] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 p-5 border-b border-white/[0.06] bg-gray-900/95 backdrop-blur-sm rounded-t-2xl">
          <div className="p-2 rounded-xl bg-brand-500/15 border border-brand-500/20">
            <Brain className="w-5 h-5 text-brand-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">
              Quiz: {taskName}
            </h3>
            <p className="text-xs text-gray-500">
              Test your understanding
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.06]">
          <button
            onClick={() => setTab("mcq")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
              tab === "mcq"
                ? "text-brand-400 border-b-2 border-brand-400 bg-brand-500/5"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <Zap className="w-4 h-4" />
            Quick Check
          </button>
          <button
            onClick={() => setTab("scenario")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
              tab === "scenario"
                ? "text-brand-400 border-b-2 border-brand-400 bg-brand-500/5"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <Target className="w-4 h-4" />
            Deep Dive
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {tab === "mcq" && (
            <McqTab
              questions={mcqQuestions}
              loading={mcqLoading}
              currentQ={currentQ}
              selectedAnswer={selectedAnswer}
              revealed={mcqRevealed}
              answers={mcqAnswers}
              done={mcqDone}
              onSelect={handleMcqSelect}
              onConfirm={handleMcqConfirm}
              onNext={handleMcqNext}
              onRetry={fetchMcq}
            />
          )}
          {tab === "scenario" && (
            <ScenarioTab
              data={scenarioData}
              loading={scenarioLoading}
              userAnswer={userAnswer}
              onAnswerChange={setUserAnswer}
              evaluation={evaluation}
              evaluating={evaluating}
              onSubmit={handleSubmitScenario}
              onRetry={fetchScenario}
              showHints={showHints}
              onToggleHints={() => setShowHints(!showHints)}
            />
          )}
        </div>

        {/* Footer with save */}
        {hasResults && (
          <div className="sticky bottom-0 p-5 border-t border-white/[0.06] bg-gray-900/95 backdrop-blur-sm rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`text-2xl font-bold ${
                    score >= 70 ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {score}%
                </div>
                <div className="text-xs text-gray-500">
                  {score >= 70 ? "Passed" : "Keep practicing"}
                  {existingBestScore != null && existingBestScore > 0 && (
                    <span className="block">
                      Best: {Math.max(score, existingBestScore)}%
                    </span>
                  )}
                </div>
              </div>
              {saved ? (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Saved
                </div>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-sm text-white font-medium transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Result
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/* ── MCQ Tab ── */

function McqTab({
  questions,
  loading,
  currentQ,
  selectedAnswer,
  revealed,
  answers,
  done,
  onSelect,
  onConfirm,
  onNext,
  onRetry,
}: {
  questions: McqQuestion[];
  loading: boolean;
  currentQ: number;
  selectedAnswer: number | null;
  revealed: boolean;
  answers: { selected: number; correct: boolean }[];
  done: boolean;
  onSelect: (i: number) => void;
  onConfirm: () => void;
  onNext: () => void;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
        <p className="text-sm text-gray-500">Generating questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <p className="text-sm text-gray-500">No questions loaded</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300"
        >
          <RotateCcw className="w-4 h-4" />
          Try again
        </button>
      </div>
    );
  }

  if (done) {
    const correctCount = answers.filter((a) => a.correct).length;
    return (
      <div className="space-y-4">
        <div className="text-center py-4">
          <div
            className={`text-4xl font-bold mb-1 ${
              correctCount === questions.length
                ? "text-emerald-400"
                : correctCount >= Math.ceil(questions.length * 0.7)
                ? "text-amber-400"
                : "text-red-400"
            }`}
          >
            {correctCount}/{questions.length}
          </div>
          <p className="text-sm text-gray-500">Questions correct</p>
        </div>

        {questions.map((q, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${
              answers[i]?.correct
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-red-500/20 bg-red-500/5"
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              {answers[i]?.correct ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              )}
              <p className="text-sm text-gray-300">{q.question}</p>
            </div>
            {!answers[i]?.correct && (
              <p className="text-xs text-gray-500 ml-6">
                Your answer: {q.options[answers[i]?.selected]} → Correct:{" "}
                {q.options[q.correctIndex]}
              </p>
            )}
            <p className="text-xs text-gray-500 ml-6 mt-1">{q.explanation}</p>
          </div>
        ))}

        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/[0.08] text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          New Questions
        </button>
      </div>
    );
  }

  const q = questions[currentQ];
  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>
          Question {currentQ + 1} of {questions.length}
        </span>
        <div className="flex-1 h-1 rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-300"
            style={{
              width: `${((currentQ + (revealed ? 1 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <p className="text-sm text-white leading-relaxed">{q.question}</p>

      {/* Options */}
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let style =
            "border-white/[0.08] hover:border-brand-500/40 hover:bg-white/[0.04]";
          if (revealed) {
            if (i === q.correctIndex) {
              style = "border-emerald-500/40 bg-emerald-500/10";
            } else if (i === selectedAnswer && i !== q.correctIndex) {
              style = "border-red-500/40 bg-red-500/10";
            } else {
              style = "border-white/[0.04] opacity-50";
            }
          } else if (i === selectedAnswer) {
            style = "border-brand-500/60 bg-brand-500/10";
          }

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              disabled={revealed}
              className={`w-full text-left p-3 rounded-xl border ${style} text-sm transition-all ${
                revealed ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <span
                className={
                  revealed && i === q.correctIndex
                    ? "text-emerald-300"
                    : revealed && i === selectedAnswer && i !== q.correctIndex
                    ? "text-red-300"
                    : "text-gray-300"
                }
              >
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-gray-400">
          {q.explanation}
        </div>
      )}

      {/* Action button */}
      <div className="flex justify-end">
        {!revealed ? (
          <button
            onClick={onConfirm}
            disabled={selectedAnswer === null}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm text-white font-medium transition-all"
          >
            Confirm
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-sm text-white font-medium transition-all"
          >
            {currentQ < questions.length - 1 ? "Next" : "See Results"}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Scenario Tab ── */

function ScenarioTab({
  data,
  loading,
  userAnswer,
  onAnswerChange,
  evaluation,
  evaluating,
  onSubmit,
  onRetry,
  showHints,
  onToggleHints,
}: {
  data: ScenarioData | null;
  loading: boolean;
  userAnswer: string;
  onAnswerChange: (v: string) => void;
  evaluation: EvaluationResult | null;
  evaluating: boolean;
  onSubmit: () => void;
  onRetry: () => void;
  showHints: boolean;
  onToggleHints: () => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
        <p className="text-sm text-gray-500">Creating scenario...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <p className="text-sm text-gray-500">No scenario loaded</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300"
        >
          <RotateCcw className="w-4 h-4" />
          Try again
        </button>
      </div>
    );
  }

  if (evaluation) {
    return (
      <div className="space-y-4">
        {/* Score */}
        <div className="text-center py-3">
          <div
            className={`text-4xl font-bold mb-1 ${
              evaluation.score >= 7
                ? "text-emerald-400"
                : evaluation.score >= 5
                ? "text-amber-400"
                : "text-red-400"
            }`}
          >
            {evaluation.score}/{evaluation.maxScore}
          </div>
          <p className="text-sm text-gray-500">
            {evaluation.score >= 7
              ? "Strong understanding"
              : evaluation.score >= 5
              ? "Decent, but room to improve"
              : "Needs more study"}
          </p>
        </div>

        {/* Strengths */}
        {evaluation.strengths.length > 0 && (
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <p className="text-xs font-medium text-emerald-400 mb-2">
              Strengths
            </p>
            <ul className="space-y-1">
              {evaluation.strengths.map((s, i) => (
                <li key={i} className="text-sm text-gray-300 flex gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {evaluation.improvements.length > 0 && (
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
            <p className="text-xs font-medium text-amber-400 mb-2">
              Areas to Improve
            </p>
            <ul className="space-y-1">
              {evaluation.improvements.map((s, i) => (
                <li key={i} className="text-sm text-gray-300 flex gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Model answer */}
        <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.03]">
          <p className="text-xs font-medium text-gray-400 mb-2">
            Model Answer
          </p>
          <div className="prose-proof">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {evaluation.modelAnswer}
            </ReactMarkdown>
          </div>
        </div>

        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/[0.08] text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          New Scenario
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Scenario */}
      <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.03]">
        <p className="text-sm text-gray-300 leading-relaxed">
          {data.scenario}
        </p>
      </div>

      {/* Hints toggle */}
      {data.hints && data.hints.length > 0 && (
        <div>
          <button
            onClick={onToggleHints}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-amber-400 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {showHints ? "Hide hints" : "Show hints"}
          </button>
          {showHints && (
            <div className="mt-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15 space-y-1">
              {data.hints.map((h, i) => (
                <p key={i} className="text-xs text-amber-400/80">
                  • {h}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Answer area */}
      <div>
        <label className="text-xs text-gray-500 mb-1.5 block">
          Your answer
        </label>
        <textarea
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          rows={6}
          placeholder="Describe your recommended solution and justify your choices..."
          className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-500/40 transition-all resize-none leading-relaxed"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          disabled={!userAnswer.trim() || evaluating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm text-white font-medium transition-all"
        >
          {evaluating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Evaluating...
            </>
          ) : (
            <>
              Submit for Review
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
