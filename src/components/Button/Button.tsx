import { css } from '@emotion/react'
import React from 'react'

const buttonStyle = css({
  borderRadius: 2,
  border: 'solid 1px #767676',
  padding: '2px 4px',
  height: 24,
  cursor: 'pointer',
  ':active': {
    background: 'white',
  },
})

export default function Button(
  props: { fullWidth?: boolean; activeTab?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      css={[buttonStyle, { width: props.fullWidth ? '100%' : 'auto', backgroundColor: props.activeTab ? 'white' : '#efefef' }]}
    >
      {props.children}
    </button>
  )
}
