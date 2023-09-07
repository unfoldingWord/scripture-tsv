### Delete Row Example

<!-- TODO: Add more documentation, especially to hooks and core functions -->
<!-- TODO: Display original TSVs, new TSVs, and new file content to user -->

This is an example of how to use the UI elements, hooks, and utility functions
of the `scripture-tsv` library to add a TSV element to an existing TSVs object

#### _UI_

- **DeleteRowButton**
- **DeleteRowDialog**

#### _Hooks_

- **useTsvData**

#### _Core Functions_

- **tsvsObjectToFileString**

```jsx
import { useState } from 'react'
import useTsvData from '../../core/hooks/useTsvData'
import DeleteRowButton from './components/DeleteRowButton'
import DeleteRowDialog from './components/DeleteRowDialog'
import { titusTsvs } from '../../assets/titusTsvs'

const chapter = 1
const verse = 1
const itemIndex = 0

const Example = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { getTsvRow, onTsvDelete } = useTsvData({
    tsvs: titusTsvs,
    chapter,
    verse,
    itemIndex,
  })

  const onDeleteButtonClick = () => setIsDeleteDialogOpen(true)

  const closeDeleteDialog = () => setIsDeleteDialogOpen(false)

  const confirmDelete = () => {
    onTsvDelete(itemIndex)
    setIsDeleteDialogOpen(false)
  }

  return (
    <div>
      <DeleteRowButton onClick={onDeleteButtonClick} />
      <DeleteRowDialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onSubmit={confirmDelete}
        currentRow={getTsvRow(itemIndex)}
      />
    </div>
  )
}

Example()
```
