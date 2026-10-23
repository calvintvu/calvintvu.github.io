---
title: 'autosampler'
description: 'web app that generates variations of drum samples with an audio-to-audio model, plus text-to-audio generation'
date: '2025-03-03T12:00:00-08:00'
draft: false
showHeroImage: false
icon: 'github'
authors:
  - name: 'calvintvu'
    url: 'https://github.com/calvintvu'
links:
  - label: 'repo'
    href: 'https://github.com/calvintvu/autosampler'
    kind: github
tags:
  - javascript
  - python
  - ml
comments: false
sidebar:
  enable: false
  toc: false
  relatedPosts: false
---

autosampler is a web app for generating variations of drum samples. Upload a sample and an audio-to-audio model produces new takes on it; there is also a text-to-audio mode for generating sounds from a prompt.

- **Repository:** [github.com/calvintvu/autosampler](https://github.com/calvintvu/autosampler)
- **Live demo:** [autosampler.onrender.com](https://autosampler.onrender.com)

## Stack

- React frontend
- FastAPI backend serving PyTorch models
- Docker Compose for local setup

## Running it locally

```sh
git clone https://github.com/calvintvu/autosampler
cd autosampler
docker compose up -d
```
