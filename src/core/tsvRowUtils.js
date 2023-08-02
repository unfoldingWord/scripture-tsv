const calculateRowsLengthIndex = allItems => {
  let rowsIndex = {}
  let lengthIndex = {}

  allItems.forEach(item => {
    Object.entries(item).forEach(([column, value]) => {
      if (!rowsIndex[column]) {
        rowsIndex[column] = {}
      }

      if (!rowsIndex[column][value]) {
        rowsIndex[column][value] = 0
      }
      rowsIndex[column][value]++
      const valueLength = value.length

      if (!lengthIndex[column]) {
        lengthIndex[column] = {}
      }

      if (!lengthIndex[column][valueLength]) {
        lengthIndex[column][valueLength] = 0
      }
      lengthIndex[column][valueLength]++
    })
  })

  return { rowsIndex, lengthIndex }
}

export const tsvsObjectToRows = tsvs => {
  if (!tsvs) return []
  let rows = []
  Object.entries(tsvs).forEach(([chapterNum, verses]) => {
    Object.entries(verses).forEach(([verseNum, items]) => {
      rows = [...rows, ...items]
    })
  })
  return rows
}

export const rowGenerate = (tsvs, chapter, verse) => {
  if (!tsvs || !Object.keys(tsvs).length) return {}
  const allItems = tsvsObjectToRows(tsvs)
  const { rowsIndex, lengthIndex } = calculateRowsLengthIndex(allItems)
  const rowData = allItems[0]
  const newRow = {}

  Object.entries(rowData).forEach(([column, value]) => {
    if (column === 'Reference') {
      newRow[column] = `${chapter}:${verse}`
      return
    }
    const values = Object.keys(rowsIndex[column]).length
    const valuesRatio = values / allItems.length
    const duplicateValue = valuesRatio < 0.65 // If the value is reused many times then it should be duplicated.

    const valuesLengths = Object.keys(lengthIndex[column])
    const needRandomId = valuesRatio > 0.99 && valuesLengths.length <= 2

    let newValue = ''
    if (duplicateValue) {
      newValue = value
    } else if (needRandomId) {
      const allIds = Object.keys(rowsIndex[column])
      newValue = generateRandomUID(allIds)
    }
    newRow[column] = newValue
  })

  return { ...newRow }
}

export const generateRandomUID = (allIds = [], defaultLength = 4) => {
  let sampleID = allIds[0]
  let length = sampleID?.length || defaultLength
  let notUnique = true
  let counter = 0
  let newID = ''
  const UNIQUE_COUNTER_THRESHOLD = 1000

  while (notUnique && counter < UNIQUE_COUNTER_THRESHOLD) {
    newID = randomId({ length })
    notUnique = allIds.includes(newID)
    counter++
  }

  if (counter >= UNIQUE_COUNTER_THRESHOLD) {
    console.log(
      'Duplicate IDs found after ' + UNIQUE_COUNTER_THRESHOLD + ' tries'
    )
  }
  return newID
}

// ids must begin with a letter
const randomId = ({ length }) => {
  // get the initial letter first
  const letters = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ]
  const random = Math.floor(Math.random() * letters.length)
  const number = Math.random() // 0.9394456857981651

  // number.toString(36); // '0.xtis06h6'
  if (length > 9) {
    length = 9
  }

  const id = letters[random] + number.toString(36).substr(2, length - 1) // 'xtis06h6'
  return id
}

export const getColumnsFilterOptions = ({ columnNames, allItems }) => {
  const columnsFilterOptions = {}

  allItems.forEach(item => {
    columnNames.forEach(columnName => {
      const value = item[columnName]
      if (value) {
        if (!columnsFilterOptions[columnName]) {
          columnsFilterOptions[columnName] = new Set()
        }

        if (!columnsFilterOptions[columnName].has(value)) {
          columnsFilterOptions[columnName].add(value)
        }
      }
    })
  })

  columnNames.forEach(columnName => {
    if (columnsFilterOptions[columnName]) {
      columnsFilterOptions[columnName] = [
        ...columnsFilterOptions[columnName],
      ].sort(sortSKU) // sort chapters and verses
    }
  })

  return columnsFilterOptions
}

function sortSKU(a, b) {
  var aParts = a.split(':'),
    bParts = b.split(':'),
    partCount = aParts.length,
    i

  if (aParts.length !== bParts.length) {
    return aParts.length - bParts.length
  }

  for (i = 0; i < partCount; i++) {
    if (aParts[i] !== bParts[i]) {
      return +aParts[i] - +bParts[i]
    }
  }
  //Exactly the same
  return 0
}
