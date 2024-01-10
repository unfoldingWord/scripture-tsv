import {
  isValidScriptureTSV,
  isValidTSVRow,
  doesChapterVerseExistInTsvs,
  doesItemIndexExistInTsvs,
} from './scriptureTsvValidation'
import { ScriptureTSV, TSVRow } from './TsvTypes'

import { titusTsvs } from '../assets/titusTsvs'

describe('scriptureTsvValidation', () => {
  describe('isValidScriptureTSV', () => {
    it('should return false for non-object types', () => {
      expect(isValidScriptureTSV(null)).toBe(false)
      expect(isValidScriptureTSV(undefined)).toBe(false)
      expect(isValidScriptureTSV(123)).toBe(false)
      expect(isValidScriptureTSV('string')).toBe(false)
      expect(isValidScriptureTSV([])).toBe(false)
    })

    it('should return false for invalid ScriptureTSV objects', () => {
      expect(isValidScriptureTSV({ chapter: 'not a number' })).toBe(false)
      expect(isValidScriptureTSV({ 1: 'not an object' })).toBe(false)
    })

    it('should return false for objects with non-array verse values', () => {
      expect(isValidScriptureTSV({ '1': { '1': 'not an array' } })).toBe(false)
    })

    it('should return false for verse arrays containing non-object items', () => {
      expect(
        isValidScriptureTSV({ '1': { '1': ['not a TSVRow object'] } })
      ).toBe(false)
    })

    it('should return true for special chapter keys like "front"', () => {
      const scriptureTSV: ScriptureTSV = {
        front: { intro: [{ Reference: 'front:intro', ID: 'a123' }] },
      }
      expect(isValidScriptureTSV(scriptureTSV)).toBe(true)
    })

    it('should return true for special verse keys like "front"', () => {
      const scriptureTSV: ScriptureTSV = {
        3: { front: [{ Reference: '3:front', ID: 'a123' }] },
      }
      expect(isValidScriptureTSV(scriptureTSV)).toBe(true)
    })

    it('should return true for valid ScriptureTSV objects', () => {
      const validScriptureTSV: ScriptureTSV = {
        1: {
          1: [{ Reference: '1:1', ID: 'abcd', OtherKey: 'value' }],
          3: [
            {
              Reference: '1:3',
              ID: 'q1su',
              Tags: '',
              SupportReference: 'rc://*/ta/man/translate/figs-exclusive',
              Quote: 'εὐχαριστοῦμεν & τοῦ Κυρίου ἡμῶν & πάντοτε',
              Occurrence: '1',
              Note: 'These words do not include the Colossians. (See: [[rc://*/ta/man/translate/figs-exclusive]])',
            },
          ],
        },
      }
      expect(isValidScriptureTSV(validScriptureTSV)).toBe(true)
      expect(isValidScriptureTSV(titusTsvs)).toBe(true)
    })
  })

  describe('isValidTSVRow', () => {
    const bookId = 'gen'
    it('should return false for non-object types', () => {
      expect(isValidTSVRow(null, bookId)).toBe(false)
      expect(isValidTSVRow(undefined, bookId)).toBe(false)
    })

    it('should return false for invalid TSVRow objects', () => {
      expect(isValidTSVRow({ Reference: '1:1', ID: '1234' }, bookId)).toBe(
        false
      ) // ID should start with a letter
    })

    it('should return false for objects without a Reference property', () => {
      expect(isValidTSVRow({ ID: 'a123' }, bookId)).toBe(false)
    })

    it('should return false for objects without an ID property', () => {
      expect(isValidTSVRow({ Reference: '1:1' }, bookId)).toBe(false)
    })

    it('should return false for objects with invalid ID format', () => {
      const invalidRows: Partial<TSVRow>[] = [
        { Reference: '1:1', ID: '1234' }, // ID should start with a letter
        { Reference: '2:2', ID: 'abcd5' }, // ID should be exactly four characters
      ]
      invalidRows.forEach(row => expect(isValidTSVRow(row, bookId)).toBe(false))
    })

    it('should return false for objects with additional properties of wrong types', () => {
      const invalidRow: Partial<TSVRow> & { ExtraProp: number } = {
        Reference: '1:1',
        ID: 'a123',
        ExtraProp: 123, // ExtraProp should be a string
      }
      expect(isValidTSVRow(invalidRow, bookId)).toBe(false)
    })

    it('should validate ReferenceString formats', () => {
      expect(
        isValidTSVRow({ Reference: 'front:intro', ID: 'a123' }, bookId)
      ).toBe(true)
      expect(isValidTSVRow({ Reference: '1:2-3', ID: 'b234' }, bookId)).toBe(
        true
      )
      expect(isValidTSVRow({ Reference: '2:3;4:23', ID: 'c345' }, bookId)).toBe(
        true
      )
    })

    it('should return true if verse is front', () => {
      expect(isValidTSVRow({ Reference: '3:front', ID: 'z123' }, bookId)).toBe(
        true
      )
    })

    it('should return true for valid TSVRow objects', () => {
      const validTSVRow: TSVRow = {
        Reference: '1:1',
        ID: 'a123',
      }
      expect(isValidTSVRow(validTSVRow, bookId)).toBe(true)
    })

    it('should return true for TSVRow objects with multiple additional string fields', () => {
      const validRow: TSVRow = {
        Reference: '2:2',
        ID: 'b2c3',
        Field1: 'Text1',
        Field2: 'Text2',
        Field3: 'Text3',
      }
      expect(isValidTSVRow(validRow, bookId)).toBe(true)
    })

    it('should return false for reference range that does not exist within book', () => {
      const invalidRow: Partial<TSVRow> = {
        Reference: '45:1-70:99',
        ID: 'a123',
      }
      expect(isValidTSVRow(invalidRow, bookId)).toBe(false)
    })
  })

  describe('doesChapterVerseExistInTsvs', () => {
    const sampleScriptureTSV: ScriptureTSV = {
      '1': { '1': [{ Reference: '1:1', ID: 'a123' }] },
      '2': {
        '1': [{ Reference: '2:1', ID: 'b234' }],
        '2': [{ Reference: '2:2', ID: 'c345' }],
      },
      '3': {}, // Chapter with no verses
    }

    it('should return true for existing chapters and verses', () => {
      expect(doesChapterVerseExistInTsvs(sampleScriptureTSV, '1', '1')).toBe(
        true
      )
      expect(doesChapterVerseExistInTsvs(sampleScriptureTSV, '2', '2')).toBe(
        true
      )
    })

    it('should return false for non-existing chapters', () => {
      expect(doesChapterVerseExistInTsvs(sampleScriptureTSV, '4', '1')).toBe(
        false
      )
      expect(doesChapterVerseExistInTsvs(sampleScriptureTSV, '100', '1')).toBe(
        false
      )
    })

    it('should return false for non-existing verses in existing chapters', () => {
      expect(doesChapterVerseExistInTsvs(sampleScriptureTSV, '1', '2')).toBe(
        false
      )
      expect(doesChapterVerseExistInTsvs(sampleScriptureTSV, '2', '3')).toBe(
        false
      )
    })

    it('should return false for chapters with no verses', () => {
      expect(doesChapterVerseExistInTsvs(sampleScriptureTSV, '3', '1')).toBe(
        false
      )
    })
  })

  describe('doesItemIndexExistInTsvs', () => {
    const sampleScriptureTSV: ScriptureTSV = {
      '1': {
        '1': [
          { Reference: '1:1', ID: 'a123' },
          { Reference: '1:1', ID: 'b234' },
        ],
      },
      '2': { '1': [{ Reference: '2:1', ID: 'c345' }] },
    }

    it('should return true for valid item indices', () => {
      expect(doesItemIndexExistInTsvs(sampleScriptureTSV, '1', '1', 0)).toBe(
        true
      )
      expect(doesItemIndexExistInTsvs(sampleScriptureTSV, '1', '1', 1)).toBe(
        true
      )
    })

    it('should return false for invalid item indices', () => {
      expect(doesItemIndexExistInTsvs(sampleScriptureTSV, '1', '1', 2)).toBe(
        false
      )
      expect(doesItemIndexExistInTsvs(sampleScriptureTSV, '2', '1', 1)).toBe(
        false
      )
    })

    it('should return false for non-existing chapters or verses', () => {
      expect(doesItemIndexExistInTsvs(sampleScriptureTSV, '3', '1', 0)).toBe(
        false
      )
      expect(doesItemIndexExistInTsvs(sampleScriptureTSV, '1', '3', 0)).toBe(
        false
      )
    })
  })
})
