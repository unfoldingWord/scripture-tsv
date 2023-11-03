/**
 * A number between 1-150 representing a chapter number.
 */
export type ChapterNum = number

/**
 * A string of a number between 1-150 representing a chapter number.
 */
export type ChapterNumString = string

/**
 * A number between 1-176 representing a verse number.
 */
export type VerseNum = number

/**
 * A string of a number between 1-150 representing a verse number.
 */
export type VerseNumString = string

/**
 * A number that is >= 0.
 */
export type ItemIndex = number

/**
 * A string in the format 'chapter:verse'.
 * Can be a reference range (i.e 1:2-3)
 * Can be multiple references (i.e 2:3;4:23)
 */
export type ReferenceString = string

/**
 * An object representing a reference to a chapter and verse.
 */
export interface TSVReference {
  chapter: ChapterNum
  verse: VerseNum
}

/**
 * A number that must be greater than zero.
 */
export type IDLength = number

/**
 * An alphanumeric random string of four characters that always starts with a letter.
 */
export type IDString = string

/**
 * String containing TSV file content.
 */
export type TSVFileContent = string

/**
 * A function that sets the content of a TSV file.
 */
export type SetContentFunction = (tsvFileContent: TSVFileContent) => void

/**
 * An object representing a row in a TSV file.
 */
export interface TSVRow {
  Reference: ReferenceString
  ID: IDString
  [key: string]: any // additional TSV column header/data
}

/**
 * An object representing a scripture TSV.
 * Mapping of chapter numbers to verse data.
 */
export interface ScriptureTSV {
  [chapter: ChapterNumString]: { [verse: VerseNumString]: Array<TSVRow> }
}

/**
 * An object representing the frequency index of unique values and value lengths for each column in a list of TSVRow items.
 */
export interface RowsLengthIndex {
  rowsIndex: { [column: string]: { [value: string]: number } }
  lengthIndex: { [column: string]: { [valueLength: number]: number } }
}
