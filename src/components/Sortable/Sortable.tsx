import preventDefault from 'modules/preventDefault'
import React, { useCallback, useEffect, useRef, useState } from 'react'

interface Position {
  x: number
  y: number
}

export default function Sortable({
  childs,
  onChangeSort,
}: {
  childs: JSX.Element[]
  onChangeSort: (from: React.Key, to: React.Key) => void
}) {
  const [nodeApp] = useState(document.querySelector('#app'))
  const [pageX, setPageX] = useState<number>(0)
  const [pageY, setPageY] = useState<number>(0)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  const [isDraggable, setIsDraggable] = useState(false)
  const [draggingKey, setDraggingKey] = useState<null | React.Key>(null)
  const [underDraggingKey, setUnderDraggingKey] = useState<null | React.Key>(null)

  const [draggableChildLeftIndent, setDraggableChildLeftIndent] = useState<number | null>(null)
  const [draggableChildTopIndent, setDraggableChildTopIndent] = useState<number | null>(null)
  const [draggableChildWidth, setDraggableChildWidth] = useState<number>(0)

  const requestAnimateFrameID = useRef<number>()

  useEffect(() => {
    setWindowHeight(window.innerHeight)

    const onMouseMove = (event: MouseEvent) => {
      setPageX(event.pageX)
      setPageY(event.pageY)
    }

    const onTouchMove = (event: TouchEvent) => {
      setPageX(event.touches[0].pageX)
      setPageY(event.touches[0].pageY)
    }

    const onResize = () => {
      if (window.innerHeight != windowHeight) setWindowHeight(window.innerHeight)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.addEventListener('resize', onResize)
    }
  }, [])

  const requestAnimateFrameCallback = () => {
    if (nodeApp) {
      const scrollTop = nodeApp.scrollTop
      const diff = 15

      setPageY(pageY => {
        if (windowHeight - pageY < 100) {
          nodeApp.scroll(0, scrollTop + diff)
        }
        if (pageY < 100) {
          nodeApp.scroll(0, scrollTop - diff)
        }
        return pageY
      })
    }

    requestAnimateFrameID.current = window.requestAnimationFrame(requestAnimateFrameCallback)
  }

  const mouseDown = (key: React.Key | null, position: Position, childWidth: number) => {
    setDraggableChildLeftIndent(position.x)
    setDraggableChildTopIndent(position.y)
    setDraggableChildWidth(childWidth)

    setDraggingKey(key)
    setIsDraggable(true)

    requestAnimateFrameID.current = window.requestAnimationFrame(requestAnimateFrameCallback)

    const onMouseUp = () => {
      if (requestAnimateFrameID.current) window.cancelAnimationFrame(requestAnimateFrameID.current)

      setDraggableChildLeftIndent(null)
      setDraggableChildTopIndent(null)

      setDraggingKey(null)
      setIsDraggable(false)

      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchend', onMouseUp)
      window.removeEventListener('selectstart', preventDefault)
    }

    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchend', onMouseUp)
    window.addEventListener('selectstart', preventDefault)
  }

  const hoverKey = useCallback(
    (newUnderDraggingKey: React.Key) => {
      if (newUnderDraggingKey != underDraggingKey) {
        if (draggingKey) onChangeSort(draggingKey, newUnderDraggingKey)
        setUnderDraggingKey(newUnderDraggingKey)
      }
    },
    [underDraggingKey, draggingKey]
  )

  const draggableChild = childs.find(child => child.key == draggingKey)

  const draggableChildNode =
    draggableChild && typeof draggableChildLeftIndent == 'number' && typeof draggableChildTopIndent == 'number' ? (
      <div
        css={{
          position: 'fixed',
          left: 0,
          top: 0,
          pointerEvents: 'none',
          zIndex: 1000,
          width: draggableChildWidth,
          willChange: 'transform',
        }}
        style={{
          transform: `translate3d(${pageX - draggableChildLeftIndent}px, ${pageY - draggableChildTopIndent}px, 0px)`,
        }}
      >
        {draggableChild}
      </div>
    ) : null

  return (
    <>
      {childs.map(currentChild => (
        <SortableItem
          itemsIsDraggable={isDraggable}
          key={currentChild.key}
          onHoverKey={key => hoverKey(key)}
          onDown={(position, childWidth) => mouseDown(currentChild.key, position, childWidth)}
          children={currentChild}
        />
      ))}
      {draggableChildNode}
    </>
  )
}

function SortableItem({
  children,
  onHoverKey,
  onDown,
  itemsIsDraggable,
}: {
  onDown: (position: Position, childWidth: number) => void
  onHoverKey: (key: React.Key) => void
  children: JSX.Element
  itemsIsDraggable: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  const down = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    position: { pageX: number; pageY: number }
  ) => {
    if (ref.current) {
      // @ts-ignore
      const isSortable = !!event.target.getAttribute('data-is-sortable')
      if (!isSortable) {
        return
      }

      event.stopPropagation()

      const clientRect = ref.current.getBoundingClientRect()
      onDown({ x: position.pageX - clientRect.x, y: position.pageY - clientRect.y }, clientRect.width)
    }
  }

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      down(event, { pageX: event.pageX, pageY: event.pageY })
    }
  }

  const onTouchDown = (event: React.TouchEvent<HTMLDivElement>) => {
    if (ref.current) {
      down(event, { pageX: event.touches[0].pageX, pageY: event.touches[0].pageY })
    }
  }

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    let element = document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY)
    if (element) {
      const key = element.getAttribute('data-sortable-item-key')
      if (key) onHoverKey(key)
    }
  }
  const onMouseMove = () => {
    if (children.key) onHoverKey(children.key)
  }

  return (
    <div
      data-sortable-item-key={children.key}
      css={
        itemsIsDraggable
          ? {
              position: 'relative',
              ':after': {
                content: `""`,
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
              },
            }
          : {}
      }
      ref={ref}
      onTouchMove={onTouchMove}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchDown}
    >
      {children}
    </div>
  )
}

export function SortableDrag({ children }: { children: JSX.Element | string }) {
  return (
    <div
      css={{
        position: 'relative',
        touchAction: 'none',
        ':after': {
          content: `""`,
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
        },
      }}
      data-is-sortable
    >
      {children}
    </div>
  )
}
