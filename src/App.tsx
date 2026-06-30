import { toPng } from "html-to-image";
import {
  ArrowRight,
  ChevronLeft,
  Copy,
  Download,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { GLOBAL_COPY_POOL, getResultByCode } from "./data/results";
import {
  ANSWER_OPTIONS,
  type AnswerMap,
  type Axis,
  QUESTIONS,
  type RawScore,
  type ResultCode,
  RESULT_CODES,
  answersForResultCode,
  scoreAnswers,
} from "./domain/scoring";

type Phase = "home" | "quiz" | "loading" | "result";

const AXIS_LABELS: Record<Axis, string> = {
  AO: "荒诞 / 秩序",
  TH: "真相 / 安顿",
  DB: "解构 / 建构",
  FG: "自由 / 共同体",
};

const LOADING_LINES = [
  "正在统计你有几层防御机制…",
  "正在核实你是真冷还是装冷…",
  "正在判断你到底是看透了，还是只是不想参与…",
];

function App() {
  const sharedCode = getSharedResultCode();
  const seededAnswers = sharedCode ? answersForResultCode(sharedCode) : {};
  const seededResult = sharedCode ? scoreAnswers(seededAnswers) : null;

  const [phase, setPhase] = useState<Phase>(seededResult ? "result" : "home");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>(seededAnswers);
  const [scoreResult, setScoreResult] = useState(seededResult);
  const [showAbout, setShowAbout] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [notice, setNotice] = useState("");
  const shareCardRef = useRef<HTMLDivElement>(null);

  const currentQuestion = QUESTIONS[currentIndex];
  const resultContent = scoreResult ? getResultByCode(scoreResult.code) : null;
  const shareLine = useMemo(() => {
    const source = resultContent?.copyPool ?? GLOBAL_COPY_POOL;
    return source[Math.abs((scoreResult?.code.charCodeAt(0) ?? 0) + currentIndex) % source.length];
  }, [currentIndex, resultContent?.copyPool, scoreResult?.code]);

  function startQuiz() {
    setAnswers({});
    setScoreResult(null);
    setCurrentIndex(0);
    setShowShare(false);
    setPhase("quiz");
  }

  function handleAnswer(value: RawScore) {
    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(nextAnswers);

    window.setTimeout(() => {
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex((index) => Math.min(index + 1, QUESTIONS.length - 1));
        return;
      }

      setPhase("loading");
      window.setTimeout(() => {
        const nextResult = scoreAnswers(nextAnswers);
        setScoreResult(nextResult);
        setPhase("result");
        setResultUrl(nextResult.code);
      }, 950);
    }, 140);
  }

  function goBack() {
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  async function saveShareCard() {
    if (!shareCardRef.current || !resultContent) return;

    try {
      const dataUrl = await toPng(shareCardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: "#15130f",
      });
      const link = document.createElement("a");
      link.download = `longhair-guy-${resultContent.code}.png`;
      link.href = dataUrl;
      link.click();
      setNotice("已生成 1080x1350 PNG。");
    } catch {
      setNotice("保存失败，请稍后重试。");
    }
  }

  async function copyResultLink() {
    if (!scoreResult) return;
    const url = buildResultUrl(scoreResult.code);

    try {
      await navigator.clipboard.writeText(url);
      setNotice("结果链接已复制。");
    } catch {
      setNotice(url);
    }
  }

  return (
    <main className="app-root">
      <section className="phone-stage" aria-live="polite">
        <Decorations />

        {phase === "home" && (
          <HomeScreen onStart={startQuiz} onAbout={() => setShowAbout(true)} />
        )}

        {phase === "quiz" && (
          <QuizScreen
            currentIndex={currentIndex}
            selectedValue={answers[currentQuestion.id]}
            onAnswer={handleAnswer}
            onBack={goBack}
          />
        )}

        {phase === "loading" && <LoadingScreen />}

        {phase === "result" && scoreResult && resultContent && (
          <ResultScreen
            scoreResult={scoreResult}
            showShare={showShare}
            shareLine={shareLine}
            notice={notice}
            shareCardRef={shareCardRef}
            onShowShare={() => setShowShare(true)}
            onSave={saveShareCard}
            onCopy={copyResultLink}
            onRestart={startQuiz}
          />
        )}

        {showAbout && <AboutDrawer onClose={() => setShowAbout(false)} />}
      </section>
    </main>
  );
}

function HomeScreen({ onStart, onAbout }: { onStart: () => void; onAbout: () => void }) {
  return (
    <div className="screen home-screen">
      <div className="top-note">VISION IS A KNOT.</div>
      <div className="side-slogan">世界是一团线，而你在其中</div>
      <div className="title-lockup" aria-label="长发男鉴定器">
        <span>长发男</span>
        <span>鉴定器</span>
      </div>
      <ThreadMark />
      <p className="hero-claim">
        不是看你头发多长，
        <br />
        是看你的世界观有没有开始打结。
      </p>
      <p className="hero-copy">
        24 个问题，测出你此刻更常使用哪种理解世界的视角。
      </p>
      <button className="primary-button" type="button" onClick={onStart}>
        <span>开始鉴定</span>
        <ArrowRight aria-hidden="true" size={30} />
      </button>
      <button className="link-button" type="button" onClick={onAbout}>
        <span className="mini-disc" aria-hidden="true" />
        <span>先看看这是什么</span>
      </button>
      <p className="fine-print">
        娱乐测试，不构成人格诊断。
        <br />
        无论你是否长发、是否男性，都可以测。
      </p>
    </div>
  );
}

function QuizScreen({
  currentIndex,
  selectedValue,
  onAnswer,
  onBack,
}: {
  currentIndex: number;
  selectedValue?: RawScore;
  onAnswer: (value: RawScore) => void;
  onBack: () => void;
}) {
  const question = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="screen quiz-screen">
      <header className="quiz-header">
        <div className="brand-small">
          <span>长发男鉴定器</span>
          <small>LONG HAIR GUY DETECTOR</small>
        </div>
        <div className="question-count">{String(currentIndex + 1).padStart(2, "0")} / 24</div>
        <div className="progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <section className="question-block">
        <p className="question-kicker">第 {currentIndex + 1} 题</p>
        <h1>{question.text}</h1>
        <ThreadMark compact />
        <p className="question-subtitle">你当前更常使用哪种理解世界的视角？</p>
      </section>

      <div className="answer-list">
        {ANSWER_OPTIONS.map((option, index) => (
          <button
            className={option.value === selectedValue ? "answer-card selected" : "answer-card"}
            key={option.value}
            type="button"
            onClick={() => onAnswer(option.value)}
          >
            <span className="radio-dot" aria-hidden="true" />
            <span className="answer-index">{index + 1}.</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      <footer className="quiz-footer">
        <button className="ghost-button" type="button" onClick={onBack} disabled={currentIndex === 0}>
          <ChevronLeft aria-hidden="true" size={22} />
          <span>上一题</span>
        </button>
        <span>没有标准答案，按直觉选。</span>
      </footer>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="screen loading-screen">
      <div className="loader-ring" aria-hidden="true" />
      <h1>正在把你从嘴硬里剥出来…</h1>
      <div className="loading-lines">
        {LOADING_LINES.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function ResultScreen({
  scoreResult,
  showShare,
  shareLine,
  notice,
  shareCardRef,
  onShowShare,
  onSave,
  onCopy,
  onRestart,
}: {
  scoreResult: NonNullable<ReturnType<typeof scoreAnswers>>;
  showShare: boolean;
  shareLine: string;
  notice: string;
  shareCardRef: React.RefObject<HTMLDivElement>;
  onShowShare: () => void;
  onSave: () => void;
  onCopy: () => void;
  onRestart: () => void;
}) {
  const result = getResultByCode(scoreResult.code);

  return (
    <div className="screen result-screen">
      <p className="result-prefix">你的精神长发男类型是：</p>
      <h1>{result.shortName}</h1>
      <p className="scene-name">{result.sceneName}</p>
      <p className="result-tagline">{result.tagline}</p>

      <AxisBars scoreResult={scoreResult} />

      <section className="result-section">
        <h2>判词</h2>
        <p>{result.description}</p>
      </section>

      <section className="result-section">
        <h2>危险倾向</h2>
        <ul>
          {result.danger.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="result-grid">
        <div>
          <h2>精神同伙</h2>
          <p>{result.companions.join(" / ")}</p>
        </div>
        <div>
          <h2>推荐阅读</h2>
          <p>{result.readings.join(" / ")}</p>
        </div>
      </section>

      <div className="action-row">
        <button className="primary-button small" type="button" onClick={onShowShare}>
          <Share2 aria-hidden="true" size={20} />
          <span>生成图卡</span>
        </button>
        <button className="ghost-button" type="button" onClick={onRestart}>
          <RotateCcw aria-hidden="true" size={19} />
          <span>再测一次</span>
        </button>
      </div>

      {showShare && (
        <section className="share-panel" aria-label="分享卡预览">
          <h2>分享卡预览</h2>
          <ShareCard refObject={shareCardRef} code={scoreResult.code} shareLine={shareLine} />
          <div className="action-row compact">
            <button className="primary-button small" type="button" onClick={onSave}>
              <Download aria-hidden="true" size={19} />
              <span>保存 PNG</span>
            </button>
            <button className="ghost-button" type="button" onClick={onCopy}>
              <Copy aria-hidden="true" size={19} />
              <span>复制结果链接</span>
            </button>
          </div>
          {notice && <p className="notice">{notice}</p>}
        </section>
      )}
    </div>
  );
}

function AxisBars({ scoreResult }: { scoreResult: NonNullable<ReturnType<typeof scoreAnswers>> }) {
  return (
    <div className="axis-bars">
      {(Object.keys(scoreResult.axisScores) as Axis[]).map((axis) => {
        const axisScore = scoreResult.axisScores[axis];
        return (
          <div className="axis-row" key={axis}>
            <div>
              <strong>{axisScore.pole}</strong>
              <span>{AXIS_LABELS[axis]}</span>
            </div>
            <div className="axis-meter">
              <span style={{ width: `${Math.max(8, axisScore.strength)}%` }} />
            </div>
            <em>{axisScore.strength}</em>
          </div>
        );
      })}
    </div>
  );
}

function ShareCard({
  refObject,
  code,
  shareLine,
}: {
  refObject: React.RefObject<HTMLDivElement>;
  code: ResultCode;
  shareLine: string;
}) {
  const result = getResultByCode(code);

  return (
    <div className="share-card" ref={refObject}>
      <div className="share-card-noise" aria-hidden="true" />
      <p className="share-card-label">LONG HAIR GUY DETECTOR</p>
      <h3>我是</h3>
      <h2>{result.shortName}</h2>
      <p className="share-card-scene">{result.sceneName}</p>
      <p className="share-card-line">{shareLine}</p>
      <div className="share-card-footer">
        <span>{code}</span>
        <span>娱乐测试，不治内耗</span>
      </div>
    </div>
  );
}

function AboutDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="drawer-backdrop" role="dialog" aria-modal="true" aria-label="这玩意儿测什么">
      <div className="about-drawer">
        <button className="drawer-close" type="button" onClick={onClose}>
          关闭
        </button>
        <h2>这玩意儿测什么</h2>
        <p>
          它不是心理诊断，也不是人格科学。它只是把你此刻理解世界、处理关系、面对真相和意义的姿势，
          翻译成一种精神长发男类型。
        </p>
        <div className="axis-mini-grid">
          <span>A 荒诞感</span>
          <span>O 秩序感</span>
          <span>T 真相优先</span>
          <span>H 安顿优先</span>
          <span>D 解构型</span>
          <span>B 建构型</span>
          <span>F 自由个体</span>
          <span>G 共同体</span>
        </div>
      </div>
    </div>
  );
}

function Decorations() {
  return (
    <div className="decorations" aria-hidden="true">
      <span className="decor-record top" />
      <span className="decor-record bottom" />
      <span className="decor-paper top-left">VISION IS A KNOT.</span>
      <span className="decor-paper bottom-right" />
      <span className="decor-ruler" />
      <span className="decor-red-thread" />
    </div>
  );
}

function ThreadMark({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={compact ? "thread-mark compact" : "thread-mark"} viewBox="0 0 420 120" role="img" aria-label="">
      <path d="M7 64C66 19 99 96 156 58s86-46 126-4 85 35 131-19" />
      <path d="M42 81c55-27 98-24 128 11 32 37 68-77 119-20 31 34 77 11 112-10" />
      <circle cx="294" cy="61" r="19" />
      <circle cx="303" cy="61" r="14" />
      <circle cx="311" cy="63" r="10" />
    </svg>
  );
}

function getSharedResultCode(): ResultCode | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("result");
  return RESULT_CODES.includes(value as ResultCode) ? (value as ResultCode) : null;
}

function setResultUrl(code: ResultCode) {
  if (typeof window === "undefined") return;
  window.history.replaceState(null, "", buildResultUrl(code));
}

function buildResultUrl(code: ResultCode) {
  const url = new URL(window.location.href);
  url.searchParams.set("result", code);
  return url.toString();
}

export default App;
