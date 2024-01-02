import React from 'react'
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
import { TSVRow } from '../../../core/TsvTypes'

interface DeleteRowDialogProps {
  title?: string
  open: boolean
  onClose: () => void
  onSubmit: () => void
  currentRow: TSVRow | null
  style?: React.CSSProperties
}

const DeleteRowDialog: React.FC<DeleteRowDialogProps> = ({
  title = 'Delete This TSV Item?',
  open,
  onClose,
  onSubmit,
  currentRow,
  style = {},
}) => {
  const renderedRowValue = ([columnName, value]: [string, string]) =>
    // TODO: THIS IS A HACK... Implement dynamic column names
    columnName !== '_referenceRange' ? (
      <DialogContentText key={columnName} sx={{ mb: 1 }}>
        <strong>{columnName}: </strong>
        <span>{value}</span>
      </DialogContentText>
    ) : null

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
        {currentRow ? renderedTSVRowValuePairs : 'No TSV Item Here to Delete! '}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          Cancel
        </Button>
        {currentRow && (
          <Button onClick={onSubmit} color="error">
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default DeleteRowDialog
