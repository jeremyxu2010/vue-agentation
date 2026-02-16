<template>
  <div class="va-settings" @click.stop>
    <div class="va-settings__backdrop" @click="$emit('close')"></div>
    
    <div class="va-settings__panel">
      <div class="va-settings__header">
        <span>Settings</span>
        <button class="va-settings__close" @click="$emit('close')">×</button>
      </div>
      
      <div class="va-settings__content">
        <div class="va-settings__row">
          <label class="va-settings__label">Output Detail</label>
          <select v-model="localSettings.outputDetail" class="va-settings__select">
            <option value="compact">Compact</option>
            <option value="standard">Standard</option>
            <option value="detailed">Detailed</option>
            <option value="forensic">Forensic</option>
          </select>
        </div>
        
        <div class="va-settings__row">
          <label class="va-settings__label">Marker Color</label>
          <input
            v-model="localSettings.markerColor"
            type="color"
            class="va-settings__color"
          />
        </div>
        
        <div class="va-settings__row">
          <label class="va-settings__label">
            <input v-model="localSettings.clearOnCopy" type="checkbox" />
            Clear on copy
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsPanel',
  
  props: {
    outputDetail: {
      type: String,
      default: 'standard'
    },
    markerColor: {
      type: String,
      default: '#ff4444'
    },
    clearOnCopy: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      localSettings: {
        outputDetail: this.outputDetail,
        markerColor: this.markerColor,
        clearOnCopy: this.clearOnCopy
      }
    }
  },
  
  watch: {
    localSettings: {
      deep: true,
      handler(val) {
        this.$emit('update', { ...val })
      }
    }
  }
}
</script>

<style lang="scss">
.va-settings {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999996;
  pointer-events: auto;
  
  &__backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
  }
  
  &__panel {
    position: absolute;
    right: 20px;
    bottom: 80px;
    width: 280px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
    font-weight: 600;
  }
  
  &__close {
    background: none;
    border: none;
    font-size: 20px;
    color: #666;
    cursor: pointer;
    
    &:hover {
      color: #333;
    }
  }
  
  &__content {
    padding: 16px;
  }
  
  &__row {
    margin-bottom: 16px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  &__label {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    color: #555;
    
    input[type="checkbox"] {
      margin-right: 8px;
    }
  }
  
  &__select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 14px;
    background: white;
    
    &:focus {
      outline: none;
      border-color: #4285f4;
    }
  }
  
  &__color {
    width: 60px;
    height: 36px;
    padding: 2px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: #4285f4;
    }
  }
}
</style>
