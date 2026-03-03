const CHARACTER_WIDTHS: Record<string, number> = {
  I: 0.55,
  J: 0.6,
  L: 0.65,
  T: 0.75,
  f: 0.65,
  i: 0.45,
  j: 0.45,
  l: 0.45,
  m: 1.2,
  w: 1.2,
  M: 1.25,
  W: 1.25,
  "-": 0.55,
};

export interface LetterTransform {
  character: string;
  x: number;
}

export function wordToLetterTransforms(
  text: string,
  letterSpacing = 0.12,
  wordSpacing = 0.55,
): { letters: LetterTransform[]; width: number } {
  const letters: LetterTransform[] = [];
  let cursor = 0;

  for (const character of text) {
    if (character === " ") {
      cursor += wordSpacing;
      continue;
    }

    const glyphWidth = CHARACTER_WIDTHS[character] ?? 0.9;
    letters.push({ character, x: cursor + glyphWidth / 2 });
    cursor += glyphWidth + letterSpacing;
  }

  const width = Math.max(cursor - letterSpacing, 0);
  const centeredLetters = letters.map((letter) => ({
    ...letter,
    x: letter.x - width / 2,
  }));

  return { letters: centeredLetters, width };
}
