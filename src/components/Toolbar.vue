<template>
  <div
    class="va-toolbar"
    :style="toolbarStyle"
    @mousedown="startDrag"
  >
    <div class="va-toolbar__title">Agentation</div>
    
    <div class="va-toolbar__buttons">
      <button
        class="va-toolbar__btn"
        :class="{ 'va-toolbar__btn--active': isActive }"
        @click.stop="$emit('toggle')"
        title="Toggle annotation mode (Cmd+Shift+F)"
      >
        {{ isActive ? '●' : '○' }}
      </button>
      
      <button
        class="va-toolbar__btn"
        :class="{ 'va-toolbar__btn--active': isPaused }"
        @click.stop="$emit('pause')"
        title="Pause animations (P)"
      >
        {{ isPaused ? '▶' : '⏸' }}
      </button>
      
      <button
        class="va-toolbar__btn"
        :class="{ 'va-toolbar__btn--active': !isVisible }"
        @click.stop="$emit('visibility')"
        title="Toggle markers (H)"
      >
        {{ isVisible ? '👁' : '👁‍🗨' }}
      </button>
      
      <span class="va-toolbar__count" v-if="annotationCount > 0">{{ annotationCount }}</span>
      
      <button
        class="va-toolbar__btn"
        :disabled="annotationCount === 0"
        @click.stop="$emit('copy')"
        title="Copy annotations (C)"
      >
        📋
      </button>
      
      <button
        class="va-toolbar__btn"
        :disabled="annotationCount === 0"
        @click.stop="confirmClear"
        title="Clear annotations (X)"
      >
        🗑
      </button>
      
      <button
        class="va-toolbar__btn"
        @click.stop="$emit('settings')"
        title="Settings"
      >
        ⚙️
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toolbar',
  
  props: {
    isActive: Boolean,
    isPaused: Boolean,
    isVisible: Boolean,
    annotationCount: {
      type: Number,
      default: 0
    }
  },
  
  data() {
    return {
      position: { x: 20, y: 20 },
      isDragging: false,
      dragStart: { x: 0, y: 0 }
    }
  },
  
  computed: {
    toolbarStyle() {
      return {
        right: `${this.position.x}px`,
        bottom: `${this.position.y}px`,
        pointerEvents: 'auto'
      }
    }
  },
  
  mounted() {
    document.addEventListener('mousemove', this.onDrag)
    document.addEventListener('mouseup', this.stopDrag)
  },
  
  beforeDestroy() {
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDrag)
  },
  
  methods: {
    startDrag(event) {
      if (event.target.tagName === 'BUTTON') return
      
      this.isDragging = true
      this.dragStart = {
        x: event.clientX - this.position.x,
        y: event.clientY - this.position.y
      }
    },
    
    onDrag(event) {
      if (!this.isDragging) return
      
      const newX = this.dragStart.x - event.clientX
      const newY = this.dragStart.y - event.clientY
      
      const maxX = window.innerWidth - 200
      const maxY = window.innerHeight - 60
      
      this.position = {
        x: Math.max(20, Math.min(maxX, newX)),
        y: Math.max(20, Math.min(maxY, newY))
      }
    },
    
    stopDrag() {
      this.isDragging = false
    },
    
    confirmClear() {
      if (confirm('Clear all annotations?')) {
        this.$emit('clear')
      }
    }
  }
}
</script>

<style lang="scss">
.va-toolbar {
  position: fixed;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 999995;
  user-select: none;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
  
  &__title {
    font-size: 12px;
    font-weight: 600;
    color: #333;
    padding-right: 8px;
    border-right: 1px solid #e0e0e0;
  }
  
  &__buttons {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: #f5f5f5;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.15s ease;
    
    &:hover:not(:disabled) {
      background: #e0e0e0;
    }
    
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    
    &--active {
      background: #4285f4;
      color: white;
      
      &:hover:not(:disabled) {
        background: #3367d6;
      }
    }
  }
  
  &__count {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    padding: 0 6px;
    background: #ff4444;
    color: white;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }
}
</style>
