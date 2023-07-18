import React from 'react'
import PropTypes from 'prop-types'
import { IconButton, Tooltip } from '@material-ui/core'
import { AddCircleOutline } from '@material-ui/icons'

const AddTsvButton = ({ title = 'Add Tsv Row', onClick, style = {} }) => {
  return (
    <Tooltip title={title} arrow>
      <span>
        <IconButton
          key='add-tsv'
          onClick={onClick}
          aria-label={title}
          style={{ padding: '8px', ...style }}
        >
          <AddCircleOutline />
        </IconButton>
      </span>
    </Tooltip>
  )
}

AddTsvButton.propTypes = {
  /** title that displays on tooltip when button is hovered */
  title: PropTypes.string,
  /** callback function when user click on the add button */
  onClick: PropTypes.func,
  /** style object for custom button styles */
  style: PropTypes.object,
}

export default AddTsvButton
