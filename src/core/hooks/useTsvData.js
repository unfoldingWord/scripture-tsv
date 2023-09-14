import { useState } from 'react'
import parser from 'tsv'
import useDeepCompareEffect from 'use-deep-compare-effect'

import {
  prepareForTsvFileConversion,
  addTsvRow,
  deleteTsvRow,
  updateTsvRow,
  moveTsvRow,
} from '../tsvDataActions'

/**
 * @typedef {number} ChapterNum
 * A number between 1-150
 */

/**
 * @typedef {number} VerseNum
 * A number between 1-176
 */

/**
 * @typedef {number} ItemIndex
 * A number that is >= 0
 */

/**
 * @typedef {string} ReferenceString
 * A string in the format 'chapter:verse'.
 */

/**
 * @typedef {string} IDString
 * An alphanumeric random string of four characters.
 */

/**
 * @typedef {Object} ScriptureTSV
 *
 * @property {Object.<ChapterNum, Object.<VerseNum, Array.<TSVRow>>>} - Mapping of chapter numbers to verse data.
 */

/**
 * @typedef {Object} TSVRow
 *
 * @property {ReferenceString} Reference
 * @property {IDString} id
 * @property {Object.<string, any>} [column3] - additional TSV column header/data
 * @property {Object.<string, any>} [column4] - additional TSV column header/data
 * @property {Object.<string, any>} [column5] - additional TSV column header/data
 * @property {Object.<string, any>} [column6] - additional TSV column header/data
 * @property {Object.<string, any>} [column7] - additional TSV column header/data
 */

/**
 * @description React hook that stores a ScriptureTSV in state.
 * Also provides functions to add/delete/remove/edit from state using the
 * tsvDataActions functions.
 */
export default function useTsvData({
  tsvs,
  itemIndex: defaultItemIndex,
  chapter: defaultChapter,
  verse: defaultVerse,
  setContent,
}) {
  const [tsvsState, setTsvsState] = useState(null)

  useDeepCompareEffect(() => {
    if (tsvs) {
      setTsvsState({ ...tsvs })
    }
  }, [{ ...tsvs }, defaultChapter, defaultVerse])

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

      const tsvItems = prepareForTsvFileConversion(newTsvs)
      const tsvFile = parser.TSV.stringify(tsvItems)
      setContent(tsvFile)
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

      const tsvItems = prepareForTsvFileConversion(newTsvs)
      const tsvFile = parser.TSV.stringify(tsvItems)
      setContent(tsvFile)
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

      const tsvItems = prepareForTsvFileConversion(newTsvs)
      const tsvFile = parser.TSV.stringify(tsvItems)
      setContent(tsvFile)
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

      const tsvItems = prepareForTsvFileConversion(newTsvs)
      const tsvFile = parser.TSV.stringify(tsvItems)
      setContent(tsvFile)
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

      const tsvItems = prepareForTsvFileConversion(newTsvs)
      const tsvFile = parser.TSV.stringify(tsvItems)
      setContent(tsvFile)
    }
  }

  return { onTsvAdd, onTsvDelete, onTsvEdit, onTsvMoveBefore, onTsvMoveAfter }
}
