<template>
  <div
    class="va-highlighter"
    :class="{ 'va-highlighter--active': !disabled }"
    :disabled="disabled"
    @mousemove="handleMouseMove"
  ></div>
</template>

<script>
import { getElementInfo, elementAtPoint } from '../utils/elementInfo'

export default {
  name: 'Highlighter',
  
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      highlightedElement: null,
      highlightEl: null,
      lastMouseMoveTime: 0,
      mouseMoveThrottle: 50 // ms
    }
  },

  watch: {
    disabled(newVal) {
      if (newVal) {
        this.removeClickListener()
      } else {
        this.addClickListener()
      }
    }
  },
  
  created() {
    if (!this.disabled) {
      this.addClickListener()
    }
  },
  
  mounted() {
    this.createHighlightElement()
  },
  
  beforeDestroy() {
    if (this.highlightEl && this.highlightEl.parentNode) {
      this.highlightEl.parentNode.removeChild(this.highlightEl)
    }
    this.removeClickListener()
  },
  
  methods: {
    createHighlightElement() {
      this.highlightEl = document.createElement('div')
      this.highlightEl.className = 'va-highlight-overlay'
      this.highlightEl.style.cssText = `
        position: fixed;
        background: rgba(66, 133, 244, 0.2);
        border: 2px solid rgba(66, 133, 244, 0.8);
        border-radius: 4px;
        pointer-events: none;
        z-index: 999991;
        transition: all 0.1s ease;
        display: none;
      `
      document.body.appendChild(this.highlightEl)
    },
    
    handleMouseMove(event) {
      // Throttle mousemove events
      const now = Date.now()
      if (now - this.lastMouseMoveTime < this.mouseMoveThrottle) {
        return
      }
      this.lastMouseMoveTime = now
      
      if (this.disabled) {
        this.hideHighlight()
        return
      }
      
      const element = elementAtPoint(event.clientX, event.clientY)
      
      if (element && this.isAgentationElement(element)) {
        this.hideHighlight()
        return
      }
      
      if (element && element !== this.highlightedElement) {
        this.highlightedElement = element
        this.showHighlight(element)
        this.updateTooltip(element, event)
      }
    },
    
    handleClick(event) {
      if (this.disabled) return
      
      const element = elementAtPoint(event.clientX, event.clientY)
      
      if (element && !this.isAgentationElement(element)) {
        this.$emit('element-click', {
          element,
          x: event.clientX,
          y: event.clientY
        })
      }
    },
    
    addClickListener() {
      document.addEventListener('click', this.handleClick, true)
    },
    
    removeClickListener() {
      document.removeEventListener('click', this.handleClick, true)
    },
    
    isAgentationElement(element) {
      let current = element
      while (current) {
        if (current.classList && (
          current.classList.contains('vue-agentation-container') ||
          current.classList.contains('va-highlighter') ||
          current.classList.contains('va-toolbar') ||
          current.classList.contains('va-marker') ||
          current.classList.contains('va-popup') ||
          current.classList.contains('va-settings')
        )) {
          return true
        }
        current = current.parentElement
      }
      return false
    },
    
    showHighlight(element) {
      if (!this.highlightEl || !element) return
      
      const rect = element.getBoundingClientRect()
      this.highlightEl.style.display = 'block'
      this.highlightEl.style.left = `${rect.left}px`
      this.highlightEl.style.top = `${rect.top}px`
      this.highlightEl.style.width = `${rect.width}px`
      this.highlightEl.style.height = `${rect.height}px`
    },
    
    hideHighlight() {
      if (this.highlightEl) {
        this.highlightEl.style.display = 'none'
      }
      this.highlightedElement = null
    },
    
    updateTooltip(element, event) {
      const info = getElementInfo(element)
      
      if (info) {
        this.highlightEl.title = `${info.shortSelector}`
      }
    }
  }
}
</script>

<style lang="scss">
.va-highlighter {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  
  &--active {
    pointer-events: none;
  }
}
</style>
