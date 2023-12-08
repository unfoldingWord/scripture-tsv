import React, { useState } from 'react'

import useTsvData from '../../core/hooks/useTsvData'
import DeleteRowButton from './components/DeleteRowButton'
import DeleteRowDialog from './components/DeleteRowDialog'
import { titusTsvs } from '../../assets/titusTsvs'
import { ChapterNum, VerseNum, ItemIndex } from '../../core/TsvTypes'

/**
 * @description This file is meant to act as a sandbox to display the content
 * of the scripture-tsv library. Currently this sandbox creates a delete TSV
 * button that utilizes the custom hooks and utility functions contained in
 * the application.
 *
 * Users of this library should be able to look at this sandbox and have an idea
 * of how to use each part of this library.
 */

const chapter: ChapterNum = 1
const verse: VerseNum = 1
const itemIndex: ItemIndex = 0

const DeleteTsvRow: React.FC = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { getTsvRow, onTsvDelete } = useTsvData({
    tsvs: titusTsvs,
    chapter,
    verse,
    itemIndex,
  })

  const onDeleteButtonClick = () => setIsDeleteDialogOpen(true)

  const closeDeleteDialog = () => setIsDeleteDialogOpen(false)

  const confirmDelete = () => {
    onTsvDelete(itemIndex)
    setIsDeleteDialogOpen(false)
  }

  return (
    <div>
      <DeleteRowButton onClick={onDeleteButtonClick} />
      <DeleteRowDialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onSubmit={confirmDelete}
        currentRow={getTsvRow(itemIndex)}
      />
    </div>
  )
}

export default DeleteTsvRow
