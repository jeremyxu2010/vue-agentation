const STORAGE_KEY = 'vue-agentation-annotations'
const EXPIRY_DAYS = 7

function generateId() {
  return 'ann_' + Math.random().toString(36).substring(2, 11)
}

function getStoredAnnotations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const data = JSON.parse(stored)
    const now = Date.now()
    const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000
    
    const valid = data.filter(item => now - item.timestamp < expiryMs)
    
    if (valid.length !== data.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(valid))
    }
    
    return valid
  } catch {
    return []
  }
}

function saveAnnotations(annotations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations))
  } catch (e) {
    console.warn('vue-agentation: Could not save annotations', e)
  }
}

export function createAnnotation(options) {
  const annotation = {
    id: generateId(),
    timestamp: Date.now(),
    url: window.location.href,
    status: 'pending',
    ...options
  }
  
  const annotations = getStoredAnnotations()
  annotations.push(annotation)
  saveAnnotations(annotations)
  
  return annotation
}

export function getAnnotations(url = null) {
  const annotations = getStoredAnnotations()
  if (url) {
    return annotations.filter(a => a.url === url)
  }
  return annotations
}

export function updateAnnotation(id, updates) {
  const annotations = getStoredAnnotations()
  const index = annotations.findIndex(a => a.id === id)
  
  if (index !== -1) {
    annotations[index] = { ...annotations[index], ...updates }
    saveAnnotations(annotations)
    return annotations[index]
  }
  return null
}

export function deleteAnnotation(id) {
  const annotations = getStoredAnnotations()
  const filtered = annotations.filter(a => a.id !== id)
  saveAnnotations(filtered)
  return filtered
}

export function clearAnnotations(url = null) {
  if (url) {
    const annotations = getStoredAnnotations().filter(a => a.url !== url)
    saveAnnotations(annotations)
    return annotations
  }
  saveAnnotations([])
  return []
}

export function resolveAnnotation(id, resolvedBy = 'human') {
  return updateAnnotation(id, {
    status: 'resolved',
    resolvedAt: new Date().toISOString(),
    resolvedBy
  })
}

export function createAnnotationStore() {
  let annotations = getStoredAnnotations()
  const listeners = new Set()
  
  function notify() {
    listeners.forEach(fn => fn(annotations))
  }
  
  return {
    getAll: () => [...annotations],
    
    getByUrl: (url) => annotations.filter(a => a.url === url),
    
    add: (options) => {
      const annotation = createAnnotation(options)
      annotations = getStoredAnnotations()
      notify()
      return annotation
    },
    
    update: (id, updates) => {
      const updated = updateAnnotation(id, updates)
      if (updated) {
        annotations = getStoredAnnotations()
        notify()
      }
      return updated
    },
    
    remove: (id) => {
      deleteAnnotation(id)
      annotations = getStoredAnnotations()
      notify()
    },
    
    clear: (url = null) => {
      clearAnnotations(url)
      annotations = getStoredAnnotations()
      notify()
    },
    
    subscribe: (fn) => {
      listeners.add(fn)
      fn(annotations)
      return () => listeners.delete(fn)
    }
  }
}
