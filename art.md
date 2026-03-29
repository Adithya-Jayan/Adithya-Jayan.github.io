---
layout: gallery
title: Artwork Gallery
gallery_title: "Explore AJ's Artworks"
description: "A diverse collection of digital illustrations, traditional sketches, and fractal art."
data_file: art
hero_image: "https://res.cloudinary.com/dtml8icqh/image/upload/v1760783581/Meditation_e8bj4k.jpg"
permalink: /art/
---

<section class="insta-gallery-section">
  <div class="container">
    <div class="text-center" style="margin-bottom: 4rem;">
      <h2 class="section-title">More Creative Projects</h2>
    </div>
    <div class="insta-grid">
      <!-- IEEE Animations -->
      <div class="insta-item">
        <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CE_3riaAY8x/" data-instgrm-version="13"></blockquote>
      </div>
      <!-- Creative Aura -->
      <div class="insta-item">
        <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CEY6x_mAnb6/" data-instgrm-version="13"></blockquote>
      </div>
      <!-- MFL Stars -->
      <div class="insta-item">
        <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CESC2N-A4rn/" data-instgrm-version="13"></blockquote>
      </div>
    </div>
  </div>
</section>

<script async src="https://www.instagram.com/embed.js"></script>

<style>
.insta-gallery-section {
  padding: 8rem 0;
  background-color: rgba(233, 242, 224, 0.4); /* Light secondary tint */
  margin: 4rem -3rem;
  width: calc(100% + 6rem);
  border-radius: 4rem;
  position: relative;
  z-index: 5;
  display: block !important;
}
.insta-gallery-section .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}
.insta-gallery-section .section-title::after {
  left: 50%;
  transform: translateX(-50%);
}
.insta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 3rem;
  justify-items: center;
  padding: 2rem 0;
}
.insta-item {
  width: 100%;
  max-width: 540px;
  background: white;
  border-radius: 2rem;
  padding: 1.5rem;
  box-shadow: 0 20px 50px rgba(0,0,0,0.08);
  min-height: 600px;
}
.text-center {
  text-align: center;
}
</style>
