# BOLFT FCT - Main Web Application

The public-facing portal for the Brethren Of Like Faith Tabernacle (BOLFT) FCT. This application provides the congregation and the public with access to sermons, testimonies, and church information.

## 🚀 Overview

The BOLFT Main Web is built with **Angular 18** and **Tailwind CSS**, offering a fast, responsive, and visually engaging experience. It integrates seamlessly with Firebase for real-time data and media hosting services like YouTube and Google Drive.

## ✨ Key Features

- **Dynamic Sermon Archive**: View and browse church sermons with integrated YouTube video playback.
- **Direct Media Access**: Download sermon audio directly from Google Drive with a single click.
- **Testimony Portal**: Read uplifting testimonies shared by church members.
- **Responsive Design**: optimized for mobile, tablet, and desktop viewing.
- **High Performance**: Built with Angular's Standalone components and signals for efficient state management.

## 🛠 Tech Stack

- **Framework**: Angular 18
- **Styling**: Tailwind CSS
- **State Management**: Angular Signals
- **Backend Service**: Firebase (Firestore)
- **Media**: Google Drive (Audio), YouTube (Video)

## 💻 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup & Installation

1. Navigate to the directory:
   ```bash
   cd main-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3002`.

## 📂 Architecture

- `src/app`: Core application logic and routing.
- `src/components`: Reusable UI components (Sermons, Testimonies, Home, etc.).
- `src/services`: Data services for Firebase integration.
- `src/assets`: Static assets, including images and logos.

## 📄 License

&copy; 2025 Brethren Of Like Faith Tabernacle. All rights reserved.
