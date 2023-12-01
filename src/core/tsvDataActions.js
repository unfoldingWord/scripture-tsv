import cloneDeep from 'lodash.clonedeep'
import flattenObject from './flattenTsvObject'
import {
  isValidScriptureTSV,
  isValidTSVRow,
  doesChapterVerseExistInTsvs,
} from './scriptureTsvValidation'
import parser from 'tsv'
import './TsvTypes'

/**
 * @description Contains functions to perform add/delete/move/edit row to a
 * given ScriptureTSVs object
 */

/**
 * add a tsv item to an existing tsvs object
 * @param {ScriptureTSV} tsvs Object containing tsv data for each book chapter
 * @param {TSVRow} newItem Object with keys of tsv column names and values of tsv column values
 * @param {ChapterNum} chapter Chapter index of tsv to insert
 * @param {VerseNum} verse Verse index of tsv to insert
 * @param {ItemIndex} itemIndex Item index of tsv to insert
 * @returns new tsvs object containing new tsv item
 */
export const addTsvRow = (tsvs, newItem, chapter, verse, itemIndex) => {
  if (!isValidScriptureTSV(tsvs)) {
    throw new Error('Invalid Scripture TSV input!')
  }
  if (!isValidTSVRow(newItem)) {
    throw new Error('Invalid new row input!')
  }

  const newTsvs = cloneDeep(tsvs)
  let newItems = []
  if (newTsvs?.[chapter]?.[verse]) {
    newItems = [...newTsvs[chapter][verse]]
  }
  newItems.splice(itemIndex + 1, 0, newItem)
  newTsvs[chapter][verse] = newItems

  // TODO: Handle reference ranges
  // let refRangeTag = newTsvItem?._referenceRange;
  // if (refRangeTag) {
  //   return updateTsvReferenceRange(newTsvs, newTsvItem, refRangeTag)
  // }

  return newTsvs
}

/**
 * delete a tsv item from an existing tsvs object
 * @param {ScriptureTSV} tsvs Object containing tsv data for each book chapter
 * @param {ChapterNum} chapter Chapter index of tsv to insert
 * @param {VerseNum} verse Verse index of tsv to insert
 * @param {ItemIndex} itemIndex Item index of tsv to insert
 * @returns new tsvs object containing new tsv item
 */
export const deleteTsvRow = (tsvs, chapter, verse, itemIndex) => {
  if (!isValidScriptureTSV(tsvs)) {
    throw new Error('Invalid Scripture TSV input')
  }
  if (!doesChapterVerseExistInTsvs(tsvs, chapter, verse)) {
    throw new Error(`No item to delete at chapter: ${chapter} verse: ${verse}`)
  }

  const newTsvs = cloneDeep(tsvs)
  const items = newTsvs[chapter][verse]
  const newItems = [...items.slice(0, itemIndex), ...items.slice(itemIndex + 1)]
  newTsvs[chapter][verse] = newItems

  // TODO: Handle reference ranges
  // let refRangeTag = newTsvItem?._referenceRange;
  // if (refRangeTag) {
  //   return updateTsvReferenceRange(newTsvs, newTsvItem, refRangeTag)
  // }

  return newTsvs
}

/**
 * updates a tsv item with a new tsv item
 * @param {ScriptureTSV} tsvs Object containing tsv data for each book chapter
 * @param {UpdatedRowValue} newRowValue Object with key of tsv column name and value of tsv column value
 * @param {ChapterNum} chapter Chapter index of tsv to insert
 * @param {VerseNum} verse Verse index of tsv to insert
 * @param {ItemIndex} itemIndex Item index of tsv to insert
 * @returns new tsvs object containing updated tsv item
 */
export const updateTsvRow = (tsvs, newRowValue, chapter, verse, itemIndex) => {
  if (!isValidScriptureTSV(tsvs)) {
    throw new Error('Invalid Scripture TSV input')
  }

  const newTsvs = cloneDeep(tsvs)
  const oldTsvItem = { ...tsvs[chapter][verse][itemIndex] }
  const newTsvItem = { ...oldTsvItem, ...newRowValue }
  if (!isValidTSVRow(newTsvItem)) {
    throw new Error('Invalid new row input!')
  }
  newTsvs[chapter][verse][itemIndex] = newTsvItem

  let refRangeTag = newTsvItem?._referenceRange
  if (refRangeTag) {
    return modifyTsvReferenceRange(
      newTsvs,
      refRangeTag,
      updateRefRange,
      newTsvItem
    )
  }

  return newTsvs
}

/**
 * Handles an operation on a specific reference range within a Scripture TSV object.
 *
 * @param {ScriptureTSV} tsvs - The TSVs object where reference ranges will be modified.
 * @param {string} refRangeTag - The tag of the reference range to modify.
 * @param {Function} operation - The callback function to perform the specific operation.
 * @param {...any} rest - Additional arguments required by the operation callback.
 * @returns {ScriptureTSV} A new TSVs object with the modified reference range.
 * @throws Will throw an error if the input TSVs or TSV item is invalid.
 */
const modifyTsvReferenceRange = (tsvs, refRangeTag, operation, ...rest) => {
  const [tsvItem] = rest

  if (!isValidScriptureTSV(tsvs)) {
    throw new Error('Invalid Scripture TSV input')
  }
  if (!isValidTSVRow(tsvItem)) {
    throw new Error('Invalid new row input!')
  }

  const newTsvs = cloneDeep(tsvs)
  for (const chapter of Object.keys(newTsvs)) {
    const tsvChapter = newTsvs[chapter]
    for (const verse of Object.keys(tsvChapter)) {
      newTsvs[chapter][verse] = operation(
        tsvChapter[verse],
        refRangeTag,
        ...rest
      )
    }
  }
  return newTsvs
}

/**
 * Updates a specific reference range within a verse array with a new TSV item.
 *
 * @param {Array} verseArray - The array of verse objects to be updated.
 * @param {string} refRangeTag - The tag of the reference range to update.
 * @param {TSVRow} tsvItem - The new TSV item to replace in the reference range.
 * @returns {Array} An updated array of verse objects with the specified reference range updated.
 */
const updateRefRange = (verseArray, refRangeTag, tsvItem) =>
  verseArray.map(note =>
    note?._referenceRange === refRangeTag ? tsvItem : note
  )

/**
 * Moves a tsv item in a chapter, verse to another index in the tsv items array
 * @param {Object} tsvs tsvs object where note will be move
 * @param {ChapterNum} chapter
 * @param {VerseNum} verse
 * @param {ItemIndex} itemIndex
 * @param {ItemIndex} newIndex
 * @returns updated tsvs object with shifted tsv row
 */
export const moveTsvRow = (tsvs, chapter, verse, itemIndex, newIndex) => {
  if (!isValidScriptureTSV(tsvs)) {
    throw new Error('Invalid Scripture TSV input')
  }

  const newTsvs = cloneDeep(tsvs)
  const newItems = arrayMove(newTsvs[chapter][verse], itemIndex, newIndex)
  newTsvs[chapter][verse] = newItems
  return newTsvs
}

/**
 * Shifts an element in an array at oldIndex to newIndex
 * @param {Array.<any>} array
 * @param {int} oldIndex
 * @param {int} newIndex
 * @returns array containing shifted element
 */
export const arrayMove = (array, oldIndex, newIndex) => {
  let _array = [...array]
  const tooLow = newIndex < 0
  const tooHigh = newIndex > array.length - 1

  if (!tooLow && !tooHigh) {
    var element = _array[oldIndex]
    _array.splice(oldIndex, 1)
    _array.splice(newIndex, 0, element)
  }
  return _array
}

/**
 * Removes any tsv items that may have been duplicated because of reference ranges
 * @param {ScriptureTSV} tsvItems array of tsv items
 * @returns deep copy of unique tsv items
 */
export const removeReferenceRangeDuplicates = tsvItems => {
  const usedRefRanges = {} // keeps track if we have already saved this reference range

  // if this note is a reference range, remove any duplicates
  const uniqueTsvItems = tsvItems.filter(tsvItem => {
    let tag = tsvItem?._referenceRange
    if (tag) {
      if (!usedRefRanges[tag]) {
        // reference range not yet saved
        usedRefRanges[tag] = true
      } else {
        // this reference range was already saved, so skip
        return false
      }
    }
    return true
  })

  return cloneDeep(uniqueTsvItems)
}

/**
 * Takes in an array of tsv items and removes duplicates and values to generate correct columns
 * @param {ScriptureTSV} tsvs object containing tsvs for all chapter and verses of a book
 * @returns tsvFileString a file string of unique and prepared tsv items
 */
export const tsvsObjectToFileString = tsvs => {
  if (!isValidScriptureTSV(tsvs)) {
    throw new Error('Invalid Scripture TSV input!')
  }
  const preparedTsvItems = flattenObject(cloneDeep(tsvs))

  // Check if it uses the Reference value, then remove Chapter, Verse and book that were added
  if (preparedTsvItems?.[0]?.Reference) {
    // TRICKY - prevent Book/Chapter/Verse columns from being generated by removing from first element
    delete preparedTsvItems[0].Chapter
    delete preparedTsvItems[0].Verse
    delete preparedTsvItems[0].Book
  }

  if (preparedTsvItems?.[0]?.markdown) {
    // TRICKY - prevent markdown column from being generated by removing from first element
    delete preparedTsvItems[0].markdown
  }

  const uniqueTsvItems = removeReferenceRangeDuplicates(preparedTsvItems)

  if (uniqueTsvItems?.[0]?._referenceRange) {
    // TRICKY - prevent referenceRange column from being generated by removing from first element
    const newItem = { ...uniqueTsvItems?.[0] }
    delete newItem._referenceRange
    uniqueTsvItems[0] = newItem
  }

  return parser.TSV.stringify(uniqueTsvItems)
}
