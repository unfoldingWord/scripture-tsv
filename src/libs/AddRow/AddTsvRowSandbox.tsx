import React from 'react'

import useTsvData from '../../core/hooks/useTsvData'
import useAddTsv from './hooks/useAddTsv'
import AddRowButton from './components/AddRowButton'
import AddRowDialog from './components/AddRowDialog'
import AddRowForm from './components/AddRowForm'
import { titusTsvs } from '../../assets/titusTsvs'
import { getChapterVerse } from '../../core/tsvRowUtils'
import { tsvsObjectToFileString } from '../../core/tsvDataActions'
import { TSVRow, ChapterNum, VerseNum, ItemIndex } from '../../types/TsvTypes'

/**
 * @description This file is meant to act as a sandbox to display the content
 * of the scripture-tsv library. Currently this sandbox creates an add TSV
 * button that utilizes the custom hooks and utility functions contained in
 * the application.
 *
 * Users of this library should be able to look at this sandbox and have an idea
 * of how to use each part of this library.
 *
 * This is the same as the code that will go in the MD file, but this is a
 * workaround so that Styleguide will display this example.
 */
const chapter: ChapterNum = 1
const verse: VerseNum = 2
const itemIndex: ItemIndex = 1
const columnsFilter: string[] = [
  'Reference',
  'Chapter',
  'Verse',
  'SupportReference',
]

const AddTsvRowSandbox: React.FC = () => {
  const { onTsvAdd } = useTsvData({
    tsvs: titusTsvs,
    chapter,
    verse,
    itemIndex,
  })

  /**
   * Adds a row to a TSV (Tab-Separated Values) data set.
   *
   * @throws {Error} Throws an error if reference or new row are not valid TSV data
   *
   * @todo Consider adding more validation for TSV properties as currently since it's quite generic.
   */
  const addRowToTsv = (row: TSVRow | {}) => {
    if ('Reference' in row) {
      const { Reference } = row
      try {
        const { chapter: inputChapter, verse: inputVerse } =
          getChapterVerse(Reference)
        if (inputChapter !== chapter || inputVerse !== verse) {
          const newTsvs = onTsvAdd(row, inputChapter, inputVerse, 'tit', 0)
          newTsvs && console.log(tsvsObjectToFileString(newTsvs))
          return
        }
        const newTsvs = onTsvAdd(row, chapter, verse, 'tit', itemIndex)
        newTsvs && console.log(tsvsObjectToFileString(newTsvs))
      } catch (error) {
        console.error('Error while adding new TSV Row:', error)
      }
    }
  }

  const {
    isAddRowDialogOpen,
    openAddRowDialog,
    closeAddRowDialog,
    submitRowEdits,
    newRow,
    changeRowValue,
    columnsFilterOptions,
  } = useAddTsv({
    tsvs: titusTsvs,
    chapter,
    verse,
    columnsFilter,
    addRowToTsv,
  })

  const tsvForm =
    newRow &&
    Object.keys(newRow).length !== 0 &&
    newRow.constructor === Object ? (
      <AddRowForm
        newRow={newRow as TSVRow}
        changeRowValue={changeRowValue}
        columnsFilterOptions={columnsFilterOptions}
      />
    ) : (
      <>
        <p>New Row has not been initialized!</p>
      </>
    )

  return (
    <div>
      <AddRowButton onClick={openAddRowDialog} />
      <AddRowDialog
        open={isAddRowDialogOpen}
        onClose={closeAddRowDialog}
        onSubmit={submitRowEdits}
        tsvForm={tsvForm}
      />
    </div>
  )
}

export default AddTsvRowSandbox
