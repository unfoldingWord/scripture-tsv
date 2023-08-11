import React from 'react'

import useTsvData from '../../core/hooks/useTsvData'
import useAddTsv from './hooks/useAddTsv'
import AddRowButton from './components/AddRowButton'
import AddRowDialog from './components/AddRowDialog'
import AddRowForm from './components/AddRowForm'
import { titusTsvs } from '../../assets/titusTsvs'

const chapter = 1
const verse = 2
const itemIndex = 1
const setContent = content => console.log('Content Set: ', content)
const columnsFilter = ['Reference', 'Chapter', 'Verse', 'SupportReference']

const AddTsvRow = () => {
  const { onTsvAdd } = useTsvData({
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
