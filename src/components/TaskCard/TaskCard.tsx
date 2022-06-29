import Button from 'components/Button/Button'
import { SortableDrag } from 'components/Sortable/Sortable'
import Textarea from 'components/Textarea/Textarea'
import Task from 'interfaces/Task'
import React from 'react'

const rightSideWidthAtTaskCard = 100

export default function TaskCard({
  task,
  onChangeTitle,
  onChangeDone,
  onRemove,
}: {
  task: Task
  onChangeTitle: (title: string) => void
  onChangeDone: (value: boolean) => void
  onRemove: () => void
}) {
  return (
    <div
      css={{
        display: 'flex',
        marginBottom: 8,
        padding: 8,
        borderRadius: 2,
        border: 'solid 1px #c1c1c1',
      }}
    >
      <div
        css={{
          width: `calc(100% - ${rightSideWidthAtTaskCard}px)`,
          paddingRight: 10,
        }}
      >
        <Textarea placeholder="type a task" value={task.text} onChange={value => onChangeTitle(value)} />
      </div>

      <div
        css={{
          width: rightSideWidthAtTaskCard,
        }}
      >
        <Button css={{ marginBottom: 4 }} fullWidth={true} onClick={() => onChangeDone(!task.done)}>
          {task.done ? 'done' : 'not done'}
        </Button>
        <Button css={{ marginBottom: 4 }} fullWidth={true} onClick={() => onRemove()}>
          remove
        </Button>
        <SortableDrag>
          <Button fullWidth={true}>drag</Button>
        </SortableDrag>
      </div>
    </div>
  )
}
