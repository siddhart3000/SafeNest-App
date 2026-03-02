# 🚀 SafeNest – Realtime Family Safety & Presence App

SafeNest is a production-ready **realtime family tracking mobile application** built using **React Native (Expo) + Firebase**.

It enables families to monitor live location, device health, and weather-based safety insights — in a clean, scalable architecture designed for real-world deployment.

---

## 🔗 Live Links

**GitHub Repository**
👉 [https://github.com/siddhart3000/SafeNest-App](https://github.com/siddhart3000/SafeNest-App)

**Expo Project**
👉 [https://expo.dev/accounts/siddharth_singhgkp/projects/SafeNest](https://expo.dev/accounts/siddharth_singhgkp/projects/SafeNest/builds/7646cd64-b6d9-48c6-bfee-3af61682ae5f)

---

## ✨ Core Features

### 📍 Realtime Location Tracking

* Live family map view
* Firestore realtime subscriptions
* Background tracking using Expo Location + Task Manager
* Online/offline detection (30s freshness logic)
* Custom animated map markers

---

### 🔋 Device Health Monitoring

* Realtime battery percentage sync
* Foreground/background presence tracking
* Last online timestamp logging
* Automatic Firestore status updates

---

### 🌦️ Weather-Based Safety Engine

Integrated OpenWeatherMap API with intelligent recommendation system:

| Condition      | Action          |
| -------------- | --------------- |
| Temp > 35°C    | Heat Alert      |
| Temp < 10°C    | Cold Alert      |
| Rain > 60%     | Carry Umbrella  |
| Wind > 40 km/h | Stay Cautious   |
| Normal         | Conditions Safe |

---

### 👤 Profile & Role Management

* Firebase Storage avatar upload (`profiles/{uid}.jpg`)
* Editable name & role (Parent / Child / Guardian)
* Live battery + status indicator
* Realtime updates across family members

---

### 🌙 Dark Cyber UI

* Global theme system
* Custom Google Maps dark styling
* Neon marker animations
* Interactive bottom sheet UI

---

## 🏗️ Architecture Overview

### Tech Stack

| Layer          | Technology                 |
| -------------- | -------------------------- |
| Frontend       | React Native (Expo SDK 55) |
| Language       | TypeScript                 |
| Authentication | Firebase Auth              |
| Database       | Firestore (Realtime)       |
| Storage        | Firebase Storage           |
| Maps           | react-native-maps          |
| Weather API    | OpenWeatherMap             |
| Build System   | EAS CLI                    |

---

## 🔄 Application Flow

### 1️⃣ App Initialization

* Firebase Auth resolves session
* User document fetches `familyId`
* Background tracking service starts
* Battery + GPS synced
* Presence listener attaches

---

### 2️⃣ Presence Logic

* Foreground → mark `online`
* Background → mark `offline`
* Background task updates:

  * `currentLocation`
  * `lastLocation`
  * `lastOnline`

---

### 3️⃣ Map Screen

* Subscribes to:
  `families/{familyId}/members`
* Renders animated markers
* Bottom sheet displays:

  * Profile
  * Battery
  * Weather
  * Safety recommendation

---

## 📁 Project Structure

```
src/
  screens/
  components/
  services/
  hooks/
  theme/
  utils/
  config/
```

All Firebase logic is isolated inside `/services`.
UI remains modular and presentation-focused.

---

## 🔥 Firebase Setup

1. Create Firebase Project
2. Enable Email/Password Authentication
3. Enable Firestore (Production Mode)
4. Enable Firebase Storage

Update:

```
src/config/firebase.ts
```

Apply:

* `firestore.rules`
* `storage.rules`

---

## 🌦️ Weather API Setup

Create a `.env` file in root:

```
EXPO_PUBLIC_WEATHER_API_KEY=YOUR_API_KEY_HERE
```

Restart Expo after adding.

---

## ▶️ Running the App

Install dependencies:

```
npm install
```

Start development server:

```
npm start
```

Run on:

* `a` → Android
* `w` → Web

---

## 📦 EAS Build

Install EAS CLI:

```
npm install -g eas-cli
```

Login:

```
eas login
```

Preview APK:

```
eas build -p android --profile preview
```

Production AAB:

```
eas build -p android --profile production
```

---

## 🎯 Why This Project Stands Out

* Realtime Firestore architecture
* Background location tracking
* Presence system implementation
* API integration with rule-based safety engine
* Service-layer architecture
* Production-ready EAS configuration
* Clean TypeScript codebase

Demonstrates:

* Realtime systems design
* Mobile device API handling
* Backend-as-a-service integration
* Deployment workflows
* Scalable folder structure

---

## 🚧 Future Improvements

* Push notifications
* Geofencing (Home / School zones)
* Web dashboard
* Admin analytics panel
* Location history timeline
* Granular privacy controls

---

## 👨‍💻 Author

**Siddharth Singh**
GitHub: [https://github.com/siddhart3000](https://github.com/siddhart3000)

ptimize your GitHub profile README to match this positioning.
