import { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { rowGenerate, getColumnsFilterOptions } from '../../../core/tsvRowUtils'
import flattenObject from '../../../core/flattenTsvObject'

const useAddTsv = ({
  tsvs,
  chapter,
  verse,
  itemIndex,
  columnsFilter,
  addRowToTsv,
}) => {
  const [isAddRowDialogOpen, setIsAddRowDialogOpen] = useState(false)
  const [newRow, setNewRow] = useState({})

  // Populate new row when tsvs load
  useEffect(() => {
    if (tsvs) {
      setNewRow(rowGenerate(tsvs, chapter, verse))
    }
  }, [tsvs])

  // populate columnsFilterOptions when ready
  const columnsFilterOptions = useMemo(() => {
    if (tsvs) {
      const allItems = flattenObject(tsvs)
      if (columnsFilter && allItems.length) {
        const columnNames = Object.keys(allItems[0])
        const columnNamesToFilter = columnsFilter.filter(columnName =>
          columnNames.includes(columnName)
        )

        return getColumnsFilterOptions(columnNamesToFilter, allItems)
      }
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
    setNewRow(rowGenerate(tsvs, chapter, verse))
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
