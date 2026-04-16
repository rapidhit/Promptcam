# PromptCam — AI Photo Editing Prompts App

A React Native / Expo app that gives users ready-to-copy AI photo editing prompts.

---

## 📁 Project Structure

```
PromptCam/
├── App.js                        ← Entry point + navigation
├── app.json                      ← Expo config (app name, icons, etc.)
├── package.json                  ← Dependencies
├── data/
│   └── templates.js              ← All prompt templates (add more here!)
├── context/
│   └── FavoritesContext.js       ← Favorites state (persisted with AsyncStorage)
├── components/
│   └── PromptCard.js             ← Reusable card component
└── screens/
    ├── BrowseScreen.js           ← Main browse screen with search + filters
    └── FavoritesScreen.js        ← Saved favorites screen
```

---

## 🚀 Setup & Run

### 1. Install Node.js
Download from https://nodejs.org (LTS version)

### 2. Install Expo CLI
```bash
npm install -g expo-cli eas-cli
```

### 3. Copy this project folder, then install dependencies
```bash
cd PromptCam
npm install
```

### 4. Start the app
```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone (available on Play Store / App Store).

---

## 📱 Build for Play Store

### 1. Create an Expo account
Go to https://expo.dev and sign up (free)

### 2. Log in
```bash
eas login
```

### 3. Configure build
```bash
eas build:configure
```

### 4. Build Android APK/AAB
```bash
eas build --platform android
```

This uploads your code to Expo's servers and gives you a download link for your `.aab` file.

### 5. Upload to Google Play Console
- Go to https://play.google.com/console
- Pay the one-time $25 developer fee
- Create a new app → Upload the `.aab` file → Fill in details → Publish

---

## ➕ Adding More Prompts

Open `data/templates.js` and add a new object to the `templates` array:

```js
{
  id: 17,                          // unique number
  title: "Your Style Name",
  category: "Moody",               // must match one in categories array
  emoji: "🌙",
  preview: "https://...",          // Unsplash image URL
  prompt: "Your full editing prompt here...",
  tags: ["tag1", "tag2", "tag3"],
},
```

---

## 🎨 Customizing

- **App name**: Edit `"name"` in `app.json`
- **Colors**: All colors are in each screen/component's `StyleSheet`
- **App icon**: Replace `assets/icon.png` (1024×1024 px)

---

## 📦 Dependencies Used

| Package | Purpose |
|---|---|
| expo | Core framework |
| @react-navigation/native | Screen navigation |
| @react-navigation/bottom-tabs | Bottom tab bar |
| react-native-safe-area-context | Safe area handling |
| @react-native-async-storage/async-storage | Persist favorites |
