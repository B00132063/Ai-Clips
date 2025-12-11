// src/utils/emotion.js

export function generateCaptionForEmotion(emotionLabel) {
  const e = (emotionLabel || "").toLowerCase();

  if (e.includes("happy") || e.includes("joy"))
    return "Pure joy — the perfect moment to share.";
  if (e.includes("surprise"))
    return "Caught in the moment — an unexpected twist.";
  if (e.includes("sad") || e.includes("sadness"))
    return "An emotional moment that really hits.";
  if (e.includes("angry") || e.includes("anger"))
    return "Things get intense — emotions running high.";
  if (e.includes("fear") || e.includes("scared"))
    return "Tension rising — you can feel the suspense.";
  if (e.includes("neutral"))
    return "Calm, focused moment — ideal for context or storytelling.";

  return "A standout moment your audience will love.";
}

export function computeDominantEmotion(clips = []) {
  if (!clips.length) return null;

  const counts = {};

  for (const c of clips) {
    const key = c.emotion_label || "Unknown";
    counts[key] = (counts[key] || 0) + (c.peak_score || 1);
  }

  let bestLabel = null;
  let bestScore = -Infinity;
  let total = 0;

  for (const [label, score] of Object.entries(counts)) {
    total += score;
    if (score > bestScore) {
      bestScore = score;
      bestLabel = label;
    }
  }

  const prob = total ? bestScore / total : 0;
  return { label: bestLabel, prob };
}
// End of emotion.js