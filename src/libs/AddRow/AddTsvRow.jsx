import React from 'react'

import useTsvData from '../../core/hooks/useTsvData'
import useAddTsv from './hooks/useAddTsv'
import AddRowButton from './components/AddRowButton'
import AddRowDialog from './components/AddRowDialog'
import AddRowForm from './components/AddRowForm'
import { titusTsvs } from '../../assets/titusTsvs'

const chapter = 1
const verse = 2
const itemIndex = 1
const setContent = content => console.log('Content Set: ', content)
const columnsFilter = ['Reference', 'Chapter', 'Verse', 'SupportReference']

const CHAPTER_VERSE_REGEX = /^[0-9]+:[0-9]+$/

const isChapterVerseFormat = referenceString => {
  return CHAPTER_VERSE_REGEX.test(referenceString)
}

/**
 * reference string has to adhere to 'x:y'
 */
const getChapterVerse = referenceString => {
  const [chapter, verse] = referenceString.split(':').map(Number)
  return { chapter, verse }
}

const AddTsvRow = () => {
  const { onTsvAdd } = useTsvData({
    tsvs: titusTsvs,
    chapter,
    verse,
    itemIndex,
    setContent,
  })

  const addRowToTsv = row => {
    const { Reference: reference, ...rest } = row
    if (isChapterVerseFormat(reference)) {
      const { chapter: inputChapter, verse: inputVerse } =
        getChapterVerse(reference)
      if (inputChapter !== chapter || inputVerse !== verse) {
        // Todo: Do we then change the app's reference? Maybe yes
        onTsvAdd(row, inputChapter, inputVerse, 0)
        return
      }
    }

    /**
     * @todo We should probably do some more checking for Tsv props. But right
     * now it's just pretty generic.
     */
    onTsvAdd(row, chapter, verse, itemIndex)
  }

  const {
    isAddRowDialogOpen,
    openAddRowDialog,
    closeAddRowDialog,
    submitRowEdits,
    newRow,
    changeRowValue,
    columnsFilterOptions,
  } = useAddTsv({
    tsvs: titusTsvs,
    chapter,
    verse,
    itemIndex,
    columnsFilter,
    addRowToTsv,
  })

  const tsvForm = (
    <AddRowForm
      newRow={newRow}
      changeRowValue={changeRowValue}
      columnsFilterOptions={columnsFilterOptions}
    />
  )

  return (
    <div>
      <AddRowButton onClick={openAddRowDialog} />
      <AddRowDialog
        open={isAddRowDialogOpen}
        onClose={closeAddRowDialog}
        onSubmit={submitRowEdits}
        tsvForm={tsvForm}
      />
    </div>
  )
}

export default AddTsvRow
