import React, { useCallback, useEffect, useRef } from 'react'

export default function Textarea(
  props: { onChange: (value: string) => void } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const changeHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [])

  useEffect(() => {
    changeHeight()
  }, [])

  const change = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange(event.target.value)
    changeHeight()
  }, [])

  return (
    <textarea
      rows={1}
      css={{
        width: '100%',
        appearance: 'none',
        border: 'none',
        resize: 'none',
        cursor: 'pointer',
        outline: 'none',
        background: 'transparent',
      }}
      ref={textareaRef}
      {...props}
      onChange={change}
    />
  )
}
