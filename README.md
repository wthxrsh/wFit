# wTrack - MERN Calorie and Workout Tracker

This is a full-stack MERN application for tracking daily caloric intake and workout routines.

## Features
- Log foods and calories consumed
- Log workouts and calories burnt
- Generate workout plans
- Dashboard for daily summary

## Deployment on Vercel

This project is configured for seamless deployment to Vercel. Follow these steps:

### 1. Vercel Project Setup

*   **Sign up or log in** to your [Vercel account](https://vercel.com).
*   Click the **"Add New..."** button and select **"Project"**.
*   **Import the Git Repository** where your project is hosted (e.g., GitHub, GitLab).

### 2. Configure the Project

Vercel should automatically detect that you are using Vite for the frontend. However, it's important to ensure the settings are correct.

*   **Framework Preset:** Should be `Vite`.
*   **Root Directory:** Should be `frontend`. This is very important. Vercel needs to know where your frontend code and `package.json` are located.
*   **Build & Output Settings:** Vercel will likely pre-fill these. They should be:
    *   **Build Command:** `vite build`
    *   **Output Directory:** `dist`
    *   **Install Command:** `npm install`

### 3. Add Environment Variables

Your application requires environment variables to connect to your database and manage authentication.

*   In your Vercel project settings, navigate to the **"Environment Variables"** section.
*   Add the following variables:
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A long, random string used to sign your authentication tokens.
    *   `NODE_ENV`: `production`

### 4. Deploy

*   Click the **"Deploy"** button.
*   Vercel will now build and deploy your application. The `vercel.json` file in the root directory will handle the routing, ensuring that API requests are sent to your backend and all other requests are served by your React frontend.

You're all set! Your application will be live at the domain provided by Vercel.
# wtrack-demo
