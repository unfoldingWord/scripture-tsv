import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash.isequal'
import { rowGenerate, getColumnsFilterOptions } from '../utils/tsvHelpers'

const useAddTsv = ({ tsvs, chapter, verse, itemIndex, columnsFilter }) => {
  const [isAddRowDialogOpen, setIsAddRowDialogOpen] = useState(false)
  const [newRow, setNewRow] = useState(
    rowGenerate(tsvs, chapter, verse, itemIndex)
  )
  const [columnsFilterOptions, setColumnsFilterOptions] = useState({})

  // populate columnsFilterOptions when ready
  useEffect(() => {
    if (columnsFilter && Object.keys(tsvs).length) {
      const columnNames = Object.keys(tsvs[chapter][verse][itemIndex])
      const columnNamesToFilter = columnsFilter.filter(columnName =>
        columnNames.includes(columnName)
      )
      const _columnsFilterOptions = getColumnsFilterOptions({
        columnNames: columnNamesToFilter,
        tsvs,
      })

      if (!isEqual(_columnsFilterOptions, columnsFilterOptions)) {
        setColumnsFilterOptions(_columnsFilterOptions)
      }
    }
  }, [columnsFilter, tsvs, columnsFilterOptions])

  const openAddRowDialog = () => {
    setIsAddRowDialogOpen(true)
  }

  const closeAddRowDialog = () => {
    setIsAddRowDialogOpen(false)
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
    newRow,
    changeRowValue,
    columnsFilterOptions,
  }
}

useAddTsv.propTypes = {}

export default useAddTsv
