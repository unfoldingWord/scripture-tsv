import React from 'react'
import PropTypes from 'prop-types'
import { IconButton, Tooltip } from '@mui/material'
import { RemoveCircleOutline } from '@mui/icons-material'

const DeleteRowButton = ({ title = 'Delete Tsv Row', onClick, style = {} }) => {
  return (
    <Tooltip title={title} arrow>
      <IconButton
        key="delete-tsv"
        onClick={onClick}
        aria-label={title}
        sx={{
          padding: '8px',
          ...style,
        }}
      >
        <RemoveCircleOutline />
      </IconButton>
    </Tooltip>
  )
}

DeleteRowButton.propTypes = {
  /** title that displays on tooltip when button is hovered */
  title: PropTypes.string,
  /** callback function when user click on the add button */
  onClick: PropTypes.func,
  /** style object for custom button styles */
  style: PropTypes.object,
}

export default DeleteRowButton
