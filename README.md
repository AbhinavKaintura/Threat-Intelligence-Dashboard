# 🛡️ ThreatIntel Dashboard

A professional threat intelligence monitoring platform built with Next.js, TypeScript, and modern UI components.

## Deployment: 
[Threat Intelligence Dashboard Deployment](https://threat-intelligence-dashboard-i293.vercel.app)

## ✨ Features

- **Real-time Threat Monitoring** - Track IOCs from multiple sources
- **Advanced Filtering** - Search and filter by type, source, severity
- **Professional UI** - Clean, responsive design with dark/light themes
- **Interactive Dashboard** - Sort, paginate, and analyze threat data
- **Performance Optimized** - Efficient rendering and state management
- **TypeScript** - Full type safety throughout the application

## 🚀 Quick Start

#### Install dependencies
npm install

#### Run development server
npm run dev

#### Build for production
npm run build
npm start


## 🏗️ Architecture

src/
├── app/ # Next.js App Router

├── components/ # Reusable UI components

├── store/ # Zustand state management

├── types/ # TypeScript definitions

├── lib/ # Utility functions

└── hooks/ # Custom React hooks



## 🎨 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS Variables
- **State Management**: Zustand with persistence
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Components**: Custom component system with CVA

## 🔧 Configuration

Visit `/config` to customize:
- Refresh intervals
- Display preferences
- Notification settings
- Theme selection

## 📊 Data Sources

Currently supports:
- Blocklist.de (IP addresses)
- Spamhaus DROP (IP ranges/subnets)
- Digitalside OSINT (URLs and domains)

## 🌙 Theme Support

Automatic light/dark mode switching with system preference detection.

## 📱 Responsive Design

Optimized for desktop, tablet, and mobile devices.

---

Built with ❤️ for security professionals



## What I've Built 


✅ Core Features
Real-time data fetching with loading states

Advanced filtering with debounced search

Professional pagination with navigation controls

Sortable data table with multiple sort options

Statistics dashboard with animated cards

Theme switching (light/dark/system)

Responsive design for all screen sizes

✅ Professional UI/UX
Enterprise-grade design without emojis

Consistent typography with proper hierarchy

Smooth animations using Framer Motion

Accessible components with ARIA support

Professional color scheme with CSS variables

Loading states and empty state handling

✅ Technical Excellence
TypeScript throughout for type safety

Zustand for efficient state management

Component-based architecture for reusability

Performance optimized with proper memoization

Error handling with toast notifications

Clean folder structure following best practices

✅ Advanced Features
Configuration page for user preferences

Navigation system with active state

Toast notifications for user feedback

Copy to clipboard functionality

External link handling for URLs

Data persistence with localStorage

This dashboard represents professional-level React/Next.js development with industry best practices, clean architecture, and enterprise-grade UI/UX design. Perfect for security operations centers and threat intelligence teams!


Why This Architecture is Professional
Single Source of Truth: All data lives in one place

Predictable Updates: Data flows in one direction

Easy Testing: Store logic is separate from UI

Performance: Only components using changed data re-render

Developer Experience: Easy to debug and understand data flow




Professional Architecture Flow:
tsconfig.json → Sets up TypeScript rules and path aliases

tailwind.config.js → Defines design system and styling

types/*.ts → Defines data structures and contracts

lib/utils.ts → Provides reusable helper functions

Components → Use all of the above for type-safe, styled, functional UI


### Tailwind issues

What I found:

tailwind@4.0.0
tailwindcss@4.1.13
postcss@8.5.6
autoprefixer@10.4.21
The Problem: You had two different Tailwind packages installed:

tailwind (CLI tool for v4)
tailwindcss (the actual CSS framework)
This is like having two different versions of the same library fighting each other!


#### other problem
Next.js expects CommonJS format for config files
The plugin configuration needs to be an object, not an array

🎯 Key Learning Points:
Always check for package conflicts when CSS frameworks don't work
Configuration files matter - wrong syntax breaks everything
Cache clearing is essential after major changes
Systematic debugging beats random trial-and-error
Version compatibility is crucial in modern web development

