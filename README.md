## SafeNest – Realtime Family Safety & Presence

SafeNest is a production-ready React Native (Expo) application that provides **realtime family location tracking**, **device health awareness**, and **weather-based safety recommendations** on top of **Firebase**.

The app is architected for internship-level portfolios: clean folder structure, service-based data layer, dark cyber UI, and fully EAS- and GitHub-ready.

---

### Features

- **Realtime family tracking**
  - Live map of all family devices using Firestore subscriptions
  - Per-member online/offline status with 30s freshness window
  - Background location tracking with Expo Location & Task Manager
- **Device-aware safety**
  - Battery percentage synced to Firestore and member cards
  - Online/offline detection (app foreground/background + lastOnline)
- **Weather-aware recommendations**
  - OpenWeatherMap integration via env-based API key
  - Per-member local weather card + safety recommendation rules:
    - Temp \> 35 → Heat Alert
    - Temp \< 10 → Cold Alert
    - Rain \> 60% → Carry Umbrella
    - Wind \> 40km/h → Stay Cautious
    - Otherwise → Conditions Normal
- **Profile management**
  - Avatar upload to Firebase Storage (`profiles/{uid}.jpg`)
  - Editable name and role chips (Parent / Child / Guardian / etc.)
  - Realtime battery %, last online, and online/offline status
- **Dark cyber UI**
  - Global theme with cyber-tech palette
  - Dark-styled Google map, neon markers, subtle animations
- **Production-readiness**
  - Clean TypeScript, service-based architecture
  - Environment-driven secrets, Firebase rules, EAS profiles

---

### Architecture

**Tech stack**

- **Frontend**: React Native (Expo SDK 55), TypeScript
- **Realtime backend**: Firebase Auth + Firestore
- **Storage**: Firebase Storage
- **Device APIs**: Expo Location, Task Manager, Battery, Image Picker
- **Maps**: `react-native-maps` (Google Maps)
- **Weather**: OpenWeatherMap REST API

**High-level flow**

- App boot:
  - Auth subscription resolves current user
  - User document subscription yields `familyId` and status fields
  - Background location tracking is started
  - Battery + GPS location are fetched once and pushed via `userStatusService`
  - A battery listener pushes level changes at most every 60 seconds
- Presence lifecycle:
  - When app goes to background/inactive → `markUserOffline`
  - When app returns to foreground → `updateUserRealtimeStatus`
  - Background task keeps user and family member docs’ `currentLocation` / `lastLocation` + `lastOnline` updated while tracking
- Map screen:
  - Subscribes to `families/{familyId}/members` in realtime
  - Renders custom `MemberMarker` with neon border + pulse when online
  - Bottom sheet shows profile, battery, last online, weather, recommendation
- Profile screen:
  - Subscribes to `users/{uid}` for live device status
  - Loads editable profile data from user or family member doc
  - Uploads avatar to `profiles/{uid}.jpg` and syncs user + member docs

---

### Folder Structure

```text
src/
  screens/
    LoginScreen.tsx         # Auth UI only
    FamilySetupScreen.tsx   # Join/create family UI
    HomeScreen.tsx          # Shell around map/profile
    MapScreen.tsx           # Map UI consuming hooks/services
    ProfileScreen.tsx       # Profile UI consuming services

  components/
    MemberMarker.tsx        # Neon marker avatar with pulse
    WeatherCard.tsx         # Weather + recommendation card
    BottomSheet.tsx         # Animated bottom sheet

  services/
    authService.ts          # Auth helpers (login/signup/logout)
    familyService.ts        # Family + members subscriptions
    locationService.ts      # Foreground + background location
    deviceService.ts        # Battery-level and subscriptions
    weatherService.ts       # OpenWeatherMap client + rules
    userStatusService.ts    # Realtime presence updates
    profileService.ts       # Profile load/save/photo upload
    backgroundLocationTask.ts  # TaskManager handler

  hooks/
    useFamilyMembers.ts     # Realtime family members list
    useWeather.ts           # Debounced weather fetching

  theme/
    theme.ts                # Global dark cyber theme

  utils/
    formatters.ts           # Last online, battery, online logic
    errorHandler.ts         # Standardized error logging/messages

  config/
    firebase.ts             # Firebase app/auth/db/storage
```

All Firebase and side-effect logic is contained in `services/`. Screens are UI-only and interact via services + hooks.

---

### Firebase Setup

1. **Create a Firebase project**
   - Enable **Email/Password** auth.
   - Create a **Firestore** database (in production mode).
   - Create a **Storage** bucket.

2. **Configure the Firebase client**
   - Update `src/config/firebase.ts` with your project’s config object.

3. **Apply Firestore rules**

   In the Firebase console (Firestore → Rules), paste the contents of `firestore.rules`:

   - Users can only read/write their own document (`users/{uid}`)
   - Family members can read their family (`families/{familyId}`)
   - Members can only create/update/delete their own member docs

4. **Apply Storage rules**

   In the Firebase console (Storage → Rules), paste `storage.rules`:

   - `profiles/{uid}.jpg` can only be written when `auth.uid == userId`
   - Avatars are readable, everything else locked down

---

### Weather API Setup (OpenWeatherMap)

1. Create a free account at `https://openweathermap.org`.
2. Generate an API key.
3. Create your `.env` file (or update it) in the project root:

```bash
EXPO_PUBLIC_WEATHER_API_KEY=YOUR_API_KEY_HERE
```

4. Restart the Expo dev server so `process.env.EXPO_PUBLIC_WEATHER_API_KEY` is available.

The `weatherService` will now fetch live weather for the selected member’s coordinates and compute a safety recommendation.

---

### Running the App (Expo)

Install dependencies:

```bash
npm install
```

Start the Expo dev server:

```bash
npm start
```

Then:

- Press `a` for Android emulator or device
- Press `w` for web
- Or scan the QR code with the Expo Go app

---

### EAS Build Configuration

The project includes an `eas.json` with three build profiles:

- **development**
  - Uses the development client
  - Internal distribution
  - Android build type: `apk`
- **preview**
  - Internal test builds
  - Android `apk`
- **production**
  - Store-ready builds
  - Android `app-bundle` (AAB)

**Basic EAS setup**

```bash
npm install -g eas-cli
eas login
eas init
```

**Android APK build (development profile)**

```bash
eas build -p android --profile development
```

**Production Android build**

```bash
eas build -p android --profile production
```

Once the build completes, EAS will provide a download URL or upload the app directly to the Play Console (for production).

---

### GitHub Setup

Ensure `.gitignore` is present (Node modules, Expo artifacts, `.env`, etc. are ignored).

Initialize the repository and push to GitHub:

```bash
git init
git add .
git commit -m "Final Production SafeNest Build"
git remote add origin YOUR_GITHUB_REMOTE_URL
git branch -M main
git push -u origin main
```

Replace `YOUR_GITHUB_REMOTE_URL` with your actual GitHub repository URL.

---

### Screenshots (Placeholders)

- `screenshots/login.png` – dark cyber login
- `screenshots/map.png` – realtime family map with neon markers
- `screenshots/profile.png` – profile with battery & status

Add real screenshots to a `screenshots/` folder and embed them in this section for your portfolio.

---

### Future Improvements

- Push notifications for:
  - Low battery thresholds
  - Member entering/leaving safe zones
  - Extreme weather alerts near family members
- Geofencing and place labels (home, school, work)
- Web dashboard for family overview
- Per-member privacy controls and temporary sharing links
- Offline caching of last known family locations
- Enhanced analytics / audit trail of location pings (e.g., BigQuery export)

SafeNest is now structured and implemented to demonstrate **realtime systems**, **device integrations**, **third-party APIs**, **clean architecture**, and **deployment readiness** — ideal for an internship-ready portfolio project.

