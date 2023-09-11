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
