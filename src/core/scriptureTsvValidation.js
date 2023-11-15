/**
 * Validates if an object is of type ScriptureTSV.
 * @param {any} obj - The object to be validated.
 * @returns {boolean} - True if the object is a ScriptureTSV, false otherwise.
 */
export function isValidScriptureTSV(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }

  // Check each property in the object
  for (const chapter in obj) {
    const chapterNum = parseInt(chapter, 10)
    if (isNaN(chapterNum)) {
      return false
    }

    const verses = obj[chapter]
    if (typeof verses !== 'object' || verses === null) {
      return false
    }

    // Check each verse in the chapter
    for (const verse in verses) {
      const verseNum = parseInt(verse, 10)
      if (isNaN(verseNum)) {
        return false
      }
      if (!Array.isArray(verses[verse])) {
        return false
      }
    }
  }

  return true
}
