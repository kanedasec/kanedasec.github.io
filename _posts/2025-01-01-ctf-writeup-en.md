---
title: "CTF Writeup: Escaping the Sandbox"
lang: en
category: "CTF"
tags:
  - CTF
  - Web
  - Sandbox
---

In this writeup I walk through an escape from a restricted sandbox environment
in a web challenge. The main ideas:

1. Enumerate what the sandbox actually restricts.
2. Look for differences between "blocked" APIs and "forgotten" ones.
3. Combine a small primitive into a full escape.

```js
// Minimal PoC
fetch('/internal/admin')
  .then(r => r.text())
  .then(console.log);
