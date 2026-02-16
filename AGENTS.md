# AGENTS.md - Vue-Agentation Development Guide

## Project Overview

Vue-Agentation is a Vue 2.0 UI annotation tool for AI coding agents. It enables users to visually annotate UI elements and generate output for AI feedback.

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build UMD and ESM bundles with minified version |
| `npm run dev` | Watch mode for development |

## Testing

**No test framework is currently configured.** To add testing:

```bash
# Install Vitest (recommended for Vue 2)
npm install -D vitest @vue/test-utils jsdom

# Add to package.json scripts
"test": "vitest run",
"test:watch": "vitest"
```

## Code Style Guidelines

### File Naming

- **Vue Components**: PascalCase (e.g., `Agentation.vue`, `AnnotationMarker.vue`)
- **Utilities**: camelCase (e.g., `annotationStore.js`, `elementInfo.js`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `STORAGE_KEY`, `IGNORED_TAGS`)

### Vue Component Structure

```vue
<template>
  <!-- Template content -->
</template>

<script>
export default {
  name: 'ComponentName',  // PascalCase, required
  
  components: { /* ... */ },
  
  props: {
    propName: {
      type: String,
      default: 'default',
      validator: v => ['option1', 'option2'].includes(v)
    }
  },
  
  data() {
    return {
      // Return fresh objects, not mutating props
    }
  },
  
  computed: {
    // Pure functions, no side effects
  },
  
  watch: {
    // Watchers for side effects
  },
  
  created() {
    // Initialization, not DOM access
  },
  
  mounted() {
    // DOM access, event listeners
  },
  
  beforeDestroy() {
    // Cleanup, remove listeners
  },
  
  methods: {
    // Use arrow functions sparingly, prefer regular functions
    handleEvent() { /* ... */ }
  }
}
</script>

<style lang="scss">
/* Component-scoped styles */
</style>
```

### JavaScript/ES6+ Conventions

- **Imports**: Grouped by type (external, internal components, utils)
- **Constants**: Defined at module top level
- **Functions**: Use arrow functions for callbacks, regular functions for methods
- **Objects**: Prefer spread operator over mutate, use object shorthand
- **Strings**: Use template literals for concatenation
- **Error Handling**: Always use try/catch, log warnings appropriately

```javascript
// Good
import Agentation from './components/Agentation.vue'
import { createAnnotationStore } from '../utils/annotationStore'

const STORAGE_KEY = 'vue-agentation-annotations'

function getStoredAnnotations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch {
    return []
  }
}

// Avoid
function badExample() {
  try { /* ... */ } catch (e) { /* silent */ }
}
```

### CSS/SCSS Conventions

- **Class Naming**: BEM with `__` for modifiers
- **Prefix**: Use `va-` (Vue Agentation) prefix for component classes
- **Nesting**: Nest within parent selector, max 3 levels deep
- **Variables**: Use CSS custom properties for theming

```scss
.va-marker {
  z-index: 999993;
  
  &__badge {
    display: flex;
    align-items: center;
    
    &:hover {
      transform: scale(1.2);
    }
  }
}
```

### Vue Template Conventions

- **Props**: kebab-case in templates, camelCase in script
- **Events**: Emit with kebab-case (parent listens to `annotation-created`)
- **v-for**: Always use `:key` with unique identifier
- **v-if/v-else**: Prefer v-show for frequent toggles

```vue
<Agentation
  :enabled="isEnabled"
  marker-color="#ff4444"
  @annotation-created="handleCreated"
/>
```

### JSDoc Type Definitions

Use JSDoc for public APIs and complex objects:

```javascript
/**
 * @typedef {'compact' | 'standard' | 'detailed' | 'forensic'} OutputDetail
 */

/**
 * @typedef {Object} Annotation
 * @property {string} id - Unique identifier
 * @property {string} comment - User feedback
 * @property {number} timestamp - Unix timestamp in ms
 */
```

### Props Validation

Always validate props with type and validator:

```javascript
props: {
  outputDetail: {
    type: String,
    default: 'standard',
    validator: v => ['compact', 'standard', 'detailed', 'forensic'].includes(v)
  },
  enabled: {
    type: Boolean,
    default: true
  }
}
```

### Event Emission

Emit events for parent communication:

```javascript
this.$emit('annotation-created', annotation)
this.$emit('annotation-removed', annotation)
this.$emit('settings-update', settings)
```

### Error Handling

- Use `console.warn` for recoverable errors
- Use try/catch for async operations and localStorage
- Never leave empty catch blocks
- Return sensible defaults on error

```javascript
function saveAnnotations(annotations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations))
  } catch (e) {
    console.warn('vue-agentation: Could not save annotations', e)
  }
}
```

## Project Structure

```
src/
├── index.js              # Plugin entry point
├── types.js              # JSDoc type definitions
├── components/
│   ├── Agentation.vue    # Main component
│   ├── Marker.vue        # Annotation marker
│   ├── Highlighter.vue   # Element highlighter
│   ├── AnnotationPopup.vue
│   ├── Toolbar.vue
│   └── SettingsPanel.vue
├── utils/
│   ├── annotationStore.js   # State management
│   ├── elementInfo.js       # DOM utilities
│   ├── outputFormatter.js   # Output generation
│   ├── keyboardShortcuts.js # Keyboard handling
│   └── domHelpers.js
└── styles/
    └── agentation.scss
```

## Common Patterns

### Store Pattern (Vue 2)

The annotation store uses a simple pub/sub pattern:

```javascript
export function createAnnotationStore() {
  let annotations = getStoredAnnotations()
  const listeners = new Set()
  
  function notify() {
    listeners.forEach(fn => fn(annotations))
  }
  
  return {
    getAll: () => [...annotations],
    add: (options) => { /* ... */ },
    subscribe: (fn) => {
      listeners.add(fn)
      fn(annotations)
      return () => listeners.delete(fn)
    }
  }
}
```

### Vue 2 Lifecycle

- `created`: Initialize data, subscribe to stores
- `mounted`: DOM manipulation, event listeners
- `beforeDestroy`: Cleanup (unregister listeners, clear timers)

### Selector Generation

Use CSS.escape for safe selector generation:

```javascript
if (element.id) {
  return `#${CSS.escape(element.id)}`
}
```

## Rollup Configuration

The build uses Rollup with:
- `@rollup/plugin-node-resolve` - Resolve node_modules
- `@rollup/plugin-commonjs` - Convert CommonJS
- `rollup-plugin-vue` - Vue 2 SFCs
- `rollup-plugin-scss` - SCSS compilation
- `rollup-plugin-terser` - Minification

Outputs:
- `dist/vue-agentation.umd.js` - UMD build
- `dist/vue-agentation.esm.js` - ES Module build
- `dist/vue-agentation.umd.min.js` - Minified UMD
- `dist/vue-agentation.css` - Combined styles
