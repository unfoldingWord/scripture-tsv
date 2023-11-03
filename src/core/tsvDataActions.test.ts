import {
  addTsvRow,
  deleteTsvRow,
  updateTsvRow,
  moveTsvRow,
  arrayMove,
  removeReferenceRangeDuplicates,
  tsvsObjectToFileString,
} from './tsvDataActions'
import { ScriptureTSV, TSVRow } from './TsvTypes'

// Sample data
const tsvs: ScriptureTSV = {
  1: {
    1: [
      { Reference: '1:1', ID: 'df78', Text: 'In the beginning' },
      { Reference: '1:1', ID: 'df8g', Text: 'Different' },
    ],
    2: [{ Reference: '1:2', ID: 'cvb8', Text: 'God created' }],
  },
}

const newItem: TSVRow = {
  Reference: '1:1',
  ID: 'rtet',
  Text: 'idk',
}

describe('TSV Operations', () => {
  test('addTsvRow adds a new TSV item', () => {
    const result = addTsvRow(tsvs, newItem, 1, 1, 1)
    expect(result[1][1][2]).toEqual(newItem)
  })

  test('deleteTsvRow deletes a TSV item', () => {
    const result = deleteTsvRow(tsvs, 1, 1, 0)
    expect(result[1][1]).toHaveLength(1)
  })

  test('updateTsvRow updates a TSV item', () => {
    const result = updateTsvRow(tsvs, newItem, 1, 1, 0)
    expect(result[1][1][0]).toEqual(newItem)
  })

  test('moveTsvRow moves a TSV item', () => {
    const result = moveTsvRow(tsvs, 1, 1, 0, 1)
    expect(result[1][1][1]).toEqual(tsvs[1][1][0])
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

  test('tsvsToFileString converts tsvsObject object to file string', () => {
    const result = tsvsObjectToFileString(tsvs)
    const expected = `Reference ID    Text
    1:1       df78    In the beginning
    1:1       df8g    Different
    1:2       cvb8    God created`
    const WHITESPACE = /\s+/g
    expect(result.replace(WHITESPACE, '')).toEqual(
      expected.replace(WHITESPACE, '')
    )
  })
})
