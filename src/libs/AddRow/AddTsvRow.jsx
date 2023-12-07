import React from 'react'

import useTsvData from '../../core/hooks/useTsvData'
import useAddTsv from './hooks/useAddTsv'
import AddRowButton from './components/AddRowButton'
import AddRowDialog from './components/AddRowDialog'
import AddRowForm from './components/AddRowForm'
import { titusTsvs } from '../../assets/titusTsvs'
import { getChapterVerse } from '../../core/tsvRowUtils'
import { tsvsObjectToFileString } from '../../core/tsvDataActions'
import '../../core/TsvTypes.js'

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
const chapter = 1
const verse = 2
const itemIndex = 1
const columnsFilter = ['Reference', 'Chapter', 'Verse', 'SupportReference']

const AddTsvRow = () => {
  const { onTsvAdd } = useTsvData({
    tsvs: titusTsvs,
    chapter,
    verse,
    itemIndex,
  })

  /**
   * Adds a row to a TSV (Tab-Separated Values) data set.
   *
   * @param {TSVRow} row - The row to be added. Must contain a 'Reference' field formatted as 'chapter:verse'.
   *
   * @throws {Error} Throws an error if reference or new row are not valid TSV data
   *
   * @todo Consider adding more validation for TSV properties as currently since it's quite generic.
   */
  const addRowToTsv = row => {
    const { Reference } = row
    try {
      const { chapter: inputChapter, verse: inputVerse } =
        getChapterVerse(Reference)
      if (inputChapter !== chapter || inputVerse !== verse) {
        const newTsvs = onTsvAdd(row, inputChapter, inputVerse, 0)
        console.log(tsvsObjectToFileString(newTsvs))
        return
      }
      const newTsvs = onTsvAdd(row, chapter, verse, itemIndex)
      console.log(tsvsObjectToFileString(newTsvs))
    } catch (error) {
      console.error('Error while adding new TSV Row:', error)
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
    itemIndex,
    columnsFilter,
    addRowToTsv,
  })

  const tsvForm = (
    <AddRowForm
      newRow={newRow}
      changeRowValue={changeRowValue}
      columnsFilterOptions={columnsFilterOptions}
    />
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

export default AddTsvRow
