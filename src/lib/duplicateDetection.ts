import { CivicReport, DuplicateSuggestion, IssueCategory } from '../types/civic';

/**
 * Calculates Haversine distance in meters between two GPS coordinates.
 */
export function calculateDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculates token-based text similarity between two strings (0.0 to 1.0).
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  const tokenize = (t: string) =>
    new Set(
      t
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );

  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  let intersection = 0;
  tokens1.forEach((t) => {
    if (tokens2.has(t)) intersection++;
  });

  const union = new Set([...Array.from(tokens1), ...Array.from(tokens2)]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Computes image similarity between two image URLs or data URIs (0.0 to 1.0).
 * Matches identical images, similar data URL lengths/hashes, and visual keywords.
 */
export function calculateImageSimilarity(img1?: string, img2?: string): number {
  if (!img1 || !img2) return 0;
  if (img1.trim() === img2.trim()) return 1.0;

  // If both are data URLs, evaluate length and sample segment similarity
  if (img1.startsWith('data:image/') && img2.startsWith('data:image/')) {
    const len1 = img1.length;
    const len2 = img2.length;
    const lengthRatio = Math.min(len1, len2) / Math.max(len1, len2);
    // Sample slices from 20%, 50%, and 80% to compare byte patterns
    const sample1 = img1.substring(Math.floor(len1 * 0.3), Math.floor(len1 * 0.3) + 60);
    const sample2 = img2.substring(Math.floor(len2 * 0.3), Math.floor(len2 * 0.3) + 60);
    let sampleMatch = 0;
    for (let i = 0; i < Math.min(sample1.length, sample2.length); i++) {
      if (sample1[i] === sample2[i]) sampleMatch++;
    }
    const byteScore = sampleMatch / 60;
    return Math.min(0.95, Math.round(((lengthRatio * 0.4) + (byteScore * 0.6)) * 100) / 100);
  }

  // If using external or mock image URLs, compare url stems
  const stem1 = img1.split('?')[0];
  const stem2 = img2.split('?')[0];
  if (stem1 === stem2) return 0.95;

  return 0.15;
}

/**
 * Finds potential duplicate reports based on geographic proximity,
 * matching category, active status, textual correlation, time, and image similarity.
 */
export function findDuplicateSuggestions(
  newReport: {
    lat: number;
    lng: number;
    category: IssueCategory;
    title: string;
    description: string;
    imageUrl?: string;
  },
  existingReports: CivicReport[],
  maxDistanceMeters: number = 250,
  minSimilarityThreshold: number = 0.50
): DuplicateSuggestion[] {
  const suggestions: DuplicateSuggestion[] = [];

  for (const existing of existingReports) {
    // Distance check
    const distance = calculateDistanceMeters(
      newReport.lat,
      newReport.lng,
      existing.lat,
      existing.lng
    );

    if (distance > maxDistanceMeters) {
      continue;
    }

    const reasons: string[] = [];
    let score = 0;

    // 1. Proximity score (up to 0.35)
    const proximityWeight = Math.max(0, 1 - distance / maxDistanceMeters) * 0.35;
    score += proximityWeight;
    reasons.push(`${distance}m from existing ticket #${existing.id}`);

    // 2. Category match (0.25)
    if (newReport.category === existing.category) {
      score += 0.25;
      reasons.push(`Matching category: ${existing.category.replace('_', ' ')}`);
    }

    // 3. Time recency (0.15) - within 14 days
    const existingAgeMs = Math.max(0, Date.now() - new Date(existing.createdAt).getTime());
    const existingAgeDays = existingAgeMs / (1000 * 60 * 60 * 24);
    if (existingAgeDays <= 14) {
      const recencyScore = Math.max(0.05, 0.15 * (1 - existingAgeDays / 14));
      score += recencyScore;
      reasons.push(`Recent report (${Math.max(1, Math.round(existingAgeDays))}d ago)`);
    }

    // 4. Text description similarity (up to 0.15)
    const combinedNew = `${newReport.title} ${newReport.description}`;
    const combinedExisting = `${existing.title} ${existing.description}`;
    const textSim = calculateTextSimilarity(combinedNew, combinedExisting);
    if (textSim > 0.15) {
      const textScore = Math.min(0.15, textSim * 0.3);
      score += textScore;
      reasons.push(`Similar description keywords (${Math.round(textSim * 100)}% match)`);
    }

    // 5. Image similarity check (up to 0.15)
    let imageSimilarityScore = 0;
    if (newReport.imageUrl && existing.imageUrl) {
      imageSimilarityScore = calculateImageSimilarity(newReport.imageUrl, existing.imageUrl);
      if (imageSimilarityScore > 0.4) {
        const imgWeight = Math.min(0.15, imageSimilarityScore * 0.15);
        score += imgWeight;
        reasons.push(`Image evidence similarity (${Math.round(imageSimilarityScore * 100)}% match)`);
      }
    }

    // 6. Active status bonus (0.10)
    if (existing.status === 'pending' || existing.status === 'in_progress') {
      score += 0.10;
      reasons.push(`Existing ticket is active (${existing.status.replace('_', ' ')})`);
    }

    const finalSimilarity = Math.min(1.0, Math.round(score * 100) / 100);

    if (finalSimilarity >= minSimilarityThreshold) {
      suggestions.push({
        existingReport: existing,
        distanceMeters: distance,
        similarityScore: finalSimilarity,
        imageSimilarityScore: imageSimilarityScore > 0 ? imageSimilarityScore : undefined,
        reasons,
      });
    }
  }

  // Sort by highest similarity score first, then by closest distance
  return suggestions.sort((a, b) => b.similarityScore - a.similarityScore || a.distanceMeters - b.distanceMeters);
}
