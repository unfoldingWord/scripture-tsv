import React from 'react'
import { TextField, Autocomplete } from '@mui/material'
import { TSVRow } from '../../../types/TsvTypes'

interface AddRowFormProps {
  newRow: TSVRow
  changeRowValue: (columnName: string, newValue: string) => void
  columnsFilterOptions: { [column: string]: string[] }
}

const AddRowForm: React.FC<AddRowFormProps> = ({
  newRow,
  changeRowValue,
  columnsFilterOptions,
}) => {
  const renderedRowInputs = Object.entries(newRow).map(
    ([columnName, value]) => {
      const shouldUseAutocomplete = columnsFilterOptions[columnName]?.length > 0

      return shouldUseAutocomplete ? (
        <Autocomplete
          key={columnName}
          options={columnsFilterOptions[columnName]}
          value={value}
          onChange={(event, newValue) => {
            changeRowValue(columnName, newValue ?? '')
          }}
          onInputChange={(event, newValue) => {
            changeRowValue(columnName, newValue)
          }}
          renderInput={params => (
            <TextField {...params} label={columnName} margin="normal" />
          )}
          freeSolo
        />
      ) : (
        <TextField
          key={columnName}
          defaultValue={value}
          label={columnName}
          margin="normal"
          onChange={event => changeRowValue(columnName, event.target.value)}
          fullWidth
        />
      )
    }
  )

  return <>{renderedRowInputs}</>
}

export default AddRowForm
