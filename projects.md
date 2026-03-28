---
layout: default
title: Projects Gallery
---

<section class="gallery-hero animate-on-scroll" style="background-image:url(https://res.cloudinary.com/dtml8icqh/image/upload/v1760783581/Fracal-Crossroads_v1_zrvh6o.jpg);">
  <div class="hero-overlay"></div>
  <div class="container">
    <h1 class="hero-title">Engineering & Design Projects</h1>
    <p class="hero-description">A collection of VLSI design, software applications, and technical hardware projects.</p>
  </div>
</section>


<div class="portfolio-grid animate-on-scroll delay-2">
  {% for project in site.projects %}
    {% assign stagger_index = forloop.index | modulo: 6 | plus: 1 %}
    <article class="project-card animate-on-scroll delay-{{ stagger_index }}" onclick="location.href='{{ project.url | relative_url }}'">
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
