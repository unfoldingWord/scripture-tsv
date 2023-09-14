import React from 'react'

import useTsvData from '../../core/hooks/useTsvData'
import useAddTsv from './hooks/useAddTsv'
import AddRowButton from './components/AddRowButton'
import AddRowDialog from './components/AddRowDialog'
import AddRowForm from './components/AddRowForm'
import { titusTsvs } from '../../assets/titusTsvs'
import { isChapterVerseFormat, getChapterVerse } from '../../core/tsvRowUtils'

/**
@todo could these constants be renamed? Are they default values?
*/
const chapter = 1
const verse = 2
const itemIndex = 1

/** @todo can this be removed? */
const setContent = content => console.log('Content Set: ', content)

const columnsFilter = ['Reference', 'Chapter', 'Verse', 'SupportReference']

const AddTsvRow = () => {
  const { onTsvAdd } = useTsvData({
    tsvs: titusTsvs,
    chapter,
    verse,
    itemIndex,
    setContent,
  })

  /** @todo could you add js docs for this please? */
  const addRowToTsv = row => {
    const { Reference } = row

    /**
    the isChapterVerseFormat and getChapterVerse is great...however,
    there's a more clear technique. There is an idea called "Parse
    don't validate" that is easily applied here is ubiquitous in
    programming.

    Validating is where we ONLY check if "raw" data is in the correct
    format.  Parsing is where we extract more structured data from
    the "raw" data if the "raw" data is in the correct format.

    If we add types to your two functions we have:

      - isChapterVerseFormat : string -> bool
      - getChapterVerse : string -> {chapter : string | undefined, verse : string | undefined}

    Notice the `undefined` bits in getChapterVerse - this is what
    getChapterVerse will return if chapter and/or verse don't exist
    in the input string. Comparing the purpose of the two functions
    you'll notice that getChapterVerse performs the same function
    as isChapterVerse but provides MORE information.

    Simply put, isChapterVerseFormat only tells us whether the input
    string is "correct" (via `true` or `false`), but nothing more.
    getChapterVerse tells us whether the input is "correct" and
    provides the "proof" that the input is "correct", or at least
    why the input is not correct.

    I would recommend removing isChapterVerseFormat and re-write
    getChapterVerse to have the following type:

      - getChapterVerse : string -> { chapter : string, verse : string } | E[^1]

    And then re-write your consuming code here by removing `if(isChapterVerseFormat...)`

    const {chapter, verse }= getChapterVerse(Reference)
    if(chapter && verse) {
      ...
    }

    Here would be "good enough". However, if we analyzed the types
    involved with the logic you're writing we might consider re-using
    this parser idea. That is `inputChapter !== chapter` could
    be part of your definition of getChapterVerse (given `chapter` in
    scope here is a global variable). In this case put this logic
    into getChapterVerse and you get: 
    
    const { inputChapter && inputVerse } = getChapterVerse(Reference)
    if(chapter && verse) { onTsvadd(row, inputChapter, inputVerse, 0) }

    And to go a step further: since our parser is a type   we could write a function: 

    Parser a = string -> a | undefined

    mapParser : (a -> b, Parser a) -> Parser b
    mapParser = (f, parser) => s => {
      const r = parser(s)
      return r ? f(r) : undefined
    }

    and then this entire nested if block becomes: 

    mapParser(getChapterVerse, ({chapter, verse}) => onTsvadd(row, inputChapter, inputVerse, 0))(Reference)
     
    This pattern is ubiquitos in programming. While it's not
    javascript I would recommend reading (especially the part on
    shotgun parsing):

      https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/

    
    [^1]: `E` is our error type. `E` could be `undefined` indicating
    that the input string isn't correct (and the function doesn't
    want to give more information beyond this), it could be an error
    string (which we really could only write to an error log), or
    it could be some well structured error type that encodes lots
    of information about why the input is "wrong".

    */
    if (isChapterVerseFormat(Reference)) {
      const { chapter: inputChapter, verse: inputVerse } = getChapterVerse(Reference)
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
