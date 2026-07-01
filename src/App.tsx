import { toPng } from "html-to-image";
import {
  ArrowRight,
  ChevronLeft,
  Copy,
  Download,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

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
type DownloadInfo = {
  href: string;
  filename: string;
};

const AXIS_LABELS: Record<Axis, string> = {
  AO: "荒诞感",
  TH: "真相倾向",
  DB: "解构倾向",
  FG: "共同体",
};

const LOADING_LINES = [
  "正在统计你有几层防御机制…",
  "正在核实你是真冷还是装冷…",
  "正在判断你到底是看透了，还是只是不想参与…",
];

const RESULT_PORTRAIT_SRC = "/assets/result-portrait-v2.png";
const SHARE_PORTRAIT_SRC = "/assets/share-card-portrait-v2.png";
const SITE_URL = "https://longhair-guy-detector.pages.dev/";
const SITE_QR_SRC = "/assets/site-qr.png";

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
  const [shareLineIndex, setShareLineIndex] = useState(0);
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | null>(null);
  const sharePanelRef = useRef<HTMLElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const currentQuestion = QUESTIONS[currentIndex];
  const resultContent = scoreResult ? getResultByCode(scoreResult.code) : null;
  const shareLine = useMemo(() => {
    const source = resultContent?.copyPool ?? GLOBAL_COPY_POOL;
    const seed = (scoreResult?.code.charCodeAt(0) ?? 0) + currentIndex + shareLineIndex;
    return source[Math.abs(seed) % source.length];
  }, [currentIndex, resultContent?.copyPool, scoreResult?.code, shareLineIndex]);

  useEffect(() => {
    if (!showShare) return undefined;

    let timer: number | undefined;
    const scrollSharePanel = () => {
      sharePanelRef.current?.scrollIntoView?.({ block: "start", inline: "nearest" });
    };
    const frame = window.requestAnimationFrame(() => {
      scrollSharePanel();
      timer = window.setTimeout(scrollSharePanel, 140);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [showShare]);

  function startQuiz() {
    setAnswers({});
    setScoreResult(null);
    setCurrentIndex(0);
    setShowShare(false);
    setShareLineIndex(0);
    setDownloadInfo(null);
    clearResultUrl();
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
        setShareLineIndex(0);
        setPhase("result");
        setResultUrl(nextResult.code);
      }, 950);
    }, 140);
  }

  function goBack() {
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  function openSharePanel() {
    setShowShare(true);
  }

  function regenerateShareLine() {
    setShareLineIndex((index) => index + 1);
    setDownloadInfo(null);
  }

  async function saveShareCard() {
    if (!shareCardRef.current || !resultContent) return;

    try {
      const dataUrl = await toPng(shareCardRef.current, {
        width: 360,
        height: 450,
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: "#15130f",
        style: {
          width: "360px",
          height: "450px",
          maxWidth: "none",
          aspectRatio: "auto",
          overflow: "hidden",
        },
      });
      const filename = `longhair-guy-${resultContent.code}.png`;
      setDownloadInfo({ href: dataUrl, filename });
      await downloadImage(dataUrl, filename);
      setNotice("已生成 1080x1350 PNG。如未自动下载，可点备用保存链接。");
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
      <section className={`phone-stage phase-${phase}`} aria-live="polite">
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
            sharePanelRef={sharePanelRef}
            shareCardRef={shareCardRef}
            downloadInfo={downloadInfo}
            onShowShare={openSharePanel}
            onRegenerate={regenerateShareLine}
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
    <div className="screen home-screen" data-testid="home-screen">
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
      <button className="primary-button home-start-button" data-testid="start-quiz" type="button" onClick={onStart}>
        <span>开始鉴定</span>
        <ArrowRight aria-hidden="true" size={30} />
      </button>
      <button className="link-button home-about-button" type="button" onClick={onAbout}>
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
    <div className="screen quiz-screen" data-testid="quiz-screen">
      <header className="quiz-header">
        <div className="brand-small">
          <span>长发男鉴定器</span>
          <small>LONG HAIR GUY DETECTOR</small>
        </div>
        <div className="question-count" data-testid="quiz-count">
          {String(currentIndex + 1).padStart(2, "0")} / 24
        </div>
        <div className="progress-track" style={{ "--progress-x": `${progress}%` } as CSSProperties}>
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
  sharePanelRef,
  shareCardRef,
  downloadInfo,
  onShowShare,
  onRegenerate,
  onSave,
  onCopy,
  onRestart,
}: {
  scoreResult: NonNullable<ReturnType<typeof scoreAnswers>>;
  showShare: boolean;
  shareLine: string;
  notice: string;
  sharePanelRef: React.RefObject<HTMLElement>;
  shareCardRef: React.RefObject<HTMLDivElement>;
  downloadInfo: DownloadInfo | null;
  onShowShare: () => void;
  onRegenerate: () => void;
  onSave: () => void;
  onCopy: () => void;
  onRestart: () => void;
}) {
  const result = getResultByCode(scoreResult.code);

  return (
    <div className="screen result-screen" data-testid="result-screen">
      <button className="result-back-button" type="button" aria-label="返回重新测试" onClick={onRestart}>
        <ChevronLeft aria-hidden="true" size={22} />
      </button>
      <p className="result-prefix">→ 鉴定完成 ←</p>
      <h1>{result.shortName}</h1>
      <p className="result-tagline">{result.tagline}</p>
      <p className="result-code">
        {scoreResult.code} / {result.sceneName}
      </p>

      <section className="result-hero-grid" aria-label="结果画像与四轴评分">
        <div className="portrait-collage" aria-hidden="true">
          <span className="portrait-scrap top" />
          <img src={RESULT_PORTRAIT_SRC} alt="" />
          <span className="portrait-scrap bottom" />
          <span className="portrait-thread" />
        </div>
        <AxisBars scoreResult={scoreResult} />
      </section>

      <section className="result-copy-grid">
        <article className="result-section">
          <h2>你的视角</h2>
          <p>{result.description}</p>
        </article>
        <article className="result-section danger-note">
          <h2>危险倾向</h2>
          <ul>
            {result.danger.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="reading-strip">
        <div>
          <span>精神同伙</span>
          <p>{result.companions.join(" / ")}</p>
        </div>
        <div>
          <span>推荐阅读</span>
          <p>{result.readings.join(" / ")}</p>
        </div>
      </section>

      <div className="action-row">
        <button className="primary-button small" data-testid="open-share-card" type="button" onClick={onShowShare}>
          <Share2 aria-hidden="true" size={20} />
          <span>生成图卡</span>
        </button>
        <button className="ghost-button" type="button" onClick={onRestart}>
          <RotateCcw aria-hidden="true" size={19} />
          <span>再测一次</span>
        </button>
      </div>

      {showShare && (
        <section className="share-panel" data-testid="share-panel" aria-label="分享卡预览" ref={sharePanelRef}>
          <div className="share-panel-heading">
            <p>SHARE POSTER</p>
            <h2>分享卡已生成</h2>
          </div>
          <ShareCard refObject={shareCardRef} scoreResult={scoreResult} shareLine={shareLine} />
          <div className="action-row compact">
            <button className="primary-button small" data-testid="save-share-card" type="button" onClick={onSave}>
              <Download aria-hidden="true" size={19} />
              <span>保存图片</span>
            </button>
            <button className="ghost-button" type="button" onClick={onRegenerate}>
              <RotateCcw aria-hidden="true" size={18} />
              <span>重新生成文案</span>
            </button>
            <button className="ghost-button" type="button" onClick={onCopy}>
              <Copy aria-hidden="true" size={19} />
              <span>复制结果链接</span>
            </button>
          </div>
          {notice && <p className="notice">{notice}</p>}
          {downloadInfo && (
            <a className="download-fallback" href={downloadInfo.href} download={downloadInfo.filename}>
              备用保存链接
            </a>
          )}
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
  scoreResult,
  shareLine,
}: {
  refObject: React.RefObject<HTMLDivElement>;
  scoreResult: NonNullable<ReturnType<typeof scoreAnswers>>;
  shareLine: string;
}) {
  const result = getResultByCode(scoreResult.code);

  return (
    <div className="share-card" ref={refObject}>
      <div className="share-card-noise" aria-hidden="true" />
      <span className="share-card-tape" aria-hidden="true">VISION IS A KNOT.</span>
      <p className="share-card-label">LONG HAIR GUY DETECTOR</p>
      <div className="share-portrait-frame" aria-hidden="true">
        <span className="share-moon" />
        <img src={SHARE_PORTRAIT_SRC} alt="" />
        <span className="share-red-thread" />
      </div>
      <div className="share-card-copy">
        <p className="share-card-kicker">我是</p>
        <h2>{result.shortName}</h2>
        <p className="share-card-scene">{result.sceneName}</p>
        <p className="share-card-line">{shareLine}</p>
      </div>
      <div className="share-score-grid" aria-label="四轴分数">
        {(Object.keys(scoreResult.axisScores) as Axis[]).map((axis) => {
          const axisScore = scoreResult.axisScores[axis];
          return (
            <div key={axis}>
              <span>{AXIS_LABELS[axis]}</span>
              <strong>{axisScore.pole}</strong>
              <em>{axisScore.strength}</em>
            </div>
          );
        })}
      </div>
      <div className="share-card-footer">
        <div>
          <span>{scoreResult.code}</span>
          <span>娱乐测试，不构成人格诊断</span>
        </div>
        <div className="share-card-qr" aria-label={`扫码进入 ${SITE_URL}`}>
          <img src={SITE_QR_SRC} alt="" />
          <span>扫码来测</span>
        </div>
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

function clearResultUrl() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("result");
  window.history.replaceState(null, "", url.toString());
}

function buildResultUrl(code: ResultCode) {
  const url = new URL(window.location.href);
  url.searchParams.set("result", code);
  return url.toString();
}

async function downloadImage(dataUrl: string, filename: string) {
  let objectUrl: string | null = null;
  const link = document.createElement("a");

  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
  } catch {
    link.href = dataUrl;
  }

  link.download = filename;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();

  if (objectUrl) {
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}

export default App;
