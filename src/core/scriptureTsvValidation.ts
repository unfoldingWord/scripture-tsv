import { parseReferenceToList } from 'bible-reference-range'
import {
  ScriptureTSV,
  TSVRow,
  ChapterNum,
  ChapterNumString,
  VerseNum,
  VerseNumString,
} from './TsvTypes'

/**
 * Validates if an object is of type ScriptureTSV.
 *
 * @returns True if the object is a ScriptureTSV, false otherwise.
 */
export function isValidScriptureTSV(obj: any): obj is ScriptureTSV {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false
  }

  // Check each property in the object
  for (const chapter in obj) {
    const chapterNum = parseInt(chapter, 10)
    if (chapter !== 'front' && isNaN(chapterNum)) {
      return false
    }

    const verses = obj[chapter]
    if (typeof verses !== 'object' || verses === null) {
      return false
    }

    // Check each verse in the chapter
    for (const verse in verses) {
      const verseNum = parseInt(verse, 10)
      if (verse !== 'intro' && isNaN(verseNum)) {
        return false
      }

      // Check if each item in verses is an object
      const verseItems = verses[verse]
      if (!Array.isArray(verseItems)) {
        return false
      }

      for (const item of verseItems) {
        if (typeof item !== 'object' || item === null) {
          return false
        }
      }
    }
  }

  return true
}

/**
 * Validates if an object is of type TSVRow.
 *
 * @returns True if the object is a TSVRow, false otherwise.
 */
export function isValidTSVRow(row: any): row is TSVRow {
  if (typeof row !== 'object' || row === null) {
    return false
  }

  // Validate ReferenceString (format 'chapter:verse' or 'chapter:verseStart-verseEnd')
  if (
    typeof row.Reference !== 'string' ||
    !parseReferenceToList(row.Reference).length
  ) {
    return false
  }

  // Validate IDString (an alphanumeric string of four characters starting with a letter)
  const ID_REGEX = /^[A-Za-z][A-Za-z0-9]{3}$/
  if (typeof row.ID !== 'string' || !ID_REGEX.test(row.ID)) {
    return false
  }

  // Check every other property to ensure it is a string
  for (const key in row) {
    if (key !== 'Reference' && key !== 'ID') {
      if (typeof row[key] !== 'string') {
        return false
      }
    }
  }

  return true
}

/**
 * Checks if a specific chapter and verse exist within a given ScriptureTSVs object.
 *
 * @returns True if the specified chapter and verse exist in the ScriptureTSVs object, otherwise false.
 */
export const doesChapterVerseExistInTsvs = (
  tsvs: ScriptureTSV,
  chapter: ChapterNum | ChapterNumString,
  verse: VerseNum | VerseNumString
): boolean => {
  if (isValidScriptureTSV(tsvs) && tsvs.hasOwnProperty(chapter)) {
    return tsvs[chapter].hasOwnProperty(verse)
  }
  return false
}

/**
 * Checks if a specific item index at chapter:verse exists within a given ScriptureTSVs object.
 *
 * @returns True if the specified chapter, verse, and item exist in the ScriptureTSVs object, otherwise false.
 */
export const doesItemIndexExistInTsvs = (
  tsvs: ScriptureTSV,
  chapter: ChapterNum | ChapterNumString,
  verse: VerseNum | VerseNumString,
  itemIndex: number
): boolean => {
  if (doesChapterVerseExistInTsvs(tsvs, chapter, verse)) {
    return (
      Array.isArray(tsvs[chapter][verse]) &&
      tsvs[chapter][verse].length > itemIndex
    )
  }
  return false
}
