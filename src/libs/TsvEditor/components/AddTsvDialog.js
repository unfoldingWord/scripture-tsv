import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
} from '@material-ui/core'

const rowInputs = columnNames.map((name, i) => {
  let text = ''

  if (!newRow) {
    // This function creates an array with string values of pre-filled row data
    // TODO: We need to figure out how to replicate this, prefilling...
    //   - occurrence
    //   - id
    //   - reference
    const _newRow = rowGenerate({ rowIndex })
    setNewRow(_newRow)
    return text
  } else {
    // by default...
    text = (
      <TextField
        key={i}
        defaultValue={newRow[i]}
        label={name}
        margin='normal'
        onChange={event => {
          newRow[i] = event.target.value
        }}
        fullWidth
      />
    )

    if (
      state.columnsFilterOptions[i] &&
      state.columnsFilterOptions[i].length > 0
    ) {
      text = (
        <Autocomplete
          key={i}
          options={state.columnsFilterOptions[i]}
          value={newRow[i]}
          onChange={(event, newValue) => {
            newRow[i] = newValue === null ? '' : newValue
          }}
          onInputChange={(event, newValue) => {
            newRow[i] = newValue
          }}
          renderInput={params => (
            <TextField {...params} label={name} margin='normal' />
          )}
          freeSolo={true}
        />
      )
    }
  }
  return text
})

const AddTsvDialog = ({
  title = 'Add Row',
  open,
  onClose,
  onSubmit,
  tsvForm,
  style = {},
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='add-tsv-dialog-title'
      aria-describedby='add-tsv-dialog-description'
      style={{ minWidth: '500px', ...style }}
    >
      <DialogTitle id='add-tsv-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <Divider />
        <br />
        {rowInputs}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary' autoFocus>
          Cancel
        </Button>
        <Button onClick={onSubmit} color='secondary'>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

AddTsvDialog.propTypes = {
  /** title that displays on tooltip when button is hovered */
  title: PropTypes.string,
  /** true if dialog is open, false otherwise */
  open: PropTypes.bool,
  /** callback function called when user closes dialog */
  onClose: PropTypes.func,
  /** callback function called when user click on the add button */
  onSubmit: PropTypes.func,
  /** style object for custom button styles */
  style: PropTypes.object,
}

export default AddTsvDialog
