---
layout: default
title: Projects Gallery
---

<section class="gallery-hero animate-on-scroll">
  <div class="hero-overlay"></div>
  <div class="container">
    <h1 class="hero-title">Engineering & Design Projects</h1>
    <p class="hero-description">A collection of VLSI design, software applications, and technical hardware projects.</p>
  </div>
</section>


<div class="portfolio-grid animate-on-scroll">
  {% for project in site.projects %}
    <article class="project-card" onclick="location.href='{{ project.url | relative_url }}'">
      <div class="sage-leaf-bg"></div>
      {% if project.thumbnail %}
        <img src="{{ project.thumbnail | relative_url }}" alt="{{ project.title }}" class="card-thumbnail">
      {% endif %}
      <div class="card-content">
        <h3 class="card-title">{{ project.title }}</h3>
        <p class="card-excerpt">{{ project.excerpt | default: project.description }}</p>
        <div class="card-tags">
          {% for tag in project.tags %}
            <span class="tag">{{ tag }}</span>
          {% endfor %}
        </div>
      </div>
    </article>
  {% endfor %}
</div>
