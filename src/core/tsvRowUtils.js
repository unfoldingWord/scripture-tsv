import flattenObject from './flattenTsvObject'
import { isValidScriptureTSV, isValidTSVRow } from './scriptureTsvValidation'
import './TsvTypes'

/**
 * Extracts chapter and verse from string in a chapter:verse format.
 * If string does not adhere to chapter:verse format, throws an error.
 * @param {ReferenceString} referenceString The reference string to parse
 *
 * @returns {TSVReference} - parsed chapter/verse
 *
 * @throws {Error} Throws an error if the string is not a ReferenceString
 */
export const getChapterVerse = referenceString => {
  const stringParts = referenceString.split(':').map(Number)

  if (stringParts.length !== 2 || stringParts.some(isNaN)) {
    throw new Error(
      `Invalid reference string format: ${referenceString}. Expected format is 'chapter:verse'.`
    )
  }

  const [chapter, verse] = stringParts
  return { chapter, verse }
}

/**
 * Calculates the frequency index of unique values and value lengths for each column in a list of TSVRow items.
 *
 * @param {Array.<TSVRow>} allItems - An array of TSVRow objects.
 *
 * @returns {RowsLengthIndex}
 *
 * @example
 *   let allItems = [{A: '1', B: 'x'}, {A: '2', B: 'y'}, {A: '1', B: 'z'}];
 *   let { rowsIndex, lengthIndex } = calculateRowsLengthIndex(allItems);
 *      rowsIndex => { A: { '1': 2, '2': 1 }, B: { 'x': 1, 'y': 1, 'z': 1 } }
 *      lengthIndex => { A: { '1': 3 }, B: { '1': 3 } }
 */
const calculateRowsLengthIndex = allItems => {
  if (!Array.isArray(allItems)) {
    throw new Error('allItems is not of type array!')
  }

  let rowsIndex = {}
  let lengthIndex = {}

  allItems.forEach(item => {
    if (!isValidTSVRow(item)) return

    Object.entries(item).forEach(([column, value]) => {
      if (!rowsIndex[column]) {
        rowsIndex[column] = {}
      }

      if (!rowsIndex[column][value]) {
        rowsIndex[column][value] = 0
      }
      rowsIndex[column][value]++
      const valueLength = value.length

      if (!lengthIndex[column]) {
        lengthIndex[column] = {}
      }

      if (!lengthIndex[column][valueLength]) {
        lengthIndex[column][valueLength] = 0
      }
      lengthIndex[column][valueLength]++
    })
  })

  return { rowsIndex, lengthIndex }
}

/**
 * Generates and pre-fills a TSV (Tab-Separated Values) row based on existing rows.
 *
 * This function creates a new row object based on the patterns and frequency of values
 * in the existing rows. For example:
 * - If a value is frequently repeated (less than 65% unique), the new row will duplicate that value.
 * - If a value is almost always unique and has a short length, a new unique ID is generated.
 *
 * NOTE:
 * - If `tsvs` is empty or not provided, an empty object is returned.
 *
 * @param {ScriptureTSV} tsvs - The existing TSVs to base the new row on.
 * @param {ChapterNum} chapter - Represents the Bible chapter we are interested in.
 * @param {VerseNum} verse - Represents the Bible verse we are interested in.
 *
 * @returns {TSVRow} - New row object with prefilled column names and some pre-filled values.
 */
export const rowGenerate = (tsvs, chapter, verse) => {
  if (!isValidScriptureTSV(tsvs)) return {}
  const allItems = flattenObject(tsvs)
  if (!allItems.length) return {}

  const { rowsIndex, lengthIndex } = calculateRowsLengthIndex(allItems)
  if (Object.keys(rowsIndex).length === 0) return {}

  // If tsvs is valid, items not empty, and rowsIndex exists then items are valid
  const rowData = allItems[0]
  const newRow = {}

  Object.entries(rowData).forEach(([column, value]) => {
    if (column === 'Reference') {
      newRow[column] = `${chapter}:${verse}`
      return
    }
    const values = Object.keys(rowsIndex[column]).length
    const valuesRatio = values / allItems.length
    const shouldDuplicateValue = valuesRatio < 0.65 // If the value is reused many times then it should be duplicated.

    const valuesLengths = Object.keys(lengthIndex[column])
    const needRandomId = valuesRatio > 0.99 && valuesLengths.length <= 2

    let newValue = ''
    if (shouldDuplicateValue) {
      newValue = value
    } else if (needRandomId) {
      const allIds = Object.keys(rowsIndex[column])
      newValue = generateRandomUID(allIds)
    }
    newRow[column] = newValue
  })

  return { ...newRow }
}

/**
 * Generates a new unique ID for a tsv given already used IDs
 *
 * @param {Array.<TSVRow>} allIds list of IDs that are already in use
 * @param {IDLength} defaultLength default length of the ID to create
 * @returns {IDString} new unique ID for a new tsv row
 */
export const generateRandomUID = (allIds = [], defaultLength = 4) => {
  let sampleID = allIds[0]
  let length = sampleID?.length || defaultLength
  let notUnique = true
  let counter = 0
  let newID = ''
  const UNIQUE_COUNTER_THRESHOLD = 1000

  while (notUnique && counter < UNIQUE_COUNTER_THRESHOLD) {
    newID = randomId(length)
    notUnique = allIds.includes(newID)
    counter++
  }

  if (counter >= UNIQUE_COUNTER_THRESHOLD) {
    console.log(
      'Duplicate IDs found after ' + UNIQUE_COUNTER_THRESHOLD + ' tries'
    )
  }
  return newID
}

/**
 * Generates a random alphanumeric ID string.
 *
 * The function first picks a random letter from 'a' to 'z' as the starting character.
 * Then it generates a random alphanumeric string and appends it to the initial letter.
 * Finally, it extends the ID to the specified length.
 *
 * NOTE:
 * - If the specified length is greater than 9, it will be capped at 9.
 *
 * @param {IDLength} length - The desired length of the ID. If greater than 9, it will be set to 9.
 *
 * @returns {IDString} - The randomly generated ID.
 *
 * @example
 *   const id = randomId(5); // Outputs something like 'a3f5z'
 */
const randomId = length => {
  // get the initial letter first
  const letters = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ]
  const random = Math.floor(Math.random() * letters.length)
  const number = Math.random() // 0.9394456857981651

  // number.toString(36); // '0.xtis06h6'
  if (length > 9) {
    length = 9
  }

  /* @todo my linter is showing that substr(from : number, length : number | undefined) is deprecated here. */
  const id = letters[random] + number.toString(36).substring(2, 2 + length - 1) // 'xtis06h6'
  return id
}

/**
 * Generates filter options for specified TSV column names based on the given TSV Row
 *
 * The function iterates over each item in the `allItems` array and each column name in `columnNames`.
 * It then populates an object (`columnsFilterOptions`) where each key is a column name and the value
 * is a sorted array of unique values present in that column across all items. This is helpful for
 * column values the user may want to select from, such as `Reference` and `SupportReference`
 *
 * @param {Array.<string>} columnNames - Array of column names for which to generate filter options.
 * @param {Array.<TSVRow>} allItems - Array of TSVRows containing TSV data
 *
 * @returns {Object.<string, string[]>} - An object where each key is a column name and the value is a sorted array of unique values for that column.
 *
 * @example
 *   const columnNames = ["Chapter", "Verse"];
 *   const allItems = [
 *     { "Chapter": "1", "Verse": "1", "Text": "In the beginning..." },
 *     { "Chapter": "1", "Verse": "2", "Text": "And the earth was..." },
 *     { "Chapter": "2", "Verse": "1", "Text": "Thus the heavens..." }
 *   ];
 *
 *   const result = getColumnsFilterOptions(columnNames, allItems);
 *     Outputs: { "Chapter": ["1", "2"], "Verse": ["1", "2"] }
 */
export const getColumnsFilterOptions = (columnNames, allItems) => {
  const columnsFilterOptions = {}

  allItems.forEach(item => {
    columnNames.forEach(columnName => {
      const value = item[columnName]
      if (value) {
        if (!columnsFilterOptions[columnName]) {
          columnsFilterOptions[columnName] = new Set()
        }

        if (!columnsFilterOptions[columnName].has(value)) {
          columnsFilterOptions[columnName].add(value)
        }
      }
    })
  })

  columnNames.forEach(columnName => {
    if (columnsFilterOptions[columnName]) {
      columnsFilterOptions[columnName] = [
        ...columnsFilterOptions[columnName],
      ].sort(sortSKU) // sort chapters and verses
    }
  })

  return columnsFilterOptions
}

function sortSKU(a, b) {
  var aParts = a.split(':'),
    bParts = b.split(':'),
    partCount = aParts.length,
    i

  if (aParts.length !== bParts.length) {
    return aParts.length - bParts.length
  }

  for (i = 0; i < partCount; i++) {
    if (aParts[i] !== bParts[i]) {
      return +aParts[i] - +bParts[i]
    }
  }
  //Exactly the same
  return 0
}
