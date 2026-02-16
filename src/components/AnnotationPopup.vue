<template>
  <div
    class="va-popup"
    :style="popupStyle"
    @click.stop
  >
    <div class="va-popup__header">
      <span class="va-popup__element">{{ elementInfo.shortSelector }}</span>
      <button class="va-popup__close" @click="$emit('cancel')">×</button>
    </div>
    
    <div v-if="selectedText" class="va-popup__selected">
      "{{ selectedText }}"
    </div>
    
    <div class="va-popup__path">{{ elementInfo.selector }}</div>
    
    <div class="va-popup__styles-toggle" @click="showStyles = !showStyles">
      <span>{{ showStyles ? '▼' : '▶' }} Computed Styles</span>
    </div>
    
    <div v-if="showStyles" class="va-popup__styles">
      <pre>{{ elementInfo.computedStyles || 'No relevant styles' }}</pre>
    </div>
    
    <div class="va-popup__divider"></div>
    
    <textarea
      ref="input"
      v-model="comment"
      class="va-popup__input"
      placeholder="Describe the issue..."
      @keydown.enter.ctrl="handleAdd"
      @keydown.escape="$emit('cancel')"
    ></textarea>
    
    <div class="va-popup__actions">
      <button class="va-popup__btn va-popup__btn--cancel" @click="$emit('cancel')">
        Cancel
      </button>
      <button 
        class="va-popup__btn va-popup__btn--add" 
        :disabled="!comment.trim()"
        @click="handleAdd"
      >
        Add
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnnotationPopup',
  
  props: {
    elementInfo: {
      type: Object,
      default: () => ({})
    },
    selectedText: {
      type: String,
      default: null
    },
    position: {
      type: Object,
      default: () => ({ x: 0, y: 0 })
    }
  },
  
  data() {
    return {
      comment: '',
      showStyles: false
    }
  },
  
  computed: {
    popupStyle() {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      
      let x = this.position.x
      let y = this.position.y
      
      const popupWidth = 320
      const popupHeight = 250
      
      if (x + popupWidth > viewport.width - 20) {
        x = viewport.width - popupWidth - 20
      }
      if (x < 20) x = 20
      
      if (y + popupHeight > viewport.height - 20) {
        y = this.position.y - popupHeight - 20
      }
      if (y < 20) y = 20
      
      return {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        pointerEvents: 'auto'
      }
    }
  },
  
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.input) {
        this.$refs.input.focus()
      }
    })
  },
  
  methods: {
    handleAdd() {
      if (this.comment.trim()) {
        this.$emit('add', this.comment)
        this.comment = ''
      }
    }
  }
}
</script>

<style lang="scss">
.va-popup {
  width: 320px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 999994;
  overflow: hidden;
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
  }
  
  &__element {
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 13px;
    color: #4285f4;
    font-weight: 500;
  }
  
  &__close {
    background: none;
    border: none;
    font-size: 20px;
    color: #666;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    
    &:hover {
      color: #333;
    }
  }
  
  &__selected {
    padding: 8px 16px;
    background: #fff8e1;
    font-style: italic;
    color: #666;
    font-size: 13px;
  }
  
  &__path {
    padding: 8px 16px;
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 11px;
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  &__styles-toggle {
    padding: 8px 16px;
    font-size: 12px;
    color: #666;
    cursor: pointer;
    
    &:hover {
      background: #f5f5f5;
    }
  }
  
  &__styles {
    padding: 8px 16px;
    background: #fafafa;
    
    pre {
      margin: 0;
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 11px;
      color: #555;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
  
  &__divider {
    height: 1px;
    background: #e0e0e0;
    margin: 0 16px;
  }
  
  &__input {
    width: 100%;
    min-height: 80px;
    padding: 12px 16px;
    border: none;
    font-size: 14px;
    font-family: inherit;
    resize: none;
    
    &:focus {
      outline: none;
    }
    
    &::placeholder {
      color: #aaa;
    }
  }
  
  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 16px;
    background: #f9f9f9;
    border-top: 1px solid #e0e0e0;
  }
  
  &__btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    
    &--cancel {
      background: #f0f0f0;
      color: #666;
      
      &:hover {
        background: #e0e0e0;
      }
    }
    
    &--add {
      background: #4285f4;
      color: white;
      
      &:hover:not(:disabled) {
        background: #3367d6;
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}
</style>
