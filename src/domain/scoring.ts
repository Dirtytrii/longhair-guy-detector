export type Axis = "AO" | "TH" | "DB" | "FG";
export type Pole = "A" | "O" | "T" | "H" | "D" | "B" | "F" | "G";
export type ResultCode = `${"A" | "O"}${"T" | "H"}${"D" | "B"}${"F" | "G"}`;
export type RawScore = -2 | -1 | 0 | 1 | 2;

export interface AnswerOption {
  label: string;
  value: RawScore;
}

export interface Question {
  id: number;
  text: string;
  axis: Axis;
  agreePole: Pole;
  tieBreaker?: boolean;
}

export interface AxisScore {
  axis: Axis;
  score: number;
  pole: Pole;
  strength: number;
}

export interface ScoreResult {
  code: ResultCode;
  axisScores: Record<Axis, AxisScore>;
}

export type AnswerMap = Partial<Record<number, RawScore>>;

const AXIS_CONFIG: Record<Axis, { front: Pole; back: Pole; tieQuestionId: number }> = {
  AO: { front: "A", back: "O", tieQuestionId: 6 },
  TH: { front: "T", back: "H", tieQuestionId: 12 },
  DB: { front: "D", back: "B", tieQuestionId: 18 },
  FG: { front: "F", back: "G", tieQuestionId: 24 },
};

const VALID_RAW_SCORES = new Set<RawScore>([-2, -1, 0, 1, 2]);

export const ANSWER_OPTIONS: AnswerOption[] = [
  { label: "拉完了", value: -2 },
  { label: "有点拉", value: -1 },
  { label: "NPC", value: 0 },
  { label: "人上人", value: 1 },
  { label: "夯", value: 2 },
];

export const QUESTIONS: Question[] = [
  { id: 1, text: "世界本身不供应意义，硬要找也得自己编。", axis: "AO", agreePole: "A" },
  { id: 2, text: "很多“命中注定”只是人给混乱补字幕。", axis: "AO", agreePole: "A" },
  { id: 3, text: "比起寻找答案，我更容易先感到荒谬。", axis: "AO", agreePole: "A" },
  { id: 4, text: "我相信人生再乱，底下也有一层可解释的秩序。", axis: "AO", agreePole: "O" },
  { id: 5, text: "我愿意承认事情没道理，而不是急着把它讲圆。", axis: "AO", agreePole: "A" },
  { id: 6, text: "我总觉得很多看似偶然的事，背后还是能理出线头。", axis: "AO", agreePole: "O", tieBreaker: true },
  { id: 7, text: "真相会让我难受，我也想知道。", axis: "TH", agreePole: "T" },
  { id: 8, text: "比起被安慰，我更怕被糊弄。", axis: "TH", agreePole: "T" },
  { id: 9, text: "有些事不知道，日子反而能过下去。", axis: "TH", agreePole: "H" },
  { id: 10, text: "我能接受善意的模糊，只要它不把人逼坏。", axis: "TH", agreePole: "H" },
  { id: 11, text: "我宁愿知道自己输在哪，也不想被漂亮话哄走。", axis: "TH", agreePole: "T" },
  { id: 12, text: "不是每个真相都值得立刻掀开。", axis: "TH", agreePole: "H", tieBreaker: true },
  { id: 13, text: "我听见漂亮说法，第一反应是想拆。", axis: "DB", agreePole: "D" },
  { id: 14, text: "我很难直接接受一个概念而不去问它是谁发明的。", axis: "DB", agreePole: "D" },
  { id: 15, text: "与其拆穿一切，我更想把混乱整理成能用的图。", axis: "DB", agreePole: "B" },
  { id: 16, text: "我喜欢把零散感受归档、命名、排出结构。", axis: "DB", agreePole: "B" },
  { id: 17, text: "很多时候，戳穿比安慰更让我有掌控感。", axis: "DB", agreePole: "D" },
  { id: 18, text: "我不满足于怀疑，我还想搭个东西让自己站稳。", axis: "DB", agreePole: "B", tieBreaker: true },
  { id: 19, text: "我最怕的不是吃苦，是活成别人安排的样子。", axis: "FG", agreePole: "F" },
  { id: 20, text: "哪怕关系会变难，我也想保住自己的边界。", axis: "FG", agreePole: "F" },
  { id: 21, text: "人活到最后，真正扛事的还是那几段关系。", axis: "FG", agreePole: "G" },
  { id: 22, text: "做决定时，我很难彻底不顾那些和我绑定的人。", axis: "FG", agreePole: "G" },
  { id: 23, text: "我宁可一个人拧巴，也不想为了合群把自己磨平。", axis: "FG", agreePole: "F" },
  { id: 24, text: "真正把人拉回地面的，往往不是道理，是一起熬过的事。", axis: "FG", agreePole: "G", tieBreaker: true },
];

export const RESULT_CODES: ResultCode[] = [
  "ATDF",
  "ATDG",
  "ATBF",
  "ATBG",
  "AHDF",
  "AHDG",
  "AHBF",
  "AHBG",
  "OTDF",
  "OTDG",
  "OTBF",
  "OTBG",
  "OHDF",
  "OHDG",
  "OHBF",
  "OHBG",
];

export function scoreAnswers(answers: AnswerMap): ScoreResult {
  validateAnswers(answers);

  const axisScores = {} as Record<Axis, AxisScore>;

  for (const axis of Object.keys(AXIS_CONFIG) as Axis[]) {
    const axisQuestions = QUESTIONS.filter((question) => question.axis === axis);
    const score = axisQuestions.reduce((total, question) => {
      return total + contributionFor(question, answers[question.id] as RawScore);
    }, 0);
    const pole = resolveAxisPole(axis, score, answers);

    axisScores[axis] = {
      axis,
      score,
      pole,
      strength: Math.round((Math.abs(score) / 12) * 100),
    };
  }

  return {
    code: `${axisScores.AO.pole}${axisScores.TH.pole}${axisScores.DB.pole}${axisScores.FG.pole}` as ResultCode,
    axisScores,
  };
}

export function answersForResultCode(code: ResultCode): Record<number, RawScore> {
  const targetByAxis: Record<Axis, Pole> = {
    AO: code[0] as Pole,
    TH: code[1] as Pole,
    DB: code[2] as Pole,
    FG: code[3] as Pole,
  };

  return Object.fromEntries(
    QUESTIONS.map((question) => [
      question.id,
      question.agreePole === targetByAxis[question.axis] ? 2 : -2,
    ]),
  ) as Record<number, RawScore>;
}

function validateAnswers(answers: AnswerMap): void {
  const missing = QUESTIONS.filter((question) => answers[question.id] === undefined);
  if (missing.length > 0) {
    throw new Error(`Expected answers for all 24 questions, missing ${missing.length}.`);
  }

  for (const question of QUESTIONS) {
    if (!VALID_RAW_SCORES.has(answers[question.id] as RawScore)) {
      throw new Error(`Question ${question.id} has an invalid score.`);
    }
  }
}

function resolveAxisPole(axis: Axis, score: number, answers: AnswerMap): Pole {
  const config = AXIS_CONFIG[axis];
  if (score > 0) return config.front;
  if (score < 0) return config.back;

  const tieQuestion = QUESTIONS.find((question) => question.id === config.tieQuestionId);
  if (!tieQuestion) return config.back;

  const tieContribution = contributionFor(tieQuestion, answers[tieQuestion.id] as RawScore);
  if (tieContribution > 0) return config.front;
  if (tieContribution < 0) return config.back;

  return tieQuestion.agreePole;
}

function contributionFor(question: Question, rawScore: RawScore): number {
  const config = AXIS_CONFIG[question.axis];
  const direction = question.agreePole === config.front ? 1 : -1;

  return rawScore * direction;
}
