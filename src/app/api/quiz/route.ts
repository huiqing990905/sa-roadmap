import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SA_SYSTEM_PROMPT = `You are a Solution Architect exam coach. You test understanding of cloud architecture, networking, security, and system design concepts. Your questions should be practical and scenario-based, similar to AWS Solutions Architect certification exams. Always frame questions from a real-world architecture perspective.`;

type QuizRequest = {
  task: string;
  description?: string;
  mode: "mcq" | "scenario" | "evaluate";
  question?: string;
  answer?: string;
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "your-openai-api-key-here") {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body: QuizRequest = await req.json();
    const { task, description, mode, question, answer } = body;

    if (!task || !mode) {
      return NextResponse.json(
        { error: "Missing required fields: task, mode" },
        { status: 400 }
      );
    }

    if (mode === "mcq") {
      return handleMcq(task, description);
    } else if (mode === "scenario") {
      return handleScenario(task, description);
    } else if (mode === "evaluate") {
      if (!question || !answer) {
        return NextResponse.json(
          { error: "Missing required fields for evaluate: question, answer" },
          { status: 400 }
        );
      }
      return handleEvaluate(task, question, answer);
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (err) {
    console.error("Quiz API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleMcq(task: string, description?: string) {
  const topicContext = description ? `${task}\n${description}` : task;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SA_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Generate exactly 3 multiple-choice questions to test understanding of this topic:

"${topicContext}"

Each question should test practical understanding, not just memorization. Include at least one scenario-based question.

Respond in this exact JSON format:
{
  "questions": [
    {
      "question": "the question text",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "correctIndex": 0,
      "explanation": "brief explanation of why the correct answer is right and why other common choices are wrong"
    }
  ]
}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return NextResponse.json(
      { error: "No response from AI" },
      { status: 500 }
    );
  }

  return NextResponse.json(JSON.parse(content));
}

async function handleScenario(task: string, description?: string) {
  const topicContext = description ? `${task}\n${description}` : task;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SA_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Create one realistic scenario-based question for a Solution Architect interview or certification exam, testing deep understanding of:

"${topicContext}"

The scenario should describe a real company situation with specific requirements and constraints. The candidate should need to recommend a solution and justify their reasoning.

Respond in this exact JSON format:
{
  "scenario": "the full scenario description with company context, requirements, and constraints",
  "hints": ["hint 1 about what to consider", "hint 2"]
}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return NextResponse.json(
      { error: "No response from AI" },
      { status: 500 }
    );
  }

  return NextResponse.json(JSON.parse(content));
}

async function handleEvaluate(task: string, question: string, answer: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SA_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Evaluate this Solution Architect candidate's answer.

Topic: "${task}"

Scenario question:
${question}

Candidate's answer:
${answer}

Score from 0-10 and provide constructive feedback. Be encouraging but honest about gaps.

Respond in this exact JSON format:
{
  "score": 7,
  "maxScore": 10,
  "strengths": ["what the candidate did well"],
  "improvements": ["what could be improved or was missed"],
  "modelAnswer": "a brief model answer showing what a strong response would cover"
}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return NextResponse.json(
      { error: "No response from AI" },
      { status: 500 }
    );
  }

  return NextResponse.json(JSON.parse(content));
}
