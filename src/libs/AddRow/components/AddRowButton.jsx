import React from 'react'
import PropTypes from 'prop-types'
import { IconButton, Tooltip } from '@mui/material'
import { AddCircleOutline } from '@mui/icons-material'

const AddRowButton = ({ title = 'Add Tsv Row', onClick, style = {} }) => {
  return (
    <Tooltip title={title} arrow>
      <span>
        <IconButton
          key="add-tsv"
          onClick={onClick}
          aria-label={title}
          sx={{
            padding: '8px',
            ...style,
          }}
        >
          <AddCircleOutline />
        </IconButton>
      </span>
    </Tooltip>
  )
}

AddRowButton.propTypes = {
  /** title that displays on tooltip when button is hovered */
  title: PropTypes.string,
  /** callback function when user click on the add button */
  onClick: PropTypes.func,
  /** style object for custom button styles */
  style: PropTypes.object,
}

export default AddRowButton
