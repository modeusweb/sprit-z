# Sprit-Z — SVG Sprite Generator

A web application for combining SVG icons into a single reusable sprite.

## Description

Sprit-Z is a convenient tool for creating SVG sprites from individual icons. The application allows you to upload SVG files, configure generation parameters, and get a ready-to-use sprite with usage examples for integration into web projects.

## Demo

Try the application online: [https://sprit-z.vercel.app/](https://sprit-z.vercel.app/)

## Key Features

- **File Upload** — drag and drop SVG files or select via dialog
- **Visual Preview** — grid with previews of all uploaded icons
- **Parameter Configuration**:
  - Symbol ID prefix
  - CSS class for icons in usage examples
  - Replace colors with `currentColor` for dynamic color changes
  - Minify output to reduce file size
- **Icon Management**:
  - Enable/disable individual icons
  - Rename symbol IDs
  - Delete icons
  - Clear all icons
- **Automatic Conflict Resolution** — when duplicate IDs are detected, suffixes are automatically added (`-2`, `-3`, etc.)
- **Faithful Symbol Output** — inherited styling from the source root `<svg>` (`fill="none"`, `stroke="currentColor"`, `stroke-width`, …) is carried onto each `<symbol>`, so stroke-based icon sets render correctly
- **State Persistence** — all settings and icons are saved to localStorage
- **Dark Theme** — dark mode support

## Installation and Setup

### Requirements
- Node.js 18+
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

Built files will be located in the `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## How to Use

1. **Upload SVG Files**
   - Drag files into the upload zone or click to select files
   - Multiple files can be uploaded at once

2. **Configure Parameters** (optional)
   - **Symbol ID prefix** — add a prefix to symbol IDs (e.g., `icon-`)
   - **Icon class** — specify CSS class for icons in usage examples
   - **Use currentColor** — replace fixed colors with `currentColor` to enable color changes via CSS
   - **Minify output** — remove whitespace to reduce file size

3. **Manage Icons**
   - Enable/disable icons using checkboxes
   - Rename icon IDs if needed
   - Delete unwanted icons

4. **Copy or Download Result**
   - Copy the sprite code or usage examples
   - Click "Download sprite" to download the `sprite.svg` file

## Sprite Integration

### 1. Include the Sprite
Save the generated sprite as `sprite.svg` and include it in your HTML:

```html
<body>
  <!-- Sprite must be in DOM but can be hidden -->
  <svg style="display: none;">
    <use href="/sprite.svg" />
  </svg>
  
  <!-- Or include as external image -->
  <img src="/sprite.svg" style="display: none;" />
</body>
```

### 2. Use Icons
```html
<!-- Using generated examples -->
<svg class="icon" width="24" height="24">
  <use href="#icon-name" />
</svg>

<!-- Or directly -->
<svg width="24" height="24">
  <use href="#your-icon-id" />
</svg>
```

### 3. Configure Styles
```css
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: currentColor;
}

/* Change color via CSS */
.icon.custom-color {
  color: #ff0000;
}
```

## Advantages

- **User-Friendly Interface** — intuitive web interface without needing to install complex tools
- **Instant Results** — see changes in real-time when adjusting parameters
- **Automation** — automatic ID conflict resolution and usage example generation
- **Flexibility** — `currentColor` support for dynamic icon color changes
- **Optimization** — built-in minification to reduce file size
- **Work Preservation** — state persists between sessions, you won't lose progress on reload
- **Responsive Design** — works on desktop and mobile devices
- **Dark Theme** — comfortable work at any time of day

## Technologies

- **React 19** — UI library
- **TypeScript** — type safety
- **Vite** — build tool and dev server
- **Tailwind CSS** — styling
- **react-dropzone** — file upload

## License

MIT

## Support

If you enjoy the app, you can support the project by sending a donation to:
```
TQZxZ2Ygh6RvkZDi5qswq8uF9KbDbDw9bo
```
