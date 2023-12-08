import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { RemoveCircleOutline } from '@mui/icons-material'

interface DeleteRowButtonProps {
  title?: string
  onClick: () => void
  style?: React.CSSProperties
}

const DeleteRowButton: React.FC<DeleteRowButtonProps> = ({
  title = 'Delete Tsv Row',
  onClick,
  style = {},
}) => {
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

export default DeleteRowButton
