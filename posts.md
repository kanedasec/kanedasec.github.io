---
layout: default
title: "Posts"
permalink: /posts/
---

<section class="section section--posts">
  <div class="section__inner">
    <header class="section-header">
      <h1 class="section__title">Posts</h1>
      <p class="section__text">
        CTF writeups, study notes and research logs – in English and Portuguese.
      </p>
    </header>

    {% assign en_posts = site.posts | where: "lang", "en" | sort: "date" | reverse %}
    {% assign pt_posts = site.posts | where: "lang", "pt" | sort: "date" | reverse %}

    {% if en_posts.size > 0 %}
      <h2 class="section__title" style="margin-top: 2rem;">English 🇺🇸</h2>
      <div class="post-list">
        {% for post in en_posts %}
          <article class="post-card">
            <h3 class="post-card__title">
              <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            </h3>
            <p class="post-card__meta">
              <span>{{ post.date | date_to_string }}</span>
              {% if post.category %}
                • <span>{{ post.category }}</span>
              {% endif %}
            </p>
            {% if post.excerpt %}
              <p class="post-card__excerpt">
                {{ post.excerpt | strip_html | truncate: 180 }}
              </p>
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
    {% endif %}

    {% if pt_posts.size > 0 %}
      <h2 class="section__title" style="margin-top: 2rem;">Português 🇧🇷</h2>
      <div class="post-list">
        {% for post in pt_posts %}
          <article class="post-card">
            <h3 class="post-card__title">
              <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            </h3>
            <p class="post-card__meta">
              <span>{{ post.date | date_to_string }}</span>
              {% if post.category %}
                • <span>{{ post.category }}</span>
              {% endif %}
            </p>
            {% if post.excerpt %}
              <p class="post-card__excerpt">
                {{ post.excerpt | strip_html | truncate: 180 }}
              </p>
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
    {% endif %}
  </div>
</section>
