# BOLFT FCT - Admin Management Portal

The secure administrative backend for the Brethren Of Like Faith Tabernacle (BOLFT) FCT website. This portal enables authorized personnel to manage sermons, testimonies, and other congregational content.

## 🚀 Overview

The BOLFT Admin Portal is a robust management interface built with **Angular 18**. It provides a secure, single-page application (SPA) experience for church administrators to keep the main website's content fresh and accurate.

## ✨ Key Features

- **Sermon Management**: Full CRUD (Create, Read, Update, Delete) capability for sermon records.
- **Audio/Video Integration**: Easily link YouTube videos and Google Drive audio files to church messages.
- **Testimony Moderation**: Review and publish testimonies shared by the congregation.
- **Secure Authentication**: Integrated with Firebase Authentication (Google Sign-In) to ensure only authorized admins can access the portal.
- **Admin Dashboard**: A clean, focused dashboard for quick access to frequent management tasks.

## 🛠 Tech Stack

- **Framework**: Angular 18
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **Reactive Programming**: RxJS & Angular Signals

## 💻 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup & Installation

1. Navigate to the directory:
   ```bash
   cd admin-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The portal will be available at `http://localhost:3001`.

## 📂 Architecture

- `src/app/components/admin`: Contains all administrative views (Dashboard, Login, Sermon Manager, etc.).
- `src/app/services`: Core services for authentication, data management, and system modals.
- `src/app/routes.ts`: Defines the secure routing structure for the portal.

## 📄 License

&copy; 2025 Brethren Of Like Faith Tabernacle. All rights reserved.
