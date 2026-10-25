const fs = require('fs');

// Read fonts
const futuraB64 = fs.readFileSync('FuturaPassata_DISPLAY.woff2').toString('base64');
const splineB64 = fs.readFileSync('SplineSans.woff2').toString('base64');
const splineMonoB64 = fs.readFileSync('SplineSansMono.woff2').toString('base64');
const logoSvgRaw = fs.readFileSync('original_logo.svg', 'utf8');

// Extract inner paths of logo (excluding path 0 which is background)
const pathMatches = [...logoSvgRaw.matchAll(/<path\s+d="([^"]+)"(?:\s+fill="([^"]+)")?/g)];
const arenaPaths = pathMatches.slice(1).map(m => m[1]);

console.log('Read all assets. Total arena paths:', arenaPaths.length);

const appHtml = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Logo & Intro Creator</title>
  <style>
    @font-face {
      font-family: 'FuturaPassata';
      src: url('data:font/woff2;base64,${futuraB64}') format('woff2');
      font-weight: bold;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'SplineSans';
      src: url('data:font/woff2;base64,${splineB64}') format('woff2');
      font-weight: 400 700;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'SplineSansMono';
      src: url('data:font/woff2;base64,${splineMonoB64}') format('woff2');
      font-weight: 400 600;
      font-style: normal;
      font-display: swap;
    }

    :root {
      --primary-color: #E73C3E;
      --charcoal-color: #19191A;
      --white-color: #FFFFFF;
      --ecru-color: #F9F8F6;
      --bg-color: #F4F4F2;
      --card-bg: #FFFFFF;
      --text-color: #19191A;
      --font-display: 'FuturaPassata', sans-serif;
      --font-body: 'SplineSans', sans-serif;
      --font-mono: 'SplineSansMono', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-body);
      background-color: var(--bg-color);
      color: var(--text-color);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    /* Top Navigation Bar */
    header.site-header {
      background: #FFFFFF;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-title-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-logo-badge {
      width: 48px;
      height: 48px;
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .header-logo-badge:hover {
      transform: scale(1.08) rotate(5deg);
    }

    .brand-title {
      font-family: var(--font-display);
      font-size: 1.4rem;
      text-transform: uppercase;
      letter-spacing: -0.02em;
    }

    .brand-subtitle {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: #666;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    /* Modern Pill Buttons */
    .btn {
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 0.85rem;
      padding: 0.55rem 1.15rem;
      border-radius: 9999px;
      border: 1px solid transparent;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .btn-primary {
      background-color: var(--primary-color);
      color: #FFFFFF;
    }
    .btn-primary:hover {
      filter: brightness(0.92);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(231, 60, 62, 0.25);
    }

    .btn-secondary {
      background-color: #FFFFFF;
      color: var(--charcoal-color);
      border-color: #D5D5D5;
    }
    .btn-secondary:hover {
      background-color: #F8F8F8;
      border-color: #B0B0B0;
    }

    .btn-dark {
      background-color: var(--charcoal-color);
      color: #FFFFFF;
    }
    .btn-dark:hover {
      background-color: #000000;
    }

    /* Main Workspace Layout */
    .workspace {
      display: grid;
      grid-template-columns: 1fr 420px;
      flex: 1;
      height: calc(100vh - 65px);
      overflow: hidden;
    }

    @media (max-width: 960px) {
      .workspace {
        grid-template-columns: 1fr;
        height: auto;
        overflow: visible;
      }
    }

    /* Preview Canvas Area */
    .preview-pane {
      position: relative;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-right: 1px solid rgba(0,0,0,0.08);
    }

    .preview-viewport {
      position: relative;
      flex: 1;
      width: 100%;
      height: 100%;
      background: var(--ecru-color);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    /* Controls Panel */
    .controls-pane {
      background: #FFFFFF;
      padding: 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.35rem;
    }

    .control-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid #ECECEB;
    }
    .control-section:last-child {
      border-bottom: none;
    }

    .control-title {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #777;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .input-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--charcoal-color);
    }

    .text-input {
      font-family: var(--font-body);
      font-size: 0.95rem;
      padding: 0.65rem 0.9rem;
      border: 1.5px solid #DDD;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.2s;
      width: 100%;
    }
    .text-input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(231, 60, 62, 0.12);
    }

    /* Color Swatches */
    .color-swatches {
      display: flex;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .swatch {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 2px solid #FFF;
      outline: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s;
    }
    .swatch:hover {
      transform: scale(1.1);
    }
    .swatch.active {
      outline-color: var(--charcoal-color);
    }

    /* Style Presets */
    .pill-tabs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.4rem;
      background: #F4F4F2;
      padding: 4px;
      border-radius: 10px;
    }

    .pill-tabs-4 {
      grid-template-columns: repeat(4, 1fr);
    }

    .pill-tab {
      padding: 0.5rem 0.3rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-align: center;
      border-radius: 7px;
      cursor: pointer;
      background: transparent;
      border: none;
      color: #666;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .pill-tab.active {
      background: #FFFFFF;
      color: var(--charcoal-color);
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }

    /* Range slider */
    .slider-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .slider {
      flex: 1;
      accent-color: var(--primary-color);
    }
    .slider-value {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      width: 45px;
      text-align: right;
    }

    /* ========================================================= */
    /* THE INTRO & STAGE ENGINE                                  */
    /* ========================================================= */

    .intro-viewport-container {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      user-select: none;
    }

    /* Curtain Wipe / Huge Preloader Effect */
    .wc-curtain {
      position: absolute;
      inset: 0;
      background-color: var(--current-primary, var(--primary-color));
      z-index: 50;
      transform: translateY(100%);
      pointer-events: none;
      will-change: transform;
    }

    .wc-curtain.wipe-in {
      animation: curtainWipeIn var(--wipe-dur, 0.85s) cubic-bezier(0.77, 0, 0.175, 1) forwards;
    }
    .wc-curtain.wipe-out {
      animation: curtainWipeOut var(--wipe-dur, 0.85s) cubic-bezier(0.77, 0, 0.175, 1) forwards;
    }

    @keyframes curtainWipeIn {
      0% { transform: translateY(100%); }
      100% { transform: translateY(0%); }
    }
    @keyframes curtainWipeOut {
      0% { transform: translateY(0%); }
      100% { transform: translateY(-100%); }
    }

    /* Subtle architectural grid background */
    .arena-grid-bg {
      position: absolute;
      inset: 0;
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
      pointer-events: none;
      opacity: 0.7;
    }

    /* Interactive FX Canvas (Rotunda / Particles / Clean) */
    #fx-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
      opacity: 0.45;
      transition: opacity 0.5s ease;
    }

    /* Intro Stage Elements */
    .intro-stage {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2rem;
      max-width: 95vw;
    }

    /* Central Dynamic Logo Badge */
    .wc-badge-wrapper {
      position: relative;
      margin-bottom: 2rem;
      perspective: 1000px;
      cursor: pointer;
    }

    .wc-badge-svg {
      width: clamp(100px, 15vw, 175px);
      height: clamp(100px, 15vw, 175px);
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s;
      filter: drop-shadow(0 12px 30px rgba(0,0,0,0.12));
    }
    .wc-badge-wrapper:hover .wc-badge-svg {
      transform: scale(1.08) rotate(-4deg);
      filter: drop-shadow(0 16px 40px rgba(231, 60, 62, 0.25));
    }

    /* Slogan / Subtitle: "WELCOME TO" */
    .intro-welcome-text {
      font-family: var(--font-mono);
      font-size: clamp(0.85rem, 1.8vw, 1.25rem);
      text-transform: uppercase;
      letter-spacing: 0.35em;
      color: #555;
      margin-bottom: 0.75rem;
      display: flex;
      justify-content: center;
      gap: 0.08em;
      opacity: 0;
    }

    .intro-welcome-text.animate-in {
      opacity: 1;
      animation: welcomeFadeIn 0.8s ease forwards;
    }

    @keyframes welcomeFadeIn {
      0% { opacity: 0; transform: translateY(-15px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    /* Monumental Name Typography */
    .monumental-name {
      font-family: var(--font-display);
      text-transform: uppercase;
      line-height: 0.88;
      font-size: clamp(2.8rem, 10vw, 130px);
      letter-spacing: -0.03em;
      color: var(--current-primary, var(--primary-color));
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      user-select: none;
      perspective: 1200px;
    }

    /* Letter Spans */
    .monumental-letter {
      display: inline-block;
      transform-origin: 50% 100%;
      will-change: transform, opacity;
      cursor: default;
      transition: color 0.15s, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
    }

    /* Tactile Vibration Visual Micro-Shake Keyframe */
    @keyframes hapticVibrate {
      0% { transform: translateY(-16px) scale(1.13) rotate(0deg); }
      20% { transform: translateY(-18px) scale(1.15) rotate(-3deg) translateX(-2px); }
      40% { transform: translateY(-15px) scale(1.12) rotate(3deg) translateX(2px); }
      60% { transform: translateY(-17px) scale(1.14) rotate(-1.5deg) translateX(-1px); }
      80% { transform: translateY(-16px) scale(1.13) rotate(1deg) translateX(1px); }
      100% { transform: translateY(-16px) scale(1.13) rotate(0deg); }
    }

    .monumental-letter.is-vibrating {
      color: var(--charcoal-color);
      animation: hapticVibrate 0.18s ease-in-out forwards;
      filter: drop-shadow(0 8px 18px rgba(0,0,0,0.18));
    }

    /* Slogan Loop Container */
    .slogan-loop-container {
      margin-top: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.8rem;
      font-family: var(--font-mono);
      font-size: clamp(0.85rem, 1.6vw, 1.2rem);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--charcoal-color);
      overflow: hidden;
      height: 2.2rem;
    }

    .slogan-prefix {
      color: #888;
    }

    .slogan-roller {
      position: relative;
      display: inline-flex;
      flex-direction: column;
      height: 2.2rem;
      overflow: hidden;
    }

    .slogan-word {
      display: flex;
      align-items: center;
      height: 2.2rem;
      color: var(--current-primary, var(--primary-color));
      font-weight: 700;
      white-space: nowrap;
      transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
    }

    /* Floating Status Indicator */
    .stage-status-pill {
      position: absolute;
      bottom: 1.5rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 9999px;
      padding: 0.45rem 1rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: #555;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
      z-index: 20;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      animation: pulseDot 2s infinite;
    }

    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    /* Fullscreen Modal View */
    .fullscreen-overlay {
      position: fixed;
      inset: 0;
      background: #000;
      z-index: 9999;
      display: none;
      flex-direction: column;
    }
    .fullscreen-overlay.active {
      display: flex;
    }

    .fullscreen-close-btn {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: rgba(255,255,255,0.2);
      color: #FFF;
      border: none;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      font-size: 1.2rem;
      cursor: pointer;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .fullscreen-close-btn:hover {
      background: rgba(255,255,255,0.4);
    }

    /* Modal for Code Export */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      z-index: 2000;
      display: none;
      justify-content: center;
      align-items: center;
      padding: 1.5rem;
    }
    .modal-backdrop.open {
      display: flex;
    }

    .modal-card {
      background: #FFFFFF;
      border-radius: 16px;
      width: 100%;
      max-width: 680px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }

    .modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #ECECEB;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-header h3 {
      font-family: var(--font-display);
      font-size: 1.3rem;
      text-transform: uppercase;
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .code-preview-block {
      background: #19191A;
      color: #A3E635;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      padding: 1.25rem;
      border-radius: 10px;
      overflow-x: auto;
      max-height: 320px;
      line-height: 1.5;
      white-space: pre;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #ECECEB;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      background: #FAF9F7;
    }

    /* Toast Notification */
    .toast {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: var(--charcoal-color);
      color: #FFF;
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 10000;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;
      opacity: 0;
      pointer-events: none;
    }
    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    /* Badge Text SVG styling */
    .badge-text-line {
      font-family: 'FuturaPassata', sans-serif;
      font-weight: bold;
      text-anchor: middle;
      letter-spacing: -0.02em;
      transition: fill 0.3s;
    }
  </style>
</head>
<body>

  <!-- Top Header Navigation -->
  <header class="site-header">
    <div class="brand-title-group">
      <!-- Octagonal Badge Icon -->
      <div class="header-logo-badge" id="header-logo-trigger" title="Replay intro animatie">
        <svg id="header-badge-svg" viewBox="0 0 342 342" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path id="header-badge-bg" d="M38.4256 0L14.9606 15.6794L0 38.0675V303.932L14.9606 326.321L38.4256 342H303.574L327.039 326.321L342 303.932V38.0675L327.039 15.6794L303.574 0H38.4256Z" fill="#E73C3E"/>
          
          <!-- Text Group (Default: GEERT VERHULST) -->
          <g id="header-badge-text-group">
            <text id="header-badge-line1" class="badge-text-line" x="171" y="125" font-size="62" fill="#19191A">GEERT</text>
            <text id="header-badge-line2" class="badge-text-line" x="171" y="185" font-size="62" fill="#19191A">VERHULST</text>
          </g>

          <!-- Arena Group -->
          <g id="header-badge-arena" style="display: none;">
            ${arenaPaths.map(p => `<path d="${p}" fill="#19191A"/>`).join('')}
          </g>

          <!-- Monogram Group -->
          <text id="header-badge-monogram" class="badge-text-line" x="171" y="200" font-size="95" fill="#19191A" style="display: none;">GV</text>
        </svg>
      </div>
      <div>
        <h1 class="brand-title">Logo & Intro Creator</h1>
        <p class="brand-subtitle">Dynamische Typografie & Gepersonaliseerd Logo Badge</p>
      </div>
    </div>

    <div class="header-actions">
      <button class="btn btn-secondary" id="btn-replay">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
        Speel Intro Af
      </button>
      <button class="btn btn-secondary" id="btn-fullscreen">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        Volledig Scherm
      </button>
      <button class="btn btn-primary" id="btn-export">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
        Exporteer
      </button>
    </div>
  </header>

  <!-- Workspace Container -->
  <div class="workspace">
    <!-- Preview Window -->
    <div class="preview-pane">
      <div class="preview-viewport" id="preview-viewport">
        <!-- The Intro Viewport -->
        <div class="intro-viewport-container" id="intro-container">
          <!-- Fullscreen Red Curtain Wipe -->
          <div class="wc-curtain" id="wc-curtain"></div>

          <!-- Architectural 2D Grid -->
          <div class="arena-grid-bg"></div>

          <!-- Interactive FX Canvas (Rotunda / Particles / Clean) -->
          <canvas id="fx-canvas"></canvas>

          <!-- Main Center Stage -->
          <div class="intro-stage">
            <!-- Animated Center Badge -->
            <div class="wc-badge-wrapper" id="badge-wrapper" title="Klik om de badge te animeren">
              <svg id="stage-badge-svg" class="wc-badge-svg" viewBox="0 0 342 342" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Faceted Polygon Base (or Circle/Squircle/Hexagon) -->
                <path id="stage-badge-bg" d="M38.4256 0L14.9606 15.6794L0 38.0675V303.932L14.9606 326.321L38.4256 342H303.574L327.039 326.321L342 303.932V38.0675L327.039 15.6794L303.574 0H38.4256Z" fill="#E73C3E"/>
                
                <!-- 1. Text Logo Group (Exact match with Photo 2) -->
                <g id="stage-badge-text-group">
                  <text id="stage-badge-line1" class="badge-text-line" x="171" y="125" font-size="62" fill="#19191A">GEERT</text>
                  <text id="stage-badge-line2" class="badge-text-line" x="171" y="185" font-size="62" fill="#19191A">VERHULST</text>
                </g>

                <!-- 2. Inner Architectural Ring Tracks -->
                <g id="stage-badge-arena" style="display: none;">
                  ${arenaPaths.map(p => `<path d="${p}" fill="#19191A"/>`).join('')}
                </g>

                <!-- 3. Monogram Text Layer -->
                <text id="stage-badge-monogram" class="badge-text-line" x="171" y="200" font-size="95" fill="#19191A" style="display: none;">GV</text>
              </svg>
            </div>

            <!-- "WELCOME TO" subtitle -->
            <div class="intro-welcome-text" id="intro-welcome">
              WELCOME TO
            </div>

            <!-- Monumental Main Name: e.g. "MIJN PORTFOLIO" -->
            <h1 class="monumental-name" id="monumental-name">
              MIJN PORTFOLIO
            </h1>

            <!-- Dynamic Slogan Roller -->
            <div class="slogan-loop-container">
              <span class="slogan-prefix" id="slogan-prefix">NEVER STOP</span>
              <div class="slogan-roller">
                <div class="slogan-word" id="slogan-word">IMAGINING</div>
              </div>
            </div>
          </div>

          <!-- Live Status Pill -->
          <div class="stage-status-pill">
            <span class="status-dot"></span>
            <span id="status-text">Studio Gereed &bull; Typ om live te wijzigen</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls Sidebar -->
    <div class="controls-pane">

      <!-- LOGO BADGE CUSTOMIZATION -->
      <div class="control-section" style="background: #FFF9F9; padding: 1rem; border-radius: 12px; border: 1.5px solid #F8D7D7;">
        <div class="control-title" style="color: var(--primary-color); font-weight: bold;">
          <span>🎪 Logo Badge Wijzigen</span>
          <span>AANBEVOLEN</span>
        </div>

        <!-- Badge Style Switcher -->
        <div class="pill-tabs" id="badge-style-tabs" style="margin-top: 0.25rem;">
          <button class="pill-tab active" data-style="text">Tekst Logo</button>
          <button class="pill-tab" data-style="arena">Arena Ringen</button>
          <button class="pill-tab" data-style="monogram">Monogram</button>
        </div>

        <!-- Badge Shape Switcher -->
        <div style="margin-top: 0.4rem;">
          <span style="font-size: 0.75rem; font-weight: 600; color: #777;">Badge Vorm:</span>
          <div class="pill-tabs pill-tabs-4" id="badge-shape-tabs" style="margin-top: 0.2rem;">
            <button class="pill-tab active" data-shape="bracket">Afgeschuind</button>
            <button class="pill-tab" data-shape="circle">Cirkel</button>
            <button class="pill-tab" data-shape="squircle">Squircle</button>
            <button class="pill-tab" data-shape="hexagon">Hexagon</button>
          </div>
        </div>

        <div id="badge-text-inputs" style="display: flex; flex-direction: column; gap: 0.65rem; margin-top: 0.6rem;">
          <div class="input-group">
            <label class="input-label" for="input-badge-line1">Logo Tekst Regel 1 (Boven)</label>
            <input type="text" id="input-badge-line1" class="text-input" value="GEERT" placeholder="bv. GEERT" maxlength="15">
          </div>
          <div class="input-group">
            <label class="input-label" for="input-badge-line2">Logo Tekst Regel 2 (Onder)</label>
            <input type="text" id="input-badge-line2" class="text-input" value="VERHULST" placeholder="bv. VERHULST" maxlength="15">
          </div>

          <div class="input-group">
            <div style="display: flex; justify-content: space-between;">
              <label class="input-label" for="badge-font-size-slider">Tekstgrootte in Badge</label>
              <span id="badge-font-size-label" style="font-family: var(--font-mono); font-size: 0.8rem;">62px</span>
            </div>
            <input type="range" id="badge-font-size-slider" class="slider" min="30" max="80" step="2" value="62">
          </div>

          <div class="input-group">
            <label class="input-label">Tekstkleur in Badge</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <button class="btn btn-secondary badge-color-btn active" data-color="#19191A" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; background: #19191A; color: #FFF;">Zwart (#19191A)</button>
              <button class="btn btn-secondary badge-color-btn" data-color="#FFFFFF" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; background: #FFFFFF; color: #19191A; border: 1px solid #CCC;">Wit (#FFF)</button>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN PAGE HEADLINE NAME -->
      <div class="control-section">
        <div class="control-title">
          <span>Grote Titel & Intro Tekst</span>
          <span>02</span>
        </div>
        <div class="input-group">
          <label class="input-label" for="input-name">Grote Hoofdnaam (op scherm)</label>
          <input type="text" id="input-name" class="text-input" value="MIJN PORTFOLIO" placeholder="bv. MIJN PORTFOLIO" maxlength="28">
        </div>
        <div class="input-group">
          <label class="input-label" for="input-welcome">Subtitel (Intro Tekst)</label>
          <input type="text" id="input-welcome" class="text-input" value="WELCOME TO" placeholder="bv. WELCOME TO of ONTDEK">
        </div>
      </div>

      <!-- Slogan Roller Customization -->
      <div class="control-section">
        <div class="control-title">
          <span>Slogan Cyclus</span>
          <span>03</span>
        </div>
        <div class="input-group">
          <label class="input-label" for="input-slogan-prefix">Vaste Slogan Tekst</label>
          <input type="text" id="input-slogan-prefix" class="text-input" value="NEVER STOP">
        </div>
        <div class="input-group">
          <label class="input-label" for="input-slogan-words">Wisselende Woorden (komma gescheiden)</label>
          <input type="text" id="input-slogan-words" class="text-input" value="IMAGINING, DESIGNING, GROWING, CONNECTING, REIMAGINING">
        </div>
      </div>

      <!-- Achtergrond Effecten -->
      <div class="control-section">
        <div class="control-title">
          <span>Achtergrond Visuele Sfeer</span>
          <span>04</span>
        </div>
        <div class="pill-tabs" id="bg-effect-tabs">
          <button class="pill-tab active" data-effect="rotunda">3D Koepel</button>
          <button class="pill-tab" data-effect="particles">Deeltjes</button>
          <button class="pill-tab" data-effect="clean">Minimalistisch</button>
        </div>
      </div>

      <!-- Color Palettes -->
      <div class="control-section">
        <div class="control-title">
          <span>Badge Achtergrondkleur</span>
          <span>05</span>
        </div>
        <div class="color-swatches" id="color-swatches">
          <!-- Signature Red -->
          <div class="swatch active" data-color="#E73C3E" data-name="Crimson Red" style="background: #E73C3E;" title="Crimson Red (#E73C3E)"></div>
          <!-- Midnight Noir -->
          <div class="swatch" data-color="#111215" data-name="Midnight Noir" style="background: #111215;" title="Midnight Noir (#111215)"></div>
          <!-- Cerulean Blue -->
          <div class="swatch" data-color="#1D70B8" data-name="Cerulean Blauw" style="background: #1D70B8;" title="Cerulean Blauw (#1D70B8)"></div>
          <!-- Vibrant Coral -->
          <div class="swatch" data-color="#FF5A36" data-name="Vibrant Coral" style="background: #FF5A36;" title="Vibrant Coral (#FF5A36)"></div>
          <!-- Emerald Green -->
          <div class="swatch" data-color="#059669" data-name="Emerald Groen" style="background: #059669;" title="Emerald Groen (#059669)"></div>
        </div>
        <div class="input-group" style="margin-top: 0.5rem;">
          <label class="input-label" for="custom-color-picker">Vrije Kleurkeuze</label>
          <input type="color" id="custom-color-picker" value="#E73C3E" style="width: 100%; height: 38px; border-radius: 8px; border: 1.5px solid #DDD; cursor: pointer; padding: 2px;">
        </div>
      </div>

      <!-- Animation Speed & Timing -->
      <div class="control-section">
        <div class="control-title">
          <span>Animatie Snelheid</span>
          <span>06</span>
        </div>
        <div class="slider-row">
          <input type="range" id="anim-speed-slider" class="slider" min="0.5" max="2.0" step="0.1" value="1.0">
          <span class="slider-value" id="speed-label">1.0x</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="control-section">
        <button class="btn btn-dark" id="btn-download-html" style="justify-content: center; width: 100%; padding: 0.75rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Download Website Intro (.html)
        </button>
        <button class="btn btn-secondary" id="btn-download-svg" style="justify-content: center; width: 100%; padding: 0.75rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
          Download Aangepast SVG Logo
        </button>
        <button class="btn btn-secondary" id="btn-record-video" style="justify-content: center; width: 100%; padding: 0.75rem; border-color: #B5D0F5; color: #1D70B8;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9" stroke="currentColor"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
          <span id="record-btn-text">Neem Intro Op als Video (WebM)</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Fullscreen Modal -->
  <div class="fullscreen-overlay" id="fullscreen-overlay">
    <button class="fullscreen-close-btn" id="btn-close-fullscreen" title="Sluit volledig scherm (Esc)">✕</button>
    <div id="fullscreen-container" style="position: absolute; inset: 0; width: 100%; height: 100%;"></div>
  </div>

  <!-- Export Code Modal -->
  <div class="modal-backdrop" id="export-modal">
    <div class="modal-card">
      <div class="modal-header">
        <h3>Exporteer Aangepaste Intro & Logo</h3>
        <button class="btn btn-secondary" id="btn-close-modal" style="padding: 0.35rem 0.7rem; border-radius: 50%;">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size: 0.9rem; color: #555;">
          Gebruik deze standalone HTML code met jouw aangepaste logo-badge en intro-animatie:
        </p>
        <div class="code-preview-block" id="code-snippet-box"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-copy-code">Kopieer Code</button>
        <button class="btn btn-primary" id="btn-download-export-file">Download Als Bestand</button>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div class="toast" id="toast-msg">Gekopieerd naar klembord!</div>

  <!-- Interactive Logic -->
  <script>
    // State management (No audio)
    const state = {
      name: 'MIJN PORTFOLIO',
      welcome: 'WELCOME TO',
      badgeStyle: 'text', // 'text', 'arena', 'monogram'
      badgeShape: 'bracket', // 'bracket', 'circle', 'squircle', 'hexagon'
      badgeLine1: 'GEERT',
      badgeLine2: 'VERHULST',
      badgeFontSize: 62,
      badgeTextColor: '#19191A',
      sloganPrefix: 'NEVER STOP',
      sloganWords: ['IMAGINING', 'DESIGNING', 'GROWING', 'CONNECTING', 'REIMAGINING'],
      currentSloganIndex: 0,
      bgEffect: 'rotunda', // 'rotunda', 'particles', 'clean'
      primaryColor: '#E73C3E',
      speed: 1.0,
      isAnimating: false,
      sloganTimer: null
    };

    // Shape Path Definitions for 342x342 viewBox
    const SHAPE_PATHS = {
      bracket: 'M38.4256 0L14.9606 15.6794L0 38.0675V303.932L14.9606 326.321L38.4256 342H303.574L327.039 326.321L342 303.932V38.0675L327.039 15.6794L303.574 0H38.4256Z',
      circle: 'M171 0C265.44 0 342 76.56 342 171C342 265.44 265.44 342 171 342C76.56 342 0 265.44 0 171C0 76.56 76.56 0 171 0Z',
      squircle: 'M80 0C35 0 0 35 0 80V262C0 307 35 342 80 342H262C307 342 342 307 342 262V80C342 35 307 0 262 0H80Z',
      hexagon: 'M171 0L330 91.8V250.2L171 342L12 250.2V91.8L171 0Z'
    };

    // DOM Elements
    const inputName = document.getElementById('input-name');
    const inputWelcome = document.getElementById('input-welcome');
    const inputBadgeLine1 = document.getElementById('input-badge-line1');
    const inputBadgeLine2 = document.getElementById('input-badge-line2');
    const badgeFontSizeSlider = document.getElementById('badge-font-size-slider');
    const badgeFontSizeLabel = document.getElementById('badge-font-size-label');
    const badgeTextInputs = document.getElementById('badge-text-inputs');
    const inputSloganPrefix = document.getElementById('input-slogan-prefix');
    const inputSloganWords = document.getElementById('input-slogan-words');
    const monumentalName = document.getElementById('monumental-name');
    const introWelcome = document.getElementById('intro-welcome');
    const sloganPrefix = document.getElementById('slogan-prefix');
    const sloganWord = document.getElementById('slogan-word');
    const curtain = document.getElementById('wc-curtain');

    // Badges in Stage & Header
    const stageBadgeBg = document.getElementById('stage-badge-bg');
    const stageBadgeTextGroup = document.getElementById('stage-badge-text-group');
    const stageBadgeLine1 = document.getElementById('stage-badge-line1');
    const stageBadgeLine2 = document.getElementById('stage-badge-line2');
    const stageBadgeArena = document.getElementById('stage-badge-arena');
    const stageBadgeMonogram = document.getElementById('stage-badge-monogram');

    const headerBadgeBg = document.getElementById('header-badge-bg');
    const headerBadgeTextGroup = document.getElementById('header-badge-text-group');
    const headerBadgeLine1 = document.getElementById('header-badge-line1');
    const headerBadgeLine2 = document.getElementById('header-badge-line2');
    const headerBadgeArena = document.getElementById('header-badge-arena');
    const headerBadgeMonogram = document.getElementById('header-badge-monogram');

    const colorSwatches = document.getElementById('color-swatches');
    const customColorPicker = document.getElementById('custom-color-picker');
    const animSpeedSlider = document.getElementById('anim-speed-slider');
    const speedLabel = document.getElementById('speed-label');
    const badgeStyleTabs = document.getElementById('badge-style-tabs');
    const badgeShapeTabs = document.getElementById('badge-shape-tabs');
    const bgEffectTabs = document.getElementById('bg-effect-tabs');

    const btnReplay = document.getElementById('btn-replay');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const btnCloseFullscreen = document.getElementById('btn-close-fullscreen');
    const btnExport = document.getElementById('btn-export');
    const exportModal = document.getElementById('export-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCopyCode = document.getElementById('btn-copy-code');
    const btnDownloadExportFile = document.getElementById('btn-download-export-file');
    const btnDownloadHtml = document.getElementById('btn-download-html');
    const btnDownloadSvg = document.getElementById('btn-download-svg');
    const btnRecordVideo = document.getElementById('btn-record-video');
    const recordBtnText = document.getElementById('record-btn-text');
    const codeSnippetBox = document.getElementById('code-snippet-box');
    const toastMsg = document.getElementById('toast-msg');
    const fxCanvas = document.getElementById('fx-canvas');

    // Show toast message
    function showToast(text) {
      toastMsg.textContent = text;
      toastMsg.classList.add('show');
      setTimeout(() => toastMsg.classList.remove('show'), 2600);
    }

    // Update Badge View (Text Logo / Arena / Monogram + Shapes)
    function updateBadgeView() {
      const isText = state.badgeStyle === 'text';
      const isArena = state.badgeStyle === 'arena';
      const isMonogram = state.badgeStyle === 'monogram';

      // Shape path
      const shapePath = SHAPE_PATHS[state.badgeShape] || SHAPE_PATHS.bracket;
      stageBadgeBg.setAttribute('d', shapePath);
      headerBadgeBg.setAttribute('d', shapePath);

      // Visibility controls
      badgeTextInputs.style.display = isText ? 'flex' : 'none';

      // Update Stage Badge
      stageBadgeTextGroup.style.display = isText ? 'block' : 'none';
      stageBadgeArena.style.display = isArena ? 'block' : 'none';
      stageBadgeMonogram.style.display = isMonogram ? 'block' : 'none';

      // Update Header Badge
      headerBadgeTextGroup.style.display = isText ? 'block' : 'none';
      headerBadgeArena.style.display = isArena ? 'block' : 'none';
      headerBadgeMonogram.style.display = isMonogram ? 'block' : 'none';

      if (isText) {
        const line1 = state.badgeLine1.trim() || 'GEERT';
        const line2 = state.badgeLine2.trim();
        const fSize = state.badgeFontSize;
        const color = state.badgeTextColor;

        // Stage
        stageBadgeLine1.textContent = line1;
        stageBadgeLine1.setAttribute('font-size', fSize);
        stageBadgeLine1.setAttribute('fill', color);

        if (line2) {
          const startY = 125;
          stageBadgeLine1.setAttribute('y', startY);
          stageBadgeLine2.textContent = line2;
          stageBadgeLine2.setAttribute('y', startY + (fSize * 0.95));
          stageBadgeLine2.setAttribute('font-size', fSize);
          stageBadgeLine2.setAttribute('fill', color);
          stageBadgeLine2.style.display = 'block';
        } else {
          stageBadgeLine1.setAttribute('y', 185);
          stageBadgeLine2.style.display = 'none';
        }

        // Header
        headerBadgeLine1.textContent = line1;
        headerBadgeLine1.setAttribute('font-size', fSize);
        headerBadgeLine1.setAttribute('fill', color);

        if (line2) {
          const startY = 125;
          headerBadgeLine1.setAttribute('y', startY);
          headerBadgeLine2.textContent = line2;
          headerBadgeLine2.setAttribute('y', startY + (fSize * 0.95));
          headerBadgeLine2.setAttribute('font-size', fSize);
          headerBadgeLine2.setAttribute('fill', color);
          headerBadgeLine2.style.display = 'block';
        } else {
          headerBadgeLine1.setAttribute('y', 185);
          headerBadgeLine2.style.display = 'none';
        }
      } else if (isMonogram) {
        const parts = (state.badgeLine1 + ' ' + state.badgeLine2).trim().split(/\\s+/);
        let initials = '';
        if (parts.length >= 2 && parts[0] && parts[1]) {
          initials = (parts[0][0] + parts[1][0]).toUpperCase();
        } else if (parts[0] && parts[0].length >= 2) {
          initials = parts[0].slice(0, 2).toUpperCase();
        } else {
          initials = (state.name.slice(0, 2) || 'GV').toUpperCase();
        }
        stageBadgeMonogram.textContent = initials;
        stageBadgeMonogram.setAttribute('fill', state.badgeTextColor);
        headerBadgeMonogram.textContent = initials;
        headerBadgeMonogram.setAttribute('fill', state.badgeTextColor);
      }
    }

    // Render Monumental Letters with purely visual micro-motion
    function renderNameLetters(animate = true) {
      const text = state.name.trim() || 'MIJN PORTFOLIO';
      monumentalName.innerHTML = '';

      const letters = text.split('');
      const baseDelay = 0.05 / state.speed;

      letters.forEach((char, idx) => {
        const span = document.createElement('span');
        span.className = 'monumental-letter';
        span.textContent = char === ' ' ? '\\u00A0' : char;

        if (animate) {
          span.style.opacity = '0';
          span.style.transform = 'translateY(120px) rotate(' + ((idx % 2 === 0 ? 1 : -1) * (15 - Math.min(idx * 2, 12))) + 'deg)';
          
          const delay = (0.35 / state.speed) + (idx * baseDelay);
          const duration = 0.85 / state.speed;

          setTimeout(() => {
            span.style.transition = 'opacity ' + duration + 's cubic-bezier(0.16, 1, 0.3, 1), transform ' + duration + 's cubic-bezier(0.16, 1, 0.3, 1), color 0.15s';
            span.style.opacity = '1';
            span.style.transform = 'translateY(0) rotate(0deg)';
          }, delay * 1000);
        } else {
          span.style.opacity = '1';
          span.style.transform = 'none';
        }

        // Silent visual hover animation
        span.addEventListener('mouseenter', () => {
          if (char !== ' ') {
            span.classList.add('is-vibrating');
            setTimeout(() => {
              span.classList.remove('is-vibrating');
            }, 200);
          }
        });

        monumentalName.appendChild(span);
      });
    }

    // Apply color palette
    function applyColor(hex) {
      state.primaryColor = hex;
      document.documentElement.style.setProperty('--current-primary', hex);
      stageBadgeBg.setAttribute('fill', hex);
      headerBadgeBg.setAttribute('fill', hex);
      customColorPicker.value = hex;

      // Update active swatch
      document.querySelectorAll('.swatch').forEach(sw => {
        sw.classList.toggle('active', sw.dataset.color.toLowerCase() === hex.toLowerCase());
      });
    }

    // Slogan Loop
    function startSloganLoop() {
      if (state.sloganTimer) clearInterval(state.sloganTimer);
      const interval = Math.max(1800, 3200 / state.speed);

      state.sloganTimer = setInterval(() => {
        if (!state.sloganWords || state.sloganWords.length === 0) return;
        
        sloganWord.style.transition = 'transform 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19), opacity 0.4s';
        sloganWord.style.transform = 'translateY(-100%)';
        sloganWord.style.opacity = '0';

        setTimeout(() => {
          state.currentSloganIndex = (state.currentSloganIndex + 1) % state.sloganWords.length;
          sloganWord.textContent = state.sloganWords[state.currentSloganIndex];
          sloganWord.style.transition = 'none';
          sloganWord.style.transform = 'translateY(100%)';

          requestAnimationFrame(() => {
            sloganWord.style.transition = 'transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.5s';
            sloganWord.style.transform = 'translateY(0)';
            sloganWord.style.opacity = '1';
          });
        }, 400);

      }, interval);
    }

    // Play Full Intro Sequence (Silent)
    function playIntroSequence() {
      if (state.isAnimating) return;
      state.isAnimating = true;

      const dur = 0.85 / state.speed;
      document.documentElement.style.setProperty('--wipe-dur', dur + 's');

      // 1. Wipe Curtain In
      curtain.className = 'wc-curtain wipe-in';

      // Reset contents during curtain cover
      setTimeout(() => {
        introWelcome.classList.remove('animate-in');
        introWelcome.style.opacity = '0';
        introWelcome.textContent = state.welcome;
        sloganPrefix.textContent = state.sloganPrefix;
        sloganWord.textContent = state.sloganWords[state.currentSloganIndex] || 'IMAGINING';

        // Badge reset
        document.getElementById('badge-wrapper').style.transform = 'scale(0.4) rotate(-30deg)';
        document.getElementById('badge-wrapper').style.opacity = '0';

        // Empty letters
        monumentalName.innerHTML = '';
      }, dur * 500);

      // 2. Wipe Curtain Out & Reveal Elements
      setTimeout(() => {
        curtain.className = 'wc-curtain wipe-out';

        // Animate badge in
        setTimeout(() => {
          const badgeWrap = document.getElementById('badge-wrapper');
          badgeWrap.style.transition = 'transform ' + (0.9 / state.speed) + 's cubic-bezier(0.34, 1.56, 0.64, 1), opacity ' + (0.6 / state.speed) + 's';
          badgeWrap.style.transform = 'scale(1) rotate(0deg)';
          badgeWrap.style.opacity = '1';
        }, 150 / state.speed);

        // Animate Welcome Subtitle
        setTimeout(() => {
          introWelcome.classList.add('animate-in');
        }, 350 / state.speed);

        // Animate Letters
        setTimeout(() => {
          renderNameLetters(true);
        }, 450 / state.speed);

        // Finish animation flag
        setTimeout(() => {
          state.isAnimating = false;
        }, 1400 / state.speed);

      }, dur * 900);
    }

    // Visual Canvas Animation Engine (Rotunda / Cosmic Particles / Clean)
    function initFxCanvas() {
      const ctx = fxCanvas.getContext('2d');
      let width = fxCanvas.width = fxCanvas.clientWidth;
      let height = fxCanvas.height = fxCanvas.clientHeight;
      let angle = 0;
      let mouseX = 0, mouseY = 0;

      // Particles setup
      const particles = [];
      for (let i = 0; i < 45; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.1
        });
      }

      window.addEventListener('resize', () => {
        width = fxCanvas.width = fxCanvas.clientWidth;
        height = fxCanvas.height = fxCanvas.clientHeight;
      });

      document.getElementById('preview-viewport').addEventListener('mousemove', (e) => {
        const rect = fxCanvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left - width / 2) * 0.0005;
        mouseY = (e.clientY - rect.top - height / 2) * 0.0005;
      });

      function renderFrame() {
        ctx.clearRect(0, 0, width, height);

        if (state.bgEffect === 'rotunda') {
          fxCanvas.style.opacity = '0.45';
          const cx = width / 2;
          const cy = height / 2;
          angle += 0.004 * state.speed;

          ctx.strokeStyle = state.primaryColor;
          ctx.lineWidth = 1;

          // Concentric architectural rings
          const rings = [70, 120, 180, 240, 310, 380];
          rings.forEach((r, idx) => {
            const depth = idx * 15;
            ctx.beginPath();
            ctx.ellipse(cx + (mouseX * 50), cy + (mouseY * 50) + depth * 0.4, r, r * 0.38, 0, 0, Math.PI * 2);
            ctx.globalAlpha = 0.06 + (idx * 0.035);
            ctx.stroke();
          });

          // Radial ribs
          const ribs = 16;
          ctx.beginPath();
          for (let i = 0; i < ribs; i++) {
            const a = angle + (i * (Math.PI * 2 / ribs));
            const rInner = 70;
            const rOuter = 380;
            const x1 = cx + Math.cos(a) * rInner;
            const y1 = cy + Math.sin(a) * (rInner * 0.38);
            const x2 = cx + Math.cos(a) * rOuter;
            const y2 = cy + Math.sin(a) * (rOuter * 0.38) + (5 * 15 * 0.4);
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
          }
          ctx.globalAlpha = 0.08;
          ctx.stroke();
          ctx.globalAlpha = 1;

        } else if (state.bgEffect === 'particles') {
          fxCanvas.style.opacity = '0.55';
          ctx.fillStyle = state.primaryColor;

          particles.forEach(p => {
            p.x += p.vx * state.speed;
            p.y += p.vy * state.speed;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.globalAlpha = p.alpha;
            ctx.fill();
          });
          ctx.globalAlpha = 1;

        } else {
          fxCanvas.style.opacity = '0';
        }

        requestAnimationFrame(renderFrame);
      }

      renderFrame();
    }

    // Generate Standalone HTML File (100% Silent)
    function buildStandaloneHtml() {
      const name = state.name.trim() || 'MIJN PORTFOLIO';
      const welcome = state.welcome.trim() || 'WELCOME TO';
      const prefix = state.sloganPrefix.trim() || 'NEVER STOP';
      const wordsJson = JSON.stringify(state.sloganWords);
      const color = state.primaryColor;
      const bColor = state.badgeTextColor;
      const bSize = state.badgeFontSize;
      const bLine1 = state.badgeLine1.trim() || 'GEERT';
      const bLine2 = state.badgeLine2.trim() || 'VERHULST';
      const shapePath = SHAPE_PATHS[state.badgeShape] || SHAPE_PATHS.bracket;
      const isText = state.badgeStyle === 'text';

      let innerBadgeSvg = '';
      if (isText) {
        innerBadgeSvg = \`
          <text x="171" y="\${bLine2 ? 125 : 185}" font-family="FuturaPassata, sans-serif" font-weight="bold" font-size="\${bSize}" text-anchor="middle" letter-spacing="-1" fill="\${bColor}">\${bLine1}</text>
          \${bLine2 ? \`<text x="171" y="\${125 + (bSize * 0.95)}" font-family="FuturaPassata, sans-serif" font-weight="bold" font-size="\${bSize}" text-anchor="middle" letter-spacing="-1" fill="\${bColor}">\${bLine2}</text>\` : ''}
        \`;
      } else if (state.badgeStyle === 'arena') {
        innerBadgeSvg = arenaPaths.map(p => \`<path d="\${p}" fill="\${bColor}"/>\`).join('');
      } else {
        innerBadgeSvg = \`<text x="171" y="200" font-family="FuturaPassata, sans-serif" font-weight="bold" font-size="95" text-anchor="middle" fill="\${bColor}">\${(bLine1[0]||'G') + (bLine2[0]||'V')}</text>\`;
      }

      return \`<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${name} &bull; Intro</title>
  <style>
    @font-face {
      font-family: 'FuturaPassata';
      src: url('data:font/woff2;base64,${futuraB64}') format('woff2');
      font-weight: bold;
    }
    @font-face {
      font-family: 'SplineSans';
      src: url('data:font/woff2;base64,${splineB64}') format('woff2');
    }
    @font-face {
      font-family: 'SplineSansMono';
      src: url('data:font/woff2;base64,${splineMonoB64}') format('woff2');
    }
    :root {
      --primary: \${color};
      --charcoal: #19191A;
      --font-display: 'FuturaPassata', sans-serif;
      --font-body: 'SplineSans', sans-serif;
      --font-mono: 'SplineSansMono', monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #F9F8F6;
      color: #19191A;
      font-family: var(--font-body);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      user-select: none;
    }
    .curtain {
      position: fixed;
      inset: 0;
      background: var(--primary);
      z-index: 999;
      animation: wipeOut 0.9s cubic-bezier(0.77, 0, 0.175, 1) 0.3s forwards;
    }
    @keyframes wipeOut {
      0% { transform: translateY(0%); }
      100% { transform: translateY(-100%); }
    }
    .grid-bg {
      position: absolute;
      inset: 0;
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
    }
    .stage {
      position: relative;
      z-index: 10;
      text-align: center;
      padding: 2rem;
    }
    .badge {
      width: clamp(100px, 16vw, 175px);
      height: clamp(100px, 16vw, 175px);
      margin-bottom: 2rem;
      animation: badgeIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s backwards;
      filter: drop-shadow(0 12px 30px rgba(0,0,0,0.12));
      transition: transform 0.4s;
    }
    .stage:hover .badge {
      transform: scale(1.06) rotate(-3deg);
    }
    @keyframes badgeIn {
      0% { transform: scale(0.3) rotate(-30deg); opacity: 0; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .welcome {
      font-family: var(--font-mono);
      font-size: clamp(0.85rem, 1.8vw, 1.25rem);
      letter-spacing: 0.35em;
      color: #555;
      margin-bottom: 0.75rem;
      animation: fadeIn 0.8s ease 0.8s backwards;
    }
    .name-heading {
      font-family: var(--font-display);
      text-transform: uppercase;
      line-height: 0.88;
      font-size: clamp(2.8rem, 11vw, 140px);
      letter-spacing: -0.03em;
      color: var(--primary);
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
    .name-letter {
      display: inline-block;
      animation: letterIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) backwards;
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.15s;
      cursor: default;
    }
    .name-letter:hover {
      color: #19191A;
      transform: translateY(-15px) scale(1.12) rotate(4deg);
    }
    @keyframes letterIn {
      0% { opacity: 0; transform: translateY(120px) rotate(15deg); }
      100% { opacity: 1; transform: translateY(0) rotate(0deg); }
    }
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(-15px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .slogan {
      margin-top: 2rem;
      font-family: var(--font-mono);
      font-size: clamp(0.85rem, 1.6vw, 1.2rem);
      font-weight: 600;
      letter-spacing: 0.15em;
      color: #19191A;
      animation: fadeIn 0.8s ease 1.3s backwards;
    }
    .slogan span {
      color: var(--primary);
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="curtain"></div>
  <div class="grid-bg"></div>
  <div class="stage">
    <svg class="badge" viewBox="0 0 342 342" fill="none">
      <path d="\${shapePath}" fill="\${color}"/>
      \${innerBadgeSvg}
    </svg>
    <div class="welcome">\${welcome}</div>
    <h1 class="name-heading" id="name-container"></h1>
    <div class="slogan">\${prefix} <span id="slogan-target">IMAGINING</span></div>
  </div>

  <script>
    const nameText = "\${name}";
    const container = document.getElementById('name-container');

    const letters = nameText.split('');
    letters.forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'name-letter';
      s.textContent = c === ' ' ? '\\u00A0' : c;
      s.style.animationDelay = (0.7 + (i * 0.05)) + 's';
      container.appendChild(s);
    });

    const words = \${wordsJson};
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % words.length;
      document.getElementById('slogan-target').textContent = words[idx];
    }, 2800);
  <\\/script>
</body>
</html>\`;
    }

    // --- EVENT LISTENERS ---

    // Badge Line 1 & Line 2 inputs
    inputBadgeLine1.addEventListener('input', (e) => {
      state.badgeLine1 = e.target.value.toUpperCase();
      updateBadgeView();
    });

    inputBadgeLine2.addEventListener('input', (e) => {
      state.badgeLine2 = e.target.value.toUpperCase();
      updateBadgeView();
    });

    // Badge Font Size Slider
    badgeFontSizeSlider.addEventListener('input', (e) => {
      state.badgeFontSize = parseInt(e.target.value, 10);
      badgeFontSizeLabel.textContent = state.badgeFontSize + 'px';
      updateBadgeView();
    });

    // Badge Text Color Buttons
    document.querySelectorAll('.badge-color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.badge-color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.badgeTextColor = btn.dataset.color;
        updateBadgeView();
      });
    });

    // Main Big Name input
    inputName.addEventListener('input', (e) => {
      state.name = e.target.value.toUpperCase();
      renderNameLetters(false);
    });

    inputWelcome.addEventListener('input', (e) => {
      state.welcome = e.target.value.toUpperCase();
      introWelcome.textContent = state.welcome;
    });

    inputSloganPrefix.addEventListener('input', (e) => {
      state.sloganPrefix = e.target.value.toUpperCase();
      sloganPrefix.textContent = state.sloganPrefix;
    });

    inputSloganWords.addEventListener('input', (e) => {
      state.sloganWords = e.target.value.split(',').map(w => w.trim().toUpperCase()).filter(Boolean);
      if (state.sloganWords.length > 0) {
        state.currentSloganIndex = 0;
        sloganWord.textContent = state.sloganWords[0];
      }
    });

    // Swatches
    colorSwatches.addEventListener('click', (e) => {
      const swatch = e.target.closest('.swatch');
      if (swatch) {
        applyColor(swatch.dataset.color);
      }
    });

    customColorPicker.addEventListener('input', (e) => {
      applyColor(e.target.value);
    });

    // Speed Slider
    animSpeedSlider.addEventListener('input', (e) => {
      state.speed = parseFloat(e.target.value);
      speedLabel.textContent = state.speed.toFixed(1) + 'x';
      startSloganLoop();
    });

    // Badge Style Switcher
    badgeStyleTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.pill-tab');
      if (btn) {
        badgeStyleTabs.querySelectorAll('.pill-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.badgeStyle = btn.dataset.style;
        updateBadgeView();
      }
    });

    // Badge Shape Switcher
    badgeShapeTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.pill-tab');
      if (btn) {
        badgeShapeTabs.querySelectorAll('.pill-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.badgeShape = btn.dataset.shape;
        updateBadgeView();
      }
    });

    // Background Effect Switcher
    bgEffectTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.pill-tab');
      if (btn) {
        bgEffectTabs.querySelectorAll('.pill-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.bgEffect = btn.dataset.effect;
      }
    });

    // Replay Buttons
    btnReplay.addEventListener('click', playIntroSequence);
    document.getElementById('header-logo-trigger').addEventListener('click', playIntroSequence);
    document.getElementById('badge-wrapper').addEventListener('click', playIntroSequence);

    // Fullscreen View
    btnFullscreen.addEventListener('click', () => {
      fullscreenOverlay.classList.add('active');
      const intro = document.getElementById('intro-container');
      document.getElementById('fullscreen-container').appendChild(intro);
      playIntroSequence();
    });

    btnCloseFullscreen.addEventListener('click', () => {
      fullscreenOverlay.classList.remove('active');
      const intro = document.getElementById('intro-container');
      document.getElementById('preview-viewport').appendChild(intro);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fullscreenOverlay.classList.contains('active')) {
        btnCloseFullscreen.click();
      }
    });

    // Modal Export Code
    btnExport.addEventListener('click', () => {
      const htmlCode = buildStandaloneHtml();
      codeSnippetBox.textContent = htmlCode;
      exportModal.classList.add('open');
    });

    btnCloseModal.addEventListener('click', () => {
      exportModal.classList.remove('open');
    });

    btnCopyCode.addEventListener('click', () => {
      const htmlCode = buildStandaloneHtml();
      navigator.clipboard.writeText(htmlCode).then(() => {
        showToast('HTML code succesvol gekopieerd!');
      });
    });

    // Download file helper
    function downloadFile(content, filename, type) {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    btnDownloadExportFile.addEventListener('click', () => {
      const html = buildStandaloneHtml();
      const safeName = (state.name || 'intro').toLowerCase().replace(/[^a-z0-9]/g, '_');
      downloadFile(html, safeName + '_intro.html', 'text/html');
      showToast('HTML bestand gedownload!');
    });

    btnDownloadHtml.addEventListener('click', () => {
      const html = buildStandaloneHtml();
      const safeName = (state.name || 'intro').toLowerCase().replace(/[^a-z0-9]/g, '_');
      downloadFile(html, safeName + '_intro.html', 'text/html');
      showToast('Standalone intro gedownload!');
    });

    // Download Custom SVG Logo
    btnDownloadSvg.addEventListener('click', () => {
      const svgEl = document.getElementById('stage-badge-svg').cloneNode(true);
      svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      
      const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      styleEl.textContent = \`
        @font-face {
          font-family: 'FuturaPassata';
          src: url('data:font/woff2;base64,${futuraB64}') format('woff2');
          font-weight: bold;
        }
        .badge-text-line {
          font-family: 'FuturaPassata', sans-serif;
          font-weight: bold;
        }
      \`;
      svgEl.insertBefore(styleEl, svgEl.firstChild);

      const svgStr = new XMLSerializer().serializeToString(svgEl);
      const safeName = (state.badgeLine1 + '_' + (state.badgeLine2||'')).toLowerCase().replace(/[^a-z0-9]/g, '_') || 'logo';
      downloadFile(svgStr, safeName + '_logo.svg', 'image/svg+xml');
      showToast('Aangepast SVG Logo gedownload!');
    });

    // Record Intro as WebM Video
    let mediaRecorder = null;
    let recordedChunks = [];
    btnRecordVideo.addEventListener('click', async () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') return;

      try {
        const stream = fxCanvas.captureStream(30);
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        recordedChunks = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = (state.badgeLine1 + '_intro_video').toLowerCase() + '.webm';
          a.click();
          recordBtnText.textContent = 'Neem Intro Op als Video (WebM)';
          showToast('Video opname gereed en gedownload!');
        };

        recordBtnText.textContent = 'Opnemen... (3s)';
        mediaRecorder.start();
        playIntroSequence();

        setTimeout(() => {
          mediaRecorder.stop();
        }, 3200);

      } catch (err) {
        showToast('Video opname wordt niet ondersteund in deze browser');
      }
    });

    // Initialize on load
    window.addEventListener('DOMContentLoaded', () => {
      applyColor(state.primaryColor);
      renderNameLetters(false);
      updateBadgeView();
      initFxCanvas();
      startSloganLoop();
      setTimeout(playIntroSequence, 350);
    });
  </script>
</body>
</html>`;

fs.writeFileSync('index.html', appHtml, 'utf8');
console.log('Successfully removed all audio and updated index.html! File size:', appHtml.length);
