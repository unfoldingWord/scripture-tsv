import { useState } from 'react'
import PropTypes from 'prop-types'

const useAddTsv = props => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const onClick = () => {
    setIsAddDialogOpen(true)
  }

  return {
    isAddDialogOpen,
    onClick,
  }
}

useAddTsv.propTypes = {}

export default useAddTsv
