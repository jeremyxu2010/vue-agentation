<template>
  <div
    class="va-marker"
    :style="markerStyle"
    @click.stop="handleClick"
    @contextmenu.prevent.stop="handleRightClick"
  >
    <span class="va-marker__badge" :style="badgeStyle">
      {{ index }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'AnnotationMarker',
  
  props: {
    annotation: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      default: '#ff4444'
    },
    index: {
      type: Number,
      default: 1
    }
  },
  
  computed: {
    markerStyle() {
      const x = this.annotation.x
      const y = this.annotation.y
      const isFixed = this.annotation.isFixed
      
      if (isFixed) {
        return {
          position: 'fixed',
          left: `${x}%`,
          top: `${y}px`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'auto'
        }
      }
      
      return {
        position: 'absolute',
        left: `${x}%`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'auto'
      }
    },
    
    badgeStyle() {
      return {
        backgroundColor: this.color,
        color: this.getContrastColor(this.color)
      }
    }
  },
  
  methods: {
    handleClick() {
      this.$emit('click', this.annotation)
    },
    
    handleRightClick() {
      if (confirm('Remove this annotation?')) {
        this.$emit('remove', this.annotation)
      }
    },
    
    getContrastColor(hexcolor) {
      if (!hexcolor) return '#ffffff'
      
      const hex = hexcolor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
      
      return yiq >= 128 ? '#000000' : '#ffffff'
    }
  }
}
</script>

<style lang="scss">
.va-marker {
  z-index: 999993;
  
  &__badge {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    padding: 0 6px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: transform 0.15s ease;
    
    &:hover {
      transform: scale(1.2);
    }
  }
}
</style>
