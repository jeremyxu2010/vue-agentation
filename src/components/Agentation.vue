<template>
  <div 
    v-if="enabled" 
    class="vue-agentation-container"
    :style="{ '--marker-color': markerColor }"
  >
    <Highlighter
      :disabled="isPopupVisible"
      @element-click="handleElementClick"
    />
    
    <AnnotationMarker
      v-for="(annotation, index) in visibleAnnotations"
      :key="annotation.id"
      :annotation="annotation"
      :color="markerColor"
      :index="index + 1"
      @click="handleMarkerClick"
      @remove="handleMarkerRemove"
    />
    
    <AnnotationPopup
      v-if="isPopupVisible"
      :element-info="currentElementInfo"
      :selected-text="currentSelectedText"
      :position="popupPosition"
      @add="handleAddAnnotation"
      @cancel="handleCancelAnnotation"
    />
    
    <Toolbar
      :is-active="isActive"
      :is-paused="isPaused"
      :is-visible="markersVisible"
      :annotation-count="annotations.length"
      @toggle="toggleActive"
      @pause="togglePause"
      @visibility="toggleVisibility"
      @copy="handleCopy"
      @clear="handleClear"
      @settings="toggleSettings"
    />
    
    <SettingsPanel
      v-if="isSettingsVisible"
      :output-detail="outputDetail"
      :marker-color="markerColor"
      :clear-on-copy="clearOnCopy"
      @close="isSettingsVisible = false"
      @update="handleSettingsUpdate"
    />
  </div>
</template>

<script>
import { createAnnotationStore } from '../utils/annotationStore'
import { getElementInfo, getTextSelection, elementAtPoint } from '../utils/elementInfo'
import { generateOutput, copyToClipboard } from '../utils/outputFormatter'
import { pauseAnimations, resumeAnimations, toViewportPercent } from '../utils/domHelpers'
import { registerShortcuts, enableShortcuts, disableShortcuts } from '../utils/keyboardShortcuts'
import Toolbar from './Toolbar.vue'
import Highlighter from './Highlighter.vue'
import AnnotationMarker from './Marker.vue'
import AnnotationPopup from './AnnotationPopup.vue'
import SettingsPanel from './SettingsPanel.vue'

export default {
  name: 'Agentation',
  
  components: {
    Toolbar,
    Highlighter,
    AnnotationMarker,
    AnnotationPopup,
    SettingsPanel
  },
  
  props: {
    enabled: {
      type: Boolean,
      default: true
    },
    outputDetail: {
      type: String,
      default: 'standard',
      validator: v => ['compact', 'standard', 'detailed', 'forensic'].includes(v)
    },
    markerColor: {
      type: String,
      default: '#ff4444'
    },
    clearOnCopy: {
      type: Boolean,
      default: false
    },
    webhookUrl: {
      type: String,
      default: null
    }
  },
  
  data() {
    return {
      isActive: false,
      isPaused: false,
      markersVisible: true,
      isPopupVisible: false,
      isSettingsVisible: false,
      annotations: [],
      currentElementInfo: null,
      currentSelectedText: null,
      popupPosition: { x: 0, y: 0 },
      store: null,
      unregisterShortcuts: null
    }
  },
  
  computed: {
    visibleAnnotations() {
      if (!this.markersVisible) return []
      return this.annotations.filter(a => a.status !== 'dismissed')
    }
  },
  
  watch: {
    enabled(val) {
      if (val) {
        this.registerKeyboardShortcuts()
      } else {
        this.unregisterKeyboardShortcuts()
      }
    }
  },
  
  created() {
    this.store = createAnnotationStore()
    this.annotations = this.store.getAll()
    
    this.store.subscribe((anns) => {
      this.annotations = [...anns]
    })
  },
  
  mounted() {
    if (this.enabled) {
      this.registerKeyboardShortcuts()
    }
  },
  
  beforeDestroy() {
    this.unregisterKeyboardShortcuts()
  },
  
  methods: {
    registerKeyboardShortcuts() {
      this.unregisterShortcuts = registerShortcuts({
        toggle: this.toggleActive,
        escape: this.handleEscape,
        pause: this.togglePause,
        hide: this.toggleVisibility,
        copy: this.handleCopy,
        clear: this.handleClear
      })
    },
    
    unregisterKeyboardShortcuts() {
      if (this.unregisterShortcuts) {
        this.unregisterShortcuts()
        this.unregisterShortcuts = null
      }
    },
    
    toggleActive() {
      this.isActive = !this.isActive
      if (!this.isActive) {
        this.isPopupVisible = false
        this.currentElementInfo = null
      }
    },
    
    togglePause() {
      this.isPaused = !this.isPaused
      if (this.isPaused) {
        pauseAnimations()
      } else {
        resumeAnimations()
      }
    },
    
    toggleVisibility() {
      this.markersVisible = !this.markersVisible
    },
    
    toggleSettings() {
      this.isSettingsVisible = !this.isSettingsVisible
    },
    
    handleElementClick(event) {
      const textSelection = getTextSelection()
      
      if (textSelection) {
        this.currentSelectedText = textSelection.text
        this.popupPosition = { x: textSelection.x, y: textSelection.y }
        
        const element = elementAtPoint(textSelection.x, textSelection.y)
        if (element) {
          this.currentElementInfo = getElementInfo(element)
        }
      } else {
        this.currentSelectedText = null
        this.currentElementInfo = getElementInfo(event.element)
        this.popupPosition = { x: event.x, y: event.y }
      }
      
      this.isPopupVisible = true
    },
    
    handleAddAnnotation(comment) {
      if (!comment.trim() || !this.currentElementInfo) return
      
      const annotation = this.store.add({
        comment: comment.trim(),
        element: this.currentElementInfo.tagName,
        elementPath: this.currentElementInfo.selector,
        x: toViewportPercent(this.popupPosition.x),
        y: this.popupPosition.y,
        cssClasses: this.currentElementInfo.cssClasses,
        boundingBox: this.currentElementInfo.boundingBox,
        computedStyles: this.outputDetail === 'forensic' ? this.currentElementInfo.computedStyles : '',
        nearbyText: this.currentElementInfo.nearbyText,
        selectedText: this.currentSelectedText,
        isFixed: this.currentElementInfo.isFixed
      })
      
      this.$emit('annotation-created', annotation)
      
      this.isPopupVisible = false
      this.currentElementInfo = null
      this.currentSelectedText = null
    },
    
    handleCancelAnnotation() {
      this.isPopupVisible = false
      this.currentElementInfo = null
      this.currentSelectedText = null
    },
    
    handleMarkerClick(annotation) {
      this.$emit('annotation-click', annotation)
    },
    
    handleMarkerRemove(annotation) {
      this.store.remove(annotation.id)
      this.$emit('annotation-removed', annotation)
    },
    
    handleEscape() {
      if (this.isPopupVisible) {
        this.handleCancelAnnotation()
      } else if (this.isSettingsVisible) {
        this.isSettingsVisible = false
      } else if (this.isActive) {
        this.isActive = false
      }
    },
    
    async handleCopy() {
      if (this.annotations.length === 0) return
      
      const output = generateOutput(this.annotations, 'markdown', this.outputDetail)
      const success = await copyToClipboard(output)
      
      if (success) {
        this.$emit('copied', output)
        
        if (this.clearOnCopy) {
          this.store.clear()
        }
      }
    },
    
    handleClear() {
      this.store.clear()
      this.$emit('cleared')
    },
    
    handleSettingsUpdate(settings) {
      this.$emit('settings-update', settings)
    },
    
    getAnnotations() {
      return this.store.getAll()
    },
    
    clearAnnotations() {
      this.store.clear()
    }
  }
}
</script>

<style lang="scss">
.vue-agentation-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999990;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  color: #333;
  
  * {
    box-sizing: border-box;
  }
  
  button {
    font-family: inherit;
  }
  
  input, textarea, select {
    font-family: inherit;
  }
}
</style>
