# 🚂 Train Schedule (Mobile App)

A mobile application for viewing train schedules, built with React Native and Expo.

## 🚀 Features

- 📅 Real-time train schedule viewing
- 🔍 Search and filter trains by various parameters
- ⭐ Save favorite routes
- 🎨 User-friendly and intuitive interface
- 📱 Cross-platform support (iOS, Android, Web)
- 📶 Offline access to saved data

## 🛠 Technologies

### Core Libraries
- **React Native** - Framework for building native mobile apps
- **Expo** - Platform for cross-platform app development
- **TypeScript** - Typed JavaScript for reliable code
- **Redux Toolkit** - State management
- **React Navigation** - Screen navigation
- **Expo Router** - File-based routing in Expo

### User Interface
- **React Native Paper** - Material Design components
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Gesture handling
- **Lucide Icons** - Modern icon set

### Data Management
- **Axios** - HTTP client for API requests
- **Redux Persist** - State persistence
- **Formik + Yup** - Forms and validation
- **Socket.IO** - Real-time WebSocket communication

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9+ or yarn
- Git
- Expo CLI (install with: `npm install -g expo-cli`)
- For iOS: Xcode (Mac only)
- For Android: Android Studio

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/train-schedule-mobile.git
   cd train-schedule-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the application:
   ```bash
   # Web version
   npm run web
   
   # iOS simulator (Mac only)
   npm run ios
   
   # Android emulator
   npm run android
   
   # Or use Expo Go for device testing
   npx expo start
   ```

## 📂 Project Structure

```
/
├── app/                  # Main application directory
│   ├── (app)/           # Route groups
│   ├── _layout.tsx      # Root layout
│   └── index.tsx        # Main screen
├── assets/              # Static files (images, fonts)
├── components/          # Reusable components
├── hooks/               # Custom React hooks
├── store/               # Redux store and slices
├── utils/               # Utility functions
├── app.json             # Expo configuration
└── package.json         # Dependencies and scripts
```

## 📝 Available Scripts

- `npm start` - Start the development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator (Mac only)
- `npm run web` - Run web version
- `npm run lint` - Lint code with ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by Train Schedule Team
