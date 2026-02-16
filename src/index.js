/**
 * Vue-Agentation - UI Annotation Tool for AI Coding Agents
 * 
 * A Vue 2.0 component that enables users to annotate UI elements on any webpage.
 * Designed for providing visual feedback to AI coding agents.
 * 
 * @version 1.0.0
 * @author Vue-Agentation Team
 * @license MIT
 */

// Import main component and styles
import Agentation from './components/Agentation.vue'
import './styles/agentation.scss'

/**
 * Vue Plugin Installer
 * 
 * @param {Vue} Vue - Vue constructor
 * @param {Object} options - Plugin configuration options
 * @param {string} [options.outputDetail='standard'] - Output detail level: 'compact', 'standard', 'detailed', 'forensic'
 * @param {string} [options.markerColor='#ff4444'] - Color of annotation markers
 * @param {boolean} [options.clearOnCopy=false] - Clear annotations after copying to clipboard
 * @param {boolean} [options.blockInteractions=false] - Block user interactions while annotating
 * @param {string|null} [options.webhookUrl=null] - Webhook URL for sending annotations
 * @param {boolean} [options.autoSend=false] - Automatically send annotations to webhook
 * @param {boolean} [options.enabled=true] - Enable/disable the annotation tool
 */
const VueAgentation = {
  /**
   * Install the plugin to Vue
   * @param {Vue} Vue - Vue constructor
   * @param {Object} options - Installation options
   */
  install(Vue, options = {}) {
    // Default configuration values
    const defaults = {
      outputDetail: 'standard',
      markerColor: '#ff4444',
      clearOnCopy: false,
      blockInteractions: false,
      webhookUrl: null,
      autoSend: false,
      enabled: true
    }
    
    // Merge user options with defaults
    const settings = { ...defaults, ...options }
    
    // Expose settings via Vue prototype for global access
    Vue.prototype.$agentation = {
      settings,
      /**
       * Update plugin settings at runtime
       * @param {Object} newSettings - Settings to update
       */
      updateSettings(newSettings) {
        Object.assign(settings, newSettings)
      }
    }
    
    // Register the main component globally
    Vue.component('Agentation', Agentation)
  }
}

// Auto-install if Vue is already present (UMD build)
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueAgentation)
}

// Export component for direct import
VueAgentation.Agentation = Agentation

export default VueAgentation
