import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Task from 'interfaces/Task'
import { arrayMoveImmutable } from 'modules/arrayMove'
import mockTasks from './mockTasks'

interface TasksState {
  tasks: Task[]
}

const initialState: TasksState = {
  tasks: mockTasks,
}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    createTask: (state, action: PayloadAction<string>) => {
      const newTask = { text: action.payload, id: Date.now(), done: false }
      state.tasks = [newTask, ...state.tasks]
    },
    removeTaskByID: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.id != action.payload)
    },
    changeDoneTaskByID: (state, action: PayloadAction<{ id: number; value: boolean }>) => {
      const { id, value } = action.payload
      state.tasks = state.tasks.map(task => {
        if (task.id == id) {
          return {
            ...task,
            done: value,
          }
        }
        return task
      })
    },
    changeTextTaskByID: (state, action: PayloadAction<{ id: number; text: string }>) => {
      const { id, text } = action.payload
      state.tasks = state.tasks.map(task => {
        if (task.id == id) {
          return {
            ...task,
            text,
          }
        }
        return task
      })
    },
    changeTasksSort: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload
      state.tasks = arrayMoveImmutable(state.tasks, fromIndex, toIndex)
    },
  },
})

export const { createTask, removeTaskByID, changeDoneTaskByID, changeTextTaskByID, changeTasksSort } = tasksSlice.actions

const tasksReducer = tasksSlice.reducer
export default tasksReducer
