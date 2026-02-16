const IGNORED_TAGS = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'HEAD', 'META', 'LINK', 'BR', 'HR']
const IGNORED_CLASSES = []

export function generateSelector(element) {
  if (!element || element === document.body) {
    return 'body'
  }
  
  if (element.id) {
    return `#${CSS.escape(element.id)}`
  }
  
  const parts = []
  let current = element
  
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()
    
    if (current.className && typeof current.className === 'string') {
      const classes = current.className
        .split(' ')
        .filter(c => c && !IGNORED_CLASSES.includes(c))
        .slice(0, 2)
        .map(c => '.' + CSS.escape(c))
        .join('')
      if (classes) selector += classes
    }
    
    const siblings = current.parentElement 
      ? Array.from(current.parentElement.children).filter(el => el.tagName === current.tagName)
      : []
    
    if (siblings.length > 1) {
      const index = siblings.indexOf(current) + 1
      selector += `:nth-of-type(${index})`
    }
    
    parts.unshift(selector)
    current = current.parentElement
  }
  
  return 'body > ' + parts.join(' > ')
}

export function getShortSelector(element) {
  if (!element || element === document.body) return 'body'
  
  const tag = element.tagName.toLowerCase()
  let selector = tag
  
  if (element.id) {
    return `${tag}#${element.id}`
  }
  
  if (element.className && typeof element.className === 'string') {
    const firstClass = element.className.split(' ').filter(c => c)[0]
    if (firstClass) {
      selector += '.' + CSS.escape(firstClass)
    }
  }
  
  return selector
}

export function getComputedStyles(element) {
  if (!element) return ''
  
  const computed = window.getComputedStyle(element)
  const relevantProps = [
    'display', 'position', 'width', 'height', 'padding', 'margin',
    'font-size', 'font-weight', 'line-height', 'color', 'background-color',
    'border', 'border-radius', 'box-shadow', 'opacity', 'z-index',
    'flex-direction', 'justify-content', 'align-items', 'gap',
    'grid-template-columns', 'grid-template-rows', 'text-align',
    'overflow', 'transform', 'transition'
  ]
  
  const styles = relevantProps
    .filter(prop => {
      const value = computed.getPropertyValue(prop)
      return value && value !== 'none' && value !== 'normal' && value !== 'auto'
    })
    .map(prop => `${prop}: ${computed.getPropertyValue(prop)};`)
    .join('\n')
  
  return styles
}

export function getBoundingBox(element) {
  if (!element) return null
  
  const rect = element.getBoundingClientRect()
  const scrollX = window.scrollX || document.documentElement.scrollLeft
  const scrollY = window.scrollY || document.documentElement.scrollTop
  
  return {
    x: Math.round(rect.left + scrollX),
    y: Math.round(rect.top + scrollY),
    width: Math.round(rect.width),
    height: Math.round(rect.height)
  }
}

export function getNearbyText(element, maxLength = 100) {
  if (!element) return ''
  
  const text = element.innerText || element.textContent || ''
  const cleaned = text.replace(/\s+/g, ' ').trim()
  
  if (cleaned.length <= maxLength) return cleaned
  return cleaned.substring(0, maxLength - 3) + '...'
}

export function isFixedPosition(element) {
  if (!element) return false
  
  let current = element
  while (current && current !== document.body) {
    const position = window.getComputedStyle(current).position
    if (position === 'fixed' || position === 'sticky') {
      return true
    }
    current = current.parentElement
  }
  return false
}

export function getElementInfo(element) {
  if (!element) return null
  
  return {
    tagName: element.tagName.toLowerCase(),
    selector: generateSelector(element),
    shortSelector: getShortSelector(element),
    cssClasses: element.className && typeof element.className === 'string' 
      ? element.className.trim() 
      : '',
    boundingBox: getBoundingBox(element),
    computedStyles: getComputedStyles(element),
    nearbyText: getNearbyText(element),
    isFixed: isFixedPosition(element),
    inputType: element.type || null,
    isButton: ['BUTTON', 'A'].includes(element.tagName) || 
              element.type === 'button' || 
              element.type === 'submit'
  }
}

export function elementAtPoint(x, y) {
  let element = document.elementFromPoint(x, y)
  
  if (element && (element.tagName === 'IFRAME' || element.tagName === 'OBJECT')) {
    return null
  }
  
  return element
}

export function getTextSelection() {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed) return null
  
  const text = selection.toString().trim()
  if (!text) return null
  
  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()
  
  return {
    text,
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }
}
