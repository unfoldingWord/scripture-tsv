import React, { ReactNode } from 'react'
import {
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material'

interface AddRowDialogProps {
  title?: string
  open: boolean
  onClose: () => void
  onSubmit: () => void
  tsvForm: ReactNode
  style?: React.CSSProperties
}

const AddRowDialog: React.FC<AddRowDialogProps> = ({
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
          ...style,
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

export default AddRowDialog
