type SafetyScan = {
  blocked: boolean;
  requiresCare: boolean;
  matchCount: number;
  message: string | null;
};

const emergencyPatterns = [
  /worsening severe headache/i,
  /repeated vomiting/i,
  /seizure/i,
  /loss of consciousness/i,
  /increasing confusion/i,
  /increasing agitation/i,
  /unable to wake/i,
  /weakness/i,
  /numbness/i,
  /slurred speech/i,
  /severe deterioration/i,
  /significant deterioration/i,
];

const arabicEmergencyPatterns = [
  /(?:صداع شديد.{0,32}(?:يزداد|متفاقم|يتفاقم)|(?:يزداد|يتفاقم).{0,32}صداع شديد)/u,
  /(?:تقيؤ|قيء|استفراغ)\s+متكرر/u,
  /(?:نوبه\s+(?:صرع|تشنج)|تشنجات?)/u,
  /(?:فقدان|غياب)\s+(?:الوعي|الادراك)/u,
  /(?:ارتباك|تشوش)\s+(?:متزايد|يزداد)/u,
  /(?:لا\s+(?:يمكن|استطيع).{0,18}(?:ايقاظه|ايقاظي)|صعوبه\s+ايقاظ)/u,
  /(?:ضعف|خدر|تنميل)\s+(?:مفاجئ|مفاجي|جديد)/u,
  /(?:ثقل|تداخل|صعوبه)\s+(?:في\s+)?الكلام/u,
  /(?:تدهور|تفاقم)\s+(?:شديد|ملحوظ)/u,
  /(?:رؤيه|رويه)\s+مزدوجه/u,
];

const boundaryPattern = /\b(return to|play|football|drive|driving|fully recovered|how severe|take medication|medication)\b/i;
const arabicBoundaryPattern = /(?:العوده\s+(?:الى\s+)?(?:اللعب|الرياضه)|هل\s+استطيع\s+(?:العوده|القياده)|قياده\s+(?:السياره)?|تناول\s+(?:دواء|الدواء)|هل\s+تعافيت\s+تماما)/u;

function normalizeArabicForSafety(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ـ/g, "");
}

export function safetyScan(input: string): SafetyScan {
  const normalizedArabic = normalizeArabicForSafety(input);
  const matches = [
    ...emergencyPatterns.filter((pattern) => pattern.test(input)),
    ...arabicEmergencyPatterns.filter((pattern) => pattern.test(normalizedArabic)),
  ];
  const requiresCare = boundaryPattern.test(input) || arabicBoundaryPattern.test(normalizedArabic);

  return {
    blocked: matches.length > 0,
    requiresCare,
    matchCount: matches.length,
    message: matches.length
      ? "This tool cannot determine severity. Seek urgent medical evaluation or local emergency services."
      : requiresCare
        ? "This tool cannot diagnose, prescribe, or clear activity. Please ask a qualified clinician for guidance."
        : null,
  };
}
