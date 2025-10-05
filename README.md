# Cricklog Application

## Project Overview
Cricklog is a comprehensive cricket match scoring application that allows users to manage teams, create matches, and record live scores with real-time updates.

## Technology Stack
- **Frontend**: Next.js 14+ with TypeScript + Tailwind CSS
- **Mobile**: React Native with TypeScript
- **Backend**: Express.js with Node.js + TypeScript
- **Database**: PostgreSQL + Redis
- **Hosting**: DigitalOcean + GitHub Actions CI/CD

## Project Structure
```
cricklog/
├── docs/
│   ├── requirements/
│   ├── user-stories/
│   ├── technical-specs/
│   └── planning/
├── frontend/          # Next.js web application
├── backend/           # Express.js API
├── mobile/            # React Native app
├── .github/workflows/ # GitHub Actions CI/CD
├── nginx/             # Nginx configuration
└── scripts/           # Deployment scripts
```

## Getting Started
1. Review the requirements document in `docs/requirements/`
2. Check user stories in `docs/user-stories/`
3. Review technical specifications in `docs/technical-specs/`
4. Set up development environment following the deployment guide

## Deployment
- **Repository**: https://github.com/arun-nex/cricklog.git
- **Frontend Port**: 3000
- **Backend Port**: 4000
- **Deployment**: Automated via GitHub Actions to DigitalOcean
