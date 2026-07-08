import { init as csInit, getRenderingEngine, Enums, cache, volumeLoader } from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

// Tool references
let renderingEngine = null;
const viewportId = 'ct-viewport';
const elementId = 'canvas';

/**
 * Initialize Cornerstone 3D
 */
async function initializeCornerstone() {
    try {
        console.log('Initializing Cornerstone 3D...');
        
        // Initialize core
        await csInit();
        
        // Register WADO Image Loader
        cornerstoneWADOImageLoader.external.dicomParser = require('dicom-parser');
        cornerstoneWADOImageLoader.external.cornerstone = require('@cornerstonejs/core');
        
        console.log('✅ Cornerstone 3D initialized successfully');
        
        // Get rendering engine
        const canvas = document.getElementById(elementId);
        renderingEngine = new (await csInit()).RenderingEngine.RenderingEngine({
            id: 'myRenderingEngine',
            enableCPURendering: true,
        });
        
        // Setup UI event listeners
        setupEventListeners();
        
        // Log ready state
        console.log('🎮 Ready to load DICOM images!');
        updateStatus('Ready to load DICOM images');
        
    } catch (error) {
        console.error('❌ Failed to initialize Cornerstone 3D:', error);
        updateStatus(`Error: ${error.message}`, true);
    }
}

/**
 * Setup event listeners for UI controls
 */
function setupEventListeners() {
    const loadBtn = document.getElementById('load-btn');
    const resetBtn = document.getElementById('reset-btn');
    const fileInput = document.getElementById('dicom-file-input');
    const panBtn = document.getElementById('pan-btn');
    const zoomBtn = document.getElementById('zoom-btn');
    const wwcBtn = document.getElementById('wwc-btn');
    const measureBtn = document.getElementById('measure-btn');
    
    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            fileInput?.click();
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelection);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', handleResetView);
    }
    
    if (panBtn) {
        panBtn.addEventListener('click', () => toggleTool('Pan'));
    }
    
    if (zoomBtn) {
        zoomBtn.addEventListener('click', () => toggleTool('Zoom'));
    }
    
    if (wwcBtn) {
        wwcBtn.addEventListener('click', () => toggleTool('WindowLevel'));
    }
    
    if (measureBtn) {
        measureBtn.addEventListener('click', () => toggleTool('Length'));
    }
}

/**
 * Handle DICOM file selection
 */
async function handleFileSelection(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    console.log('📁 Selected file:', file.name);
    updateStatus(`Loading ${file.name}...`);
    
    try {
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Create blob URL
        const blob = new Blob([arrayBuffer], { type: 'application/dicom' });
        const blobUrl = URL.createObjectURL(blob);
        
        // Create DICOM URI
        const dicomUri = `wadouri:${blobUrl}`;
        
        console.log('📦 DICOM URI created:', dicomUri);
        
        // Display the image
        await displayDICOMImage(dicomUri);
        
        updateStatus(`✅ Loaded: ${file.name}`);
        
    } catch (error) {
        console.error('❌ Error loading DICOM file:', error);
        updateStatus(`Error loading file: ${error.message}`, true);
    }
}

/**
 * Display DICOM image in viewer
 */
async function displayDICOMImage(dicomUri) {
    try {
        const canvas = document.getElementById(elementId);
        
        if (!renderingEngine) {
            console.error('Rendering engine not initialized');
            return;
        }
        
        // Create viewport
        const viewportInput = {
            viewportId: viewportId,
            type: Enums.ViewportType.STACK,
            element: canvas,
            defaultOptions: {
                background: Enums.Colors.BLACK,
            },
        };
        
        renderingEngine.enableElement(viewportInput);
        
        // Get viewport
        const viewport = renderingEngine.getViewport(viewportId);
        
        // Load and display image
        await viewport.setStack([dicomUri], 0);
        viewport.render();
        
        console.log('🖼️ DICOM image displayed successfully');
        
    } catch (error) {
        console.error('❌ Error displaying DICOM image:', error);
        throw error;
    }
}

/**
 * Toggle tools on/off
 */
function toggleTool(toolName) {
    try {
        console.log(`🔧 Toggling tool: ${toolName}`);
        
        const toolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('default');
        
        if (!toolGroup) {
            console.error('Tool group not found');
            return;
        }
        
        const toolState = toolGroup.getToolOptions(toolName);
        
        if (toolState?.mode === Enums.ToolModes.Active) {
            toolGroup.setToolDisabled(toolName);
            console.log(`✅ ${toolName} disabled`);
        } else {
            toolGroup.setToolActive(toolName);
            console.log(`✅ ${toolName} enabled`);
        }
        
    } catch (error) {
        console.error(`Error toggling tool ${toolName}:`, error);
    }
}

/**
 * Reset view to default
 */
function handleResetView() {
    try {
        const viewport = renderingEngine?.getViewport(viewportId);
        if (viewport) {
            viewport.resetCamera();
            viewport.render();
            console.log('↻ View reset');
            updateStatus('View reset');
        }
    } catch (error) {
        console.error('Error resetting view:', error);
    }
}

/**
 * Update status message in UI
 */
function updateStatus(message, isError = false) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.style.color = isError ? '#ff6b6b' : '#51cf66';
    }
    console.log(`[Status] ${message}`);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCornerstone);
} else {
    initializeCornerstone();
}
