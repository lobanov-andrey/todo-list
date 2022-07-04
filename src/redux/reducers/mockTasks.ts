import Task from 'interfaces/Task'

const mockTasks: Task[] = [
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

export default mockTasks
