import React from 'react'
import useAddTsv from './hooks/useAddTsv'
import AddRowButton from './components/AddRowButton'
import AddRowDialog from './components/AddRowDialog'
import NewTsvForm from './components/NewTsvForm'
import { titusTsvs } from './assets/titusTsvs'

const chapter = 1
const verse = 1
const itemIndex = 1
const columnsFilter = ['Reference', 'Chapter', 'Verse', 'SupportReference']

const AddTsvRow = () => {
  const {
    isAddRowDialogOpen,
    openAddRowDialog,
    closeAddRowDialog,
    newRow,
    changeRowValue,
    columnsFilterOptions,
  } = useAddTsv({ tsvs: titusTsvs, chapter, verse, itemIndex, columnsFilter })

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
        onSubmit={closeAddRowDialog}
        tsvForm={tsvForm}
      />
    </div>
  )
}

export default AddTsvRow
