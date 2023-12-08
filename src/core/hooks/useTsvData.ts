import { useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { doesItemIndexExistInTsvs } from '../scriptureTsvValidation'

import {
  addTsvRow,
  deleteTsvRow,
  updateTsvRow,
  moveTsvRow,
  tsvsObjectToFileString,
} from '../tsvDataActions'
import {
  ScriptureTSV,
  ItemIndex,
  ChapterNum,
  VerseNum,
  SetContentFunction,
  TSVRow,
} from '../TsvTypes'

interface TSVContentAndReference {
  tsvs: ScriptureTSV
  itemIndex: ItemIndex
  chapter: ChapterNum
  verse: VerseNum
  setContent: SetContentFunction
}

interface TSVDataOperations {
  getTsvRow: (itemIndex?: ItemIndex) => TSVRow | null
  onTsvAdd: (
    newItem: TSVRow,
    chapter: ChapterNum,
    verse: VerseNum,
    itemIndex?: ItemIndex
  ) => ScriptureTSV | null
  onTsvDelete: (itemIndex?: ItemIndex) => ScriptureTSV | null
  onTsvEdit: (newItem: TSVRow, itemIndex?: ItemIndex) => void
  onTsvMoveBefore: (itemIndex?: ItemIndex) => ScriptureTSV | null
  onTsvMoveAfter: (itemIndex?: ItemIndex) => ScriptureTSV | null
}

/**
 * @description React hook that stores a ScriptureTSV in state.
 * Also provides functions to add/delete/remove/edit from state using the
 * tsvDataActions functions. On edit, it also converts the
 * new TSVs to a string format that can be saved to a file, and then passes
 * this string to the given `setContent` function.
 *
 * @returns Functions for managing TSV state and content.
 */
export default function useTsvData({
  tsvs,
  itemIndex: defaultItemIndex,
  chapter: defaultChapter,
  verse: defaultVerse,
  setContent,
}: TSVContentAndReference): TSVDataOperations {
  const [tsvsState, setTsvsState] = useState<ScriptureTSV | null>(null)

  // Todo: It would probably be more helpful if we fetched TSVs directly
  // here instead of passing them in as a prop
  useDeepCompareEffect(() => {
    if (tsvs) {
      setTsvsState({ ...tsvs })
    }
  }, [{ ...tsvs }, defaultChapter, defaultVerse])

  /**
   * @description Retrieves a row item from the ScriptureTSV state
   */
  function getTsvRow(itemIndex: ItemIndex = defaultItemIndex): TSVRow | null {
    if (
      tsvsState &&
      doesItemIndexExistInTsvs(
        tsvsState,
        defaultChapter,
        defaultVerse,
        itemIndex
      )
    ) {
      return tsvsState[defaultChapter][defaultVerse][itemIndex]
    }
    return null
  }

  /**
   * @description Adds a row item to the ScriptureTSV state
   */
  function onTsvAdd(
    newItem: TSVRow,
    chapter: ChapterNum,
    verse: VerseNum,
    itemIndex: ItemIndex = defaultItemIndex
  ): ScriptureTSV | null {
    if (tsvsState) {
      const newTsvs = addTsvRow(tsvsState, newItem, chapter, verse, itemIndex)
      setTsvsState(newTsvs)
      return newTsvs
    }
    return null
  }

  /**
   * @description Deletes a row item from ScriptureTSV state at current chapter/verse
   * given item index
   */
  function onTsvDelete(
    itemIndex: ItemIndex = defaultItemIndex
  ): ScriptureTSV | null {
    if (tsvsState) {
      const newTsvs = deleteTsvRow(
        tsvsState,
        defaultChapter,
        defaultVerse,
        itemIndex
      )
      setTsvsState(newTsvs)
      return newTsvs
    }
    return null
  }

  /**
   * @description Edits a row item in the ScriptureTSV state at current chapter/verse
   * given index and sets content of parent application
   */
  function onTsvEdit(
    newItem: TSVRow,
    itemIndex: ItemIndex = defaultItemIndex
  ): void {
    if (tsvsState) {
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
   */
  function onTsvMoveBefore(
    itemIndex: ItemIndex = defaultItemIndex
  ): ScriptureTSV | null {
    if (tsvsState) {
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
    return null
  }

  /**
   * @description Move a TSV row one row after its current index
   * @param {ItemIndex} itemIndex
   */
  function onTsvMoveAfter(
    itemIndex: ItemIndex = defaultItemIndex
  ): ScriptureTSV | null {
    if (tsvsState) {
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
    return null
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
