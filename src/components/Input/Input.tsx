import { css } from '@emotion/react'
import React, { InputHTMLAttributes } from 'react'

const inputStyle = css({
  width: '100%',
  padding: '2px 8px',
  height: 24,
  borderRadius: 2,
  border: 'solid 1px #c1c1c1',
  position: 'relative',
  cursor: 'pointer',
  background: 'transparent',
  appearance: 'none',
  outline: 'none',
  ':focus': {
    border: 'solid 1px #767676',
  },
})

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input css={inputStyle} {...props} />
}
