# 🌿 Comprehensive Portfolio Revamp Checklist

> [!IMPORTANT]
> **External Directory Protection**: The `Anirudh/` directory contains my brother's portfolio and must remain completely untouched, unlinked from Jekyll collections, and preserved at the root directory at all times.

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
    - [x] **Woven Linen Texture**: Implemented the template texture as the primary background.
- [x] **Typography Framework**
    - [x] Import 'Syne' (Organic Sans) for headings and 'Inter' (Sans-serif) for body.
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

## Phase 4: Dynamic Background (Growing Vines)
- [x] **Interactive Canvas Background**
    - [x] Integrated slow-growing vine logic from template.
    - [x] Implemented 5-second delayed auto-start.
    - [x] Adjusted growth rate for 5-minute full screen coverage.
    - [x] Confined growth to background layer (`z-index: -3`).

## Phase 5: Modular Component Templating
- [x] **Project Cards Refinement**
    - [x] Standardized `.project-card` container.
    - [x] **Sage Leaf background** (CSS art watermark behind text).
    - [x] Clean image thumbnail, `<h3>` title, and `<p>` excerpt.
- [x] **Collection Layout Enhancements**
    - [x] Refine `_layouts/art.html` and `_layouts/models.html` for more organic detail pages.

## Phase 6: Motion & Spatial Dynamics
- [x] **Enhanced Scroll Reveals**
    - [x] Update `.animate-on-scroll` for "Pebble Emergence": staggered upward translation.
- [x] **Sticky Stacking Sections**
    - [x] Applied `position: sticky` to section headers for a "shuffling paper" effect.

## Phase 7: Professional Engineering & Resume Architecture
- [x] **Advanced Resume Styling**
    - [x] **Vine-like Timeline**: Implement vertical career trajectory using `::before` and `::after`.
    - [x] **Botanical Markers**: Replace standard bullet points with leaf CSS shapes.
- [x] **Sanitized Engineering Case Study Layout**
    - [x] **NDA-Friendly Structure**: Create section blocks for Architectural Overview, Verification Methodology, and Metrics.

## Phase 8: Final Polishing & Quality Assurance
- [x] **Mobile Responsive Audit**
- [x] **SEO & Metadata Tuning**
- [x] **Performance Optimization**

## Phase 9: Navigation, Reachability & Missing Sections
- [x] **Contact Section Restoration**
    - [x] Restore the "Feedback / Suggestions / Collaboration" CTA section above footer.
- [x] **Back to Top Button**
    - [x] Implement a floating botanical-styled button for quick scroll-up.
- [x] **Leaf-Vine Bottom Navigation**
    - [x] Replace "Work and Play" on Home with new leaf-vine button array.
    - [x] Add the same navigation block to the bottom of Art, Models, and Projects pages.
    - [x] Use Flower icon for current page indicator.
- [x] **Project Gallery Layout Refinement**
    - [x] Change from 3 columns to 2 columns.
    - [x] Enforce minimum width on items to prevent squishing.

## Fixes completed.
- [x] The contents of the my repertoir project has been restored from the original version. The thumbnail and dedicated github/website links have been added to the project page and gallery cards.
- [x] The feedback and suggestions section is now only on the home page.
- [x] Backgrounds of main content and sections are now slightly transparent to allow background vines to show through.
- [x] Instagram post links (embedded gallery) have been added back to the Art Gallery.
- [x] The "Explore More" section now uses the animated leafy CSS design from `vines_buttons.txt`.