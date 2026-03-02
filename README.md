🚀 SafeNest – Realtime Family Safety & Tracking App

SafeNest is a production-ready realtime family tracking application built with React Native (Expo) and Firebase.

It provides:

📍 Live family location tracking

🔋 Device battery monitoring

🌦️ Weather-based safety alerts

🟢 Online / Offline presence detection

👤 Profile & avatar management


Designed with clean architecture, service-layer separation, and deployment-ready configuration.


---

🔗 Live Links

GitHub Repository
👉 https://github.com/siddhart3000/SafeNest-App

Expo Project
👉 https://expo.dev/accounts/siddharth_singhgkp/projects/SafeNest


---

✨ Core Features

📍 Realtime Location Tracking

Live map of family members

Firestore realtime subscriptions

Background tracking using Expo Location & Task Manager

Online/offline detection (30-second freshness logic)


🔋 Device Health Monitoring

Realtime battery percentage sync

Last online timestamp tracking

Presence updates on foreground/background state


🌦️ Weather-Based Safety System

OpenWeatherMap API integration

Automatic safety recommendations:

Temp > 35°C → Heat Alert

Temp < 10°C → Cold Alert

Rain > 60% → Carry Umbrella

Wind > 40km/h → Stay Cautious

Otherwise → Conditions Normal



👤 Profile Management

Avatar upload to Firebase Storage (profiles/{uid}.jpg)

Editable name & role (Parent / Child / Guardian)

Realtime battery & status display


🌙 Dark Cyber UI

Global theme system

Dark Google Map styling

Neon markers with pulse animation

Bottom sheet interaction UI



---

🏗️ Architecture Overview

Tech Stack

Layer	Technology

Frontend	React Native (Expo SDK 55)
Language	TypeScript
Authentication	Firebase Auth
Realtime DB	Firestore
Storage	Firebase Storage
Maps	react-native-maps
Weather	OpenWeatherMap API
Build	EAS CLI



---

🔄 Application Flow

App Initialization

Firebase Auth subscription resolves user

Firestore user doc fetches familyId

Background tracking starts

Battery + GPS synced via userStatusService

Presence listener attaches


Presence Logic

Foreground → mark online

Background → mark offline

Background task updates:

currentLocation

lastLocation

lastOnline



Map Screen

Subscribes to families/{familyId}/members

Renders custom animated markers

Bottom sheet displays:

Profile

Battery

Weather

Safety recommendation




---

📁 Project Structure

src/
  screens/
  components/
  services/
  hooks/
  theme/
  utils/
  config/

All Firebase logic is contained inside /services.
UI remains clean and modular.


---

🔥 Firebase Setup

1. Create a Firebase project


2. Enable Email/Password Authentication


3. Enable Firestore (Production Mode)


4. Enable Firebase Storage



Update:

src/config/firebase.ts

Apply provided:

firestore.rules

storage.rules



---

🌦️ Weather API Setup

Create a .env file in root:

EXPO_PUBLIC_WEATHER_API_KEY=YOUR_API_KEY_HERE

Restart Expo after adding.


---

▶️ Running the App

Install dependencies:

npm install

Start development server:

npm start

Press:

a → Android

w → Web



---

📦 EAS Build

Install EAS CLI:

npm install -g eas-cli

Login:

eas login

Preview Build (APK):

eas build -p android --profile preview

Production Build (AAB):

eas build -p android --profile production


---

🎯 Why This Project Stands Out

Realtime Firestore architecture

Background location tracking

Presence system implementation

API integration (weather logic engine)

Service-based architecture

Production-ready EAS build setup

Clean TypeScript structure


This demonstrates understanding of:

Realtime systems

Mobile device APIs

Backend-as-a-service architecture

Deployment workflows

Scalable code organization



---

🚧 Future Improvements

Push notifications

Geofencing (Home / School zones)

Web dashboard

Admin analytics panel

Location history timeline

Privacy controls per member



---

👨‍💻 Author

Siddharth Singh
GitHub: https://github.com/siddhart3000

