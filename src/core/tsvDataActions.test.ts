import {
  addTsvRow,
  deleteTsvRow,
  updateTsvRow,
  moveTsvRow,
  arrayMove,
  removeReferenceRangeDuplicates,
  tsvsObjectToFileString,
} from './tsvDataActions'
import { ScriptureTSV, TSVRow, UpdatedRowValue } from '../types/TsvTypes'

describe('TSV Data Actions', () => {
  describe('addTsvRow', () => {
    const sampleScriptureTSV: ScriptureTSV = {
      '1': { '1': [{ Reference: '1:1', ID: 'a123' }] },
    }
    const newItem: TSVRow = { Reference: '1:1', ID: 'b234' }

    it('should add a new TSV row at the specified chapter and verse', () => {
      const updatedTsvs = addTsvRow(sampleScriptureTSV, newItem, 1, 1, 0)
      expect(updatedTsvs['1']['1'][1]).toEqual(newItem)
    })

    it('should throw an error for invalid new row input', () => {
      const invalidNewItem = { Reference: '1:1' } // Missing ID
      expect(() =>
        addTsvRow(sampleScriptureTSV, invalidNewItem as TSVRow, 1, 1, 0)
      ).toThrow('Invalid new row input!')
    })
  })

  describe('deleteTsvRow', () => {
    const sampleScriptureTSV: ScriptureTSV = {
      '1': {
        '1': [
          { Reference: '1:1', ID: 'a123' },
          { Reference: '1:1', ID: 'b234' },
        ],
      },
    }

    it('should delete a TSV row at the specified chapter, verse, and itemIndex', () => {
      const updatedTsvs = deleteTsvRow(sampleScriptureTSV, 1, 1, 0)
      expect(updatedTsvs['1']['1']).toHaveLength(1)
      expect(updatedTsvs['1']['1'][0].ID).toBe('b234')
    })

    it('should throw an error for non-existing item index', () => {
      expect(() => deleteTsvRow(sampleScriptureTSV, 1, 1, 2)).toThrow()
    })
  })

  describe('deleteTsvRow with Reference Range', () => {
    const sampleScriptureTSV: ScriptureTSV = {
      '1': {
        '1': [
          { Reference: '1:1-2', ID: 'a123', _referenceRange: 'a123_1:1-2' },
        ],
        '2': [
          { Reference: '1:1-2', ID: 'a123', _referenceRange: 'a123_1:1-2' },
          { Reference: '1:2;2:2', ID: 'b123', _referenceRange: 'b123_1:2;2:2' },
        ],
      },
      '2': {
        '1': [{ Reference: '2:1', ID: 'c345' }],
        '2': [
          { Reference: '1:2;2:2', ID: 'b123', _referenceRange: 'b123_1:2;2:2' },
        ],
      },
    }

    it('should delete TSV rows within the specified reference range', () => {
      const updatedTsvs = deleteTsvRow(sampleScriptureTSV, 1, 1, 0)
      expect(updatedTsvs['1']['1']).toHaveLength(0)
      expect(updatedTsvs['1']['2']).toHaveLength(1)
    })

    it('should delete TSV rows within the reference range with semicolon', () => {
      const updatedTsvs = deleteTsvRow(sampleScriptureTSV, 1, 2, 1)
      expect(updatedTsvs['1']['2']).toHaveLength(1)
      expect(updatedTsvs['2']['2']).toHaveLength(0)
    })

    it('should only delete rows within the specified chapter and verse', () => {
      const updatedTsvs = deleteTsvRow(sampleScriptureTSV, 1, 1, 0)
      expect(updatedTsvs['2']['1']).toHaveLength(1)
    })

    it('should throw an error if the specified index does not exist in the chapter and verse', () => {
      expect(() => deleteTsvRow(sampleScriptureTSV, 1, 1, 2)).toThrow()
    })
  })

  describe('updateTsvRow', () => {
    const sampleScriptureTSV: ScriptureTSV = {
      '1': { '1': [{ Reference: '1:1', ID: 'a123' }] },
    }
    const updatedValue: UpdatedRowValue = { OtherField: 'Updated' }

    it('should update a TSV row at the specified index with new values', () => {
      const updatedTsvs = updateTsvRow(
        sampleScriptureTSV,
        updatedValue,
        1,
        1,
        0
      )
      expect(updatedTsvs['1']['1'][0].OtherField).toBe('Updated')
    })
  })

  describe('updateTsvRow with Reference Range', () => {
    const sampleScriptureTSV: ScriptureTSV = {
      '1': {
        '1': [
          { Reference: '1:1-2', ID: 'a123', _referenceRange: 'a123_1:1-2' },
        ],
        '2': [
          { Reference: '1:1-2', ID: 'a123', _referenceRange: 'a123_1:1-2' },
        ],
      },
      '2': {
        '1': [{ Reference: '2:1', ID: 'b234' }],
      },
    }
    const updatedValue: UpdatedRowValue = { ExtraField: 'Updated' }

    it('should update all TSV rows within the specified reference range', () => {
      const updatedTsvs = updateTsvRow(
        sampleScriptureTSV,
        updatedValue,
        1,
        1,
        0
      )
      expect(updatedTsvs['1']['1'][0].ExtraField).toBe('Updated')
      expect(updatedTsvs['1']['2'][0].ExtraField).toBe('Updated')
    })

    it('should only update rows within the specified chapter and verse', () => {
      const updatedTsvs = updateTsvRow(
        sampleScriptureTSV,
        updatedValue,
        1,
        1,
        0
      )
      expect(updatedTsvs['2']['1'][0].ExtraField).toBeUndefined()
    })

    it('should throw an error if the updated row becomes invalid', () => {
      const invalidUpdatedValue: UpdatedRowValue = { ID: '123' } // Invalid ID format
      expect(() =>
        updateTsvRow(sampleScriptureTSV, invalidUpdatedValue, 1, 1, 0)
      ).toThrow('Invalid new row input!')
    })
  })

  describe('moveTsvRow', () => {
    const sampleScriptureTSV: ScriptureTSV = {
      '1': {
        '1': [
          { Reference: '1:1', ID: 'a123' },
          { Reference: '1:1', ID: 'b234' },
        ],
      },
    }

    it('should move a TSV row from one index to another', () => {
      const updatedTsvs = moveTsvRow(sampleScriptureTSV, 1, 1, 0, 1)
      expect(updatedTsvs['1']['1'][0].ID).toBe('b234')
      expect(updatedTsvs['1']['1'][1].ID).toBe('a123')
    })
  })

  describe('tsvsObjectToFileString', () => {
    it('should convert a valid ScriptureTSV object to a TSV file string', () => {
      const sampleScriptureTSV: ScriptureTSV = {
        '1': {
          '1': [
            {
              Reference: '1:1',
              ID: 'df78',
              Text: 'In the beginning',
              _referenceRange: '1:1-1:2',
            },
          ],
          '2': [{ Reference: '1:2', ID: 'cvb8', Text: 'God created' }],
        },
      }
      const expected = `Reference\tID\tText\n1:1\tdf78\tIn the beginning\n1:2\tcvb8\tGod created`
      expect(tsvsObjectToFileString(sampleScriptureTSV)).toBe(expected)
    })

    it('should remove duplicate rows based on reference ranges', () => {
      const sampleScriptureTSV: ScriptureTSV = {
        '1': {
          '1': [
            {
              Reference: '1:1',
              ID: 'df78',
              Text: 'In the beginning',
              _referenceRange: '1:1-1:2',
            },
          ],
          '2': [
            {
              Reference: '1:2',
              ID: 'df78',
              Text: 'In the beginning',
              _referenceRange: '1:1-1:2',
            },
          ],
        },
      }
      const expected = `Reference\tID\tText\n1:1\tdf78\tIn the beginning`
      expect(tsvsObjectToFileString(sampleScriptureTSV)).toBe(expected)
    })

    it('should remove unnecessary columns like Chapter, Verse, Book, and markdown', () => {
      const sampleScriptureTSV: ScriptureTSV = {
        '1': {
          '1': [
            {
              Reference: '1:1',
              ID: 'df78',
              Text: 'In the beginning',
              Book: 'Genesis',
              Chapter: '1',
              Verse: '1',
              markdown: '###',
            },
          ],
        },
      }
      const expected = `Reference\tID\tText\n1:1\tdf78\tIn the beginning`
      expect(tsvsObjectToFileString(sampleScriptureTSV)).toBe(expected)
    })
  })

  test('arrayMove moves an element in an array', () => {
    const array = [1, 2, 3]
    const result = arrayMove(array, 0, 2)
    expect(result).toEqual([2, 3, 1])
  })

  test('removeReferenceRangeDuplicates removes duplicates', () => {
    const tsvItems: TSVRow[] = [
      {
        Reference: '1:1-2',
        ID: 'f89s',
        Text: 'text1',
        _referenceRange: 'ref1',
      },
      {
        Reference: '1:1-2',
        ID: 'fis0',
        Text: 'text2',
        _referenceRange: 'ref1',
      },
    ]
    const result = removeReferenceRangeDuplicates(tsvItems)
    expect(result).toHaveLength(1)
    expect(result[0].ID).toEqual('f89s')
  })
})
