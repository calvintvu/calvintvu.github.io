---
title: 'zoomassist'
description: 'discord bot that creates and schedules zoom meetings from chat'
date: '2021-03-28T12:00:00-07:00'
draft: false
showHeroImage: false
icon: 'code-2'
authors:
  - name: 'gurubac'
    url: 'https://github.com/gurubac'
  - name: 'calvintvu'
    url: 'https://github.com/calvintvu'
  - name: 'jmahir408'
    url: 'https://github.com/jmahir408'
links:
  - label: 'repo'
    href: 'https://github.com/gurubac/ZoomAssist'
    kind: github
tags:
  - python
comments: false
sidebar:
  enable: false
  toc: false
  relatedPosts: false
---

ZoomAssist is a Discord bot that brings Zoom setup into the Discord chat. A team project built at LA Hacks 2021, when every class was on Zoom.

- **Repository:** [github.com/gurubac/ZoomAssist](https://github.com/gurubac/ZoomAssist)

## What it does

- `!meeting` creates a new Zoom meeting and posts the link
- `.setschedule` stores a class schedule; `!zoomschedule` shows it, or one class's meeting times
- `!status` reports on the current meeting

## What changed along the way

We set out to sync Zoom chat with Discord in both directions, but reading meeting chat needs OAuth through an approved Zoom Marketplace app. With only JWT auth available in a weekend, we narrowed the scope to creating and scheduling meetings.
