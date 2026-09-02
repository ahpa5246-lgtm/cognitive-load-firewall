const criticalTerms = /\b(must|must not|do not|required|emergency|call|deadline|warning|contraindication)\b/gi;

export type CriticalTokens = {
  numbers: string[];
  urls: string[];
  directives: string[];
  dates: string[];
};

export function extractCriticalTokens(input: string): CriticalTokens {
  return {
    numbers: input.match(/\b\d+(?:\.\d+)?\b/g) ?? [],
    urls: input.match(/https?:\/\/\S+/g) ?? [],
    directives: input.match(criticalTerms) ?? [],
    dates: input.match(/\b(?:20\d{2}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]20\d{2})\b/g) ?? []
  };
}

export function compareCriticalTokens(original: string, adapted: string) {
  const source = extractCriticalTokens(original);
  const output = extractCriticalTokens(adapted);
  const missingNumbers = source.numbers.filter((item) => !output.numbers.includes(item));
  const missingUrls = source.urls.filter((item) => !output.urls.includes(item));
  const missingDirectives = source.directives.filter((item) => !output.directives.includes(item));
  const missingDates = source.dates.filter((item) => !output.dates.includes(item));
  return { safe: missingNumbers.length === 0 && missingUrls.length === 0 && missingDirectives.length === 0 && missingDates.length === 0, missingNumbers, missingUrls, missingDirectives, missingDates };
}
