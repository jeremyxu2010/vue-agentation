const OUTPUT_FORMATS = {
  compact: {
    includeClasses: false,
    includePath: false,
    includePosition: false,
    includeStyles: false,
    includeNearbyText: false,
    includeIntent: false
  },
  standard: {
    includeClasses: true,
    includePath: true,
    includePosition: false,
    includeStyles: false,
    includeNearbyText: false,
    includeIntent: false
  },
  detailed: {
    includeClasses: true,
    includePath: true,
    includePosition: true,
    includeStyles: false,
    includeNearbyText: true,
    includeIntent: true
  },
  forensic: {
    includeClasses: true,
    includePath: true,
    includePosition: true,
    includeStyles: true,
    includeNearbyText: true,
    includeIntent: true
  }
}

function escapeMarkdown(text) {
  if (!text) return ''
  return text.replace(/([*_`[\]\\])/g, '\\$1')
}

export function formatAnnotationMarkdown(annotation, format = 'standard') {
  const config = OUTPUT_FORMATS[format] || OUTPUT_FORMATS.standard
  const lines = []
  
  lines.push(`## Annotation #${annotation.id.slice(-3)}`)
  lines.push('')
  
  const elementStr = annotation.cssClasses && config.includeClasses
    ? `${annotation.element}.${annotation.cssClasses.split(' ')[0]}`
    : annotation.element
  lines.push(`**Element:** ${escapeMarkdown(elementStr)}`)
  
  if (config.includePath && annotation.elementPath) {
    lines.push(`**Path:** ${escapeMarkdown(annotation.elementPath)}`)
  }
  
  if (config.includeClasses && annotation.cssClasses) {
    lines.push(`**Classes:** ${escapeMarkdown(annotation.cssClasses)}`)
  }
  
  if (config.includePosition && annotation.boundingBox) {
    const bb = annotation.boundingBox
    lines.push(`**Position:** ${bb.x}px, ${bb.y}px (${bb.width}×${bb.height}px)`)
  }
  
  if (config.includeNearbyText && annotation.nearbyText) {
    lines.push(`**Nearby text:** ${escapeMarkdown(annotation.nearbyText)}`)
  }
  
  if (annotation.selectedText) {
    lines.push(`**Selected text:** "${escapeMarkdown(annotation.selectedText)}"`)
  }
  
  if (config.includeStyles && annotation.computedStyles) {
    lines.push('')
    lines.push('**Computed Styles:**')
    lines.push('```css')
    lines.push(annotation.computedStyles)
    lines.push('```')
  }
  
  lines.push('')
  lines.push(`**Feedback:** ${escapeMarkdown(annotation.comment)}`)
  
  if (config.includeIntent && annotation.intent) {
    lines.push(`**Intent:** ${annotation.intent}`)
  }
  
  if (config.includeIntent && annotation.severity) {
    lines.push(`**Severity:** ${annotation.severity}`)
  }
  
  return lines.join('\n')
}

export function formatAllAnnotationsMarkdown(annotations, format = 'standard') {
  if (!annotations || annotations.length === 0) {
    return 'No annotations.'
  }
  
  const parts = annotations.map(a => formatAnnotationMarkdown(a, format))
  return parts.join('\n\n---\n\n')
}

export function annotationToJSON(annotation) {
  return JSON.stringify(annotation, null, 2)
}

export function annotationsToJSON(annotations) {
  return JSON.stringify(annotations, null, 2)
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      return true
    } catch {
      return false
    } finally {
      document.body.removeChild(textarea)
    }
  }
}

export function generateOutput(annotations, format = 'markdown', detail = 'standard') {
  if (format === 'json') {
    return annotationsToJSON(annotations)
  }
  return formatAllAnnotationsMarkdown(annotations, detail)
}
