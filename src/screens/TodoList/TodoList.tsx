import Button from 'components/Button/Button'
import Input from 'components/Input/Input'
import Sortable from 'components/Sortable/Sortable'
import TaskCard from 'components/TaskCard/TaskCard'
import Task from 'interfaces/Task'
import { arrayMoveImmutable } from 'modules/arrayMove'
import React, { useCallback, useState } from 'react'
import { todoHeadLeftStyle, todoHeadRightStyle, todoHeadStyle, todoStyle } from './styles'

let mockTasks = [
  {
    text: 'do something',
    id: Date.now(),
    done: false,
  },
  {
    text: 'wash dishes',
    id: Date.now() + 1,
    done: true,
  },
  {
    text: 'watch series',
    id: Date.now() + 2,
    done: false,
  },
  {
    text: 'read book',
    id: Date.now() + 3,
    done: false,
  },
  {
    text: 'walk',
    id: Date.now() + 4,
    done: false,
  },
  {
    text: 'pool',
    id: Date.now() + 5,
    done: false,
  },
  {
    text: 'gun shot',
    id: Date.now() + 6,
    done: false,
  },
]

export default function TodoList() {
  const [task, setTask] = useState('cook cookies')
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [activeTab, setActiveTab] = useState<'all' | 'done' | 'notDone'>('all')

  const changeNewTextTask = useCallback((text: string) => setTask(text), [])

  const createNewTask = useCallback(() => {
    if (task) {
      const newTask = { text: task, id: Date.now(), done: false }
      setTasks([newTask, ...tasks])
      setTask('')
    }
  }, [task, tasks])

  const inputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key == 'Enter') {
        createNewTask()
      }
    },
    [task, tasks]
  )

  const removeTaskByID = useCallback(
    (id: number) => {
      setTasks(tasks.filter(task => task.id != id))
    },
    [tasks]
  )

  const changeDoneTaskByID = useCallback(
    (id: number, value: boolean) => {
      setTasks(
        tasks.map(task => {
          if (task.id == id) {
            return {
              ...task,
              done: value,
            }
          }
          return task
        })
      )
    },
    [tasks]
  )

  const changeTaskByID = useCallback(
    (id: number, value: string) => {
      setTasks(tasks => {
        return tasks.map(task => {
          if (task.id == id) {
            return {
              ...task,
              text: value,
            }
          }
          return task
        })
      })
    },
    [tasks]
  )

  const changeSort = useCallback(
    (from: React.Key, to: React.Key) => {
      const fromIndex = tasks.findIndex(task => task.id == from)
      const toIndex = tasks.findIndex(task => task.id == to)
      if (fromIndex > -1 && toIndex > -1) {
        setTasks(arrayMoveImmutable(tasks, fromIndex, toIndex))
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
            value={task}
            onChange={event => changeNewTextTask(event.target.value)}
          />
        </div>
        <div css={todoHeadRightStyle}>
          <Button fullWidth={true} onClick={() => createNewTask()}>
            create
          </Button>
        </div>
      </div>

      <div
        css={{
          marginBottom: 8,
        }}
      >
        <Button css={{ marginRight: 8 }} onClick={() => setActiveTab('all')} activeTab={activeTab == 'all'}>
          All
        </Button>
        <Button css={{ marginRight: 8 }} onClick={() => setActiveTab('notDone')} activeTab={activeTab == 'notDone'}>
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
                onRemove={() => removeTaskByID(task.id)}
                onChangeDone={value => changeDoneTaskByID(task.id, value)}
                task={task}
                onChangeTitle={title => changeTaskByID(task.id, title)}
              />
            )
          })}
      />
    </div>
  )
}
