# Brethren Of Like Faith Tabernacle (BOLFT) - FCT Website
**Developed by Williams Joseph**

A modern, high-performance web platform for BOLFT FCT, featuring a public information portal and a secure administrative management system.

## Project Structure

- `main-web/`: The public gateway for the church. Features sermons, testimonies, and general information. Built with Angular and Tailwind CSS.
- `admin-web/`: The secure management portal for church administrators. Handles sermon uploads and testimony moderation.
- `firestore.rules`: Security rules for the Firebase Firestore database.

## Key Features

- **Sermon Management**: Administrators can upload sermons with YouTube links and Google Drive audio IDs.
- **Direct Downloads**: Users can download sermon audio directly from Google Drive.
- **Testimony Portal**: Members can share testimonies, and administrators can manage them from the dashboard.
- **Secure Authentication**: Admin portal is protected by Firebase Authentication.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## Technology Stack

- **Frontend**: Angular 18+ (Standalone Components), Tailwind CSS
- **Backend/Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Sign-In & Email/Password)
- **Media Hosting**: YouTube (Video), Google Drive (Audio)

## Development Setup

### Prerequisite
Ensure you have Node.js and npm installed.

### Installation
1. Clone the repository.
2. For both `main-web` and `admin-web`:
   ```bash
   cd [directory]
   npm install
   ```

### Running Locally
To run the development servers manually:
- **Main Web**: `cd main-web && npm run dev` (Runs on `http://localhost:3002`)
- **Admin Web**: `cd admin-web && npm run dev` (Runs on `http://localhost:3001`)

Alternatively, use the recommended helper scripts for a clean start:
- `./clean_run_main.sh`
- `./clean_run_admin.sh`

## Deployment

This project is configured for Firebase Hosting with a multi-site setup.

### Sites
- **Main Web**: `bolftfct-church.web.app`
- **Admin Web**: `bolftfct-admin.web.app`

### Deploying
The recommended way to deploy updates is using the provided script:
```bash
./deploy.sh
```

Alternatively, you can run manual commands:
- Deploy everything: `firebase deploy`
- Main only: `firebase deploy --only hosting:main`
- Admin only: `firebase deploy --only hosting:admin`

## Documentation
The codebase is comprehensively commented to facilitate future updates and maintenance.

---
&copy; 2025 Brethren Of Like Faith Tabernacle. All rights reserved.
