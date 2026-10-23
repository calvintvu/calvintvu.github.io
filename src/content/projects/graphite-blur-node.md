---
title: 'graphite: blur node'
description: 'contributed to an open source 2d raster graphics editor by implementing image blurring algorithms'
date: '2025-04-29T12:00:00-07:00'
draft: false
showHeroImage: false
icon: 'palette'
authors:
  - name: 'calvintvu'
    url: 'https://github.com/calvintvu'
links:
  - label: 'pr'
    href: 'https://github.com/GraphiteEditor/Graphite/pull/2477'
    kind: github
  - label: 'graphite'
    href: 'https://graphite.rs'
    kind: website
tags:
  - rust
  - oss
comments: false
sidebar:
  enable: false
  toc: false
  relatedPosts: false
---

[Graphite](https://graphite.rs) is an open-source, node-based vector and raster graphics editor written in Rust. I added a **Blur** node to its raster category, closing [issue #995](https://github.com/GraphiteEditor/Graphite/issues/995).

- **Pull request:** [GraphiteEditor/Graphite#2477](https://github.com/GraphiteEditor/Graphite/pull/2477) (merged)

## What it does

- Gaussian blur and box blur, selectable on the same node
- Lives in the node graph's standard library (`node-graph/gstd`), so it composes with the rest of Graphite's raster nodes
