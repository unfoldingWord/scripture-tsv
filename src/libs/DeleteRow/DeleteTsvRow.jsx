import React from 'react'

import useTsvData from '../../core/hooks/useTsvData'
import DeleteRowButton from './components/DeleteRowButton'
import { titusTsvs } from '../../assets/titusTsvs'

const DeleteTsvRow = () => {
  return (
    <div>
      <DeleteRowButton onClick={() => console.log('delete!')} />
    </div>
  )
}

export default DeleteTsvRow
