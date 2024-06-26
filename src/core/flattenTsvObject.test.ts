import flattenTsvObject from './flattenTsvObject'
import type { ScriptureTSV, TSVRow } from '../types/TsvTypes'

// Fixtures
import tsvsObject from '../assets/tsvsObject.json'
import tsvsObjectWithVerseSpan from '../assets/tsvsObjectWithVerseSpan.json'

describe('flattenTsvObject', () => {
  let result: TSVRow[]
  let resultWithVerseSpans: TSVRow[]

  beforeAll(() => {
    result = flattenTsvObject(tsvsObject as ScriptureTSV)
    resultWithVerseSpans = flattenTsvObject(
      tsvsObjectWithVerseSpan as ScriptureTSV
    )
  })

  it('Front reference should go at the very top of the array', () => {
    expect(result[0].Reference).toBe('front:intro')
    expect(resultWithVerseSpans[0].Reference).toBe('front:intro')
  })

  it('The first item at the biginning of each chapter should have intro as a verse reference', () => {
    // find returns the first value that matches the condition thus will make sure the first chapter value will be returned, which should include intro.
    const chapter1VerseValue = result.find(
      ({ Reference }) => Reference.split(':')[0] == '1'
    )
    const chapter2VerseValue = result.find(
      ({ Reference }) => Reference.split(':')[0] == '2'
    )
    const chapter3VerseValue = result.find(
      ({ Reference }) => Reference.split(':')[0] == '3'
    )
    expect(chapter1VerseValue).toBeDefined()
    expect(chapter1VerseValue?.Reference).toBe('1:intro')

    expect(chapter2VerseValue).toBeDefined()
    expect(chapter2VerseValue?.Reference).toBe('2:intro')

    expect(chapter3VerseValue).toBeDefined()
    expect(chapter3VerseValue?.Reference).toBe('3:intro')
  })

  it('Verse spans are sorted correctly', () => {
    const verseSpanIndex = resultWithVerseSpans.findIndex(
      ({ Reference }) => Reference == '1:1-2'
    )

    // 1:1 should go before 1:1-2
    expect(resultWithVerseSpans[verseSpanIndex - 1].Reference).toBe('1:1')
    // 1:2 should go after 1:1-2
    expect(resultWithVerseSpans[verseSpanIndex + 1].Reference).toBe('1:2')
  })
})
