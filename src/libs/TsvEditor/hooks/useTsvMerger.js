import { useState } from 'react'
import parser from 'tsv'
import useDeepCompareEffect from 'use-deep-compare-effect'

import {
  prepareForTsvFileConversion,
  addTsvRow,
  deleteTsvRow,
  updateTsvRow,
  moveTsvRow,
} from '../core/tsvDataActions'

export default function useTsvMerger({
  itemIndex: defaultItemIndex,
  setContent,
  chapter,
  verse,
  tsvs,
}) {
  const [tsvsState, setTsvsState] = useState(null)

  useDeepCompareEffect(() => {
    if (tsvs) {
      setTsvsState({ ...tsvs })
    }
  }, [{ ...tsvs }, chapter, verse])

  function onTsvAdd(newItem, itemIndex) {
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
      const newTsvs = deleteTsvRow(tsvsState, chapter, verse, itemIndex)
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
        chapter,
        verse,
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
        chapter,
        verse,
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
        chapter,
        verse,
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
