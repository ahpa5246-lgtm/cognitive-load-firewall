const criticalTerms = /\b(must|must not|should not|do not|required|emergency|call|deadline|warning|contraindication|restriction)\b/gi;

export type CriticalTokens = {
  numbers: string[];
  urls: string[];
  directives: string[];
  dates: string[];
  units: string[];
  percentages: string[];
  emails: string[];
};

export function extractCriticalTokens(input: string): CriticalTokens {
  return {
    numbers: input.match(/\b\d+(?:\.\d+)?\b/g) ?? [],
    urls: input.match(/https?:\/\/\S+/g) ?? [],
    directives: input.match(criticalTerms) ?? [],
    dates: input.match(/\b(?:20\d{2}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]20\d{2})\b/g) ?? [],
    units: input.match(/\b\d+(?:\.\d+)?\s?(?:mg|g|kg|ml|cm|mm|hours?|minutes?|USD|dollars?)\b/gi) ?? [],
    percentages: input.match(/\b\d+(?:\.\d+)?%\b/g) ?? [],
    emails: input.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g) ?? []
  };
}

export function compareCriticalTokens(original: string, adapted: string) {
  const source = extractCriticalTokens(original);
  const output = extractCriticalTokens(adapted);
  const missingNumbers = source.numbers.filter((item) => !output.numbers.includes(item));
  const missingUrls = source.urls.filter((item) => !output.urls.includes(item));
  const missingDirectives = source.directives.filter((item) => !output.directives.includes(item));
  const missingDates = source.dates.filter((item) => !output.dates.includes(item));
  const missingUnits = source.units.filter((item) => !output.units.includes(item));
  const missingPercentages = source.percentages.filter((item) => !output.percentages.includes(item));
  const missingEmails = source.emails.filter((item) => !output.emails.includes(item));
  return { safe: [missingNumbers, missingUrls, missingDirectives, missingDates, missingUnits, missingPercentages, missingEmails].every((items) => items.length === 0), missingNumbers, missingUrls, missingDirectives, missingDates, missingUnits, missingPercentages, missingEmails };
}
