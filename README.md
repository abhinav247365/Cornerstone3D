# Cornerstone 3D Project

A project to explore and work with Cornerstone 3D JavaScript libraries for medical imaging visualization.

## What is Cornerstone 3D?

Cornerstone 3D is a powerful open-source JavaScript library for building web-based medical imaging applications. It provides:
- 2D and 3D image rendering
- DICOM image support
- Medical imaging tools (measurements, annotations, etc.)
- GPU-accelerated rendering
- Interactive viewer capabilities

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Cornerstone 3D Libraries Included

- **@cornerstonejs/core** - Core rendering engine
- **@cornerstonejs/tools** - Interactive tools (measurements, etc.)
- **@cornerstonejs/streaming-image-volume-loader** - Volume loading and streaming
- **cornerstone-wado-image-loader** - WADO image loading
- **dicom-parser** - DICOM file parsing

## Project Structure

```
.
├── package.json
├── index.html
├── src/
│   ├── index.js
│   └── styles.css
└── public/
```

## Learning Medical Images Rendering

This project is designed to learn how to:
1. Set up Cornerstone 3D
2. Load and display DICOM images
3. Build interactive medical imaging viewers
4. Add tools for image analysis

## Next Steps

1. ✅ Create HTML entry point
2. ✅ Set up basic viewer component  
3. Load and display sample DICOM images
4. Explore interactive tools
5. Implement pan, zoom, windowing
6. Add measurements and annotations
