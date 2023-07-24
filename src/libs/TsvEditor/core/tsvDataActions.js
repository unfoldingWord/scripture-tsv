import cloneDeep from 'lodash.clonedeep'
import flattenObject from './flattenTsvObject'

/**
 * add a tsv item to an existing tsvs object
 * @param {*} tsvs Object containing tsv data for each book chapter
 * @param {*} newItem Object with keys of tsv column names and values of tsv column values
 * @param {*} chapter Chapter index of tsv to insert
 * @param {*} verse Verse index of tsv to insert
 * @param {*} itemIndex Item index of tsv to insert
 * @returns new tsvs object containing new tsv item
 */
export const addTsvRow = (tsvs, newItem, chapter, verse, itemIndex) => {
  const newTsvs = cloneDeep(tsvs)
  const newItems = [...newTsvs[chapter][verse]]
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
 * @param {*} tsvs Object containing tsv data for each book chapter
 * @param {*} chapter Chapter index of tsv to insert
 * @param {*} verse Verse index of tsv to insert
 * @param {*} itemIndex Item index of tsv to insert
 * @returns new tsvs object containing new tsv item
 */
export const deleteTsvRow = (tsvs, chapter, verse, itemIndex) => {
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
 * @param {*} tsvs Object containing tsv data for each book chapter
 * @param {*} newItem Object with keys of tsv column names and values of tsv column values
 * @param {*} chapter Chapter index of tsv to insert
 * @param {*} verse Verse index of tsv to insert
 * @param {*} itemIndex Item index of tsv to insert
 * @returns new tsvs object containing updated tsv item
 */
export const updateTsvRow = (tsvs, newItem, chapter, verse, itemIndex) => {
  const newTsvs = cloneDeep(tsvs)
  const oldTsvItem = { ...tsvs[chapter][verse][itemIndex] }
  const newTsvItem = { ...oldTsvItem, ...newItem }
  newTsvs[chapter][verse][itemIndex] = newTsvItem

  let refRangeTag = newTsvItem?._referenceRange
  if (refRangeTag) {
    return updateTsvReferenceRange(newTsvs, newTsvItem, refRangeTag)
  }

  return newTsvs
}

/**
 * Given a tsvs object and reference range tag, update verses in reference range
 * @param {*} tsvs Tsvs object where reference ranges will be updated
 * @param {*} newTsvItem Tsv object that will be given to tsv reference range
 * @param {*} refRangeTag Tag of the reference range to update
 * @returns new tsvs object containing new reference range tsv items
 */
const updateTsvReferenceRange = (tsvs, newTsvItem, refRangeTag) => {
  const newTsvs = cloneDeep(tsvs)
  for (const chapter of Object.keys(newTsvs)) {
    const tsvChapter = newTsvs[chapter]
    for (const verse of Object.keys(tsvChapter)) {
      const tsvVerse = [...tsvChapter[verse]] || []
      newTsvs[chapter][verse] = tsvVerse.map(note => {
        if (note?._referenceRange === refRangeTag) {
          return newTsvItem
        }
        return note
      })
    }
  }
  return newTsvs
}

/**
 * Moves a tsv item in a chapter, verse to another index in the tsv items array
 * @param {Object} tsvs tsvs object where note will be move
 * @param {int} chapter
 * @param {int} verse
 * @param {int} itemIndex
 * @param {int} newIndex
 * @returns updated tsvs object with shifted tsv row
 */
export const moveTsvRow = (tsvs, chapter, verse, itemIndex, newIndex) => {
  const newTsvs = cloneDeep(tsvs)
  const newItems = arrayMove(newTsvs[chapter][verse], itemIndex, newIndex)
  newTsvs[chapter][verse] = newItems
  return newTsvs
}

/**
 * Shifts an element in an array at oldIndex to newIndex
 * @param {[]} array
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
 * @param {*} tsvItems array of tsv items
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
 * @param {*} tsvs object containing tsvs for all chapter and verses of a book
 * @returns uniqueTsvItems a list of unique and prepared tsv items to convert to .tsv
 */
export const prepareForTsvFileConversion = tsvs => {
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

  return uniqueTsvItems
}
