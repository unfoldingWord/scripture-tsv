import React from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core'

const NewTsvForm = ({ newRow, setNewRow }) => {
  const changeRowValue = (event, indexToChange) => {
    setNewRow(prevRow =>
      prevRow.map((item, index) =>
        index === indexToChange ? event.target.value : item
      )
    )
  }

  const renderedRowInputs = Object.entries(newRow).map(
    ([columnName, value]) => {
      let text = ''

      // by default...
      text = (
        <TextField
          key={columnName}
          defaultValue={value}
          label={columnName}
          margin="normal"
          onChange={event => changeRowValue(event, i)}
          fullWidth
        />
      )

      return text
    }
  )

  // if ( state.columnsFilterOptions[i] && state.columnsFilterOptions[i].length > 0 ) {
  //   text = (
  //     <Autocomplete
  //       key={i}
  //       options={state.columnsFilterOptions[i]}
  //       value={newRow[i]}
  //       onChange={(event, newValue) => {
  //         newRow[i] = newValue === null ? '' : newValue;
  //       }}
  //       onInputChange={(event, newValue) => {
  //         newRow[i] = newValue;
  //       }}
  //       renderInput={(params) => <TextField {...params} label={name} margin="normal" />}
  //       freeSolo={true}
  //     />
  //   );
  // }
  return renderedRowInputs
}

NewTsvForm.propTypes = {}

export default NewTsvForm
