import { parseReferenceToList } from 'bible-reference-range'
import flattenObject from './flattenTsvObject'
import { isValidScriptureTSV, isValidTSVRow } from './scriptureTsvValidation'
import {
  ReferenceString,
  TSVReference,
  RowsLengthIndex,
  TSVRow,
  ScriptureTSV,
  IDString,
  IDLength,
  ChapterNum,
  VerseNum,
} from './TsvTypes'

/**
 * Extracts chapter and verse from string in a chapter:verse format.
 * If string does not adhere to chapter:verse format, throws an error.
 *
 * @returns parsed chapter/verse
 * @throws Throws an error if the string is not a ReferenceString
 */
export const getChapterVerse = (
  referenceString: ReferenceString
): TSVReference => {
  const verseChunks = parseReferenceToList(referenceString)

  if (!verseChunks) {
    throw new Error(
      `Invalid reference string format: ${referenceString}. Expected format is 'chapter:verse'.`
    )
  }

  const { chapter, verse } = verseChunks[0]
  return { chapter, verse }
}

/**
 * Calculates the frequency index of unique values and value lengths for each column in a list of TSVRow items.
 *
 * @example
 *   let allItems = [{A: '1', B: 'x'}, {A: '2', B: 'y'}, {A: '1', B: 'z'}];
 *   let { rowsIndex, lengthIndex } = calculateRowsLengthIndex(allItems);
 *      rowsIndex => { A: { '1': 2, '2': 1 }, B: { 'x': 1, 'y': 1, 'z': 1 } }
 *      lengthIndex => { A: { '1': 3 }, B: { '1': 3 } }
 */
export const calculateRowsLengthIndex = (
  allItems: TSVRow[]
): RowsLengthIndex => {
  if (!Array.isArray(allItems)) {
    throw new Error('allItems is not of type array!')
  }

  let rowsIndex: { [column: string]: { [value: string]: number } } = {}
  let lengthIndex: { [column: string]: { [valueLength: number]: number } } = {}

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
 * @returns New row object with prefilled column names and some pre-filled values.
 */
export const rowGenerate = (
  tsvs: ScriptureTSV,
  chapter: ChapterNum,
  verse: VerseNum
): TSVRow => {
  const emptyTSVRow = { Reference: '', ID: '' }
  if (!isValidScriptureTSV(tsvs)) return emptyTSVRow
  const allItems = flattenObject(tsvs)
  if (!allItems.length) return emptyTSVRow

  const { rowsIndex, lengthIndex } = calculateRowsLengthIndex(allItems)
  if (Object.keys(rowsIndex).length === 0) return emptyTSVRow

  // If tsvs is valid, items not empty, and rowsIndex exists then items are valid
  const rowData: TSVRow = allItems[0]

  return Object.entries(rowData).reduce(
    (rowAcc: TSVRow, [column, value]) => {
      if (column === 'Reference') {
        rowAcc[column] = `${chapter}:${verse}`
      } else if (column === 'ID') {
        const allIds: IDString[] = Object.keys(rowsIndex[column]) as IDString[]
        rowAcc[column] = generateRandomUID(allIds)
      } else {
        const values = Object.keys(rowsIndex[column]).length
        const valuesRatio = values / allItems.length
        const shouldDuplicateValue = valuesRatio < 0.65 // If the value is reused many times then it should be duplicated.
        const valuesLengths = Object.keys(lengthIndex[column])
        const needRandomId = valuesRatio > 0.99 && valuesLengths.length <= 2

        if (shouldDuplicateValue) {
          rowAcc[column] = value
        } else if (needRandomId) {
          const allIds: IDString[] = Object.keys(
            rowsIndex[column]
          ) as IDString[]
          rowAcc[column] = generateRandomUID(allIds)
        } else {
          rowAcc[column] = ''
        }
      }
      return rowAcc
    },
    { Reference: '', ID: '' } as TSVRow
  )
}

/**
 * Generates a new unique ID for a tsv given already used IDs
 *
 * @returns new unique ID for a new tsv row
 */
export const generateRandomUID = (
  allIds: IDString[] = [],
  defaultLength: IDLength = 4
): IDString => {
  let sampleID: IDString = allIds[0]
  let length: IDLength = sampleID?.length || defaultLength
  let notUnique = true
  let counter = 0
  let newID: IDString = ''
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
 * @returns The randomly generated ID.
 *
 * @example
 *   const id = randomId(5); // Outputs something like 'a3f5z'
 */
export const randomId = (length: IDLength): IDString => {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const random = Math.floor(Math.random() * letters.length)
  const number = Math.random()
    .toString(36)
    .substring(2, 2 + length - 1)

  if (length > 9) {
    length = 9
  }

  return letters[random] + number.substring(0, length - 1)
}

/**
 * Generates filter options for specified TSV column names based on the given TSV Row
 *
 * The function iterates over each item in the `allItems` array and each column name in `columnNames`.
 * It then populates an object (`columnsFilterOptions`) where each key is a column name and the value
 * is a sorted array of unique values present in that column across all items. This is helpful for
 * column values the user may want to select from, such as `Reference` and `SupportReference`
 *
 * @returns An object where each key is a column name and the value is a sorted array of unique values for that column.
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
export const getColumnsFilterOptions = (
  columnNames: string[],
  allItems: TSVRow[]
): { [column: string]: string[] } => {
  const columnsFilterOptions: { [column: string]: Set<string> } = {}

  allItems.forEach(item => {
    columnNames.forEach(columnName => {
      const value = item[columnName]
      if (value) {
        if (!columnsFilterOptions[columnName]) {
          columnsFilterOptions[columnName] = new Set()
        }

        columnsFilterOptions[columnName].add(value)
      }
    })
  })

  const result: { [column: string]: string[] } = {}
  columnNames.forEach(columnName => {
    if (columnsFilterOptions[columnName]) {
      result[columnName] = Array.from(columnsFilterOptions[columnName]).sort(
        sortSKU
      )
    }
  })

  return result
}

function sortSKU(a: string, b: string): number {
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
