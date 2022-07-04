import Button from 'components/Button/Button'
import Input from 'components/Input/Input'
import Sortable from 'components/Sortable/Sortable'
import TaskCard from 'components/TaskCard/TaskCard'
import React, { useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import {
  changeDoneTaskByID,
  changeTasksSort,
  changeTextTaskByID,
  createTask,
  removeTaskByID,
} from 'redux/reducers/tasksReducer'
import { todoFilterStyle, todoHeadLeftStyle, todoHeadRightStyle, todoHeadStyle, todoStyle } from './styles'

export default function TodoList() {
  const [newTextTask, setNewTextTask] = useState('cook cookies')
  const [activeTab, setActiveTab] = useState<'all' | 'done' | 'notDone'>('all')

  const dispatch = useAppDispatch()
  const tasks = useAppSelector(state => state.tasksState.tasks)

  const createTaskAndClear = useCallback(() => {
    if (newTextTask) {
      dispatch(createTask(newTextTask))
      setNewTextTask('')
    }
  }, [newTextTask])

  const inputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key == 'Enter') {
        createTaskAndClear()
      }
    },
    [newTextTask]
  )

  const changeSort = useCallback(
    (from: React.Key, to: React.Key) => {
      const fromIndex = tasks.findIndex(task => task.id == from)
      const toIndex = tasks.findIndex(task => task.id == to)
      if (fromIndex > -1 && toIndex > -1) {
        dispatch(changeTasksSort({ fromIndex, toIndex }))
      }
    },
    [tasks]
  )

  return (
    <div css={todoStyle}>
      <div css={todoHeadStyle}>
        <div css={todoHeadLeftStyle}>
          <Input
            placeholder="write a new task"
            onKeyDown={inputKeyDown}
            value={newTextTask}
            onChange={event => setNewTextTask(event.target.value)}
          />
        </div>
        <div css={todoHeadRightStyle}>
          <Button fullWidth={true} onClick={() => createTaskAndClear()}>
            create
          </Button>
        </div>
      </div>

      <div css={todoFilterStyle}>
        <Button onClick={() => setActiveTab('all')} activeTab={activeTab == 'all'}>
          All
        </Button>
        <Button onClick={() => setActiveTab('notDone')} activeTab={activeTab == 'notDone'}>
          Not done
        </Button>
        <Button onClick={() => setActiveTab('done')} activeTab={activeTab == 'done'}>
          Done
        </Button>
      </div>

      <Sortable
        onChangeSort={changeSort}
        childs={tasks
          .filter(task => (activeTab == 'all' ? true : activeTab == 'done' ? task.done : !task.done))
          .map(function (task) {
            return (
              <TaskCard
                key={task.id}
                onRemove={() => dispatch(removeTaskByID(task.id))}
                onChangeDone={value => dispatch(changeDoneTaskByID({ id: task.id, value }))}
                task={task}
                onChangeText={text => dispatch(changeTextTaskByID({ id: task.id, text }))}
              />
            )
          })}
      />
    </div>
  )
}
