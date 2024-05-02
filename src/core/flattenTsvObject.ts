import type { ScriptureTSV, TSVRow } from '../types/TsvTypes'

/**
 * Compare function to sort verses.
 */
const sortVerses = (a: string, b: string): number => {
  const parseVerse = (v: string) =>
    v.includes('-') ? parseInt(v.split('-')[0], 10) : parseInt(v, 10)
  const numA = isNaN(parseVerse(a)) ? 0 : parseVerse(a)
  const numB = isNaN(parseVerse(b)) ? 0 : parseVerse(b)

  return numA - numB
}

/**
 * @description Given a ScriptureTSV object, flatten the nested object into an array
 * of TSV rows. This flattened array is properly sorted by verse, making sure to put
 * data such as chapter "front" and "intro" at the beginning.
 * @param tsvObj The ScriptureTSV object to flatten
 * @returns An array of TSV rows
 */
export default function flattenObject(tsvObj: ScriptureTSV): TSVRow[] {
  if (!tsvObj) return []

  const chapters = Object.keys(tsvObj)

  const flatten = chapters.reduce((flatAccumulator, chapter) => {
    const verses = Object.keys(tsvObj[chapter]).sort(sortVerses)

    // Ensure 'intro' is at the beginning
    const sortedVerses = verses.includes('intro')
      ? ['intro', ...verses.filter(v => v !== 'intro')]
      : verses

    // Flatten verses
    return sortedVerses.reduce(
      (verseAccumulator, verse) => [
        ...verseAccumulator,
        ...tsvObj[chapter][verse],
      ],
      flatAccumulator
    )
  }, [] as TSVRow[])

  // Ensure 'front:intro' is at the beginning
  const lastTsvItem = flatten[flatten.length - 1]
  if (
    lastTsvItem?.Chapter === 'front' ||
    lastTsvItem?.Reference === 'front:intro'
  ) {
    return [lastTsvItem, ...flatten.slice(0, -1)]
  }

  return flatten
}
