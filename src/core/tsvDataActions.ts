import parser from 'tsv'
import cloneDeep from 'lodash.clonedeep'
import flattenObject from './flattenTsvObject'
import {
  isValidScriptureTSV,
  isValidTSVRow,
  doesItemIndexExistInTsvs,
} from './scriptureTsvValidation'
import {
  ScriptureTSV,
  TSVRow,
  ChapterNum,
  VerseNum,
  ItemIndex,
  UpdatedRowValue,
  ReferenceRangeOperation,
  ReferenceRangeTag,
  BookId,
} from '../types/TsvTypes'

/**
 * @module
 * @description Contains functions to perform add/delete/move/edit row to a
 * given ScriptureTSVs object
 */

/**
 * @description Add a TSV item to an existing TSVs object.
 *
 * @returns New TSVs object containing new TSV item
 */
export const addTsvRow = (
  tsvs: ScriptureTSV,
  newItem: TSVRow,
  chapter: ChapterNum,
  verse: VerseNum,
  itemIndex: ItemIndex,
  bookId: BookId
): ScriptureTSV => {
  if (!isValidScriptureTSV(tsvs)) {
    throw new Error('Invalid Scripture TSV input!')
  }
  if (!isValidTSVRow(newItem, bookId)) {
    throw new Error('Invalid new row input!')
  }

  const newTsvs = cloneDeep(tsvs)
  const existingItems = newTsvs?.[chapter]?.[verse] || []
  const newItems = [
    ...existingItems.slice(0, itemIndex + 1),
    newItem,
    ...existingItems.slice(itemIndex + 1),
  ]
  newTsvs[chapter][verse] = newItems

  // TODO: Handle reference ranges
  // let refRangeTag = newTsvItem?._referenceRange;
  // if (refRangeTag) {
  //   return updateTsvReferenceRange(newTsvs, newTsvItem, refRangeTag)
  // }

  return newTsvs
}

/**
 * Delete a TSV item from an existing TSVs object.
 *
 * @returns New TSVs object containing new TSV item
 */
export const deleteTsvRow = (
  tsvs: ScriptureTSV,
  chapter: ChapterNum,
  verse: VerseNum,
  itemIndex: ItemIndex
): ScriptureTSV => {
  if (!isValidScriptureTSV(tsvs)) {
    throw new Error('Invalid Scripture TSV input')
  }
  if (!doesItemIndexExistInTsvs(tsvs, chapter, verse, itemIndex)) {
    throw new Error(
      `No item to delete at chapter: ${chapter} verse: ${verse} itemIndex: ${itemIndex}`
    )
  }

  const newTsvs = cloneDeep(tsvs)
  const items = newTsvs[chapter][verse]
  const itemToDelete = newTsvs[chapter][verse][itemIndex]
  const newItems = [...items.slice(0, itemIndex), ...items.slice(itemIndex + 1)]
  newTsvs[chapter][verse] = newItems

  let refRangeTag = itemToDelete?._referenceRange
  if (refRangeTag) {
    return modifyTsvReferenceRange(newTsvs, refRangeTag, deleteRefRange)
  }

  return newTsvs
}

/**
 * @description Updates a tsv item with a new tsv item
 *
 * @returns New tsvs object containing updated tsv item
 */
export const updateTsvRow = (
  tsvs: ScriptureTSV,
  newRowValue: UpdatedRowValue,
  chapter: ChapterNum,
  verse: VerseNum,
  itemIndex: ItemIndex
): ScriptureTSV => {
  if (!isValidScriptureTSV(tsvs)) {
    throw new Error('Invalid Scripture TSV input')
  }

  const newTsvs = cloneDeep(tsvs)
  const newTsvItem = { ...tsvs[chapter][verse][itemIndex], ...newRowValue }
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
 * @description Given a tsvs object and reference range tag, update verses in reference range
 *
 * @returns new tsvs object containing new reference range tsv items
 */
const modifyTsvReferenceRange = (
  tsvs: ScriptureTSV,
  refRangeTag: ReferenceRangeTag,
  operation: ReferenceRangeOperation,
  ...rest: any[]
): ScriptureTSV => {
  const newTsvs = Object.keys(tsvs).reduce((accTsvs, chapter) => {
    const tsvChapter = tsvs[chapter]
    const updatedChapter = Object.keys(tsvChapter).reduce(
      (accChapter, verse) => {
        return {
          ...accChapter,
          [verse]: operation(tsvChapter[verse], refRangeTag, ...rest),
        }
      },
      {}
    )
    return { ...accTsvs, [chapter]: updatedChapter }
  }, {})

  return newTsvs
}

/**
 * Updates a specific reference range within a verse array with a new TSV item.
 *
 * @returns {Array} An updated array of verse objects with the specified reference range updated.
 */
const updateRefRange: ReferenceRangeOperation = (
  verseArray,
  refRangeTag,
  tsvItem
) =>
  verseArray.map(note =>
    note?._referenceRange === refRangeTag ? tsvItem : note
  )

/**
 * Deletes a specific reference range from a verse array.
 *
 * @returns {Array} An updated array of verse objects with the specified reference range removed.
 */
const deleteRefRange: ReferenceRangeOperation = (verseArray, refRangeTag) =>
  verseArray.filter(note => note?._referenceRange !== refRangeTag)

/**
 * @description Moves a tsv item in a chapter, verse to another index in the tsv items array
 *
 * @returns Updated tsvs object with shifted tsv row
 */
export const moveTsvRow = (
  tsvs: ScriptureTSV,
  chapter: ChapterNum,
  verse: VerseNum,
  itemIndex: ItemIndex,
  newIndex: ItemIndex
): ScriptureTSV => {
  if (!isValidScriptureTSV(tsvs)) {
    throw new Error('Invalid Scripture TSV input')
  }

  const newTsvs = cloneDeep(tsvs)
  const newItems = arrayMove(newTsvs[chapter][verse], itemIndex, newIndex)
  newTsvs[chapter][verse] = newItems
  return newTsvs
}

/**
 * @description Shifts an element in an array at oldIndex to newIndex
 *
 * @returns Array containing shifted element
 */
export const arrayMove = (array: any[], oldIndex: number, newIndex: number) => {
  if (newIndex < 0 || newIndex > array.length - 1) {
    return array
  }

  const element = array[oldIndex]
  const arrayWithoutElement = [
    ...array.slice(0, oldIndex),
    ...array.slice(oldIndex + 1),
  ]
  const newArray = [
    ...arrayWithoutElement.slice(0, newIndex),
    element,
    ...arrayWithoutElement.slice(newIndex),
  ]

  return newArray
}

/**
 * @description Removes any tsv items that may have been duplicated because of reference ranges
 *
 * @returns Deep copy of unique tsv items
 */
export const removeReferenceRangeDuplicates = (
  tsvItems: TSVRow[]
): TSVRow[] => {
  const usedRefRanges = new Set() // keeps track if we have already saved this reference range

  // if this note is a reference range, remove any duplicates
  const uniqueTsvItems = tsvItems.filter(tsvItem => {
    const tag = tsvItem?._referenceRange
    if (tag) {
      if (!usedRefRanges.has(tag)) {
        // reference range not yet saved
        usedRefRanges.add(tag)
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
 * @description Takes in an array of tsv items and removes duplicates and values to generate correct columns
 *
 * @returns tsvFileString a file string of unique and prepared tsv items
 */
export const tsvsObjectToFileString = (tsvs: ScriptureTSV): string => {
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
