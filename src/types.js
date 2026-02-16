/**
 * @typedef {'compact' | 'standard' | 'detailed' | 'forensic'} OutputDetail
 * @typedef {'fix' | 'change' | 'question' | 'approve'} Intent
 * @typedef {'blocking' | 'important' | 'suggestion'} Severity
 * @typedef {'pending' | 'acknowledged' | 'resolved' | 'dismissed'} Status
 * @typedef {'element' | 'text' | 'multi-select' | 'area'} AnnotationMode
 */

/**
 * @typedef {Object} BoundingBox
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} Annotation
 * @property {string} id - Unique identifier
 * @property {string} comment - User feedback
 * @property {string} elementPath - CSS selector path
 * @property {number} timestamp - Unix timestamp in ms
 * @property {number} x - % of viewport width (0-100)
 * @property {number} y - px from document top
 * @property {string} element - Tag name
 * @property {string} [url] - Page URL
 * @property {BoundingBox} [boundingBox]
 * @property {string} [cssClasses]
 * @property {string} [computedStyles]
 * @property {string} [nearbyText]
 * @property {string} [selectedText]
 * @property {boolean} [isFixed]
 * @property {boolean} [isMultiSelect]
 * @property {string} [fullPath]
 * @property {Intent} [intent]
 * @property {Severity} [severity]
 * @property {Status} [status]
 */

/**
 * @typedef {Object} AgentationOptions
 * @property {OutputDetail} [outputDetail='standard']
 * @property {string} [markerColor='#ff4444']
 * @property {boolean} [clearOnCopy=false]
 * @property {boolean} [blockInteractions=false]
 * @property {string} [webhookUrl]
 * @property {boolean} [autoSend=false]
 * @property {boolean} [enabled=true]
 */

export default {}
