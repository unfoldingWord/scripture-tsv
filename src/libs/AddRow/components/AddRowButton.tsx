import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { AddCircleOutline } from '@mui/icons-material'

interface TitleClickAndStyle {
  title?: string
  onClick: () => void
  style?: React.CSSProperties
}

const AddRowButton: React.FC<TitleClickAndStyle> = ({
  title = 'Add Tsv Row',
  onClick,
  style = {},
}) => {
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

export default AddRowButton
