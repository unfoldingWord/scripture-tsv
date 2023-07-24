import React from 'react'

import useTsvMerger from './hooks/useTsvMerger'
import useAddTsv from './hooks/useAddTsv'
import AddRowButton from './components/AddRowButton'
import AddRowDialog from './components/AddRowDialog'
import NewTsvForm from './components/NewTsvForm'
import { titusTsvs } from './assets/titusTsvs'

const chapter = 1
const verse = 1
const itemIndex = 1
const setContent = content => console.log('Content Set: ', content)
const columnsFilter = ['Reference', 'Chapter', 'Verse', 'SupportReference']

const AddTsvRow = () => {
  const { onTsvAdd } = useTsvMerger({
    tsvs: titusTsvs,
    chapter,
    verse,
    itemIndex,
    setContent,
  })

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
    addRowToTsv: row => onTsvAdd(row, itemIndex),
  })

  const tsvForm = (
    <NewTsvForm
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
