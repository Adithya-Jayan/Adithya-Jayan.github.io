# 🌿 Comprehensive Portfolio Revamp Checklist

## Phase 1: Structural Sanitization & Jekyll Foundation
- [x] **Core Directory Scaffolding**
    - [x] `_layouts`, `_includes`, `_projects`, `_art`, `_models`, `_sass`
- [x] **Complete Asset Migration**
    - [x] Move remaining images from root `images/` and other subdirs to `assets/images/`.
    - [x] Update all internal links in `.md` and `.html` files.
    - [x] Relocate `js/` files to `assets/js/`.
    - [x] Clean up redundant folders once content is migrated.
- [x] **Jekyll Collection Setup**
    - [x] Define `projects`, `art`, and `models` in `_config.yml`.
- [x] **CSV-Driven Gallery Implementation**
    - [x] Created `_data/art.csv` and `_data/models.csv`.
- [x] **Redundant Asset Cleanup**
    - [x] Remove root `images/` and `js/` folders after migration.
- [x] **Restore Brother's Portfolio**
    - [x] Restore `Anirudh/` directory to root and ensure it remains untouched.

## Phase 2: Design System & "Earthy Boho" Aesthetic
- [x] **Color Palette Implementation**
    - [x] Hex-coded variables: `#FAF7F0`, `#E9F2E0`, `#2C3E50`, `#5D4037`, `#8A9A5B`, `#D2691E`.
- [x] **Visual Distinction & Contrast**
    - [x] Audit and refine `--color-bg-primary` vs `--color-bg-secondary` to ensure clear layer separation.
    - [x] Ensure Perlin noise texture is properly visible and not being overridden by solid colors (moved behind UI).
- [x] **Typography Framework**
    - [x] Import 'Lora' (Serif) for headings and 'Inter' (Sans-serif) for body.
- [x] **UI Component Refinement**
    - [x] **Explore Dropdown UX**: Make the entire "Explore" button clickable (implemented `dropbtn-wrapper`).
    - [x] **Blob Shapes**: Removed heavy blobbing from project cards to ensure text readability.
    - [x] **Footer Formatting**: Fixed alignment and formatting issues (center-aligned).

## Phase 3: Gallery & Project Fixes
- [x] **Projects Page Restoration**
    - [x] Fix the `/projects/` permalink and folder rendering issue.
    - [x] Standardized hero section and restored missing title.
- [x] **Art Gallery Debugging**
    - [x] Fix broken image details and descriptions in the gallery view.
    - [x] Fixed broken filters (implemented tag slugification).
    - [x] Restored image click functionality (Magnific Popup).
- [x] **3D Model Library Correction**
    - [x] Ensure `models.md` correctly pulls from `site.models` and `_data/models.csv`.
    - [x] Standardized hero section and restored correct title.

## Phase 4: Nature Themeing & Parallax
- [x] **CSS-Styled Botanical Art**
    - [x] Implemented pure CSS leaf and vine elements instead of image watermarks.
    - [x] Injected CSS watermarks into `_layouts/default.html` and key sections.
- [x] **Parallax Environmental Depth**
    - [x] Implemented JS-driven parallax for botanical background elements.

## Phase 5: Modular Component Templating
- [x] **Project Cards Refinement**
    - [x] Standardized `.project-card` container.
    - [x] **Sage Leaf background** (CSS art watermark behind text).
    - [x] Clean image thumbnail, `<h3>` title, and `<p>` excerpt.
- [ ] **Collection Layout Enhancements**
    - [ ] Refine `_layouts/art.html` and `_layouts/models.html` for more organic detail pages.

## Phase 6: Motion & Spatial Dynamics
- [ ] **Enhanced Scroll Reveals**
    - [ ] Update `.animate-on-scroll` for "Pebble Emergence": staggered upward translation.
- [x] **Sticky Stacking Sections**
    - [x] Applied `position: sticky` to section headers for a "shuffling paper" effect.

## Phase 7: Professional Engineering & Resume Architecture
- [ ] **Advanced Resume Styling**
    - [ ] **Vine-like Timeline**: Implement vertical career trajectory using `::before` and `::after`.
    - [ ] **Botanical Markers**: Replace standard bullet points with leaf CSS shapes.
- [ ] **Sanitized Engineering Case Study Layout**
    - [ ] **NDA-Friendly Structure**: Create section blocks for Architectural Overview, Verification Methodology, and Metrics.

## Phase 8: Final Polishing & Quality Assurance
- [ ] **Mobile Responsive Audit**
- [ ] **SEO & Metadata Tuning**
- [ ] **Performance Optimization**
