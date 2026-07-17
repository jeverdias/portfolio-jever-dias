import { useEffect, useRef } from 'react'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useModalA11y({ active = true, containerRef, initialFocusRef, onClose }) {
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!active) return undefined
    previousFocusRef.current = document.activeElement
    document.body.classList.add('modal-open')
    const focusTimer = window.setTimeout(() => {
      const target = initialFocusRef?.current || containerRef.current?.querySelector(focusableSelector)
      target?.focus()
    }, 0)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = [...(containerRef.current?.querySelectorAll(focusableSelector) || [])]
        .filter((element) => !element.hasAttribute('hidden') && element.offsetParent !== null)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus?.()
    }
  }, [active, containerRef, initialFocusRef, onClose])
}
