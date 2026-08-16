/**
 * OpenAlex stores abstracts as an inverted index (key: word, value: array of zero-based character/word indices).
 * This reconstructs standard English text from the inverted index object.
 */
export function reconstructAbstract(invertedIndex) {
  if (!invertedIndex || typeof invertedIndex !== 'object' || Object.keys(invertedIndex).length === 0) {
    return 'Abstract not available.';
  }

  let maxPosition = 0;
  for (const positions of Object.values(invertedIndex)) {
    for (const pos of positions) {
      if (pos > maxPosition) {
        maxPosition = pos;
      }
    }
  }

  const words = new Array(maxPosition + 1).fill('');
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }

  return words.join(' ').replace(/\s+/g, ' ').trim();
}