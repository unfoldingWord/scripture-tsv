type TsvObject = {
  [key: string]: string
}

export const tsvStringToJson: (tsv: string) => TsvObject[] = tsv => {
  if (!tsv) return []

  const lines = tsv.trim().split('\n')
  const [headerLine, ...dataLines] = lines
  const headers = headerLine.split('\t')

  return dataLines.map(line => {
    const values = line.split('\t')
    return headers.reduce(
      (obj, header, index) => ({
        ...obj,
        [header]: values[index] ?? '',
      }),
      {}
    )
  })
}
