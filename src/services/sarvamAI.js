/**
 * Sarvam AI Service
 * Integrates Text-to-Speech and Speech-to-Text for multilingual Indian language support.
 * API Docs: https://docs.sarvam.ai
 */

const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY;
const BASE_URL = 'https://api.sarvam.ai';

// Map app language codes to Sarvam BCP-47 codes
const SARVAM_LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  or: 'or-IN'
};

/**
 * Text-to-Speech using Sarvam's Bulbul v3 model
 * Returns an Audio object that can be played directly
 */
export const sarvamTTS = async (text, langCode = 'en') => {
  if (!SARVAM_API_KEY || !text?.trim()) return null;

  // Clean emojis and markdown from text before sending
  const cleanText = text
    .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
    .replace(/\*\*/g, '')
    .replace(/\n+/g, '. ')
    .trim();

  if (!cleanText) return null;

  // Sarvam TTS has a 2500 char limit for bulbul:v3
  const truncated = cleanText.substring(0, 2400);

  try {
    const response = await fetch(`${BASE_URL}/text-to-speech`, {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: truncated,
        target_language_code: SARVAM_LANG_MAP[langCode] || 'en-IN',
        model: 'bulbul:v2',
        speaker: 'anushka',  // Female voice for health assistant
        pace: 0.85,
        pitch: 0.1,
        loudness: 1.2,
        enable_preprocessing: true,
      }),
    });

    if (!response.ok) {
      console.warn('Sarvam TTS error:', response.status);
      return null;
    }

    const data = await response.json();
    if (data.audios && data.audios.length > 0) {
      const audioBase64 = data.audios[0];
      const audioBlob = base64ToBlob(audioBase64, 'audio/wav');
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => URL.revokeObjectURL(audioUrl);
      return audio;
    }
    return null;
  } catch (error) {
    console.warn('Sarvam TTS failed, falling back to browser TTS:', error.message);
    return null;
  }
};

/**
 * Speech-to-Text using Sarvam's Saarika model
 * Takes a Blob of audio and returns transcribed text
 */
export const sarvamSTT = async (audioBlob, langCode = 'unknown') => {
  if (!SARVAM_API_KEY || !audioBlob) return null;

  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    formData.append('model', 'saarika:v2');
    formData.append('language_code', SARVAM_LANG_MAP[langCode] || 'unknown');

    const response = await fetch(`${BASE_URL}/speech-to-text`, {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      console.warn('Sarvam STT error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.transcript || null;
  } catch (error) {
    console.warn('Sarvam STT failed, falling back to browser STT:', error.message);
    return null;
  }
};

/**
 * Convert base64 string to Blob
 */
function base64ToBlob(base64, mimeType = 'audio/wav') {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Translate text to English using Sarvam AI
 * Used so the chatbot can understand input in any Indian language
 */
export const sarvamTranslate = async (text, sourceLang = 'auto', targetLang = 'en') => {
  if (!SARVAM_API_KEY || !text?.trim()) return text;

  try {
    const response = await fetch(`${BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        source_language_code: SARVAM_LANG_MAP[sourceLang] || 'Unknown',
        target_language_code: SARVAM_LANG_MAP[targetLang] || 'en-IN',
        mode: 'formal',
      }),
    });

    if (!response.ok) return text;
    const data = await response.json();
    return data.translated_text || text;
  } catch {
    return text;
  }
};

/**
 * Check if Sarvam API is available
 */
export const isSarvamAvailable = () => !!SARVAM_API_KEY;

/**
 * Detect script/language of text
 * Returns a language code
 */
export const detectLanguage = (text, defaultLang = 'en') => {
  if (!text) return defaultLang;
  if (/[\u0900-\u097F]/.test(text)) return 'hi'; // Devanagari (Hindi/Marathi)
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; // Telugu
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn'; // Kannada
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; // Tamil
  if (/[\u0980-\u09FF]/.test(text)) return 'bn'; // Bengali
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu'; // Gujarati
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'; // Malayalam
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa'; // Punjabi (Gurmukhi)
  if (/[\u0B00-\u0B7F]/.test(text)) return 'or'; // Odia
  
  // If mostly English characters, default to English, otherwise fallback
  return /[a-zA-Z]/.test(text) ? 'en' : defaultLang;
};

// Language names for the system prompt
const LANG_NAMES = {
  en: 'English', hi: 'Hindi', te: 'Telugu', kn: 'Kannada', ta: 'Tamil', mr: 'Marathi',
  bn: 'Bengali', gu: 'Gujarati', ml: 'Malayalam', pa: 'Punjabi', or: 'Odia'
};

/**
 * Chat Completion using Sarvam AI (sarvam-m model)
 * For free-form health assistant conversation in user's language
 */
export const sarvamChat = async (chatHistory, langCode = 'en', userContext = {}) => {
  if (!SARVAM_API_KEY) return null;

  // Detect the language from the user's most recent message
  const lastUserMsg = [...chatHistory].reverse().find(m => m.sender === 'user')?.text || '';
  const detectedCode = detectLanguage(lastUserMsg, langCode);
  const activeLangName = LANG_NAMES[detectedCode] || 'English';
  
  const systemPrompt = `You are "Nari", a caring and knowledgeable women's health AI assistant for NariCycle app. You help adolescent girls and women with menstrual health, anaemia prevention, and general wellness.

IMPORTANT RULES:
1. ALWAYS respond in English language only. Every word of your response must be in English.
2. Be warm, empathetic, and use a friendly conversational tone.
3. Give practical, actionable health advice about: menstrual health, period symptoms, anaemia, nutrition, hydration, sleep, exercise, and emotional wellness.
4. When someone describes symptoms, provide helpful suggestions but always recommend consulting a doctor for serious concerns.
5. Keep responses concise (2-4 sentences max) and easy to understand.
6. Use simple language appropriate for young girls in rural areas.
7. Never diagnose conditions — only suggest and recommend professional help.
8. You can use relevant emojis sparingly to be friendly.

User Context:
- Name: ${userContext.name || 'User'}
- Anaemia Risk: ${userContext.anaemiaRisk || 'Unknown'}
- Recent symptoms reported: ${userContext.symptoms?.join(', ') || 'None reported yet'}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }))
  ];

  try {
    const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SARVAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sarvam-m',
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.warn('Sarvam Chat error:', response.status);
      return null;
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '';
    
    // Sarvam-m model sometimes outputs internal reasoning in <think> tags.
    // Strip these out so they aren't displayed to the user or read aloud.
    content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    
    // If the user spoke in a regional language, strictly translate the English AI output to that language
    if (content && detectedCode !== 'en') {
      content = await sarvamTranslate(content, 'en', detectedCode);
    }
    
    return content || null;
  } catch (error) {
    console.warn('Sarvam Chat failed:', error.message);
    return null;
  }
};
