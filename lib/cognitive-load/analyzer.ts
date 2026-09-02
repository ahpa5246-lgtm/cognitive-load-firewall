import type { LoadVector } from "@/lib/types";
const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function analyzeContentLoad(text: string): LoadVector {
	const normalized = text.trim();
	const words = normalized ? normalized.split(/\s+/) : [];
	const sentences = normalized ? normalized.split(/[.!?]+/).filter(Boolean) : [];
	const paragraphs = normalized ? normalized.split(/\n\s*\n/).filter(Boolean) : [];
	const averageSentence = words.length / Math.max(1, sentences.length);
	const longWordRatio = words.filter((word) => word.replace(/[^\p{L}]/gu, "").length >= 10).length / Math.max(1, words.length);
	const sequenceMarkers = (normalized.match(/\b(first|next|then|before|after|must|identify|compare|interpret|step|finally)\b/gi) ?? []).length;
	const references = (normalized.match(/\b(this|that|above|below|previous|following|section)\b/gi) ?? []).length;
	const switches = (normalized.match(/\b(and then|instead|alternatively|however|if|unless)\b/gi) ?? []).length;
	const readingMinutes = words.length / 220;

	return {
		reading: clamp(16 + averageSentence * 1.8 + longWordRatio * 55),
		memory: clamp(18 + sequenceMarkers * 7 + references * 5 + Math.min(words.length / 8, 30)),
		attention: clamp(12 + Math.min(words.length / 3.2, 58) + averageSentence + switches * 4),
		visual: clamp(25 + Math.min(paragraphs.length * 4, 25) + Math.min(words.length / 10, 35)),
		motion: /\b(animated|moving|flashing|video|scroll)\b/i.test(normalized) ? 35 : 5,
		density: clamp(18 + Math.min(words.length / 5, 35) + Math.max(0, 6 - paragraphs.length) * 5),
		audio: clamp(10 + (normalized.match(/\b(listen|audio|sound|video)\b/gi) ?? []).length * 10),
		taskSwitching: clamp(8 + switches * 10 + sequenceMarkers * 3),
		duration: clamp(readingMinutes * 16),
		fatigue: clamp(10 + readingMinutes * 12)
	};
}
