import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bot, Mic, MicOff, Send, AlertTriangle, CheckCircle, RefreshCcw, MapPin, Activity, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sarvamTTS, sarvamChat, isSarvamAvailable, sarvamTranslate, detectLanguage } from '../../services/sarvamAI';

const BOT_TYPING_TIME = 1200;
const LANG_MAP = { en:'en-IN', hi:'hi-IN', kn:'kn-IN', te:'te-IN', ta:'ta-IN', mr:'mr-IN', bn:'bn-IN', gu:'gu-IN', ml:'ml-IN', pa:'pa-IN', or:'or-IN' };

// Map symptom keys to health_tips translation prefixes
const SYMPTOM_TIP_MAP = {
  cramps: 'cramps', heavyFlow: 'heavy', dizzy: 'dizzy', painSevere: 'pain',
  headache: 'headache', bloating: 'bloating', sleep: 'sleep', hydration: 'hydration'
};

const AIChatbotPanel = () => {
  const { t, i18n } = useTranslation();
  const { user, initiateSOS } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentNode, setCurrentNode] = useState('start');
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [riskScore, setRiskScore] = useState(0);
  const [summary, setSummary] = useState(null);
  const [collectedSymptoms, setCollectedSymptoms] = useState([]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatMode, setChatMode] = useState('triage'); // 'triage' | 'freeChat'
  const [isAILoading, setIsAILoading] = useState(false);

  const hasInitialized = useRef(false);
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const handleUserResponseRef = useRef(null);
  const currentAudioRef = useRef(null);

  // Speech synthesis — Sarvam AI with browser fallback
  const speakText = useCallback(async (text) => {
    if (!isVoiceEnabled || !text) return;

    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    window.speechSynthesis.cancel();

    setIsSpeaking(true);

    // Detect language of the text to be spoken
    const detectedLang = detectLanguage(text, i18n.language);

    // Try Sarvam AI first for superior Indian language voices
    if (isSarvamAvailable()) {
      try {
        const audio = await sarvamTTS(text, detectedLang);
        if (audio) {
          currentAudioRef.current = audio;
          audio.onended = () => { setIsSpeaking(false); currentAudioRef.current = null; };
          audio.onerror = () => { setIsSpeaking(false); currentAudioRef.current = null; };
          await audio.play();
          return;
        }
      } catch (e) {
        console.warn('Sarvam TTS failed, using browser fallback:', e.message);
      }
    }

    // Browser fallback
    const clean = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').replace(/\*\*/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = LANG_MAP[detectedLang] || 'en-IN';
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [isVoiceEnabled, i18n.language]);

  // Speech recognition — browser Web Speech API (works well cross-browser)
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.lang = LANG_MAP[i18n.language] || 'en-IN';
      rec.continuous = false;
      rec.interimResults = true;
      rec.onresult = (e) => {
        let final = '', interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript;
          else interim += e.results[i][0].transcript;
        }
        if (final) {
          setInputText(final);
          if (handleUserResponseRef.current) handleUserResponseRef.current(final);
          setIsListening(false);
        } else setInputText(interim);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
      if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; }
    };
  }, [i18n.language]);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert('Speech recognition not supported.');
    // Stop speaking when user starts talking
    if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    if (isListening) { recognitionRef.current.stop(); setIsListening(false); }
    else { setInputText(''); recognitionRef.current.start(); setIsListening(true); }
  };

  // Multilingual keyword sets for intent detection
  const YES_WORDS = ['yes','yeah','yep','sure','ok','हाँ','हां','అవును','ಹೌದು','ஆம்','हो'];
  const NO_WORDS = ['no','nah','nope','not','नहीं','కాదు','ಇಲ್ಲ','இல்லை','नाही'];
  const CRAMP_WORDS = ['cramp','pain','ache','hurt','दर्द','ऐंठन','నొప్పి','ನೋವು','வலி','पेटके'];
  const DIZZY_WORDS = ['dizzy','faint','lightheaded','चक्कर','తిరగడం','ತಲೆಸುತ್ತು','மயக்கம்'];
  const HEAD_WORDS = ['head','headache','migraine','सिरदर्द','తలనొప్పి','ತಲೆನೋವು','தலைவலி'];
  const TIRED_WORDS = ['tired','fatigue','exhaust','sleep','थकान','అలసట','ಆಯಾಸ','சோர்வு'];
  const HEAVY_WORDS = ['heavy','lot','clot','भारी','ज्यादा','ఎక్కువ','ಹೆಚ್ಚು','அதிக'];
  const MILD_WORDS = ['mild','little','slight','light','हल्का','తేలిక','ತೇಲಿಕ','லேசான'];
  const BAD_WORDS = ['bad','severe','worse','terrible','awful','बहुत','तेज','చాలా','ತುಂಬಾ','மிக'];
  const GOOD_WORDS = ['good','fine','well','great','okay','अच्छ','బాగు','ಚೆನ್ನಾಗಿ','நல்ல'];
  const BLOAT_WORDS = ['bloat','swell','puff','सूजन','फूल','ఉబ్బ','ಉಬ್ಬ','வீக்கம்'];

  const matchesAny = (text, keywords) => {
    const lower = text.toLowerCase().trim();
    return keywords.some(kw => lower.includes(kw.toLowerCase()));
  };
  const isPositive = (r) => matchesAny(r, YES_WORDS) || matchesAny(r, GOOD_WORDS);
  const isNegative = (r) => matchesAny(r, NO_WORDS);

  // Build conversation tree using t() with fuzzy matching
  const getTree = useCallback(() => {
    const name = user?.name ? user.name.split(' ')[0] : '';
    return {
      start: {
        text: t('chatbot.nodes.start', { name }),
        options: [t('chatbot.options.lets_start'), t('chatbot.options.not_well')],
        next: (r) => (isNegative(r) || matchesAny(r, [...CRAMP_WORDS,...DIZZY_WORDS,...HEAD_WORDS,...TIRED_WORDS]) || r === t('chatbot.options.not_well')) ? 'q_whats_wrong' : 'q_period'
      },
      q_whats_wrong: {
        text: t('chatbot.nodes.q_whats_wrong'),
        options: [t('chatbot.options.cramps_pain'), t('chatbot.options.feeling_dizzy'), t('chatbot.options.headache'), t('chatbot.options.just_tired')],
        next: (r) => {
          if (matchesAny(r, CRAMP_WORDS) || r === t('chatbot.options.cramps_pain')) { setRiskScore(s=>s+2); setCollectedSymptoms(s=>[...s,'cramps']); return 'tip_cramps'; }
          if (matchesAny(r, DIZZY_WORDS) || r === t('chatbot.options.feeling_dizzy')) { setRiskScore(s=>s+4); setCollectedSymptoms(s=>[...s,'dizzy']); return 'tip_dizzy'; }
          if (matchesAny(r, HEAD_WORDS) || r === t('chatbot.options.headache')) { setCollectedSymptoms(s=>[...s,'headache']); return 'tip_headache'; }
          setRiskScore(s=>s+1); return 'q_period';
        }
      },
      tip_cramps: { text: t('chatbot.nodes.tip_cramps'), options: [t('chatbot.options.ok_continue')], next: () => 'q_period' },
      tip_dizzy: { text: t('chatbot.nodes.tip_dizzy'), options: [t('chatbot.options.ok_continue')], next: () => 'q_period' },
      tip_headache: { text: t('chatbot.nodes.tip_headache'), options: [t('chatbot.options.ok_continue')], next: () => 'q_period' },
      q_period: {
        text: t('chatbot.nodes.q_period'),
        options: [t('chatbot.options.yes_iam'), t('chatbot.options.no_not_now')],
        next: (r) => (isPositive(r) || r === t('chatbot.options.yes_iam')) ? 'q_cramps' : 'q_last_cycle'
      },
      q_last_cycle: {
        text: t('chatbot.nodes.q_last_cycle'),
        options: [t('chatbot.options.within_2_weeks'), t('chatbot.options.2_4_weeks'), t('chatbot.options.over_month')],
        next: (r) => { if (matchesAny(r, ['over','month','महीन','నెల','ತಿಂಗ','மாத']) || r === t('chatbot.options.over_month')) setRiskScore(s=>s+1); return 'q_bloating'; }
      },
      q_cramps: {
        text: t('chatbot.nodes.q_cramps'),
        options: [t('chatbot.options.yes_mild'), t('chatbot.options.yes_severe'), t('chatbot.options.no_cramps')],
        next: (r) => {
          if (matchesAny(r, BAD_WORDS) || r === t('chatbot.options.yes_severe')) { setRiskScore(s=>s+3); setCollectedSymptoms(s=>[...s,'painSevere']); return 'q_pain_severity'; }
          if (matchesAny(r, [...MILD_WORDS,...YES_WORDS]) || r === t('chatbot.options.yes_mild')) { setRiskScore(s=>s+1); setCollectedSymptoms(s=>[...s,'cramps']); }
          return 'q_flow';
        }
      },
      q_pain_severity: {
        text: t('chatbot.nodes.q_pain_severity'),
        options: [t('chatbot.options.yes_that_bad'), t('chatbot.options.i_can_manage')],
        next: (r) => { if (isPositive(r) || matchesAny(r, BAD_WORDS) || r === t('chatbot.options.yes_that_bad')) setRiskScore(s=>s+3); return 'q_flow'; }
      },
      q_flow: {
        text: t('chatbot.nodes.q_flow'),
        options: [t('chatbot.options.light_normal'), t('chatbot.options.heavy'), t('chatbot.options.very_heavy')],
        next: (r) => {
          if (matchesAny(r, BAD_WORDS) || r === t('chatbot.options.very_heavy')) { setRiskScore(s=>s+4); setCollectedSymptoms(s=>[...s,'heavyFlow']); }
          else if (matchesAny(r, HEAVY_WORDS) || r === t('chatbot.options.heavy')) { setRiskScore(s=>s+2); setCollectedSymptoms(s=>[...s,'heavyFlow']); }
          return 'q_dizzy';
        }
      },
      q_bloating: {
        text: t('chatbot.nodes.q_bloating'),
        options: [t('chatbot.options.quite_bloated'), t('chatbot.options.a_little'), t('chatbot.options.no_bloating')],
        next: (r) => { if (isPositive(r) || matchesAny(r, BLOAT_WORDS) || r === t('chatbot.options.quite_bloated')) setCollectedSymptoms(s=>[...s,'bloating']); return 'q_sleep'; }
      },
      q_dizzy: {
        text: t('chatbot.nodes.q_dizzy'),
        options: [t('chatbot.options.yes_sad'), t('chatbot.options.no_fine')],
        next: (r) => { if (isPositive(r) || matchesAny(r, DIZZY_WORDS) || r === t('chatbot.options.yes_sad')) { setRiskScore(s=>s+5); setCollectedSymptoms(s=>[...s,'dizzy']); } return 'q_headache'; }
      },
      q_headache: {
        text: t('chatbot.nodes.q_headache'),
        options: [t('chatbot.options.yes_headache'), t('chatbot.options.body_aches'), t('chatbot.options.none')],
        next: (r) => { if (matchesAny(r, HEAD_WORDS) || isPositive(r) || r === t('chatbot.options.yes_headache')) setCollectedSymptoms(s=>[...s,'headache']); return 'q_sleep'; }
      },
      q_sleep: {
        text: t('chatbot.nodes.q_sleep'),
        options: [t('chatbot.options.slept_well'), t('chatbot.options.okayish'), t('chatbot.options.poorly')],
        next: (r) => { if (matchesAny(r, BAD_WORDS) || matchesAny(r, ['poor','badly','खराब','బాగో','ಕೆಟ್ಟ','மோச']) || r === t('chatbot.options.poorly')) { setRiskScore(s=>s+1); setCollectedSymptoms(s=>[...s,'sleep']); } return 'q_hydration'; }
      },
      q_hydration: {
        text: t('chatbot.nodes.q_hydration'),
        options: [t('chatbot.options.yes_hydrated'), t('chatbot.options.not_really')],
        next: (r) => { if (isNegative(r) || r === t('chatbot.options.not_really')) setCollectedSymptoms(s=>[...s,'hydration']); return 'end'; }
      },
      end: { text: '', options: [t('chatbot.options.start_new')], next: () => 'start' }
    };
  }, [t, user?.name]);

  const scrollToBottom = () => chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const appendBotMessage = useCallback((text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + Math.random(), text, sender: 'bot' }]);
      setIsTyping(false);
      speakText(text);
    }, BOT_TYPING_TIME);
  }, [speakText]);

  // Init
  useEffect(() => {
    if (hasInitialized.current) return;
    const saved = localStorage.getItem('naricycle_chat_session');
    if (saved) {
      try {
        const { msgs, node, score, sum, symptoms } = JSON.parse(saved);
        setMessages(msgs || []); setCurrentNode(node || 'start'); setRiskScore(score || 0); setSummary(sum); setCollectedSymptoms(symptoms || []);
      } catch { appendBotMessage(getTree().start.text); }
    } else {
      if (user?.anaemiaRisk === 'High') setRiskScore(8);
      else if (user?.anaemiaRisk === 'Moderate') setRiskScore(4);
      appendBotMessage(getTree().start.text);
    }
    hasInitialized.current = true;
  }, [user, appendBotMessage, getTree]);

  // Save session
  useEffect(() => {
    if (messages.length > 0) localStorage.setItem('naricycle_chat_session', JSON.stringify({ msgs: messages, node: currentNode, score: riskScore, sum: summary, symptoms: collectedSymptoms }));
  }, [messages, currentNode, riskScore, summary, collectedSymptoms]);

  // Dynamically translate the initial question if the user changes the UI language
  useEffect(() => {
    setMessages(prev => {
      // Only re-translate if the user hasn't started answering yet (length === 1)
      if (prev.length === 1 && prev[0].sender === 'bot' && currentNode === 'start') {
        const tree = getTree();
        if (prev[0].text !== tree.start.text) {
          return [{ ...prev[0], text: tree.start.text }];
        }
      }
      return prev;
    });
  }, [i18n.language, currentNode, getTree]);

  const generateSummary = useCallback(() => {
    let level, message, color, showSOS = false;
    if (riskScore >= 8) {
      level = "🚨"; message = t('chatbot.nodes.end_risk'); color = "text-health-red"; showSOS = true;
      setTimeout(() => { appendBotMessage(t('chatbot.nodes.sos_alert')); setTimeout(() => initiateSOS("Chatbot Health Triage"), 2000); }, 1000);
    } else if (riskScore >= 4) {
      level = "⚠️"; message = t('chatbot.nodes.end_moderate'); color = "text-health-orange";
    } else {
      level = "✨"; message = t('chatbot.nodes.end_normal'); color = "text-health-green";
    }
    return { level, message, color, showSOS };
  }, [riskScore, t, appendBotMessage, initiateSOS]);

  // Free-chat handler using Sarvam AI
  const handleFreeChat = useCallback(async (text) => {
    if (!text.trim() || isTyping || isAILoading) return;
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), text, sender: 'user' }]);
    setInputText('');
    setIsAILoading(true);
    setIsTyping(true);

    try {
      // Get last 10 messages for context
      const recentMsgs = [...messages.slice(-10), { text, sender: 'user' }];
      const reply = await sarvamChat(recentMsgs, i18n.language, {
        name: user?.name,
        anaemiaRisk: user?.anaemiaRisk,
        symptoms: collectedSymptoms
      });

      if (reply) {
        setMessages(prev => [...prev, { id: Date.now() + Math.random(), text: reply, sender: 'bot' }]);
        speakText(reply);
      } else {
        const fallback = t('chatbot.nodes.fallback');
        setMessages(prev => [...prev, { id: Date.now() + Math.random(), text: fallback, sender: 'bot' }]);
      }
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + Math.random(), text: t('chatbot.nodes.fallback'), sender: 'bot' }]);
    } finally {
      setIsTyping(false);
      setIsAILoading(false);
    }
  }, [messages, isTyping, isAILoading, i18n.language, user, collectedSymptoms, speakText, t]);

  const handleUserResponse = useCallback(async (text) => {
    if (!text.trim() || isTyping) return;

    // If in free-chat mode, use Sarvam AI
    if (chatMode === 'freeChat') {
      handleFreeChat(text);
      return;
    }

    // Triage mode
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), text, sender: 'user' }]);
    setInputText('');
    
    const tree = getTree();
    const node = tree[currentNode];
    if (!node) { setCurrentNode('start'); appendBotMessage(tree.start.text); return; }

    // Translate input to English if it's not English, so the internal intent matcher works
    // Skip translation if the user clicked a predefined option button (exact match)
    let textToMatch = text;
    const inputLang = detectLanguage(text);
    if (inputLang !== 'en' && !node.options?.includes(text)) {
      setIsTyping(true);
      textToMatch = await sarvamTranslate(text, inputLang);
      setIsTyping(false);
    }
    
    // Evaluate the intent on the translated english text OR original text
    // The exact string matches from the UI buttons will still match because t() is used in node.next,
    // but free-text will be translated to English so our English keywords arrays work.
    const nextKey = node.next(textToMatch);
    setCurrentNode(nextKey);
    if (nextKey === 'end') {
      const s = generateSummary();
      setSummary(s);
      appendBotMessage(s.message);
      // After triage, switch to free-chat mode
      setChatMode('freeChat');
    }
    else if (nextKey === 'start') { setRiskScore(0); setSummary(null); setCollectedSymptoms([]); setChatMode('triage'); localStorage.removeItem('naricycle_chat_session'); appendBotMessage(tree.start.text); }
    else if (tree[nextKey]) appendBotMessage(tree[nextKey].text);
    else { setCurrentNode('start'); appendBotMessage(t('chatbot.nodes.fallback') + '\n\n' + tree.start.text); }
  }, [isTyping, currentNode, chatMode, getTree, appendBotMessage, generateSummary, handleFreeChat, t]);

  useEffect(() => { handleUserResponseRef.current = handleUserResponse; }, [handleUserResponse]);

  const uniqueSymptoms = [...new Set(collectedSymptoms)];
  const tree = getTree();

  // Build localized tips
  const getLocalizedTips = (symptomKey) => {
    const prefix = SYMPTOM_TIP_MAP[symptomKey];
    if (!prefix) return null;
    const title = t(`chatbot.health_tips.${prefix}_title`);
    const tips = [1,2,3,4].map(i => t(`chatbot.health_tips.${prefix}_${i}`));
    const warnKey = `chatbot.health_tips.${prefix}_warn`;
    const warning = t(warnKey) !== warnKey ? t(warnKey) : null;
    return { title, tips, warning };
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-primary-50 to-lavender-50 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 relative">
            <Bot size={20} />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-health-green border-2 border-white rounded-full animate-pulse"></span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">🌸 {t('chatbot.name')}</h3>
            <p className="text-xs text-slate-500 font-medium">✨ {t('chatbot.status')}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => { setIsVoiceEnabled(!isVoiceEnabled); if (isVoiceEnabled) { window.speechSynthesis.cancel(); if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; } setIsSpeaking(false); } }}
            className={`p-2 rounded-full transition-colors relative ${isVoiceEnabled ? 'bg-primary-100 text-primary-600' : 'hover:bg-white/50 text-slate-400'}`}
            title={isVoiceEnabled ? t('chatbot.voice_on') : t('chatbot.voice_off')}>
            {isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {isSpeaking && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-health-green rounded-full animate-pulse border border-white"></span>}
          </button>
          <button onClick={() => { setMessages([]); setRiskScore(0); setSummary(null); setCollectedSymptoms([]); setCurrentNode('start'); setChatMode('triage'); localStorage.removeItem('naricycle_chat_session'); window.speechSynthesis.cancel(); if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; } setIsSpeaking(false); appendBotMessage(tree.start.text); }}
            className="p-2 hover:bg-white/50 rounded-full text-slate-400 hover:text-primary-600 transition-colors" title={t('chatbot.restart')}>
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {/* SOS Alert */}
      <AnimatePresence>
        {summary?.showSOS && (
          <div className="bg-red-50 border-b border-red-100 px-4 py-2 flex flex-col gap-2 overflow-hidden">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-health-red shrink-0" />
              <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider flex-1">🚨 {t('chatbot.emergency_warning')}</p>
              <Link to="/clinics" className="text-[10px] bg-red-600 text-white px-2 py-1 rounded-md font-bold hover:bg-red-700 transition-colors">🏥 {t('chatbot.find_clinics')}</Link>
            </div>
            <div className="flex flex-wrap gap-2 pb-1">
              <a href="tel:112" className="text-[9px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded border border-red-200">📞 112</a>
              <a href="tel:108" className="text-[9px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded border border-red-200">🚑 108</a>
              <a href="tel:1091" className="text-[9px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded border border-red-200">👩 1091</a>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user' ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
              }`} style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm p-4 flex items-center gap-2 w-20">
              <span className="w-2 h-2 bg-primary-300 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-150"></span>
            </div>
          </motion.div>
        )}

        {/* Summary + Tips */}
        {summary && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 mt-4">
            <div className="bg-white border-2 border-primary-100 rounded-3xl p-6 shadow-lg text-center">
              <CheckCircle className="mx-auto mb-3 text-health-green" size={40} />
              <h4 className="font-bold text-slate-900 mb-1">📝 {t('chatbot.health_complete')}</h4>
              <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${summary.color}`}>{summary.level}</p>
              <p className="text-sm text-slate-600 mb-4">{summary.message}</p>
              {summary.showSOS && (
                <div className="bg-red-50 p-3 rounded-2xl border border-red-100 flex items-center justify-center gap-2 mb-4 animate-pulse">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  <span className="text-[10px] font-bold text-red-700 uppercase">Emergency Alert Sent 📲</span>
                </div>
              )}
            </div>

            {uniqueSymptoms.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm px-1">💡 {t('chatbot.tips_title')}</h4>
                {uniqueSymptoms.map((s, idx) => {
                  const tip = getLocalizedTips(s);
                  if (!tip) return null;
                  return (
                    <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                      <h5 className="font-bold text-sm text-slate-800 mb-2">{tip.title}</h5>
                      <ul className="space-y-1.5">
                        {tip.tips.map((t2, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="text-primary-500 mt-0.5">•</span><span>{t2}</span>
                          </li>
                        ))}
                      </ul>
                      {tip.warning && (
                        <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-2.5 flex items-start gap-2">
                          <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-amber-700 font-medium">{tip.warning}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              <Link to="/clinics" className="flex items-center gap-4 p-4 bg-primary-600 text-white rounded-2xl shadow-md hover:bg-primary-700 transition-all group">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><MapPin size={20} /></div>
                <div className="text-left"><p className="font-bold text-sm">{t('chatbot.find_clinics')} 🏥</p><p className="text-[10px] opacity-80">{t('chatbot.find_clinics_desc')}</p></div>
              </Link>
              <Link to="/conditions/nutrition" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-health-green transition-all group">
                <div className="w-10 h-10 bg-green-50 text-health-green rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Activity size={20} /></div>
                <div className="text-left"><p className="font-bold text-sm text-slate-900">{t('chatbot.nutrition_guide')} 🥗</p><p className="text-[10px] text-slate-500">{t('chatbot.nutrition_guide_desc')}</p></div>
              </Link>
            </div>
          </motion.div>
        )}
        <div />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 z-20">
        {/* Triage option buttons */}
        {chatMode === 'triage' && !isTyping && !summary && tree[currentNode]?.options?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mb-4">
            {tree[currentNode].options.map((opt, i) => (
              <button key={i} onClick={() => handleUserResponse(opt)}
                className="flex-1 min-w-[100px] py-3 px-4 rounded-xl font-bold border-2 transition-all whitespace-nowrap active:scale-95 bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100 text-sm">
                {opt}
              </button>
            ))}
          </motion.div>
        )}

        {/* Free-chat quick suggestions after triage */}
        {chatMode === 'freeChat' && !isTyping && !isAILoading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mb-3">
            <button onClick={() => { setChatMode('triage'); setCurrentNode('start'); setSummary(null); setRiskScore(0); setCollectedSymptoms([]); localStorage.removeItem('naricycle_chat_session'); appendBotMessage(getTree().start.text); }}
              className="py-2 px-3 rounded-xl font-semibold border-2 transition-all active:scale-95 bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 text-xs flex items-center gap-1">
              <RefreshCcw size={12} /> {t('chatbot.new_checkin')}
            </button>
            {[
              { label: '🩸 Period tips', q: 'Give me tips for managing my period better' },
              { label: '🥗 Diet advice', q: 'What foods should I eat for better health?' },
              { label: '💊 Anaemia help', q: 'How can I prevent anaemia?' },
            ].map((s, i) => (
              <button key={i} onClick={() => handleUserResponse(s.q)}
                className="py-2 px-3 rounded-xl font-semibold border-2 transition-all active:scale-95 bg-primary-50 text-primary-600 border-primary-100 hover:bg-primary-100 text-xs">
                {s.label}
              </button>
            ))}
          </motion.div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center px-4 py-3 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
            <input type="text"
              placeholder={isTyping ? t('chatbot.typing') : isListening ? t('chatbot.listening') : chatMode === 'freeChat' ? t('chatbot.ask_anything') || 'Ask me anything...' : t('chatbot.input_placeholder')}
              disabled={isTyping || isAILoading} value={inputText} onChange={(e) => setInputText(e.target.value)}
              className="bg-transparent border-none focus:outline-none w-full text-sm text-slate-700 font-medium placeholder:text-slate-400 disabled:opacity-50"
              onKeyDown={(e) => { if (e.key === 'Enter') handleUserResponse(inputText); }} />
          </div>
          <button disabled={isTyping || isAILoading} onClick={toggleListening}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-all disabled:opacity-50 ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`} title={isListening ? t('chatbot.mic_on') : t('chatbot.mic_off')}>
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button disabled={isTyping || isAILoading || !inputText.trim()} onClick={() => handleUserResponse(inputText)}
            className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors shrink-0 shadow-md disabled:opacity-50">
            <Send size={20} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbotPanel;
