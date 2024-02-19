import { describe, it, expect } from 'vitest'
import { tsvStringToJson } from './tsvFileConversions'

describe('tsvStringToJson', () => {
  it('converts a valid TSV string to JSON', () => {
    const tsv = `Name\tAge\tCity\nJohn Doe\t30\tNew York\nJane Doe\t25\tLos Angeles`
    const expectedResult = [
      { Name: 'John Doe', Age: '30', City: 'New York' },
      { Name: 'Jane Doe', Age: '25', City: 'Los Angeles' },
    ]
    expect(tsvStringToJson(tsv)).toEqual(expectedResult)
  })

  it('correctly handles quotes and commas in values', () => {
    const tsv = `Name\tQuote\nJohn Doe\t"Life, Universe, and Everything"`
    const expectedResult = [
      { Name: 'John Doe', Quote: '"Life, Universe, and Everything"' },
    ]
    expect(tsvStringToJson(tsv)).toEqual(expectedResult)
  })

  it('handles a TSV string that ends with a newline character', () => {
    const tsv = `Name\tAge\tCity\nJohn Doe\t30\tNew York\n`
    const expectedResult = [{ Name: 'John Doe', Age: '30', City: 'New York' }]
    expect(tsvStringToJson(tsv)).toEqual(expectedResult)
  })

  it('returns an empty array if the TSV string contains only headers', () => {
    const tsv = `Name\tAge\tCity`
    const expectedResult = []
    expect(tsvStringToJson(tsv)).toEqual(expectedResult)
  })

  it('returns an empty array for an empty string', () => {
    const tsv = ''
    const expectedResult = []
    expect(tsvStringToJson(tsv)).toEqual(expectedResult)
  })

  it('handles missing values by assigning an empty string', () => {
    const tsv = `Name\tAge\tCity\nJohn Doe\t\tNew York`
    const expectedResult = [{ Name: 'John Doe', Age: '', City: 'New York' }]
    expect(tsvStringToJson(tsv)).toEqual(expectedResult)
  })
})
