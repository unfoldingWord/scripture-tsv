import { useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { doesChapterVerseExistInTsvs } from '../scriptureTsvValidation'

import {
  addTsvRow,
  deleteTsvRow,
  updateTsvRow,
  moveTsvRow,
  tsvsObjectToFileString,
} from '../tsvDataActions'
import '../TsvTypes'

/**
 * @typedef {Object} TSVContentAndReference
 * @property {ScriptureTSV} tsvs - Initial TSVs state.
 * @property {ItemIndex} itemIndex - Default item index.
 * @property {ChapterNum} chapter - Default chapter.
 * @property {VerseNum} verse - Default verse.
 * @property {SetContentFunction} setContent - Function to set the content.
 */

/**
 * @typedef {Object} UseTsvDataReturn
 * @property {Function} onTsvAdd - Function to add a new TSV row.
 * @property {Function} onTsvDelete - Function to delete a TSV row.
 * @property {Function} onTsvEdit - Function to edit a TSV row.
 * @property {Function} onTsvMoveBefore - Function to move a TSV row up.
 * @property {Function} onTsvMoveAfter - Function to move a TSV row down.
 */

/**
 * @description React hook that stores a ScriptureTSV in state.
 * Also provides functions to add/delete/remove/edit from state using the
 * tsvDataActions functions. On edit, it also converts the
 * new TSVs to a string format that can be saved to a file, and then passes
 * this string to the given `setContent` function.
 * @param {TSVContentAndReference} options - Options for initializing the hook.
 * @returns {UseTsvDataReturn} - Functions for managing TSV state and content.
 */
export default function useTsvData({
  tsvs,
  itemIndex: defaultItemIndex,
  chapter: defaultChapter,
  verse: defaultVerse,
  setContent,
}) {
  const [tsvsState, setTsvsState] = useState(null)

  // Todo: It would probably be more helpful if we fetched TSVs directly
  // here instead of passing them in as a prop
  useDeepCompareEffect(() => {
    if (tsvs) {
      setTsvsState({ ...tsvs })
    }
  }, [{ ...tsvs }, defaultChapter, defaultVerse])

  function getTsvRow(itemIndex) {
    if (doesChapterVerseExistInTsvs(tsvsState, defaultChapter, defaultVerse)) {
      itemIndex = typeof itemIndex == 'number' ? itemIndex : defaultItemIndex
      return tsvsState[defaultChapter][defaultVerse][itemIndex]
    }
    return null
  }

  /**
   * @todo Since we aren't checking for chapter, verse, we should force
   * these types
   * @description Adds a row item to the ScriptureTSV state
   * @param {TSVRow} newItem
   * @param {ChapterNum} chapter
   * @param {VerseNum} verse
   * @param {ItemIndex} itemIndex
   */
  function onTsvAdd(newItem, chapter, verse, itemIndex) {
    if (tsvsState) {
      itemIndex = typeof itemIndex == 'number' ? itemIndex : defaultItemIndex
      const newTsvs = addTsvRow(tsvsState, newItem, chapter, verse, itemIndex)
      setTsvsState(newTsvs)
      console.log(newTsvs)
      return newTsvs
    }
  }

  /**
   * @description Deletes a row item from ScriptureTSV state at current chapter/verse
   * given item index
   * @param {ItemIndex} itemIndex
   */
  function onTsvDelete(itemIndex) {
    if (tsvsState) {
      itemIndex = typeof itemIndex == 'number' ? itemIndex : defaultItemIndex
      const newTsvs = deleteTsvRow(
        tsvsState,
        defaultChapter,
        defaultVerse,
        itemIndex
      )
      setTsvsState(newTsvs)
      return newTsvs
    }
  }

  /**
   * @description Edits a row item in the ScriptureTSV state at current chapter/verse
   * given index
   * @param {TSVRow} newItem
   * @param {ItemIndex} itemIndex
   */
  function onTsvEdit(newItem, itemIndex) {
    if (tsvsState) {
      itemIndex = typeof itemIndex == 'number' ? itemIndex : defaultItemIndex
      const newTsvs = updateTsvRow(
        tsvsState,
        newItem,
        defaultChapter,
        defaultVerse,
        itemIndex
      )
      setTsvsState(newTsvs)

      setContent(tsvsObjectToFileString(newTsvs))
    }
  }

  /**
   * @description Move a TSV row one row before its current index
   * @param {ItemIndex} itemIndex
   */
  function onTsvMoveBefore(itemIndex) {
    if (tsvsState) {
      itemIndex = typeof itemIndex == 'number' ? itemIndex : defaultItemIndex
      const newTsvs = moveTsvRow(
        tsvsState,
        defaultChapter,
        defaultVerse,
        itemIndex,
        itemIndex - 1
      )
      setTsvsState(newTsvs)
      return newTsvs
    }
  }

  /**
   * @description Move a TSV row one row after its current index
   * @param {ItemIndex} itemIndex
   */
  function onTsvMoveAfter(itemIndex) {
    if (tsvsState) {
      itemIndex = typeof itemIndex == 'number' ? itemIndex : defaultItemIndex
      const newTsvs = moveTsvRow(
        tsvsState,
        defaultChapter,
        defaultVerse,
        itemIndex,
        itemIndex + 1
      )
      setTsvsState(newTsvs)
      return newTsvs
    }
  }

  return {
    getTsvRow,
    onTsvAdd,
    onTsvDelete,
    onTsvEdit,
    onTsvMoveBefore,
    onTsvMoveAfter,
  }
}
