const STORAGE_KEY = 'vue-agentation-annotations'
const EXPIRY_DAYS = 7

function isLocalStorageAvailable() {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

function generateId() {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 11)
  return 'ann_' + timestamp + randomPart
}

function filterExpiredAnnotations(data) {
  const now = Date.now()
  const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000
  return data.filter(item => now - item.timestamp < expiryMs)
}

function loadFromStorage() {
  if (!isLocalStorageAvailable()) return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const data = JSON.parse(stored)
    const valid = filterExpiredAnnotations(data)
    
    if (valid.length !== data.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(valid))
    }
    
    return valid
  } catch {
    return []
  }
}

function saveToStorage(annotations) {
  if (!isLocalStorageAvailable()) return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations))
  } catch (e) {
    console.warn('vue-agentation: Could not save annotations', e)
  }
}

export function createAnnotationStore() {
  // Initialize from localStorage once
  let annotations = loadFromStorage()
  const listeners = new Set()
  
  function notify() {
    listeners.forEach(fn => fn([...annotations]))
  }
  
  return {
    getAll: () => [...annotations],
    
    getByUrl: (url) => annotations.filter(a => a.url === url),
    
    add: (options) => {
      const annotation = {
        id: generateId(),
        timestamp: Date.now(),
        url: window.location.href,
        status: 'pending',
        ...options
      }
      
      // Add to in-memory array
      annotations = [...annotations, annotation]
      
      // Persist to localStorage
      saveToStorage(annotations)
      
      notify()
      return annotation
    },
    
    update: (id, updates) => {
      const index = annotations.findIndex(a => a.id === id)
      
      if (index !== -1) {
        annotations = [
          ...annotations.slice(0, index),
          { ...annotations[index], ...updates },
          ...annotations.slice(index + 1)
        ]
        
        saveToStorage(annotations)
        notify()
        return annotations[index]
      }
      return null
    },
    
    remove: (id) => {
      annotations = annotations.filter(a => a.id !== id)
      saveToStorage(annotations)
      notify()
    },
    
    clear: (url = null) => {
      if (url) {
        annotations = annotations.filter(a => a.url !== url)
      } else {
        annotations = []
      }
      saveToStorage(annotations)
      notify()
    },
    
    subscribe: (fn) => {
      listeners.add(fn)
      fn([...annotations])
      return () => listeners.delete(fn)
    }
  }
}
