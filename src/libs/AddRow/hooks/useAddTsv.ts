import { useState, useMemo } from 'react'
import { rowGenerate, getColumnsFilterOptions } from '../../../core/tsvRowUtils'
import flattenObject from '../../../core/flattenTsvObject'
import { isValidScriptureTSV } from '../../../core/scriptureTsvValidation'
import {
  ScriptureTSV,
  ChapterNum,
  VerseNum,
  TSVRow,
} from '../../../types/TsvTypes'

interface UseAddTsvProps {
  tsvs: ScriptureTSV
  chapter: ChapterNum
  verse: VerseNum
  columnsFilter: string[]
  addRowToTsv: (newRow: TSVRow | {}) => void
}

interface UseAddTsvReturn {
  isAddRowDialogOpen: boolean
  openAddRowDialog: () => void
  closeAddRowDialog: () => void
  submitRowEdits: () => void
  newRow: TSVRow | {}
  changeRowValue: (columnName: string, newValue: string) => void
  columnsFilterOptions: { [key: string]: string[] } | {}
}

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
const useAddTsv = ({
  tsvs,
  chapter,
  verse,
  columnsFilter,
  addRowToTsv,
}: UseAddTsvProps): UseAddTsvReturn => {
  const [isAddRowDialogOpen, setIsAddRowDialogOpen] = useState(false)
  const [newRow, setNewRow] = useState<TSVRow | {}>({})

  const columnsFilterOptions = useMemo(() => {
    if (!isValidScriptureTSV(tsvs)) return {}

    const allItems = flattenObject(tsvs)
    if (columnsFilter && allItems.length) {
      const columnNames = Object.keys(allItems[0])
      const columnNamesToFilter = columnsFilter.filter(columnName =>
        columnNames.includes(columnName)
      )

      return getColumnsFilterOptions(columnNamesToFilter, allItems)
    }
    return {}
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

  const changeRowValue = (columnName: string, newValue: string) => {
    setNewRow(prevRow => ({ ...prevRow, [columnName]: newValue }))
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

export default useAddTsv
