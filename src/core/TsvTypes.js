/**
 * @typedef {number} ChapterNum
 * A number between 1-150
 */

/**
 * @typedef {number} VerseNum
 * A number between 1-176
 */

/**
 * @typedef {number} ItemIndex
 * A number that is >= 0
 */

/**
 * @typedef {string} ReferenceString
 * A string in the format 'chapter:verse'
 * 'chapter' can be a number or the word 'front',
 * 'verse' can be a number, the word 'intro', or a verse range (verseStart-verseEnd)
 */

/**
 * @typedef {Object} TSVReference
 * @property {ChapterNum} chapter - The chapter number.
 * @property {VerseNum} verse - The verse number.
 */

/**
 * @typedef {int} IDLength
 * A number that must be greater than zero
 */

/**
 * @typedef {string} IDString
 * An alphanumeric random string of four characters that always starts with a letter
 */

/**
 * @typedef {string} TSVFileContent
 * String containing tsv file content
 */

/**
 * @callback SetContentFunction
 * @param {TSVFileContent} tsvFileContent
 */

/**
 * @typedef {Object} ScriptureTSV
 *
 * @property {Object.<ChapterNum, Object.<VerseNum, Array.<TSVRow>>>} - Mapping of chapter numbers to verse data.
 */

/**
 * @typedef {Object} TSVRow
 *
 * @property {ReferenceString} Reference
 * @property {IDString} ID
 * @property {Object.<string, any>} column3 - additional TSV column header/data
 * @property {Object.<string, any>} column4 - additional TSV column header/data
 * @property {Object.<string, any>} column5 - additional TSV column header/data
 * @property {Object.<string, any>} column6 - additional TSV column header/data
 * @property {Object.<string, any>} column7 - additional TSV column header/data
 */

/**
 * @typedef {Object} UpdatedRowValue
 * @property {string} columnName - Description of the property.
 */

/**
 * @typedef {Object} RowsLengthIndex
 * @property {Object.<string, Object.<string, number>>} rowsIndex - An object mapping each column name to another object. The inner object maps unique values in that column to their frequencies.
 * @property {Object.<string, Object.<number, number>>} lengthIndex - An object mapping each column name to another object. The inner object maps unique lengths of values in that column to their frequencies.
 */
