import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  ArrowCounterClockwise,
  GridFour,
  Eye,
  EyeSlash,
  Monitor,
  DeviceMobile,
  Square,
  TextT,
  Sparkle,
  Palette,
  FilmStrip,
  VideoCamera,
  DownloadSimple,
  Copy,
  Check,
  SpeakerHigh,
  SpeakerSimpleSlash,
  Lightning,
  SkipBack,
  Stack,
  Textbox,
  Clock
} from '@phosphor-icons/react';

// ==========================================
// 1. Style Guidelines & Presets
// ==========================================
export interface StyleGuideline {
  id: string;
  name: string;
  category: string;
  description: string;
  bgClass: string;
  textClass: string;
  subClass: string;
  titleClass: string;
  cardStyle: string;
  fontFamily: 'outfit' | 'mono' | 'sans' | 'serif' | 'pretendard' | 'noto-sans-kr';
  accentColor: string;
  isDark: boolean;
  glowEffect?: string;
}

const STYLE_GUIDELINES: StyleGuideline[] = [
  {
    id: 'pretendard-clean',
    name: 'Pretendard Modern',
    category: 'Korean Minimalist',
    description: 'Clean Pretendard typography, sleek slate backdrop, smooth spring physics & vibrant orange cursor accent.',
    bgClass: 'bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-black',
    textClass: 'text-slate-900 dark:text-slate-100 font-[Pretendard,sans-serif] tracking-tight',
    subClass: 'text-slate-500 dark:text-slate-400',
    titleClass: 'text-slate-900 dark:text-white font-bold tracking-tight',
    cardStyle: 'backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xl',
    fontFamily: 'pretendard',
    accentColor: '#FF5A1F',
    isDark: false
  },
  {
    id: 'noto-sans-korean',
    name: 'Noto Sans KR Focus',
    category: 'Editorial Hangul',
    description: 'Legible Noto Sans KR display, warm ivory background, crisp corporate blue accent.',
    bgClass: 'bg-gradient-to-br from-[#faf7f2] via-[#f3ede2] to-[#e8dfd1]',
    textClass: 'text-[#1e293b] font-[Noto_Sans_KR,sans-serif] tracking-tight',
    subClass: 'text-[#475569] font-medium',
    titleClass: 'text-[#0c4da2] font-black tracking-tight',
    cardStyle: 'bg-[#faf7f2]/90 border border-[#d6c7b2] shadow-md',
    fontFamily: 'noto-sans-kr',
    accentColor: '#0c4da2',
    isDark: false
  },
  {
    id: 'apple-style',
    name: 'Apple Style Glass',
    category: 'Cupertino Minimalist',
    description: 'Clean SF-style typography, glassmorphic backdrop, subtle ambient glows & smooth spring physics.',
    bgClass: 'bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-black',
    textClass: 'text-slate-900 dark:text-slate-100 font-sans tracking-tight',
    subClass: 'text-slate-500 dark:text-slate-400',
    titleClass: 'text-slate-900 dark:text-white font-bold tracking-tight',
    cardStyle: 'backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xl',
    fontFamily: 'sans',
    accentColor: '#0071e3',
    isDark: false
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    category: 'Futuristic OLED',
    description: 'High-contrast dark grid, glowing cyan & magenta neon text, monospace futuristic typography.',
    bgClass: 'bg-radial from-[#0d1322] via-[#050810] to-[#010206]',
    textClass: 'text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] font-mono tracking-widest',
    subClass: 'text-fuchsia-300 drop-shadow-[0_0_8px_rgba(240,171,252,0.6)]',
    titleClass: 'text-fuchsia-400 drop-shadow-[0_0_16px_rgba(232,121,249,0.9)] font-mono font-black uppercase tracking-widest',
    cardStyle: 'bg-slate-950/90 border border-cyan-500/40 shadow-[0_0_25px_rgba(34,211,238,0.15)]',
    fontFamily: 'mono',
    accentColor: '#06b6d4',
    isDark: true,
    glowEffect: 'drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]'
  },
  {
    id: 'swiss-modern',
    name: 'Swiss Modernist',
    category: 'Bauhaus Graphic',
    description: 'Stark geometric grid, high contrast, vivid crimson red accent, bold uppercase typography.',
    bgClass: 'bg-[#f4f3ef]',
    textClass: 'text-neutral-900 font-sans font-black uppercase tracking-tighter',
    subClass: 'text-[#e63946] font-sans font-bold',
    titleClass: 'text-[#e63946] font-sans font-black uppercase tracking-tight',
    cardStyle: 'bg-white border-2 border-neutral-900 shadow-[4px_4px_0px_#000]',
    fontFamily: 'sans',
    accentColor: '#e63946',
    isDark: false
  },
  {
    id: 'editorial-ivory',
    name: 'Editorial Luxury',
    category: 'Classic Magazine',
    description: 'Classic luxury serif typography, warm paper ivory tone, dark bronze hierarchy.',
    bgClass: 'bg-gradient-to-br from-[#faf7f2] via-[#f3ede2] to-[#e8dfd1]',
    textClass: 'text-[#2c221e] font-serif tracking-wide',
    subClass: 'text-[#6e5849] font-serif italic',
    titleClass: 'text-[#1c1512] font-serif font-bold italic',
    cardStyle: 'bg-[#faf7f2]/90 border border-[#d6c7b2] shadow-md',
    fontFamily: 'serif',
    accentColor: '#8c6d46',
    isDark: false
  }
];

// ==========================================
// 2. Preset Text Templates
// ==========================================
export interface TextTemplate {
  id: string;
  name: string;
  category: string;
  title: string;
  phrase: string;
  outro: string;
}

const SCRIPT_TEMPLATES: TextTemplate[] = [
  {
    id: 'korean-goal',
    name: '한국어 학습 목표 (Multi-line)',
    category: 'Korean Education',
    title: '학습 목표',
    phrase: '‘-아서/어서’가 나타내는 시간 순서의 의미를 알고,\n자신의 일과를 순서대로 표현할 수 있다.',
    outro: '한국어 문법 학습 04단계'
  },
  {
    id: 'apple-keynote',
    name: 'Apple Keynote Intro',
    category: 'Product & Tech',
    title: 'Think Different',
    phrase: 'Design is not just what it looks like.\nDesign is how it works.',
    outro: 'Special Apple Event'
  },
  {
    id: 'tech-announce',
    name: 'Next-Gen Launch',
    category: 'Product & Tech',
    title: 'Introducing AG-2.0',
    phrase: 'Faster, Sleeker, and Reimagined.\nBuilt from the ground up for infinite possibilities.',
    outro: 'Available World Wide'
  },
  {
    id: 'cinematic-teaser',
    name: 'Cinematic Teaser',
    category: 'Entertainment',
    title: 'THE DISCOVERY',
    phrase: 'In a world of infinite choices,\none bold decision changes everything forever.',
    outro: 'Coming This Autumn'
  }
];

export type EffectType = 'typing' | 'slideInOut' | 'dropdown' | 'zoomBounce' | 'elasticFlip' | 'minimalFade';

export interface EffectConfig {
  id: EffectType;
  name: string;
  badge: string;
  description: string;
}

const KINETIC_EFFECTS: EffectConfig[] = [
  {
    id: 'typing',
    name: 'Typewriter Effect (타이핑 이펙트)',
    badge: 'Classic',
    description: 'Character-by-character typewriter effect with custom accent color cursor and synchronized audio clicks.'
  },
  {
    id: 'slideInOut',
    name: 'Text Slide In-Out (슬라이드인-아웃)',
    badge: 'Popular',
    description: 'Directional spring sliding motion with velocity blur.'
  },
  {
    id: 'dropdown',
    name: 'Dropdown & Drop-Out (드롭다운/드롭아웃)',
    badge: 'Bouncy',
    description: 'Bouncy vertical drop-down with overshoot physics.'
  },
  {
    id: 'zoomBounce',
    name: 'Zoom & Spring Bounce (줌 앤 바운스)',
    badge: 'Dynamic',
    description: 'Depth scale bounce with defocus zoom-in.'
  },
  {
    id: 'elasticFlip',
    name: 'Elastic 3D Flip (3D 회전 이펙트)',
    badge: '3D Motion',
    description: 'Elastic 3D perspective flip recoil along X axis.'
  },
  {
    id: 'minimalFade',
    name: 'Minimal Cross-Fade (미니멀 크로스페이드)',
    badge: 'Minimal',
    description: 'Ultra-clean opacity fade favored by minimal design.'
  }
];

// ==========================================
// 2.5 Canvas Background Presets (Transparent, Off-White, Core, Broadcast)
// ==========================================
export interface BackgroundPreset {
  id: string;
  name: string;
  category: 'transparent' | 'offwhite' | 'core' | 'broadcast';
  categoryLabel: string;
  description: string;
  bgClass?: string;
  customStyle?: React.CSSProperties;
  previewColor: string;
  borderPreview?: string;
  isTransparent?: boolean;
  textTone: 'dark' | 'light' | 'chroma';
  accentRecommendation?: string;
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  // 1. 투명 배경
  {
    id: 'bg-transparent',
    name: '투명 배경 (Alpha)',
    category: 'transparent',
    categoryLabel: '오버레이 합성',
    description: '알파 채널 투명 배경. 프리미어, 파이널컷, OBS 영상 위에 자막/타이포로 바로 합성.',
    isTransparent: true,
    previewColor: 'transparent',
    textTone: 'dark',
    accentRecommendation: '#FF5A1F'
  },
  // 2. 오프화이트 & 라이트 (사용자 요구사항 명시 반영)
  {
    id: 'bg-offwhite-clean',
    name: '스튜디오 클린 오프화이트',
    category: 'offwhite',
    categoryLabel: '오프화이트',
    description: '눈부심이 없는 따뜻한 미색 오프화이트(#FAF9F6). 교육 및 비즈니스 영상 최적.',
    customStyle: { backgroundColor: '#FAF9F6' },
    previewColor: '#FAF9F6',
    borderPreview: '#E5E4DE',
    textTone: 'dark',
    accentRecommendation: '#FF5A1F'
  },
  {
    id: 'bg-offwhite-swiss',
    name: '스위스 바우하우스 오프화이트',
    category: 'offwhite',
    categoryLabel: '오프화이트',
    description: '스위스 모던 그래픽 표준 오프화이트(#F4F3EF). 높은 시인성과 고급스러운 종이 질감.',
    customStyle: { backgroundColor: '#F4F3EF' },
    previewColor: '#F4F3EF',
    borderPreview: '#DDDCD7',
    textTone: 'dark',
    accentRecommendation: '#E63946'
  },
  {
    id: 'bg-offwhite-ivory',
    name: '웜 아이보리 페이퍼',
    category: 'offwhite',
    categoryLabel: '오프화이트',
    description: '따뜻한 한지/아이보리 그라데이션. 인문학 및 감성 메시지에 최적.',
    bgClass: 'bg-gradient-to-br from-[#faf7f2] via-[#f3ede2] to-[#e8dfd1]',
    previewColor: '#F3EDE2',
    borderPreview: '#D6C7B2',
    textTone: 'dark',
    accentRecommendation: '#0C4DA2'
  },
  // 3. 다크 & 테마 코어
  {
    id: 'bg-modern-slate',
    name: '모던 슬레이트 다크',
    category: 'core',
    categoryLabel: '테마 코어',
    description: '세련된 슬레이트 딥 다크 그라데이션. Pretendard 폰트와 최고 궁합.',
    bgClass: 'bg-gradient-to-b from-slate-900 via-slate-950 to-black',
    previewColor: '#0F172A',
    textTone: 'light',
    accentRecommendation: '#38BDF8'
  },
  {
    id: 'bg-apple-glass',
    name: '애플 SF 글래스',
    category: 'core',
    categoryLabel: '테마 코어',
    description: '애플 스타일 글래스모피즘 블러 효과와 차분한 그레이스케일.',
    bgClass: 'backdrop-blur-xl bg-slate-900/80',
    previewColor: '#1E293B',
    textTone: 'light',
    accentRecommendation: '#0071E3'
  },
  {
    id: 'bg-cyberpunk-neon',
    name: '사이버펑크 OLED 블랙',
    category: 'core',
    categoryLabel: '테마 코어',
    description: '네온 발광 텍스트를 극대화하는 방사형 심층 블랙.',
    bgClass: 'bg-radial from-[#0d1322] via-[#050810] to-[#010206]',
    previewColor: '#050810',
    textTone: 'light',
    accentRecommendation: '#06B6D4'
  },
  // 4. 방송/영상 제작 전용
  {
    id: 'bg-chroma-green',
    name: '크로마키 그린 (Green Screen)',
    category: 'broadcast',
    categoryLabel: '방송 제작용',
    description: '표준 방송 크로마키(#00FF00). 편집기 Ultra Key 추출에 최적.',
    customStyle: { backgroundColor: '#00FF00' },
    previewColor: '#00FF00',
    textTone: 'chroma',
    accentRecommendation: '#000000'
  },
  {
    id: 'bg-chroma-blue',
    name: '크로마키 블루 (Blue Screen)',
    category: 'broadcast',
    categoryLabel: '방송 제작용',
    description: '초록 그래픽/의상 촬영 시 사용하는 방송 표준 블루스크린(#0047AB).',
    customStyle: { backgroundColor: '#0047AB' },
    previewColor: '#0047AB',
    textTone: 'light',
    accentRecommendation: '#FFFFFF'
  },
  {
    id: 'bg-studio-navy',
    name: '방송 뉴스룸 스튜디오 네이비',
    category: 'broadcast',
    categoryLabel: '방송 제작용',
    description: '신뢰감을 주는 뉴스룸 및 다큐멘터리 인터뷰 딥 네이비 비네트.',
    bgClass: 'bg-gradient-to-b from-[#0a192f] via-[#0f2744] to-[#050c1a]',
    previewColor: '#0A192F',
    textTone: 'light',
    accentRecommendation: '#F59E0B'
  },
  {
    id: 'bg-amoled-black',
    name: '쇼츠/릴스 AMOLED 슈퍼블랙',
    category: 'broadcast',
    categoryLabel: '방송 제작용',
    description: '완전 무광 블랙(#000000). 숏폼 모바일 디스플레이 가독성 1위.',
    customStyle: { backgroundColor: '#000000' },
    previewColor: '#000000',
    textTone: 'light',
    accentRecommendation: '#FACC15'
  },
  {
    id: 'bg-lower-third-scrim',
    name: '하단 1/3 로어써드 페이드',
    category: 'broadcast',
    categoryLabel: '방송 제작용',
    description: '상단 투명, 하단 50% 딥 그라데이션. 실제 인물 영상 위 하단 자막용.',
    bgClass: 'bg-gradient-to-t from-black/90 via-black/40 to-transparent',
    previewColor: '#1E293B',
    textTone: 'light',
    accentRecommendation: '#38BDF8'
  }
];

function playAudioClick(type: 'type' | 'transition' = 'type') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'type') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.02);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    }
  } catch (e) {
    // Ignore audio errors
  }
}

export default function KineticTypography(): React.ReactElement {
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<'style' | 'text' | 'effects' | 'export'>('style');

  // Script & Text Content (Preserving Line Breaks)
  const [titleText, setTitleText] = useState('학습 목표');
  const [phraseText, setPhraseText] = useState(
    '‘-아서/어서’가 나타내는 시간 순서의 의미를 알고,\n자신의 일과를 순서대로 표현할 수 있다.'
  );
  const [outroText, setOutroText] = useState('한국어 문법 학습 04단계');

  // Custom text input draft fields
  const [inputTitle, setInputTitle] = useState(titleText);
  const [inputPhrase, setInputPhrase] = useState(phraseText);
  const [inputOutro, setInputOutro] = useState(outroText);

  // Requirement 1: Breakdown Display Mode ('single' flash vs 'cumulative' persistent build-up)
  const [breakdownMode, setBreakdownMode] = useState<'single' | 'cumulative'>('single');

  // Requirement 2: Cursor Accent Color ('#FF5A1F' Orange, '#0c4da2' Blue, '#10b981' Emerald, '#a855f7' Purple)
  const [cursorColor, setCursorColor] = useState<string>('#FF5A1F');

  // Background Selection State (Transparent, Off-White, Core Theme, Broadcast)
  const [selectedBgId, setSelectedBgId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const bgParam = params.get('bg');
      if (bgParam && BACKGROUND_PRESETS.some(b => b.id === bgParam)) return bgParam;
    }
    return 'bg-offwhite-clean'; // Default to comfortable Studio Clean Off-White
  });

  // Dedicated Render Mode check (?mode=render or ?canvasOnly=true)
  const [isRenderMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('mode') === 'render' || params.get('canvasOnly') === 'true';
    }
    return false;
  });

  // Requirement 3: Style Guidelines & Fonts (Added Pretendard & Noto Sans KR)
  const [activeStyleId, setActiveStyleId] = useState<string>('pretendard-clean');
  const [fontFamily, setFontFamily] = useState<'outfit' | 'mono' | 'sans' | 'serif' | 'pretendard' | 'noto-sans-kr'>('pretendard');
  const [textWeight, setTextWeight] = useState<'normal' | 'semibold' | 'bold' | 'black'>('bold');

  // Motion Effect Selection & Parameters
  const [activeEffect, setActiveEffect] = useState<EffectType>('typing');
  const [slideDirection, setSlideDirection] = useState<'up' | 'down' | 'left' | 'right'>('up');
  const [springStiffness, setSpringStiffness] = useState(130);
  const [springDamping, setSpringDamping] = useState(14);

  // Canvas Display & Aspect Ratio
  const [aspectRatio, setAspectRatio] = useState<'16-9' | '9-16' | '1-1'>('16-9');
  const [wordFontSize, setWordFontSize] = useState(54); // px
  const [finalFontSize, setFinalFontSize] = useState(24); // px

  // Timeline Durations (Added holdDuration: 1.5 seconds pause after breakdown completion)
  const [titleDuration, setTitleDuration] = useState(1.5); // sec
  const [wordDuration, setWordDuration] = useState(0.8); // sec per word
  const [holdDuration, setHoldDuration] = useState(1.5); // sec pause after text display completion
  const [finalDuration, setFinalDuration] = useState(3.5); // sec

  // Video Controls & Player State
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isLooping, setIsLooping] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Canvas Overlays
  const [showGrid, setShowGrid] = useState(false);
  const [showSafeAreas, setShowSafeAreas] = useState(false);

  // Recording / Export State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Derived active style
  const activeStyle = useMemo(() => {
    return STYLE_GUIDELINES.find(s => s.id === activeStyleId) || STYLE_GUIDELINES[0];
  }, [activeStyleId]);

  // Derived active background preset (Off-White, Transparent, Core, Broadcast)
  const activeBg = useMemo(() => {
    return BACKGROUND_PRESETS.find(b => b.id === selectedBgId) || BACKGROUND_PRESETS[1];
  }, [selectedBgId]);

  // Derived text color class adapting to background textTone
  const effectiveTextClass = useMemo(() => {
    if (activeBg.textTone === 'dark') {
      return 'text-slate-900';
    } else if (activeBg.textTone === 'chroma') {
      return 'text-neutral-950 font-black';
    } else {
      return 'text-white drop-shadow-md';
    }
  }, [activeBg.textTone]);

  const effectiveTitleClass = useMemo(() => {
    if (activeBg.textTone === 'dark') {
      return 'text-slate-900 font-extrabold';
    } else if (activeBg.textTone === 'chroma') {
      return 'text-neutral-950 font-black';
    } else {
      return 'text-white font-extrabold drop-shadow-lg';
    }
  }, [activeBg.textTone]);

  // Requirement 4 & 5: Parse multi-line phraseText preserving line breaks and Unicode grapheme integrity
  const structuredLines = useMemo(() => {
    const rawLines = phraseText.split('\n');
    let globalIndex = 0;
    return rawLines.map((lineStr, lineIdx) => {
      const lineWords = lineStr.split(/\s+/).filter(w => w.length > 0);
      const wordObjs = lineWords.map(w => ({
        index: globalIndex++,
        text: w,
        lineIndex: lineIdx
      }));
      return { lineIndex: lineIdx, rawText: lineStr, words: wordObjs };
    });
  }, [phraseText]);

  // Flat list of words for total duration & indexing
  const words = useMemo(() => {
    return structuredLines.flatMap(l => l.words.map(w => w.text));
  }, [structuredLines]);

  const wordsTotalDuration = useMemo(() => words.length * wordDuration, [words.length, wordDuration]);
  const totalDuration = useMemo(() => {
    return titleDuration + wordsTotalDuration + holdDuration + finalDuration;
  }, [titleDuration, wordsTotalDuration, holdDuration, finalDuration]);

  // Phase Determination with 1.5s Hold Pause after text display completes
  const activePhase = useMemo<'title' | 'words' | 'hold' | 'final'>(() => {
    if (currentTime < titleDuration) {
      return 'title';
    } else if (currentTime < titleDuration + wordsTotalDuration) {
      return 'words';
    } else if (currentTime < titleDuration + wordsTotalDuration + holdDuration) {
      return 'hold';
    } else {
      return 'final';
    }
  }, [currentTime, titleDuration, wordsTotalDuration, holdDuration]);

  // Word index in sequence
  const activeWordIndex = useMemo(() => {
    if (activePhase === 'words') {
      const elapsed = currentTime - titleDuration;
      const index = Math.floor(elapsed / wordDuration);
      return Math.max(0, Math.min(words.length - 1, index));
    } else if (activePhase === 'hold') {
      return words.length - 1; // Hold phase shows all words completed!
    } else {
      return -1;
    }
  }, [activePhase, currentTime, titleDuration, wordDuration, words.length]);

  // Typewriter progress state calculation
  const activeWordProgress = useMemo(() => {
    if (activePhase === 'hold') return 1.0; // 100% typed during hold phase
    if (activePhase !== 'words' || activeWordIndex < 0) return 0;
    const wordStartTime = titleDuration + activeWordIndex * wordDuration;
    const elapsedInWord = currentTime - wordStartTime;
    return Math.max(0, Math.min(1, elapsedInWord / wordDuration));
  }, [activePhase, activeWordIndex, currentTime, titleDuration, wordDuration]);

  // References for animation loop
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const videoViewportRef = useRef<HTMLDivElement | null>(null);

  // Sound click trigger refs
  const lastSoundWordRef = useRef<number>(-1);
  const lastSoundCharRef = useRef<number>(-1);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      previousTimeRef.current = null;
      return;
    }

    const animate = (time: number) => {
      if (previousTimeRef.current !== null) {
        const delta = (time - previousTimeRef.current) / 1000;
        setCurrentTime(prev => {
          const next = prev + delta * playbackSpeed;
          if (next >= totalDuration) {
            if (isLooping) {
              return 0;
            } else {
              setIsPlaying(false);
              return totalDuration;
            }
          }
          return next;
        });
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, totalDuration, isLooping]);

  // Audio Click Trigger Sync
  useEffect(() => {
    if (!soundEnabled || !isPlaying) return;

    if (activePhase === 'words' && activeWordIndex >= 0 && activeWordIndex < words.length) {
      const currentWord = words[activeWordIndex];

      if (activeEffect === 'typing') {
        const charArray = Array.from(currentWord);
        const currentCharCount = Math.floor(activeWordProgress * charArray.length);
        if (currentCharCount !== lastSoundCharRef.current) {
          lastSoundCharRef.current = currentCharCount;
          playAudioClick('type');
        }
      } else {
        if (activeWordIndex !== lastSoundWordRef.current) {
          lastSoundWordRef.current = activeWordIndex;
          playAudioClick('transition');
        }
      }
    }
  }, [activePhase, activeWordIndex, activeWordProgress, activeEffect, words, soundEnabled, isPlaying]);

  const handleReset = useCallback(() => {
    setCurrentTime(0);
    setIsPlaying(true);
    lastSoundWordRef.current = -1;
    lastSoundCharRef.current = -1;
  }, []);

  const handleApplyCustomScript = () => {
    setTitleText(inputTitle);
    setPhraseText(inputPhrase);
    setOutroText(inputOutro);
    handleReset();
  };

  const handleSelectTemplate = (template: TextTemplate) => {
    setTitleText(template.title);
    setPhraseText(template.phrase);
    setOutroText(template.outro);
    setInputTitle(template.title);
    setInputPhrase(template.phrase);
    setInputOutro(template.outro);
    handleReset();
  };

  const handleSelectStyle = (style: StyleGuideline) => {
    setActiveStyleId(style.id);
    setFontFamily(style.fontFamily);
    if (style.accentColor) {
      setCursorColor(style.accentColor);
    }
    // Automatically match suitable background for preset
    if (style.id === 'cyberpunk-neon') {
      setSelectedBgId('bg-cyberpunk-neon');
    } else if (style.id === 'apple-style') {
      setSelectedBgId('bg-apple-glass');
    } else if (style.id === 'swiss-modern') {
      setSelectedBgId('bg-offwhite-swiss');
    } else if (style.id === 'noto-sans-korean' || style.id === 'editorial-ivory') {
      setSelectedBgId('bg-offwhite-ivory');
    } else if (style.id === 'pretendard-clean') {
      setSelectedBgId('bg-offwhite-clean');
    }
    handleReset();
  };

  // Requirement 3: Extended Font Family Helper with Korean Pretendard & Noto Sans KR
  const getFontFamilyStyle = () => {
    switch (fontFamily) {
      case 'pretendard':
        return 'font-[Pretendard,sans-serif]';
      case 'noto-sans-kr':
        return 'font-[Noto_Sans_KR,sans-serif]';
      case 'mono':
        return 'font-mono';
      case 'serif':
        return 'font-serif';
      case 'sans':
      case 'outfit':
      default:
        return 'font-sans';
    }
  };

  const getFontWeightStyle = () => {
    switch (textWeight) {
      case 'normal':
        return 'font-normal';
      case 'semibold':
        return 'font-semibold';
      case 'black':
        return 'font-black';
      default:
        return 'font-bold';
    }
  };

  // Framer Motion Variants computation
  const motionVariants = useMemo(() => {
    const springTransition = {
      type: 'spring' as const,
      stiffness: springStiffness,
      damping: springDamping
    };

    switch (activeEffect) {
      case 'slideInOut': {
        const xOffset = slideDirection === 'left' ? -180 : slideDirection === 'right' ? 180 : 0;
        const yOffset = slideDirection === 'up' ? 120 : slideDirection === 'down' ? -120 : 0;
        return {
          initial: { x: xOffset, y: yOffset, opacity: 0, filter: 'blur(12px)', scale: 0.96 },
          animate: { x: 0, y: 0, opacity: 1, filter: 'blur(0px)', scale: 1 },
          exit: { x: -xOffset, y: -yOffset, opacity: 0, filter: 'blur(12px)', scale: 0.96 },
          transition: springTransition
        };
      }
      case 'dropdown': {
        return {
          initial: { y: -240, opacity: 0, scaleY: 1.25, filter: 'blur(4px)' },
          animate: { y: 0, opacity: 1, scaleY: 1, filter: 'blur(0px)' },
          exit: { y: 260, opacity: 0, scaleY: 0.8, filter: 'blur(6px)' },
          transition: { type: 'spring' as const, stiffness: springStiffness, damping: Math.max(8, springDamping - 4) }
        };
      }
      case 'zoomBounce': {
        return {
          initial: { scale: 0.5, opacity: 0, filter: 'blur(6px)' },
          animate: { scale: 1, opacity: 1, filter: 'blur(0px)' },
          exit: { scale: 1.4, opacity: 0, filter: 'blur(8px)' },
          transition: springTransition
        };
      }
      case 'elasticFlip': {
        return {
          initial: { rotateX: -90, opacity: 0, scale: 0.8 },
          animate: { rotateX: 0, opacity: 1, scale: 1 },
          exit: { rotateX: 90, opacity: 0, scale: 0.8 },
          transition: springTransition
        };
      }
      case 'minimalFade': {
        return {
          initial: { opacity: 0, filter: 'blur(2px)' },
          animate: { opacity: 1, filter: 'blur(0px)' },
          exit: { opacity: 0, filter: 'blur(2px)' },
          transition: { duration: 0.3, ease: 'easeInOut' as const }
        };
      }
      case 'typing':
      default: {
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { duration: 0.15 }
        };
      }
    }
  }, [activeEffect, slideDirection, springStiffness, springDamping]);

  // Actual High-Fidelity Canvas Video Recorder using MediaRecorder API
  const handleStartRecording = async () => {
    setIsRecording(true);
    setRecordingProgress(0);
    setRecordedVideoUrl(null);
    setIsPlaying(false);

    // Resolution based on Aspect Ratio
    let width = 1920;
    let height = 1080;
    if (aspectRatio === '9-16') {
      width = 1080;
      height = 1920;
    } else if (aspectRatio === '1-1') {
      width = 1080;
      height = 1080;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      alert('Canvas 2D context is not available.');
      setIsRecording(false);
      return;
    }

    // Supported MIME types detection
    let mimeType = 'video/webm;codecs=vp9';
    if (typeof MediaRecorder !== 'undefined' && !MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
    }

    const stream = canvas.captureStream(30); // 30 FPS
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 8000000 // 8 Mbps high quality
    });

    const recordedChunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      setIsRecording(false);
      setRecordingProgress(100);
      setIsPlaying(true);
    };

    recorder.start();

    // Render frame by frame
    const fps = 30;
    const totalFrames = Math.ceil(totalDuration * fps);
    let frame = 0;

    const renderLoop = () => {
      if (frame > totalFrames) {
        recorder.stop();
        return;
      }

      const t = frame / fps;
      setCurrentTime(t);
      const progress = Math.min(100, Math.floor((frame / totalFrames) * 100));
      setRecordingProgress(progress);

      // 1. Draw Background
      ctx.clearRect(0, 0, width, height);
      if (activeBg.isTransparent) {
        // Transparent WebM with VP9 Alpha Channel!
      } else if (activeBg.id === 'bg-offwhite-clean') {
        ctx.fillStyle = '#FAF9F6';
        ctx.fillRect(0, 0, width, height);
      } else if (activeBg.id === 'bg-offwhite-swiss') {
        ctx.fillStyle = '#F4F3EF';
        ctx.fillRect(0, 0, width, height);
      } else if (activeBg.id === 'bg-offwhite-ivory') {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#FAF7F2');
        grad.addColorStop(0.5, '#F3EDE2');
        grad.addColorStop(1, '#E8DFD1');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (activeBg.id === 'bg-chroma-green') {
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(0, 0, width, height);
      } else if (activeBg.id === 'bg-chroma-blue') {
        ctx.fillStyle = '#0047AB';
        ctx.fillRect(0, 0, width, height);
      } else if (activeBg.id === 'bg-studio-navy') {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#0A192F');
        grad.addColorStop(0.5, '#0F2744');
        grad.addColorStop(1, '#050C1A');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (activeBg.id === 'bg-amoled-black') {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
      } else if (activeBg.id === 'bg-lower-third-scrim') {
        const grad = ctx.createLinearGradient(0, height * 0.5, 0, height);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.88)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#0F172A');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw Typography Text
      const scale = width / 1280;
      const fontName = fontFamily === 'pretendard' ? 'Pretendard, sans-serif' : fontFamily === 'noto-sans-kr' ? 'Noto Sans KR, sans-serif' : 'sans-serif';
      const weight = textWeight === 'black' ? '900' : textWeight === 'bold' ? '700' : '500';

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let textColor = '#0F172A';
      if (activeBg.textTone === 'light') textColor = '#FFFFFF';
      if (activeBg.textTone === 'chroma') textColor = activeBg.id === 'bg-chroma-green' ? '#000000' : '#FFFFFF';

      ctx.fillStyle = textColor;

      if (t < titleDuration) {
        // Phase 1: Title
        ctx.font = `${weight} ${Math.floor(wordFontSize * 1.3 * scale)}px ${fontName}`;
        ctx.fillText(titleText, width / 2, height / 2);
      } else if (t < titleDuration + wordsTotalDuration + holdDuration) {
        // Phase 2 & Hold: Words
        const elapsed = t - titleDuration;
        const currentIdx = Math.min(words.length - 1, Math.floor(elapsed / wordDuration));
        const inHold = t >= titleDuration + wordsTotalDuration;

        if (breakdownMode === 'single' && !inHold) {
          // Single word flash
          ctx.font = `${weight} ${Math.floor(wordFontSize * 1.2 * scale)}px ${fontName}`;
          const currentWord = words[currentIdx] || '';
          const wordStart = titleDuration + currentIdx * wordDuration;
          const charProgress = Math.max(0, Math.min(1, (t - wordStart) / wordDuration));
          const visibleChars = Array.from(currentWord).slice(0, Math.max(1, Math.floor(charProgress * Array.from(currentWord).length))).join('');

          ctx.fillText(visibleChars, width / 2, height / 2);

          // Cursor
          const textMetric = ctx.measureText(visibleChars);
          ctx.fillStyle = cursorColor;
          ctx.fillRect(width / 2 + textMetric.width / 2 + 6 * scale, height / 2 - (wordFontSize * scale) / 2, 4 * scale, wordFontSize * scale);
        } else {
          // Cumulative build-up or Single Hold
          const lines = phraseText.split('\n');
          ctx.font = `${weight} ${Math.floor(wordFontSize * 0.8 * scale)}px ${fontName}`;
          const lineHeight = wordFontSize * 1.3 * scale;
          const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

          let wordCounter = 0;
          lines.forEach((line, lineIdx) => {
            const lineWords = line.split(/\s+/).filter(w => w.length > 0);
            let displayLine = '';
            lineWords.forEach((w) => {
              if (inHold || wordCounter <= currentIdx) {
                displayLine += (displayLine ? ' ' : '') + w;
              }
              wordCounter++;
            });
            ctx.fillStyle = textColor;
            ctx.fillText(displayLine, width / 2, startY + lineIdx * lineHeight);
          });
        }
      } else {
        // Phase 3: Outro
        ctx.font = `${weight} ${Math.floor(finalFontSize * 1.5 * scale)}px ${fontName}`;
        ctx.fillText(outroText, width / 2, height / 2);
      }

      frame++;
      setTimeout(renderLoop, 1000 / fps);
    };

    renderLoop();
  };

  const handleCopyFramerMotionCode = () => {
    const codeSnippet = `
// Framer Motion Preset Configuration: ${activeEffect}
const kineticMotionPreset = {
  initial: ${JSON.stringify(motionVariants.initial)},
  animate: ${JSON.stringify(motionVariants.animate)},
  exit: ${JSON.stringify(motionVariants.exit)},
  transition: ${JSON.stringify(motionVariants.transition)}
};
`;
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const formatTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    const ms = Math.floor((timeInSecs % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // URL parameters & Global automation hooks for headless Playwright render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramTitle = params.get('title');
      const paramPhrase = params.get('phrase');
      const paramOutro = params.get('outro');
      const paramBg = params.get('bg');
      const paramRatio = params.get('aspect');

      if (paramTitle) {
        setTitleText(paramTitle);
        setInputTitle(paramTitle);
      }
      if (paramPhrase) {
        setPhraseText(paramPhrase);
        setInputPhrase(paramPhrase);
      }
      if (paramOutro) {
        setOutroText(paramOutro);
        setInputOutro(paramOutro);
      }
      if (paramBg && BACKGROUND_PRESETS.some(b => b.id === paramBg)) {
        setSelectedBgId(paramBg);
      }
      if (paramRatio === '9-16' || paramRatio === '1-1' || paramRatio === '16-9') {
        setAspectRatio(paramRatio);
      }

      // Expose automation hook for Playwright headless rendering
      (window as any).__KINETIC_SET_SCRIPT__ = (script: { title?: string; phrase?: string; outro?: string; bg?: string; aspect?: any }) => {
        if (script.title) { setTitleText(script.title); setInputTitle(script.title); }
        if (script.phrase) { setPhraseText(script.phrase); setInputPhrase(script.phrase); }
        if (script.outro) { setOutroText(script.outro); setInputOutro(script.outro); }
        if (script.bg) { setSelectedBgId(script.bg); }
        if (script.aspect) { setAspectRatio(script.aspect); }
        handleReset();
      };
      (window as any).__KINETIC_GET_DURATION__ = () => totalDuration;
    }
  }, [handleReset, totalDuration]);

  // Clean Fullscreen Render Mode for Headless Playwright / Production Record
  if (isRenderMode) {
    return (
      <div className="w-screen h-screen m-0 p-0 overflow-hidden flex items-center justify-center bg-transparent select-none">
        <div
          ref={videoViewportRef}
          style={
            activeBg.isTransparent
              ? {}
              : activeBg.customStyle || {}
          }
          className={`relative overflow-hidden w-full h-full flex items-center justify-center ${
            activeBg.isTransparent ? '' : activeBg.bgClass || ''
          }`}
        >
          {/* Animation Center Stage */}
          <div className="absolute inset-0 flex items-center justify-center px-16 text-center select-none overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Phase 1: Intro Title */}
              {activePhase === 'title' && (
                <motion.h2
                  key="title-slide"
                  initial={motionVariants.initial}
                  animate={motionVariants.animate}
                  exit={motionVariants.exit}
                  transition={motionVariants.transition}
                  className={`text-5xl md:text-7xl tracking-tight leading-snug ${getFontFamilyStyle()} ${getFontWeightStyle()} ${effectiveTitleClass}`}
                >
                  {titleText}
                </motion.h2>
              )}

              {/* Phase 2 & Hold: Kinetic Words and 1.5s Hold View */}
              {(activePhase === 'words' || activePhase === 'hold') && (
                <>
                  {breakdownMode === 'single' ? (
                    activePhase === 'hold' ? (
                      <motion.div
                        key="hold-full-phrase"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        style={{ fontSize: `${Math.min(wordFontSize * 1.2, 48)}px` }}
                        className={`leading-relaxed tracking-tight whitespace-pre-wrap font-medium ${getFontFamilyStyle()} ${getFontWeightStyle()} ${effectiveTextClass} max-w-[92%]`}
                      >
                        {phraseText}
                      </motion.div>
                    ) : (
                      activeWordIndex >= 0 && activeWordIndex < words.length && (
                        <motion.div
                          key={`single-word-${activeWordIndex}`}
                          initial={activeEffect === 'typing' ? { opacity: 1 } : motionVariants.initial}
                          animate={activeEffect === 'typing' ? { opacity: 1 } : motionVariants.animate}
                          exit={activeEffect === 'typing' ? { opacity: 0 } : motionVariants.exit}
                          transition={motionVariants.transition}
                          style={{ fontSize: `${wordFontSize * 1.3}px` }}
                          className={`leading-tight tracking-tight ${getFontFamilyStyle()} ${getFontWeightStyle()} ${effectiveTextClass} max-w-[92%]`}
                        >
                          {activeEffect === 'typing' ? (
                            <span>
                              {Array.from(words[activeWordIndex])
                                .slice(0, Math.max(1, Math.floor(activeWordProgress * Array.from(words[activeWordIndex]).length)))
                                .join('')}
                              <span
                                style={{ color: cursorColor }}
                                className="inline-block ml-2 animate-pulse font-mono font-bold"
                              >
                                |
                              </span>
                            </span>
                          ) : (
                            words[activeWordIndex]
                          )}
                        </motion.div>
                      )
                    )
                  ) : (
                    <motion.div
                      key="cumulative-words-container"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4 }}
                      className={`flex flex-col items-center justify-center gap-3 max-w-[95%] whitespace-pre-wrap leading-relaxed ${getFontFamilyStyle()} ${getFontWeightStyle()} ${effectiveTextClass}`}
                      style={{ fontSize: `${Math.min(wordFontSize * 1.1, 54)}px` }}
                    >
                      {structuredLines.map((lineObj) => {
                        const lineVisibleWords = lineObj.words.filter(w => w.index <= activeWordIndex);
                        if (lineVisibleWords.length === 0) return null;

                        return (
                          <div key={lineObj.lineIndex} className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                            {lineVisibleWords.map((wObj) => {
                              const isCurrentTypingWord = wObj.index === activeWordIndex && activePhase === 'words';
                              const charArray = Array.from(wObj.text);

                              return (
                                <motion.span
                                  key={`word-cumul-${wObj.index}`}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="inline-flex items-center"
                                >
                                  {isCurrentTypingWord && activeEffect === 'typing' ? (
                                    <span>
                                      {charArray.slice(0, Math.max(1, Math.floor(activeWordProgress * charArray.length))).join('')}
                                      <span
                                        style={{ color: cursorColor }}
                                        className="inline-block ml-1 animate-pulse font-mono font-bold"
                                      >
                                        |
                                      </span>
                                    </span>
                                  ) : (
                                    wObj.text
                                  )}
                                </motion.span>
                              );
                            })}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </>
              )}

              {/* Phase 3: Final Outro Full Phrase */}
              {activePhase === 'final' && (
                <motion.div
                  key="final-layout"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.7 }}
                  className="flex flex-col items-center justify-center gap-6 max-w-[90%]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm uppercase tracking-[0.25em] font-bold text-emerald-500 opacity-90">
                      {outroText}
                    </span>
                    <h3 className={`text-3xl md:text-4xl ${getFontFamilyStyle()} font-extrabold ${effectiveTitleClass}`}>
                      {titleText}
                    </h3>
                    <div className="h-[3px] w-12 rounded-full my-1" style={{ backgroundColor: cursorColor }} />
                  </div>

                  <p
                    style={{ fontSize: `${finalFontSize * 1.3}px`, lineHeight: 1.6 }}
                    className={`${getFontFamilyStyle()} font-medium ${effectiveTextClass} max-w-2xl text-center whitespace-pre-wrap`}
                  >
                    {phraseText}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--surface-canvas)] p-4 md:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--stroke-subtle)] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <Sparkle size={20} weight="duotone" />
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Minimalist Kinetic Typography Studio
            </h1>
          </div>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Professional motion graphic video editor featuring 1.5s post-display hold pause, Pretendard/Noto Sans fonts, cumulative text buildup, custom accent color cursor & WebM export.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border px-3 py-2 text-xs font-semibold shadow-sm transition-all ${
              soundEnabled
                ? 'border-emerald-500/40 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                : 'border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]'
            }`}
            title="Toggle Audio SFX Synthesizer"
          >
            {soundEnabled ? <SpeakerHigh size={16} /> : <SpeakerSimpleSlash size={16} />}
            SFX Clicks: {soundEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] shadow-sm hover:bg-[var(--surface-canvas)]"
          >
            <ArrowCounterClockwise size={14} />
            Replay Preview
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Viewport (8 Cols) & Right Control Tabs (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Video Viewport & Player Controls */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          {/* Main Monitor Viewport Canvas */}
          <div className="relative overflow-hidden rounded-2xl border border-[var(--stroke-subtle)] bg-[var(--surface-card)] shadow-[var(--shadow-medium)] flex flex-col">
            {/* Monitor Top Status Bar */}
            <div className="flex items-center justify-between border-b border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] px-4 py-2.5 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
                <span className="ml-2 font-mono font-medium tracking-wide text-[var(--text-secondary)]">
                  {activeStyle.name.toUpperCase()} • {aspectRatio === '16-9' ? '16:9 HD' : aspectRatio === '9-16' ? '9:16 Vertical Reels' : '1:1 Square'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Phase: {activePhase === 'hold' ? 'HOLD (1.5s Pause)' : activePhase.toUpperCase()}
                </span>
                <span className="font-mono bg-[var(--surface-canvas)] px-2 py-0.5 rounded border border-[var(--stroke-subtle)]">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
              </div>
            </div>

            {/* Video Canvas Container */}
            <div className="p-6 bg-slate-950/10 flex items-center justify-center min-h-[460px] max-h-[580px] overflow-hidden">
              <div
                ref={videoViewportRef}
                style={
                  activeBg.isTransparent
                    ? {
                        backgroundImage:
                          'conic-gradient(#cbd5e1 90deg, #f1f5f9 90deg 180deg, #cbd5e1 180deg 270deg, #f1f5f9 270deg)',
                        backgroundSize: '20px 20px'
                      }
                    : activeBg.customStyle || {}
                }
                className={`relative overflow-hidden transition-all duration-300 ${
                  activeBg.isTransparent
                    ? 'border-2 border-dashed border-slate-300 dark:border-slate-700 shadow-inner'
                    : activeBg.bgClass || ''
                } ${
                  aspectRatio === '16-9'
                    ? 'w-full aspect-video max-w-[820px]'
                    : aspectRatio === '9-16'
                    ? 'h-[460px] aspect-[9/16]'
                    : 'w-[450px] aspect-square'
                } rounded-2xl shadow-xl`}
              >
                {/* Subtle Ambient Grid Background (hidden on transparent/chroma) */}
                {!activeBg.isTransparent && activeBg.textTone !== 'chroma' && (
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
                      backgroundSize: '24px 24px'
                    }}
                  />
                )}

                {/* Title & Action Safe Areas Overlay */}
                {showSafeAreas && (
                  <div className="absolute inset-0 border border-red-500/30 pointer-events-none z-10 m-[5%]">
                    <div className="absolute inset-0 border border-dashed border-red-500/40 m-[5%]" />
                    <span className="absolute top-1 left-2 text-[9px] font-mono text-red-500/50 uppercase tracking-widest">
                      Title Safe Area (90%)
                    </span>
                    <span className="absolute bottom-1 right-2 text-[9px] font-mono text-red-500/50 uppercase tracking-widest">
                      Action Safe Area (80%)
                    </span>
                  </div>
                )}

                {/* Grid Overlay (Rule of Thirds) */}
                {showGrid && (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10">
                    <div className="border-r border-b border-black/10 dark:border-white/10" />
                    <div className="border-r border-b border-black/10 dark:border-white/10" />
                    <div className="border-b border-black/10 dark:border-white/10" />
                    <div className="border-r border-b border-black/10 dark:border-white/10" />
                    <div className="border-r border-b border-black/10 dark:border-white/10" />
                    <div className="border-b border-black/10 dark:border-white/10" />
                    <div className="border-r border-black/10 dark:border-white/10" />
                    <div className="border-r border-black/10 dark:border-white/10" />
                    <div />
                  </div>
                )}

                {/* Animation Center Stage */}
                <div className="absolute inset-0 flex items-center justify-center px-8 text-center select-none overflow-hidden">
                  <AnimatePresence mode="wait">
                    {/* Phase 1: Intro Title */}
                    {activePhase === 'title' && (
                      <motion.h2
                        key="title-slide"
                        initial={motionVariants.initial}
                        animate={motionVariants.animate}
                        exit={motionVariants.exit}
                        transition={motionVariants.transition}
                        className={`text-4xl md:text-6xl tracking-tight leading-snug ${getFontFamilyStyle()} ${getFontWeightStyle()} ${effectiveTitleClass} ${activeStyle.glowEffect || ''}`}
                      >
                        {titleText}
                      </motion.h2>
                    )}

                    {/* Phase 2 & Hold: Kinetic Words and 1.5s Hold View */}
                    {(activePhase === 'words' || activePhase === 'hold') && (
                      <>
                        {/* Option A: Single Word Flash Mode */}
                        {breakdownMode === 'single' ? (
                          activePhase === 'hold' ? (
                            /* During 1.5s Hold Phase in Single mode: Show full phrase text clearly */
                            <motion.div
                              key="hold-full-phrase"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.3 }}
                              style={{ fontSize: `${Math.min(wordFontSize, 36)}px` }}
                              className={`leading-relaxed tracking-tight whitespace-pre-wrap font-medium ${getFontFamilyStyle()} ${getFontWeightStyle()} ${effectiveTextClass} max-w-[92%]`}
                            >
                              {phraseText}
                            </motion.div>
                          ) : (
                            /* Active word flash during typing */
                            activeWordIndex >= 0 && activeWordIndex < words.length && (
                              <motion.div
                                key={`single-word-${activeWordIndex}`}
                                initial={activeEffect === 'typing' ? { opacity: 1 } : motionVariants.initial}
                                animate={activeEffect === 'typing' ? { opacity: 1 } : motionVariants.animate}
                                exit={activeEffect === 'typing' ? { opacity: 0 } : motionVariants.exit}
                                transition={motionVariants.transition}
                                style={{ fontSize: `${wordFontSize}px` }}
                                className={`leading-tight tracking-tight ${getFontFamilyStyle()} ${getFontWeightStyle()} ${effectiveTextClass} ${activeStyle.glowEffect || ''} max-w-[92%]`}
                              >
                                {activeEffect === 'typing' ? (
                                  <span>
                                    {Array.from(words[activeWordIndex])
                                      .slice(0, Math.max(1, Math.floor(activeWordProgress * Array.from(words[activeWordIndex]).length)))
                                      .join('')}
                                    <span
                                      style={{ color: cursorColor }}
                                      className="inline-block ml-1 animate-pulse font-mono font-bold"
                                    >
                                      |
                                    </span>
                                  </span>
                                ) : (
                                  words[activeWordIndex]
                                )}
                              </motion.div>
                            )
                          )
                        ) : (
                          /* Option B: Cumulative Build-up Mode & 1.5s Hold View */
                          <motion.div
                            key="cumulative-words-container"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                            transition={{ duration: 0.4 }}
                            className={`flex flex-col items-center justify-center gap-2 max-w-[95%] whitespace-pre-wrap leading-relaxed ${getFontFamilyStyle()} ${getFontWeightStyle()} ${effectiveTextClass}`}
                            style={{ fontSize: `${Math.min(wordFontSize, 42)}px` }}
                          >
                            {structuredLines.map((lineObj) => {
                              const lineVisibleWords = lineObj.words.filter(w => w.index <= activeWordIndex);
                              if (lineVisibleWords.length === 0) return null;

                              return (
                                <div key={lineObj.lineIndex} className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                                  {lineVisibleWords.map((wObj) => {
                                    const isCurrentTypingWord = wObj.index === activeWordIndex && activePhase === 'words';
                                    const charArray = Array.from(wObj.text);

                                    return (
                                      <motion.span
                                        key={`word-cumul-${wObj.index}`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="inline-flex items-center"
                                      >
                                        {isCurrentTypingWord && activeEffect === 'typing' ? (
                                          <span>
                                            {charArray.slice(0, Math.max(1, Math.floor(activeWordProgress * charArray.length))).join('')}
                                            <span
                                              style={{ color: cursorColor }}
                                              className="inline-block ml-0.5 animate-pulse font-mono font-bold"
                                            >
                                              |
                                            </span>
                                          </span>
                                        ) : (
                                          wObj.text
                                        )}
                                      </motion.span>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </>
                    )}

                    {/* Phase 3: Final Outro Full Phrase */}
                    {activePhase === 'final' && (
                      <motion.div
                        key="final-layout"
                        initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center justify-center gap-5 max-w-[90%]"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-xs uppercase tracking-[0.25em] font-bold text-emerald-500 opacity-90">
                            {outroText}
                          </span>
                          <h3 className={`text-2xl md:text-3xl ${getFontFamilyStyle()} font-extrabold ${effectiveTitleClass}`}>
                            {titleText}
                          </h3>
                          <div className="h-[3px] w-10 rounded-full my-1" style={{ backgroundColor: cursorColor }} />
                        </div>

                        <p
                          style={{ fontSize: `${finalFontSize}px`, lineHeight: 1.6 }}
                          className={`${getFontFamilyStyle()} font-medium ${effectiveTextClass} max-w-xl text-center whitespace-pre-wrap`}
                        >
                          {phraseText}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Video Player Timeline scrub bar & controls */}
            <div className="border-t border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] p-4 flex flex-col gap-3">
              {/* Timeline scrub input */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs w-14 text-[var(--text-muted)] text-right">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={totalDuration}
                  step="0.02"
                  value={currentTime}
                  onChange={(e) => {
                    setCurrentTime(parseFloat(e.target.value));
                    setIsPlaying(false);
                  }}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-800 accent-emerald-500 outline-none"
                />
                <span className="font-mono text-xs w-14 text-[var(--text-muted)] text-left">
                  {formatTime(totalDuration)}
                </span>
              </div>

              {/* Action Buttons bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-emerald-600 text-white shadow hover:bg-emerald-500 active:scale-95 transition-transform"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--stroke-subtle)] bg-[var(--surface-card)] text-[var(--text-secondary)] shadow-sm hover:bg-[var(--surface-canvas)] active:scale-95 transition-transform"
                    title="Replay"
                  >
                    <ArrowCounterClockwise size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTime(prev => Math.max(0, prev - 0.2));
                      setIsPlaying(false);
                    }}
                    className="flex h-10 px-2.5 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--stroke-subtle)] bg-[var(--surface-card)] text-xs font-medium text-[var(--text-secondary)] shadow-sm hover:bg-[var(--surface-canvas)]"
                  >
                    <SkipBack size={16} className="mr-1" /> -0.2s
                  </button>
                </div>

                {/* Speed Controls & Loop Toggle */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-[var(--radius-sm)] border border-[var(--stroke-subtle)] bg-[var(--surface-card)] p-0.5 shadow-sm">
                    {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-2 py-1 text-xs font-mono font-semibold rounded-[var(--radius-sm)] transition-all ${
                          playbackSpeed === speed
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] select-none">
                    <input
                      type="checkbox"
                      checked={isLooping}
                      onChange={(e) => setIsLooping(e.target.checked)}
                      className="rounded border-[var(--stroke-subtle)] text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                    />
                    Loop
                  </label>

                  <div className="h-6 w-[1px] bg-[var(--stroke-subtle)] mx-1" />

                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[var(--radius-sm)] border text-xs font-semibold shadow-sm transition-all ${
                      showGrid
                        ? 'border-emerald-500/40 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                        : 'border-[var(--stroke-subtle)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:bg-[var(--surface-canvas)]'
                    }`}
                  >
                    <GridFour size={16} />
                    Grid
                  </button>

                  <button
                    onClick={() => setShowSafeAreas(!showSafeAreas)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[var(--radius-sm)] border text-xs font-semibold shadow-sm transition-all ${
                      showSafeAreas
                        ? 'border-emerald-500/40 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                        : 'border-[var(--stroke-subtle)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:bg-[var(--surface-canvas)]'
                    }`}
                  >
                    {showSafeAreas ? <Eye size={16} /> : <EyeSlash size={16} />}
                    Safe Margins
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Word Sequence breakdown strip */}
          <div className="rounded-xl border border-[var(--stroke-subtle)] bg-[var(--surface-card)] p-4 shadow-[var(--shadow-soft)] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)]">
              <span>Dynamic Word Breakdown Timeline ({words.length} Words)</span>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                {wordDuration.toFixed(2)}s per word
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {words.map((word, idx) => {
                const isActive = (activePhase === 'words' || activePhase === 'hold') && activeWordIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentTime(titleDuration + idx * wordDuration + 0.05);
                      setIsPlaying(false);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-all ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-500 text-white font-bold shadow-sm scale-105'
                        : 'border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-canvas)]'
                    }`}
                  >
                    {idx + 1}. {word}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Studio Sidebar with 4 Tabbed Navigation Menus */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
          {/* Top Menu Tabs Navigation */}
          <div className="grid grid-cols-4 p-1 rounded-xl border border-[var(--stroke-subtle)] bg-[var(--surface-card)] shadow-sm">
            <button
              onClick={() => setActiveTab('style')}
              className={`flex flex-col items-center gap-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'style'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Palette size={18} />
              Style
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex flex-col items-center gap-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'text'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <TextT size={18} />
              Script
            </button>
            <button
              onClick={() => setActiveTab('effects')}
              className={`flex flex-col items-center gap-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'effects'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Lightning size={18} />
              Effects
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`flex flex-col items-center gap-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'export'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <FilmStrip size={18} />
              Export
            </button>
          </div>

          {/* TAB 1: Style Guidelines Options */}
          {activeTab === 'style' && (
            <div className="rounded-2xl border border-[var(--stroke-subtle)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-soft)] flex flex-col gap-6">
              <div>
                <h2 className="text-md font-bold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--stroke-subtle)] pb-2.5">
                  <Palette size={18} className="text-emerald-500" />
                  Style Guideline & Typography Options
                </h2>
                <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                  Select aesthetic design guidelines, font families (Pretendard, Noto Sans KR), and cursor accent colors.
                </p>
              </div>

              {/* Requirement 3: Font Selection Selector */}
              <div className="flex flex-col gap-2.5 border-b border-[var(--stroke-subtle)] pb-4">
                <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Textbox size={16} className="text-emerald-500" />
                  Font Family (폰트 선택)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'pretendard', name: 'Pretendard (프리텐다드)' },
                    { id: 'noto-sans-kr', name: 'Noto Sans KR (노토산스)' },
                    { id: 'sans', name: 'SF Sans (Clean)' },
                    { id: 'outfit', name: 'Outfit (Modern)' },
                    { id: 'serif', name: 'Serif (Classic)' },
                    { id: 'mono', name: 'Monospace (Tech)' }
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setFontFamily(font.id as any)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition-all ${
                        fontFamily === font.id
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold ring-1 ring-emerald-500'
                          : 'border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-canvas)]'
                      }`}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Weight Selector */}
              <div className="flex flex-col gap-2.5 border-b border-[var(--stroke-subtle)] pb-4">
                <label className="text-xs font-bold text-[var(--text-primary)]">
                  Font Weight (글자 두께)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['normal', 'semibold', 'bold', 'black'] as const).map((w) => (
                    <button
                      key={w}
                      onClick={() => setTextWeight(w)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border capitalize transition-all ${
                        textWeight === w
                          ? 'border-emerald-500 bg-emerald-500 text-white font-bold'
                          : 'border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-canvas)]'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Requirement 2: Cursor Accent Color Swatch */}
              <div className="flex flex-col gap-2.5 border-b border-[var(--stroke-subtle)] pb-4">
                <label className="text-xs font-bold text-[var(--text-primary)]">
                  Cursor Accent Color (커서 액센트 컬러)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { color: '#FF5A1F', label: 'Orange (#FF5A1F)' },
                    { color: '#0c4da2', label: 'Blue (#0c4da2)' },
                    { color: '#10b981', label: 'Emerald' },
                    { color: '#a855f7', label: 'Purple' }
                  ].map((swatch) => (
                    <button
                      key={swatch.color}
                      onClick={() => setCursorColor(swatch.color)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border text-xs font-semibold transition-all ${
                        cursorColor === swatch.color
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-slate-50 dark:bg-slate-900'
                          : 'border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-canvas)]'
                      }`}
                    >
                      <span className="h-4 w-4 rounded-full border border-black/20 shadow-sm" style={{ backgroundColor: swatch.color }} />
                      <span className="text-[10px] font-mono text-[var(--text-secondary)]">{swatch.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Requirement: Background Canvas Selection (Transparent, Off-White, Broadcast, Core) */}
              <div className="flex flex-col gap-3 border-b border-[var(--stroke-subtle)] pb-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <GridFour size={16} className="text-emerald-500" />
                    Canvas Background (배경화면 선택)
                  </label>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {activeBg.name}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  투명 배경(알파 채널), 눈이 편안한 3종 오프화이트, 방송 제작용 크로마키(그린/블루) 및 숏폼 슈퍼블랙을 선택할 수 있습니다.
                </p>

                {/* Background Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {BACKGROUND_PRESETS.map((bg) => {
                    const isSelected = selectedBgId === bg.id;
                    return (
                      <button
                        key={bg.id}
                        onClick={() => {
                          setSelectedBgId(bg.id);
                          handleReset();
                        }}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/30'
                            : 'border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-canvas)]'
                        }`}
                      >
                        {/* Background Mini Swatch */}
                        <div
                          className="h-10 w-10 flex-shrink-0 rounded-lg border border-black/10 shadow-sm flex items-center justify-center overflow-hidden relative"
                          style={
                            bg.isTransparent
                              ? {
                                  backgroundImage:
                                    'conic-gradient(#94a3b8 90deg, #f8fafc 90deg 180deg, #94a3b8 180deg 270deg, #f8fafc 270deg)',
                                  backgroundSize: '10px 10px'
                                }
                              : bg.customStyle || { backgroundColor: bg.previewColor }
                          }
                        >
                          {bg.isTransparent && (
                            <span className="text-[8px] font-mono font-black text-slate-700 bg-white/80 px-1 rounded">
                              ALPHA
                            </span>
                          )}
                        </div>

                        {/* Background Info */}
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                              {bg.name}
                            </span>
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[var(--surface-canvas)] text-[var(--text-secondary)] border border-[var(--stroke-subtle)] flex-shrink-0">
                              {bg.categoryLabel}
                            </span>
                          </div>
                          <p className="text-[10px] text-[var(--text-muted)] line-clamp-2 mt-0.5 leading-snug">
                            {bg.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* List of Style Guidelines */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-[var(--text-primary)]">
                  Preset Style Guidelines
                </label>
                {STYLE_GUIDELINES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleSelectStyle(style)}
                    className={`flex flex-col gap-2 p-3.5 rounded-xl border text-left transition-all ${
                      activeStyleId === style.id
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20'
                        : 'border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-canvas)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full border border-black/20 shadow-sm" style={{ backgroundColor: style.accentColor }} />
                        {style.name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--surface-canvas)] text-[var(--text-muted)] border border-[var(--stroke-subtle)]">
                        {style.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      {style.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Text Script Input & Presets */}
          {activeTab === 'text' && (
            <div className="rounded-2xl border border-[var(--stroke-subtle)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-soft)] flex flex-col gap-6">
              <div>
                <h2 className="text-md font-bold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--stroke-subtle)] pb-2.5">
                  <TextT size={18} className="text-emerald-500" />
                  Text Script & Layout Breakdown
                </h2>
                <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                  Input phrases, switch breakdown modes (Single word flash vs Cumulative text build-up), and preserve line breaks.
                </p>
              </div>

              {/* Requirement 1: Breakdown Display Mode Selector */}
              <div className="flex flex-col gap-2.5 border-b border-[var(--stroke-subtle)] pb-4">
                <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Stack size={16} className="text-emerald-500" />
                  Breakdown Display Mode (단어 표시 방식)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setBreakdownMode('single');
                      handleReset();
                    }}
                    className={`flex flex-col gap-1 p-2.5 rounded-xl border text-left transition-all ${
                      breakdownMode === 'single'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500'
                        : 'border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-canvas)]'
                    }`}
                  >
                    <span className="text-xs font-bold">1. 단어 개별 전환 (Single Word)</span>
                    <span className="text-[11px] opacity-80 leading-tight">각 단어가 1개씩 순서대로 개별 전환되어 강조됩니다.</span>
                  </button>

                  <button
                    onClick={() => {
                      setBreakdownMode('cumulative');
                      handleReset();
                    }}
                    className={`flex flex-col gap-1 p-2.5 rounded-xl border text-left transition-all ${
                      breakdownMode === 'cumulative'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500'
                        : 'border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-canvas)]'
                    }`}
                  >
                    <span className="text-xs font-bold">2. 텍스트 순차 누적 (Cumulative)</span>
                    <span className="text-[11px] opacity-80 leading-tight">입력된 텍스트가 화면에 남으며 순서대로 최종 화면을 구성합니다.</span>
                  </button>
                </div>
              </div>

              {/* Multi-line Script Editor Input (Requirement 4 & 5) */}
              <div className="flex flex-col gap-4 border-b border-[var(--stroke-subtle)] pb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--text-primary)]">
                    1. Intro Title Header (서두 타이틀)
                  </label>
                  <input
                    type="text"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    className="w-full rounded-lg border border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">
                    <span>2. Main Phrase Text (줄바꿈 및 한글 지원 메인 문구)</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">줄바꿈(Enter) 유지됨</span>
                  </label>
                  <textarea
                    rows={4}
                    value={inputPhrase}
                    onChange={(e) => setInputPhrase(e.target.value)}
                    placeholder="여기에 텍스트를 입력하세요 (줄바꿈 가능)..."
                    className="w-full rounded-lg border border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none whitespace-pre-wrap leading-relaxed font-['Pretendard',sans-serif]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--text-primary)]">
                    3. Outro Subtitle Header (하단 서브타이틀)
                  </label>
                  <input
                    type="text"
                    value={inputOutro}
                    onChange={(e) => setInputOutro(e.target.value)}
                    className="w-full rounded-lg border border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleApplyCustomScript}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-1.5"
                >
                  <Check size={16} />
                  Apply Custom Script & Replay (스크립트 적용)
                </button>
              </div>

              {/* Script Templates Presets */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-[var(--text-primary)]">
                  Script Templates & Presets (추천 템플릿)
                </label>
                <div className="flex flex-col gap-2">
                  {SCRIPT_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl)}
                      className="flex flex-col gap-1 p-3 rounded-xl border border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] text-left hover:bg-[var(--surface-canvas)] hover:border-emerald-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-emerald-500">
                          {tmpl.name}
                        </span>
                        <span className="text-[10px] font-semibold text-[var(--text-muted)]">
                          {tmpl.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 whitespace-pre-wrap font-medium">
                        "{tmpl.phrase}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Motion Effect Selection */}
          {activeTab === 'effects' && (
            <div className="rounded-2xl border border-[var(--stroke-subtle)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-soft)] flex flex-col gap-6">
              <div>
                <h2 className="text-md font-bold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--stroke-subtle)] pb-2.5">
                  <Lightning size={18} className="text-emerald-500" />
                  Motion Effect Selection Options
                </h2>
                <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                  Configure kinetic motion effects (Typewriter, Slide, Dropdown, Zoom) and spring physics.
                </p>
              </div>

              {/* Requirement 2: Typewriter Cursor Color inside Effects */}
              {activeEffect === 'typing' && (
                <div className="flex flex-col gap-2.5 border-b border-[var(--stroke-subtle)] pb-4">
                  <label className="text-xs font-bold text-[var(--text-primary)]">
                    Typewriter Cursor Accent Color (타이핑 커서 색상)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { color: '#FF5A1F', label: 'Orange' },
                      { color: '#0c4da2', label: 'Blue' },
                      { color: '#10b981', label: 'Emerald' },
                      { color: '#a855f7', label: 'Purple' }
                    ].map((swatch) => (
                      <button
                        key={swatch.color}
                        onClick={() => setCursorColor(swatch.color)}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all ${
                          cursorColor === swatch.color
                            ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-slate-50 dark:bg-slate-900'
                            : 'border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-canvas)]'
                        }`}
                      >
                        <span className="h-3 w-3 rounded-full border border-black/20" style={{ backgroundColor: swatch.color }} />
                        <span className="text-[11px]">{swatch.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* List of Kinetic Effects */}
              <div className="flex flex-col gap-3">
                {KINETIC_EFFECTS.map((fx) => (
                  <button
                    key={fx.id}
                    onClick={() => {
                      setActiveEffect(fx.id);
                      handleReset();
                    }}
                    className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
                      activeEffect === fx.id
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20'
                        : 'border-[var(--stroke-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-canvas)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {fx.name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {fx.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-normal">
                      {fx.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Directional Control for Slide In-Out */}
              {activeEffect === 'slideInOut' && (
                <div className="flex flex-col gap-2 border-t border-[var(--stroke-subtle)] pt-4">
                  <label className="text-xs font-bold text-[var(--text-primary)]">
                    Slide In-Out Direction
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['up', 'down', 'left', 'right'] as const).map((dir) => (
                      <button
                        key={dir}
                        onClick={() => {
                          setSlideDirection(dir);
                          handleReset();
                        }}
                        className={`py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] border uppercase transition-all ${
                          slideDirection === dir
                            ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                            : 'border-[var(--stroke-subtle)] hover:bg-[var(--surface-canvas)]'
                        }`}
                      >
                        {dir}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Physics Spring Adjustments & Font Sizes & Timing */}
              <div className="flex flex-col gap-3 border-t border-[var(--stroke-subtle)] pt-4">
                <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Clock size={16} className="text-emerald-500" />
                  Motion Physics, Font Sizes & Hold Timing
                </label>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)] font-semibold">
                    <span className="text-emerald-600 dark:text-emerald-400">Post-Display Hold Pause (완료 후 정지 대기)</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{holdDuration.toFixed(1)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="4.0"
                    step="0.1"
                    value={holdDuration}
                    onChange={(e) => {
                      setHoldDuration(parseFloat(e.target.value));
                      handleReset();
                    }}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>Word Font Size</span>
                    <span className="font-mono">{wordFontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="80"
                    value={wordFontSize}
                    onChange={(e) => setWordFontSize(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>Final Outro Font Size</span>
                    <span className="font-mono">{finalFontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="40"
                    value={finalFontSize}
                    onChange={(e) => setFinalFontSize(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>Spring Stiffness</span>
                    <span className="font-mono">{springStiffness}</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="300"
                    value={springStiffness}
                    onChange={(e) => setSpringStiffness(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>Spring Damping</span>
                    <span className="font-mono">{springDamping}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={springDamping}
                    onChange={(e) => setSpringDamping(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>Intro Title Duration</span>
                    <span className="font-mono">{titleDuration.toFixed(1)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="4.0"
                    step="0.1"
                    value={titleDuration}
                    onChange={(e) => {
                      setTitleDuration(parseFloat(e.target.value));
                      handleReset();
                    }}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>Duration Per Word</span>
                    <span className="font-mono">{wordDuration.toFixed(2)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="2.0"
                    step="0.05"
                    value={wordDuration}
                    onChange={(e) => {
                      setWordDuration(parseFloat(e.target.value));
                      handleReset();
                    }}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>Outro Final Full Screen</span>
                    <span className="font-mono">{finalDuration.toFixed(1)}s</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="6.0"
                    step="0.2"
                    value={finalDuration}
                    onChange={(e) => {
                      setFinalDuration(parseFloat(e.target.value));
                      handleReset();
                    }}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Export Video & Production */}
          {activeTab === 'export' && (
            <div className="rounded-2xl border border-[var(--stroke-subtle)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-soft)] flex flex-col gap-6">
              <div>
                <h2 className="text-md font-bold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--stroke-subtle)] pb-2.5">
                  <FilmStrip size={18} className="text-emerald-500" />
                  Video Export & Production
                </h2>
              </div>

              {/* Aspect Ratio switcher */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[var(--text-primary)]">
                  Video Format / Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAspectRatio('16-9')}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                      aspectRatio === '16-9'
                        ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                        : 'border-[var(--stroke-subtle)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:bg-[var(--surface-canvas)]'
                    }`}
                  >
                    <Monitor size={18} />
                    <span>16:9 Widescreen</span>
                  </button>
                  <button
                    onClick={() => setAspectRatio('9-16')}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                      aspectRatio === '9-16'
                        ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                        : 'border-[var(--stroke-subtle)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:bg-[var(--surface-canvas)]'
                    }`}
                  >
                    <DeviceMobile size={18} />
                    <span>9:16 Shorts/Reels</span>
                  </button>
                  <button
                    onClick={() => setAspectRatio('1-1')}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                      aspectRatio === '1-1'
                        ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                        : 'border-[var(--stroke-subtle)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:bg-[var(--surface-canvas)]'
                    }`}
                  >
                    <Square size={18} />
                    <span>1:1 Square</span>
                  </button>
                </div>
              </div>

              {/* Exporter Action Box */}
              <div className="flex flex-col gap-3 border-t border-[var(--stroke-subtle)] pt-4">
                <label className="text-xs font-bold text-[var(--text-primary)]">
                  Direct WebM Video Recording Exporter
                </label>
                {isRecording ? (
                  <div className="flex flex-col gap-2 p-4 rounded-xl border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40">
                    <div className="flex justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span>Rendering Kinetic Video Package...</span>
                      <span>{recordingProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-emerald-200 dark:bg-emerald-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-100"
                        style={{ width: `${recordingProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleStartRecording}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <VideoCamera size={18} weight="fill" />
                    Export HD Kinetic Video (.webm)
                  </button>
                )}

                {recordedVideoUrl && (
                  <a
                    href={recordedVideoUrl}
                    download="kinetic_typography_studio.webm"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-lg border border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs shadow-sm hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <DownloadSimple size={18} />
                    Download Exported Video File (.webm)
                  </a>
                )}
              </div>

              {/* Developer Code Generator */}
              <div className="flex flex-col gap-2 border-t border-[var(--stroke-subtle)] pt-4">
                <label className="text-xs font-bold text-[var(--text-primary)] justify-between flex items-center">
                  <span>Framer Motion Config Code</span>
                  <button
                    onClick={handleCopyFramerMotionCode}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 hover:underline"
                  >
                    {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </label>
                <pre className="p-3 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-36 border border-slate-800">
                  {`// Framer Motion Preset Configuration: ${activeEffect}
const kineticMotionPreset = ${JSON.stringify(motionVariants, null, 2)};`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
