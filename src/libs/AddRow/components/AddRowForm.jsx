import React from 'react'
import PropTypes from 'prop-types'
import { TextField, Autocomplete } from '@mui/material'

const AddRowForm = ({ newRow, changeRowValue, columnsFilterOptions }) => {
  const renderedRowInputs = Object.entries(newRow).map(
    ([columnName, value]) => {
      let text = (
        <TextField
          key={columnName}
          defaultValue={value}
          label={columnName}
          margin="normal"
          onChange={event => changeRowValue(columnName, event.target.value)}
          fullWidth
        />
      )

      if (!!columnsFilterOptions[columnName]?.length) {
        text = (
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
            freeSolo={true}
          />
        )
      }

      return text
    }
  )

  return renderedRowInputs
}

AddRowForm.propTypes = {}

export default AddRowForm
