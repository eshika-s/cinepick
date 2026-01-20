# Instructions for Apple Sign In setup:

1. Create a 'keys' folder in backend directory:
   mkdir backend/keys

2. Place your downloaded .p8 key file in backend/keys/
   - Rename it to: AuthKey.p8
   - Path should be: backend/keys/AuthKey.p8

3. Add these to your .env file:
   APPLE_CLIENT_ID=your-apple-service-id
   APPLE_TEAM_ID=your-apple-team-id
   APPLE_KEY_ID=your-apple-key-id
   APPLE_PRIVATE_KEY_PATH=./keys/AuthKey.p8
   APPLE_CALLBACK_URL=http://localhost:5000/api/auth/apple/callback
