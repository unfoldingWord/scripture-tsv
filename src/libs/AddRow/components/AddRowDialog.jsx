import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material'

const AddRowDialog = ({
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
      aria-labelledby="add-tsv-dialog-title"
      aria-describedby="add-tsv-dialog-description"
      sx={{
        '& .MuiDialog-paper': {
          minWidth: '500px',
        },
      }}
    >
      <DialogTitle id="add-tsv-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Divider />
        <br />
        {tsvForm}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" autoFocus>
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

AddRowDialog.propTypes = {
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

export default AddRowDialog
