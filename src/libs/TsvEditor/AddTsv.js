import React, { useState, useEffect } from 'react'

const AddRowDialog = (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby='dialog-title'
    aria-describedby='dialog-description'
    classes={{ paper: classes.paper }}
  >
    <DialogTitle id='dialog-title'>Add Row</DialogTitle>
    <DialogContent>
      <Divider />
      <br />
      {newRowComponent}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color='primary' autoFocus>
        Cancel
      </Button>
      <Button onClick={handleRowAdd} color='secondary'>
        Add
      </Button>
    </DialogActions>
  </Dialog>
)

const html = (
  <div>
    <AddTsv title='Add Tsv Row' />
  </div>
)

export default AddTsv
