import { css, Global } from '@emotion/react'
import NotFound from 'components/NotFound/NotFound'
import normalize from 'modules/normalize'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import store from 'redux/store'
import TodoList from 'screens/TodoList/TodoList'

export default function App() {
  return (
    <Provider store={store}>
      <Global
        styles={css`
          ${normalize}
          html,
          body {
            min-height: 100%;
            font-family: Helvetica, Arial, sans-serif;
          }
          #app {
            background: #fffdf9;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
          }
          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
          }
        `}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
