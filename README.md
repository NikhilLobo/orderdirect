# OrderDirect 🍔🍕

A modern, full-stack restaurant food ordering platform built with React, TypeScript, and Firebase.

## 🚀 Tech Stack

- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS v4 + shadcn/ui components
- **State Management:** Redux Toolkit (client state) + React Query (server state)
- **Routing:** React Router v6
- **Testing:** Vitest + React Testing Library
- **Backend & Database:** Firebase (Firestore, Authentication, Storage)
- **Hosting:** Firebase Hosting / Vercel

## 📁 Project Structure

```
orderdirect/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── common/          # Header, Footer, etc.
│   │   ├── restaurant/      # Restaurant-specific components
│   │   ├── cart/            # Cart components
│   │   ├── order/           # Order components
│   │   └── auth/            # Authentication components
│   ├── pages/               # Page components
│   ├── providers/           # React Query provider
│   ├── services/            # Firebase and API services
│   ├── store/               # Redux store and slices
│   │   └── slices/          # Redux slices (auth, cart)
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration files (Firebase, etc.)
│   ├── test/                # Test utilities and setup
│   └── assets/              # Images, icons, etc.
├── public/                  # Static assets
└── ...config files
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - **Authentication** (Email/Password, Google Sign-in)
   - **Firestore Database**
   - **Storage**
3. Copy your Firebase configuration from Project Settings
4. Create a `.env` file in the root directory (use `.env.example` as template)
5. Add your Firebase credentials to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 🔥 Firebase Setup

### Firestore Database Structure

```
users/
  {userId}/
    - email: string
    - name: string
    - phone: string
    - addresses: array
    - createdAt: timestamp

restaurants/
  {restaurantId}/
    - name: string
    - description: string
    - image: string
    - rating: number
    - cuisines: array
    - location: object
    - isOpen: boolean

menuItems/
  {menuItemId}/
    - restaurantId: string
    - name: string
    - description: string
    - price: number
    - category: string
    - isVeg: boolean
    - isAvailable: boolean

orders/
  {orderId}/
    - userId: string
    - restaurantId: string
    - items: array
    - status: string
    - total: number
    - createdAt: timestamp
```

### Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Anyone can read restaurants and menu items
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users
    }

    match /menuItems/{menuItemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Users can only read/write their own orders
    match /orders/{orderId} {
      allow read: if request.auth != null &&
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
                       resource.data.userId == request.auth.uid;
    }
  }
}
```

## 📦 Key Features (Planned)

- [ ] User authentication (Email/Password, Google Sign-in)
- [ ] Browse restaurants by location and cuisine
- [ ] View restaurant menus with customization options
- [ ] Add items to cart with real-time updates
- [ ] Place orders with multiple payment options
- [ ] Track order status in real-time
- [ ] User profile and order history
- [ ] Restaurant ratings and reviews
- [ ] Search and filter functionality
- [ ] Responsive design for all devices

## 🎨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

MIT License - feel free to use this project for learning purposes.

## 🔗 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://tanstack.com/query/latest)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)

## 📚 Additional Documentation

- [Redux + Testing Setup Guide](REDUX_TESTING_SETUP.md) - Detailed state management and testing documentation
- [Development Checklist](DEVELOPMENT_CHECKLIST.md) - Complete feature checklist
