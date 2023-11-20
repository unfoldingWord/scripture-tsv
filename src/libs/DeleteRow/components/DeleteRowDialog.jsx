import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material'

import { isValidTSVRow } from '../../../core/scriptureTsvValidation'

const DeleteRowDialog = ({
  title = 'Delete This TSV Item?',
  open,
  onClose,
  onSubmit,
  currentRow,
  style = {},
}) => {
  const renderedRowValue = ([columnName, value]) => (
    <DialogContentText key={columnName} sx={{ mb: 1 }}>
      <strong>{columnName}: </strong>
      <span>{value}</span>
    </DialogContentText>
  )

  const renderedTSVRowValuePairs = isValidTSVRow(currentRow)
    ? Object.entries(currentRow).map(renderedRowValue)
    : null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-tsv-dialog-title"
      aria-describedby="delete-tsv-dialog-description"
    >
      <DialogTitle id="delete-tsv-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mb: 1 }}>
          There is no undo feature, this is permanent.
        </DialogContentText>
        <Divider />
        <br />
        {!!currentRow
          ? renderedTSVRowValuePairs
          : 'No TSV Item Here to Delete! '}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          Cancel
        </Button>
        {!!currentRow && (
          <Button onClick={onSubmit} color="error">
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

DeleteRowDialog.propTypes = {
  /** title that displays on tooltip when button is hovered */
  title: PropTypes.string,
  /** true if dialog is open, false otherwise */
  open: PropTypes.bool,
  /** callback function called when user closes dialog */
  onClose: PropTypes.func,
  /** callback function called when user click on the delete button */
  onSubmit: PropTypes.func,
  /** TSV Row Item that will be deleted */
  currentRow: PropTypes.object,
  /** style object for custom button styles */
  style: PropTypes.object,
}

export default DeleteRowDialog
