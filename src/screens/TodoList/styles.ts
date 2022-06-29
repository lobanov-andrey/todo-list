import { css } from '@emotion/react'

export const todoStyle = css({
  maxWidth: 500,
  margin: '0 auto',
  padding: 15,
})

export const todoHeadStyle = css({
  marginBottom: 15,
  display: 'flex',
})

export const rightSideWidthAtHeadTodo = 100

export const todoHeadLeftStyle = css({
  width: `calc(100% - ${rightSideWidthAtHeadTodo}px)`,
  paddingRight: 4,
})

export const todoHeadRightStyle = css({
  width: rightSideWidthAtHeadTodo,
})
