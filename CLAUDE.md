# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run build   # Build UMD, ESM, and minified bundles to dist/
npm run dev     # Watch mode for development
```

No test framework is currently configured.

## Architecture Overview

Vue-Agentation is a Vue 2.0 UI annotation tool for AI coding agents. It allows users to visually annotate UI elements and generate feedback output.

### Core Data Flow

```
User Click → Highlighter → Agentation.vue → AnnotationPopup → annotationStore → Marker
                                                                      ↓
                                                              localStorage (7-day expiry)
```

### Key Components

- **Agentation.vue** - Main orchestrator component. Manages active state, coordinates child components, handles keyboard shortcuts.
- **Highlighter.vue** - Captures click events on DOM elements, provides visual highlight overlay.
- **Marker.vue** - Renders numbered annotation markers at stored positions.
- **AnnotationPopup.vue** - Modal for entering annotation comments.
- **Toolbar.vue** - Floating toolbar with toggle/pause/copy/clear/settings actions.

### State Management

Uses a simple pub/sub store pattern (`src/utils/annotationStore.js`), not Vuex:

```javascript
const store = createAnnotationStore()
store.subscribe(annotations => { /* react to changes */ })
store.add({ comment, elementPath, x, y, ... })
```

Annotations persist to `localStorage` with a 7-day expiry. Store operations are immutable (always create new arrays).

### Element Selection

`src/utils/elementInfo.js` generates CSS selectors for clicked elements:
- Uses `id` if present: `#my-element`
- Falls back to path-based: `body > div.container > section:nth-child(2) > button.primary`
- Captures bounding box, CSS classes, nearby text, computed styles (for 'forensic' mode)

### Output Format

`src/utils/outputFormatter.js` generates markdown output with four detail levels:
- `compact` - Minimal: selector + comment
- `standard` - Default: includes element info, nearby text
- `detailed` - Full element context
- `forensic` - Includes computed styles for debugging

### CSS Namespacing

All CSS classes use `va-` prefix (e.g., `.va-marker`, `.va-toolbar`). The container has `z-index: 999990` to stay above page content.

## Vue 2 Patterns

### Component Naming
- Files: PascalCase (e.g., `AnnotationPopup.vue`)
- Component `name` property: Required, matches filename

### Props Pattern
```javascript
props: {
  outputDetail: {
    type: String,
    default: 'standard',
    validator: v => ['compact', 'standard', 'detailed', 'forensic'].includes(v)
  }
}
```

### Event Naming
- Emit: kebab-case (`this.$emit('annotation-created', annotation)`)
- Listen: kebab-case (`@annotation-created="handler"`)

### Lifecycle for Subscriptions
```javascript
created() {
  this.unsubscribe = store.subscribe(fn)
},
beforeDestroy() {
  this.unsubscribe()  // Always clean up
}
```

## Importing the Plugin

```javascript
// As Vue plugin
import VueAgentation from 'vue-agentation'
Vue.use(VueAgentation, { outputDetail: 'detailed', markerColor: '#ff4444' })

// Direct component import
import { Agentation } from 'vue-agentation'
```

## CSS Custom Property

Marker color is controlled via CSS custom property:

```vue
<div :style="{ '--marker-color': markerColor }">
```

Set via prop or plugin options.
