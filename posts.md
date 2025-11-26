---
layout: default
title: "Posts"
lang: en
permalink: /posts/
---

<section class="section section--posts">
  <div class="section__inner">
    <header class="section-header">
      <h1 class="section__title">Posts</h1>
      <p class="section__text">
        CTF writeups, study notes, and research logs.
      </p>
    </header>

    {% assign lang_posts = site.posts | where: "lang", "en" | sort: "date" | reverse %}

    <div class="post-list">
      {% for post in lang_posts %}
        <article class="post-card">
          <h2 class="post-card__title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h2>
          <p class="post-card__meta">
            <span>{{ post.date | date_to_string }}</span>
            {% if post.category %}
              • <span>{{ post.category }}</span>
            {% endif %}
          </p>
          {% if post.excerpt %}
            <p class="post-card__excerpt">{{ post.excerpt | strip_html | truncate: 180 }}</p>
          {% endif %}
          {% if post.tags %}
            <ul class="post-card__tags">
              {% for tag in post.tags %}
                <li class="tag-chip">{{ tag }}</li>
              {% endfor %}
            </ul>
          {% endif %}
        </article>
      {% endfor %}
    </div>
  </div>
</section>
