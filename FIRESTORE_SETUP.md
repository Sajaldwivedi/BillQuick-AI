# Firestore Setup Guide

## Index Requirements

The application requires composite indexes for efficient querying. This guide will help you set up the necessary indexes.

## Required Indexes

### 1. Bills Collection Index
- **Collection**: `bills`
- **Fields**: 
  - `userId` (Ascending)
  - `createdAt` (Descending)

### 2. Products Collection Index
- **Collection**: `products`
- **Fields**:
  - `userId` (Ascending)
  - `name` (Ascending)

## Setup Methods

### Method 1: Using Firebase Console (Recommended)

1. Go to the [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Indexes**
4. Click **Create Index**
5. Create the following indexes:

#### Bills Index:
- Collection ID: `bills`
- Fields:
  - Field path: `userId`, Order: `Ascending`
  - Field path: `createdAt`, Order: `Descending`

#### Products Index:
- Collection ID: `products`
- Fields:
  - Field path: `userId`, Order: `Ascending`
  - Field path: `name`, Order: `Ascending`

### Method 2: Using Firebase CLI

1. Install Firebase CLI if you haven't already:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project (if not already done):
   ```bash
   firebase init firestore
   ```

4. Deploy the indexes:
   ```bash
   firebase deploy --only firestore:indexes
   ```

### Method 3: Direct Link (Quick Setup)

If you're getting the index error, you can click the link provided in the error message to create the index directly:

```
https://console.firebase.google.com/v1/r/project/billquick-ai/firestore/indexes/...
```

## Index Building Time

After creating the indexes, they will take a few minutes to build. You can monitor the progress in the Firebase Console under **Firestore Database** → **Indexes**.

## Fallback Implementation

The application includes a fallback mechanism that will work even if indexes are not created:

- If an index is missing, the app will fetch all documents and filter them client-side
- This is less efficient but ensures the app continues to work
- You'll see a warning in the console when this fallback is used

## Verification

To verify that indexes are working:

1. Create some test data with different users
2. Try generating AI insights
3. Check the browser console for any index-related warnings
4. Verify that data is properly filtered by user

## Troubleshooting

### Common Issues:

1. **Index still building**: Wait a few minutes for the index to finish building
2. **Permission denied**: Ensure you have the necessary permissions in Firebase
3. **Wrong field names**: Double-check that the field names match exactly

### Error Messages:

- `The query requires an index`: Create the missing index
- `Index not found`: The fallback mechanism will handle this automatically
- `Permission denied`: Check your Firebase security rules

## Performance Considerations

- Indexes improve query performance significantly
- Without indexes, queries will fall back to client-side filtering (slower)
- Monitor your Firestore usage to ensure you stay within limits

## Security Rules

Make sure your Firestore security rules are properly configured as defined in `firestore.rules` to ensure data isolation. 