import { useState, useMemo } from 'react'
import { rowGenerate, getColumnsFilterOptions } from '../../../core/tsvRowUtils'
import flattenObject from '../../../core/flattenTsvObject'

/**
@todo It seems that it's creating a small module for users to construct
manipulate two state full values.

Could you provide the types of the parameters here? My gut instinct is 
that this module could be simplified by:


  - extracting the inner defined functions ( isAddRowDialogOpen,
  openAddRowDialog) and exposing this as a module that exports
  stateless functions directly. Though, I'm aware that this might
  break usage sites. In that case I would still break them out as
  stateless, and then add an export that packages them in such a
  way that is compatible with the legacy API.

  - removing the useEffect
  - removing the internally defined state (it might be better for users
  to use their own methods for storing the state)

  I've noted the types of the functions exported from this top-level
  function as a guide for making this module more clear. The following
  is the notation I'm using: 

  <SideEffect(s)> => Arg Type -> Result Type 

  columnsFilterOptions : Memo (ColumnsFilter x Tsvs) => Tsvs -> Object
  openAddRowDialog     : State NewRow => undefined -> undefined
  closeAddRowDialog    : State NewRow => undefined -> undefined
  submitRowEdits       : State NewRow => undefined -> undefined
  changeRowValue       : State NewRow => ColumnName x NewValue -> undefined

*/
const useAddTsv = ({ tsvs, chapter, verse, columnsFilter, addRowToTsv }) => {
  const [isAddRowDialogOpen, setIsAddRowDialogOpen] = useState(false)
  const [newRow, setNewRow] = useState({})

  /** 
  @todo could you give some context on what the schema is for
  columnNames and how it's used?
  */
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
    setNewRow(rowGenerate(tsvs, chapter, verse))
  }

  const closeAddRowDialog = () => {
    setIsAddRowDialogOpen(false)
    setNewRow({})
  }

  const submitRowEdits = () => {
    closeAddRowDialog()
    addRowToTsv(newRow)
    setNewRow({})
  }

  /**
   * @todo This allows users to input whatever value they want...
   * How do we handle things that have certain restrictions like references?
   */
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

/** @todo is this needed? */
useAddTsv.propTypes = {}

export default useAddTsv
