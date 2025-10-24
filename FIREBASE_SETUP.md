# Firebase Backend Setup Guide

This guide helps you configure all Firebase services for OrderDirect.

## Prerequisites
- Firebase project created: `orderdirect-a6c38`
- Firebase config added to `.env`
- Firestore and Authentication enabled

---

## 1. Firestore Security Rules

**Location:** Firebase Console → Firestore Database → Rules

Replace the test mode rules with production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function isRestaurantOwner(restaurantId) {
      return isSignedIn() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.restaurantId == restaurantId;
    }

    match /users/{userId} {
      allow read: if isSignedIn() && request.auth.uid == userId;
      allow write: if isSignedIn() && request.auth.uid == userId;
    }

    match /restaurants/{restaurantId} {
      allow read: if true;
      allow update: if isRestaurantOwner(restaurantId);
      allow create: if true;
      allow delete: if isRestaurantOwner(restaurantId);

      match /menu/{itemId} {
        allow read: if true;
        allow write: if isRestaurantOwner(restaurantId);
      }
    }

    match /orders/{orderId} {
      allow create: if true;
      allow read: if isRestaurantOwner(resource.data.restaurantId);
      allow update: if isRestaurantOwner(resource.data.restaurantId);
    }
  }
}
```

**Click "Publish"**

---

## 2. Firestore Indexes

**Location:** Firebase Console → Firestore Database → Indexes

### Index 1: Orders Query
- **Collection:** `orders`
- **Fields:**
  - `restaurantId` (Ascending)
  - `status` (Ascending)
  - `createdAt` (Descending)

### Index 2: Subdomain Lookup
- **Collection:** `restaurants`
- **Fields:**
  - `subdomain` (Ascending)

**Note:** Firebase may auto-create these when you run queries. Check the Indexes tab for any required indexes.

---

## 3. Firebase Storage Setup

### Enable Storage
1. Go to Firebase Console → Storage
2. Click "Get started"
3. Start in production mode
4. Choose same region as Firestore (e.g., `europe-west2`)
5. Click "Done"

### Storage Security Rules
**Location:** Firebase Console → Storage → Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /restaurants/{restaurantId}/menu/{imageId} {
      allow read: if true;
      allow write: if request.auth != null &&
                   firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.restaurantId == restaurantId;
    }

    match /restaurants/{restaurantId}/profile/{imageId} {
      allow read: if true;
      allow write: if request.auth != null &&
                   firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.restaurantId == restaurantId;
    }
  }
}
```

**Click "Publish"**

---

## 4. Authentication Configuration

**Location:** Firebase Console → Authentication → Settings

### Email Enumeration Protection
- Enable "Email enumeration protection"
- This prevents attackers from discovering valid email addresses

### Authorized Domains
Make sure these domains are authorized:
- `localhost` (for development)
- `orderdirect.co.uk` (for production - add when deploying)
- Your Vercel/Netlify domain (add when deploying)

---

## 5. Test the Setup

### Test Restaurant Signup
1. Run the dev server: `npm run dev`
2. Go to `http://localhost:5175/signup`
3. Fill in the form with test data
4. Submit the form
5. Check Firebase Console → Firestore Database
6. Verify collections created: `restaurants` and `users`

### Check Security Rules
1. In Firestore, go to Rules tab
2. Click "Rules Playground"
3. Test read/write operations
4. Ensure unauthorized access is denied

---

## 6. Production Checklist

Before going live:

- [ ] Security rules published (not in test mode)
- [ ] Indexes created
- [ ] Storage rules configured
- [ ] Authorized domains added
- [ ] Email enumeration protection enabled
- [ ] Backup strategy in place (Firestore exports)
- [ ] Monitoring enabled (Firebase Console → Analytics)

---

## Firestore Data Structure

```
restaurants/
  {restaurantId}/
    - name: string
    - subdomain: string
    - ownerName: string
    - ownerEmail: string
    - phone: string
    - stripeAccountId: string | null
    - subscriptionStatus: "trial" | "active" | "canceled"
    - subscriptionPlan: "standard"
    - createdAt: timestamp
    - updatedAt: timestamp

    menu/
      {itemId}/
        - name: string
        - description: string
        - price: number
        - category: string
        - imageUrl: string | null
        - available: boolean
        - createdAt: timestamp

users/
  {userId}/
    - email: string
    - name: string
    - restaurantId: string (ref to restaurant)
    - role: "owner"
    - createdAt: timestamp

orders/
  {orderId}/
    - restaurantId: string (ref to restaurant)
    - customerName: string
    - customerEmail: string
    - customerPhone: string
    - items: array
    - total: number
    - status: "new" | "preparing" | "ready" | "completed" | "canceled"
    - paymentStatus: "pending" | "paid" | "failed"
    - stripePaymentIntentId: string
    - createdAt: timestamp
    - updatedAt: timestamp
```

---

## Cost Estimation (Monthly)

### Free Tier Limits:
- **Firestore:**
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day
  - 1 GB storage

- **Authentication:**
  - Unlimited (free)

- **Storage:**
  - 5 GB storage
  - 1 GB/day downloads

### Estimated Usage (10 restaurants, 100 orders/day):
- Reads: ~15,000/day (well within free tier)
- Writes: ~500/day (well within free tier)
- Storage: ~500 MB (well within free tier)

**Expected cost: £0/month (Free tier)**

Once you scale beyond free tier:
- $0.06 per 100K reads
- $0.18 per 100K writes

---

## Support

For issues, check:
- Firebase Console → Project Overview → Usage & Billing
- Firebase Console → Firestore → Logs (for errors)
- Firebase Console → Authentication → Users (to verify signups)
