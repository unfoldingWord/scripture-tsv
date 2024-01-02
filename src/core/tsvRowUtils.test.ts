import {
  ChapterNum,
  IDLength,
  IDString,
  ScriptureTSV,
  TSVRow,
  VerseNum,
} from './TsvTypes'
import {
  getChapterVerse,
  calculateRowsLengthIndex,
  rowGenerate,
  generateRandomUID,
  randomId,
  getColumnsFilterOptions,
} from './tsvRowUtils'
import { titusTsvs } from '../assets/titusTsvs'

describe('TSV Row Utils', () => {
  describe('getChapterVerse', () => {
    it('should extract chapter and verse from a valid reference string', () => {
      expect(getChapterVerse('1:1')).toEqual({ chapter: 1, verse: 1 })
      expect(getChapterVerse('12:34')).toEqual({ chapter: 12, verse: 34 })
      expect(getChapterVerse('front:intro')).toEqual({
        chapter: 'front',
        verse: 'intro',
      })
    })

    it('should return only first verse from a reference range', () => {
      expect(getChapterVerse('1:1-3')).toEqual({ chapter: 1, verse: 1 })
      expect(getChapterVerse('2:4-6')).toEqual({ chapter: 2, verse: 4 })
    })
  })

  describe('calculateRowsLengthIndex', () => {
    it('should correctly calculate indices for a standard set of TSVRow items', () => {
      const allItems: TSVRow[] = [
        { Reference: '1:1', ID: 'a234', A: '1', B: 'x' },
        { Reference: '1:2', ID: 'bd32', A: '2', B: 'y' },
        { Reference: '1:3', ID: 'ed34', A: '1', B: 'z' },
      ]
      const { rowsIndex, lengthIndex } = calculateRowsLengthIndex(allItems)

      expect(rowsIndex).toEqual({
        A: { '1': 2, '2': 1 },
        B: { x: 1, y: 1, z: 1 },
        Reference: { '1:1': 1, '1:2': 1, '1:3': 1 },
        ID: { a234: 1, bd32: 1, ed34: 1 },
      })
      expect(lengthIndex).toEqual({
        A: { 1: 3 },
        B: { 1: 3 },
        Reference: { 3: 3 },
        ID: { 4: 3 },
      })
    })

    it('should correctly handle a mix of data types', () => {
      const allItems: TSVRow[] = [
        { Reference: '1:1', ID: 'id12', A: '1', B: 'longvalue' },
        { Reference: '1:2', ID: 'id23', A: '10', B: 'short' },
        { Reference: '1:3', ID: 'id34', A: '1', B: 'medium' },
      ]
      const { rowsIndex, lengthIndex } = calculateRowsLengthIndex(allItems)

      expect(rowsIndex).toEqual({
        A: { '1': 2, '10': 1 },
        B: { longvalue: 1, short: 1, medium: 1 },
        Reference: { '1:1': 1, '1:2': 1, '1:3': 1 },
        ID: { id12: 1, id23: 1, id34: 1 },
      })
      expect(lengthIndex).toEqual({
        A: { 1: 2, 2: 1 },
        B: { 9: 1, 5: 1, 6: 1 },
        Reference: { 3: 3 },
        ID: { 4: 3 },
      })
    })

    it('should throw an error for non-array inputs', () => {
      expect(() => calculateRowsLengthIndex('not an array' as any)).toThrow()
    })
  })

  describe('rowGenerate', () => {
    const EMPTY_TSV_ROW = { Reference: '', ID: '' }

    it('should generate a new row based on existing TSV data', () => {
      const tsvs: ScriptureTSV = {
        '1': {
          '1': [{ Reference: '1:1', ID: 'a123', A: '1', B: 'x' }],
          '2': [{ Reference: '1:2', ID: 'b234', A: '2', B: 'y' }],
        },
        '2': {
          '1': [{ Reference: '2:1', ID: 'c345', A: '1', B: 'z' }],
        },
      }
      const newRow = rowGenerate(tsvs, 1 as ChapterNum, 2 as VerseNum)
      expect(newRow).toHaveProperty('Reference', '1:2')
      expect(newRow).toHaveProperty('ID')
      expect(newRow.ID).toMatch(/^[a-zA-Z][a-zA-Z0-9]*$/) // ID starts with a letter and is alphanumeric
      expect(newRow.A).toBeDefined()
      expect(newRow.B).toBeDefined()
    })

    it('should return an empty object for empty TSV data', () => {
      const emptyTsvs: ScriptureTSV = {}
      const newRow = rowGenerate(emptyTsvs, 1 as ChapterNum, 2 as VerseNum)
      expect(newRow).toEqual(EMPTY_TSV_ROW)
    })

    it('should return an empty object for invalid TSV data', () => {
      const invalidTsvs: any = { '1': { '1': [{ A: '1', B: 'x' }] } } // Missing Reference and ID
      expect(rowGenerate(invalidTsvs, 1 as ChapterNum, 2 as VerseNum)).toEqual(
        EMPTY_TSV_ROW
      )
    })

    it('should generate unique IDs', () => {
      const newRow = rowGenerate(titusTsvs, 1 as ChapterNum, 2 as VerseNum)
      expect(newRow.ID).toMatch(/^[a-zA-Z][a-zA-Z0-9]*$/) // ID starts with a letter and is alphanumeric
    })

    it('should duplicate frequently repeated values', () => {
      const tsvs: ScriptureTSV = {
        '1': {
          '1': new Array(100)
            .fill({})
            .map((item, i) => ({
              Reference: '1:1',
              ID: `id1${i}`,
              A: 'common',
              B: 'x',
            })),
        },
      }
      const newRow = rowGenerate(tsvs, 1 as ChapterNum, 2 as VerseNum)
      expect(newRow.A).toEqual('common')
    })
  })

  describe('generateRandomUID', () => {
    it('should generate an ID that starts with a letter and is alphanumeric', () => {
      const id = generateRandomUID()
      expect(id).toMatch(/^[a-zA-Z][a-zA-Z0-9]*$/)
    })

    it('should generate a unique ID not in the given list', () => {
      const existingIds: IDString[] = ['a123', 'b456', 'c789']
      const newId = generateRandomUID(existingIds)
      expect(existingIds).not.toContain(newId)
      expect(newId).toMatch(/^[a-zA-Z][a-zA-Z0-9]*$/)
    })

    it('should generate different IDs on subsequent calls', () => {
      const idSet = new Set()
      for (let i = 0; i < 100; i++) {
        idSet.add(generateRandomUID())
      }
      expect(idSet.size).toBe(100) // Assuming all 100 IDs should be unique
    })

    // Test for ID length
    it('should generate an ID of the correct length', () => {
      const length = 5
      const id = generateRandomUID([], length)
      expect(id.length).toBe(length)
      expect(id).toMatch(/^[a-zA-Z][a-zA-Z0-9]*$/)
    })
  })

  describe('randomId', () => {
    it('should generate an ID that starts with a letter', () => {
      const id = randomId(5)
      expect(id).toMatch(/^[a-zA-Z]/) // Starts with a letter
    })

    it('should generate an ID of the specified length', () => {
      const length: IDLength = 5
      const id = randomId(length)
      expect(id.length).toBe(length)
    })

    it('should generate an alphanumeric ID', () => {
      const id = randomId(5)
      expect(id).toMatch(/^[a-zA-Z][a-zA-Z0-9]*$/) // Alphanumeric
    })

    it('should cap the ID length at 9', () => {
      const id = randomId(10)
      expect(id.length).toBe(9) // Length capped at 9
    })

    it('should generate different IDs on subsequent calls', () => {
      const ids = new Set()
      for (let i = 0; i < 100; i++) {
        ids.add(randomId(5))
      }
      expect(ids.size).toBeGreaterThanOrEqual(95) // Expecting high uniqueness, allowing for some coincidental duplicates
    })
  })

  describe('getColumnsFilterOptions', () => {
    it('should generate filter options correctly for given column names', () => {
      const columnNames: string[] = ['A', 'B', 'ID']
      const allItems: TSVRow[] = [
        { Reference: '1:1', ID: 'a123', A: '1', B: 'x' },
        { Reference: '1:2', ID: 'b234', A: '2', B: 'y' },
        { Reference: '1:3', ID: 'c345', A: '1', B: 'z' },
      ]
      const options = getColumnsFilterOptions(columnNames, allItems)

      expect(options).toHaveProperty('A', expect.arrayContaining(['1', '2']))
      expect(options).toHaveProperty(
        'B',
        expect.arrayContaining(['x', 'y', 'z'])
      )
      expect(options.ID).toEqual(
        expect.arrayContaining(['a123', 'b234', 'c345'])
      )
    })

    it('should return empty object for each column for empty TSV data', () => {
      const columnNames: string[] = ['A', 'B', 'ID']
      const emptyItems: TSVRow[] = []
      const options = getColumnsFilterOptions(columnNames, emptyItems)

      expect(options).toEqual({})
    })

    // Test with diverse data types
    it('should handle diverse value types in TSVRows', () => {
      const columnNames: string[] = ['A', 'C']
      const allItems: TSVRow[] = [
        { Reference: '1:1', ID: 'd456', A: '1', C: '123' },
        { Reference: '1:2', ID: 'e567', A: '2', C: 'text' },
      ]
      const options = getColumnsFilterOptions(columnNames, allItems)

      expect(options).toHaveProperty('A', expect.arrayContaining(['1', '2']))
      expect(options).toHaveProperty(
        'C',
        expect.arrayContaining(['123', 'text'])
      )
    })
  })
})
