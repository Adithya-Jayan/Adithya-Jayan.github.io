---
layout: default
title: 3D Model Library
permalink: /models/
---

<section class="gallery-hero animate-on-scroll" style="background-image:url(https://res.cloudinary.com/dtml8icqh/image/upload/v1760783588/Squidman_hbfjb6.png);">
  <div class="hero-overlay"></div>
  <div class="container">
    <h1 class="hero-title">3D Model Library</h1>
    <p class="hero-description">Exploring the world of 3D modeling, from photorealistic environments to stylized characters.</p>
    <a href="https://adithyajayan.gumroad.com/l/vwcjvr" target="_blank" class="btn-primary">Download Assets</a>
  </div>
</section>

<div class="portfolio-grid animate-on-scroll delay-2">
  {% for model in site.models %}
    {% assign stagger_index = forloop.index | modulo: 6 | plus: 1 %}
    <article class="project-card animate-on-scroll delay-{{ stagger_index }}" onclick="location.href='{{ model.url | relative_url }}'">
      <div class="sage-leaf-bg"></div>
      {% if model.thumbnail %}
        <img src="{{ model.thumbnail | relative_url }}" alt="{{ model.title }}" class="card-thumbnail">
      {% endif %}
      <div class="card-content">
        <h3 class="card-title">{{ model.title }}</h3>
        <p class="card-excerpt">{{ model.description | default: "View 3D Model Details" }}</p>
        <div class="card-tags">
          {% for tag in model.tags %}
            <span class="tag">{{ tag }}</span>
          {% endfor %}
        </div>
      </div>
    </article>
  {% endfor %}
</div>
