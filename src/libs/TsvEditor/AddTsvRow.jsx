import React, { useState, useEffect } from 'react'
import AddTsvButton from './components/AddTsvButton'
import AddTsvDialog from './components/AddTsvDialog'
import NewTsvForm from './components/NewTsvForm'
import { rowGenerate } from './utils/tsvHelpers'
import { titusTsvs } from './assets/titusTsvs'

const chapter = 1
const verse = 1
const itemIndex = 1

const AddTsvRow = () => {
  const [dialogOpen, setDialogOpen] = useState(true)
  const [newRow, setNewRow] = useState(
    rowGenerate(titusTsvs, chapter, verse, itemIndex)
  )

  return (
    <div>
      <NewTsvForm newRow={newRow} setNewRow={setNewRow} />
    </div>
  )
}

export default AddTsvRow
