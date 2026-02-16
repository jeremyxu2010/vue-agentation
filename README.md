# Vue-Agentation

A Vue 2.0 UI annotation tool for AI coding agents. Point at bugs, let AI fix them.

## Features

- Click-to-annotate UI elements with visual markers
- Generate markdown or JSON output for AI agents
- Draggable floating toolbar
- Keyboard shortcuts for quick access
- Multiple output detail levels
- Local storage persistence
- Works with any Vue 2.0 application

## Installation

```bash
npm install vue-agentation
```

## Usage

### Global Registration

```javascript
import Vue from 'vue'
import VueAgentation from 'vue-agentation'
import 'vue-agentation/dist/vue-agentation.css'

Vue.use(VueAgentation, {
  outputDetail: 'standard',
  markerColor: '#ff4444'
})
```

### In Your Template

```vue
<template>
  <div id="app">
    <!-- Your app content -->
    
    <agentation 
      :enabled="isDevMode"
      output-detail="standard"
      marker-color="#ff4444"
      @annotation-created="onAnnotationCreated"
      @copied="onCopied"
    />
  </div>
</template>

<script>
export default {
  computed: {
    isDevMode() {
      return process.env.NODE_ENV === 'development'
    }
  },
  methods: {
    onAnnotationCreated(annotation) {
      console.log('New annotation:', annotation)
    },
    onCopied(output) {
      console.log('Copied to clipboard')
    }
  }
}
</script>
```

## Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enabled` | Boolean | `true` | Enable/disable the annotation tool |
| `outputDetail` | String | `'standard'` | Output detail level: `compact`, `standard`, `detailed`, `forensic` |
| `markerColor` | String | `'#ff4444'` | Color of annotation markers |
| `clearOnCopy` | Boolean | `false` | Clear all annotations after copying |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `annotation-created` | Annotation | Fired when a new annotation is created |
| `annotation-removed` | Annotation | Fired when an annotation is removed |
| `annotation-click` | Annotation | Fired when a marker is clicked |
| `copied` | String | Fired when annotations are copied (output text) |
| `cleared` | - | Fired when all annotations are cleared |
| `settings-update` | Object | Fired when settings are changed |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Shift + F` | Toggle annotation mode |
| `Esc` | Close popup / Exit annotation mode |
| `P` | Pause/resume animations |
| `H` | Hide/show markers |
| `C` | Copy annotations to clipboard |
| `X` | Clear all annotations |

## Output Formats

### Compact
Quick feedback with minimal context.

### Standard
Balanced detail with element path and classes.

### Detailed
Full context with bounding boxes and nearby text.

### Forensic
Maximum detail including computed CSS styles.

## Annotation Format

Annotations follow the [Annotation Format Schema v1.0](https://agentation.dev/schema):

```javascript
{
  id: "ann_abc123",
  comment: "Button text is unclear",
  element: "button",
  elementPath: "body > main > form > button.submit-btn",
  x: 45.5,  // % of viewport width
  y: 480,   // px from top
  timestamp: 1705694400000,
  url: "http://localhost:3000/page",
  // ... more fields
}
```

## License

MIT

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode for development
npm run dev
```

## Demo

Open `demo.html` in a browser to test the annotation tool.
