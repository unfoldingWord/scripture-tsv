import { describe, it, expect } from 'vitest'
import {
  tsvStringToFlatArray,
  tsvFlatArrayToScriptureTSV,
} from './tsvFileConversions'
import type { ScriptureTSV, TSVRow } from './TsvTypes'

describe('tsvStringToFlatArray', () => {
  it('converts a valid TSV string to JSON', () => {
    const tsv = `Name\tAge\tCity\nJohn Doe\t30\tNew York\nJane Doe\t25\tLos Angeles`
    const expectedResult = [
      { Name: 'John Doe', Age: '30', City: 'New York' },
      { Name: 'Jane Doe', Age: '25', City: 'Los Angeles' },
    ]
    expect(tsvStringToFlatArray(tsv)).toEqual(expectedResult)
  })

  it('correctly handles quotes and commas in values', () => {
    const tsv = `Name\tQuote\nJohn Doe\t"Life, Universe, and Everything"`
    const expectedResult = [
      { Name: 'John Doe', Quote: '"Life, Universe, and Everything"' },
    ]
    expect(tsvStringToFlatArray(tsv)).toEqual(expectedResult)
  })

  it('handles a TSV string that ends with a newline character', () => {
    const tsv = `Name\tAge\tCity\nJohn Doe\t30\tNew York\n`
    const expectedResult = [{ Name: 'John Doe', Age: '30', City: 'New York' }]
    expect(tsvStringToFlatArray(tsv)).toEqual(expectedResult)
  })

  it('returns an empty array if the TSV string contains only headers', () => {
    const tsv = `Name\tAge\tCity`
    const expectedResult = []
    expect(tsvStringToFlatArray(tsv)).toEqual(expectedResult)
  })

  it('returns an empty array for an empty string', () => {
    const tsv = ''
    const expectedResult = []
    expect(tsvStringToFlatArray(tsv)).toEqual(expectedResult)
  })

  it('handles missing values by assigning an empty string', () => {
    const tsv = `Name\tAge\tCity\nJohn Doe\t\tNew York`
    const expectedResult = [{ Name: 'John Doe', Age: '', City: 'New York' }]
    expect(tsvStringToFlatArray(tsv)).toEqual(expectedResult)
  })
})

describe('tsvFlatArrayToScriptureTSV', () => {
  it('should return an empty object for an empty array input', () => {
    const result = tsvFlatArrayToScriptureTSV([])
    expect(result).toEqual({})
  })

  it('should process a single TSVRow item without a reference range', () => {
    const mockTsvRows: TSVRow[] = [{ Reference: '1:1', ID: 'a123' }]
    const result = tsvFlatArrayToScriptureTSV(mockTsvRows)
    const expected: ScriptureTSV = {
      '1': { '1': [{ Reference: '1:1', ID: 'a123' }] },
    }
    expect(result).toEqual(expected)
  })

  it('should handle multiple TSVRow items, including a range of verses', () => {
    const mockTsvRows: TSVRow[] = [{ Reference: '1:1-2', ID: 'd234' }]
    const result = tsvFlatArrayToScriptureTSV(mockTsvRows)
    const expected: ScriptureTSV = {
      '1': {
        '1': [{ Reference: '1:1-2', ID: 'd234' }],
        '2': [{ Reference: '1:1-2', ID: 'd234' }],
      },
    }
    expect(result).toEqual(expected)
  })

  it('should correctly process items spanning multiple chapters', () => {
    const mockTsvRows: TSVRow[] = [
      { Reference: '1:1-2', ID: 'f001' },
      { Reference: '2:1-2', ID: 'g002' },
    ]
    const result = tsvFlatArrayToScriptureTSV(mockTsvRows)
    const expected: ScriptureTSV = {
      '1': {
        '1': [{ Reference: '1:1-2', ID: 'f001' }],
        '2': [{ Reference: '1:1-2', ID: 'f001' }],
      },
      '2': {
        '1': [{ Reference: '2:1-2', ID: 'g002' }],
        '2': [{ Reference: '2:1-2', ID: 'g002' }],
      },
    }
    expect(result).toEqual(expected)
  })

  it('should handle items with overlapping verse ranges', () => {
    const mockTsvRows: TSVRow[] = [
      { Reference: '1:1-3', ID: 'd003' },
      { Reference: '1:2-4', ID: 'e004' },
    ]
    const result = tsvFlatArrayToScriptureTSV(mockTsvRows)
    expect(result['1']['1']).toHaveLength(1) // Only the first item
    expect(result['1']['2']).toHaveLength(2) // Both items overlap here
    expect(result['1']['3']).toHaveLength(2) // Both items overlap here
    expect(result['1']['4']).toHaveLength(1) // Only the second item
  })

  it('should correctly process complex reference patterns', () => {
    // Mock `parseReferenceToList` to return a complex reference pattern for testing
    // Assume parseReferenceToList is properly mocked to return a complex pattern
    const mockTsvRows: TSVRow[] = [{ Reference: '1:1-1:3,2:1-2:2', ID: '006' }]
    const result = tsvFlatArrayToScriptureTSV(mockTsvRows)
    // Expected output depends on how `parseReferenceToList` interprets the complex pattern
    // This is a placeholder assuming a specific interpretation
    const expected: ScriptureTSV = {
      '1': {
        '1': [{ Reference: '1:1-1:3,2:1-2:2', ID: '006' }],
        '2': [{ Reference: '1:1-1:3,2:1-2:2', ID: '006' }],
        '3': [{ Reference: '1:1-1:3,2:1-2:2', ID: '006' }],
      },
      '2': {
        '1': [{ Reference: '1:1-1:3,2:1-2:2', ID: '006' }],
        '2': [{ Reference: '1:1-1:3,2:1-2:2', ID: '006' }],
      },
    }
    expect(result).toEqual(expected)
  })
})
