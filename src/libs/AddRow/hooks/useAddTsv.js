import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { rowGenerate, getColumnsFilterOptions } from '../../../core/tsvRowUtils'

const useAddTsv = ({
  tsvs,
  chapter,
  verse,
  itemIndex,
  columnsFilter,
  addRowToTsv,
}) => {
  const [isAddRowDialogOpen, setIsAddRowDialogOpen] = useState(false)
  const [newRow, setNewRow] = useState(
    rowGenerate(tsvs, chapter, verse, itemIndex)
  )

  // populate columnsFilterOptions when ready
  const columnsFilterOptions = useMemo(() => {
    if (columnsFilter && Object.keys(tsvs).length) {
      const columnNames = Object.keys(tsvs[chapter][verse][itemIndex])
      const columnNamesToFilter = columnsFilter.filter(columnName =>
        columnNames.includes(columnName)
      )

      return getColumnsFilterOptions({
        columnNames: columnNamesToFilter,
        tsvs,
      })
    }
  }, [columnsFilter, tsvs])

  const openAddRowDialog = () => {
    setIsAddRowDialogOpen(true)
  }

  const closeAddRowDialog = () => {
    setIsAddRowDialogOpen(false)
  }

  const submitRowEdits = () => {
    closeAddRowDialog()
    addRowToTsv(newRow)
    setNewRow(rowGenerate(tsvs, chapter, verse, itemIndex))
  }

  const changeRowValue = (columnName, newValue) => {
    setNewRow(prevRow => {
      return { ...prevRow, [columnName]: newValue }
    })
  }

  return {
    isAddRowDialogOpen,
    openAddRowDialog,
    closeAddRowDialog,
    submitRowEdits,
    newRow,
    changeRowValue,
    columnsFilterOptions,
  }
}

useAddTsv.propTypes = {}

export default useAddTsv
