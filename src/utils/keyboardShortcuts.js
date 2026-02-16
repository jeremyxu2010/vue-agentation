let shortcutsEnabled = true
let registeredShortcuts = new Map()

const defaultShortcuts = {
  toggle: { key: 'f', modifiers: ['metaKey', 'shiftKey'] },
  escape: { key: 'Escape' },
  pause: { key: 'p' },
  hide: { key: 'h' },
  copy: { key: 'c' },
  clear: { key: 'x' }
}

function matchesShortcut(event, shortcut) {
  if (!shortcut) return false
  
  const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
  
  if (!shortcut.modifiers || shortcut.modifiers.length === 0) {
    return keyMatch && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
  }
  
  const modifiersMatch = shortcut.modifiers.every(mod => event[mod])
  const noExtraModifiers = !event.altKey || shortcut.modifiers.includes('altKey')
  
  return keyMatch && modifiersMatch && noExtraModifiers
}

function isInputElement(element) {
  if (!element) return false
  const tag = element.tagName.toLowerCase()
  const isEditable = element.isContentEditable
  const isInput = tag === 'input' || tag === 'textarea' || tag === 'select'
  return isInput || isEditable
}

function handleKeydown(event, callbacks) {
  if (!shortcutsEnabled) return
  
  if (isInputElement(document.activeElement)) return
  
  for (const [action, shortcut] of Object.entries(defaultShortcuts)) {
    if (matchesShortcut(event, shortcut)) {
      const callback = callbacks[action]
      if (callback) {
        event.preventDefault()
        callback(event)
      }
      break
    }
  }
}

export function enableShortcuts() {
  shortcutsEnabled = true
}

export function disableShortcuts() {
  shortcutsEnabled = false
}

export function registerShortcuts(callbacks) {
  const handler = (e) => handleKeydown(e, callbacks)
  document.addEventListener('keydown', handler)
  
  registeredShortcuts.set('main', handler)
  
  return () => {
    document.removeEventListener('keydown', handler)
    registeredShortcuts.delete('main')
  }
}

export function unregisterShortcuts() {
  registeredShortcuts.forEach((handler, key) => {
    document.removeEventListener('keydown', handler)
  })
  registeredShortcuts.clear()
}

export { defaultShortcuts }
