import React, { useState } from 'react'
import AddTsvButton from './components/AddTsvButton'
import AddTsvDialog from './components/AddTsvDialog'
import NewTsvForm from './components/NewTsvForm'

const rowGenerate = (rows, columnNames, rowIndex) => {
  let rowsIndex = {}
  let lengthIndex = {}
  const rowData = rows[rowIndex]

  rows.forEach(_row => {
    _row.forEach((value, index) => {
      const column = columnNames[index]

      if (!rowsIndex[column]) {
        rowsIndex[column] = {}
      }

      if (!rowsIndex[column][value]) {
        rowsIndex[column][value] = 0
      }
      rowsIndex[column][value]++
      const valueLength = value.length

      if (!lengthIndex[column]) {
        lengthIndex[column] = {}
      }

      if (!lengthIndex[column][valueLength]) {
        lengthIndex[column][valueLength] = 0
      }
      lengthIndex[column][valueLength]++
    })
  })

  const rowCount = rows.length
  let newRow = rowData.map((value, index) => {
    const column = columnNames[index]
    const values = Object.keys(rowsIndex[column]).length
    const valuesRatio = values / rowCount
    const duplicateValue = valuesRatio < 0.65 // If the value is reused many times then it should be duplicated.

    const valuesLengths = Object.keys(lengthIndex[column])
    const valuesLengthsLength = valuesLengths.length
    const needRandomId = valuesRatio > 0.99 && valuesLengthsLength <= 2
    let newValue = ''

    if (duplicateValue) {
      newValue = value
    } else if (needRandomId) {
      const allIds = Object.keys(rowsIndex[column])
      newValue = generateRandomUID(allIds)
    }
    return newValue
  })
  return newRow
}

const rows = []

const columnNames = [
  'Reference',
  'ID',
  'Tags',
  'SupportReference',
  'Quote',
  'Occurrence',
  'Note',
]

const rowIndex = 0

const AddTsvRow = () => {
  const [dialogOpen, setDialogOpen] = useState(true)
  const [newRow, setNewRow] = useState(rowGenerate(rows, columnNames, rowIndex))

  return (
    <div>
      <NewTsvForm newRow={newRow} setNewRow={setNewRow} />
    </div>
  )
}

export default AddTsvRow
