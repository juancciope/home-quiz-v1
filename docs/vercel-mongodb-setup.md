# Vercel + MongoDB Atlas Setup Guide

## Step 1: Get Your MongoDB Connection String

1. Log into [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (it looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority
   ```

## Step 2: Create Database User (if not done)

1. In Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Create a username and strong password
4. Give "Read and write to any database" permission
5. Click "Add User"

## Step 3: Whitelist Vercel IPs

1. In Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is required for Vercel since it uses dynamic IPs
4. Click "Confirm"

## Step 4: Add to Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add new variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your connection string with actual username/password
   - **Environment**: Select all (Production, Preview, Development)
   
   Example:
   ```
   mongodb+srv://homemusic:MyStr0ngP@ssw0rd@cluster0.abc123.mongodb.net/home-music-quiz?retryWrites=true&w=majority
   ```

4. Click "Save"

## Step 5: Redeploy

1. Go to "Deployments" tab in Vercel
2. Click the three dots on your latest deployment
3. Click "Redeploy"
4. Select "Use existing Build Cache" → "Redeploy"

## Step 6: Test Your Setup

### Option A: Test via the Quiz
1. Go to your live site
2. Complete the quiz with a test email
3. Check MongoDB Atlas:
   - Go to "Browse Collections"
   - You should see your database created
   - Look for `artistprofiles`, `quizsubmissions`, and `leadevents` collections

### Option B: Check Vercel Function Logs
1. In Vercel dashboard, go to "Functions" tab
2. Click on "submit-lead"
3. View real-time logs to see MongoDB connection status

## Troubleshooting

### "MongoServerError: bad auth"
- Double-check username/password in connection string
- Make sure you're using database user credentials, not Atlas account login

### "MongoNetworkError"
- Verify IP whitelist includes 0.0.0.0/0
- Check cluster is active in Atlas

### "MONGODB_URI is not defined"
- Ensure environment variable is saved in Vercel
- Redeploy after adding environment variables

## What Happens Automatically

When someone completes the quiz:
1. MongoDB creates the database (first time only)
2. Creates collections based on our models (first time only)
3. Stores the artist profile
4. Stores the quiz submission
5. Creates an event record

No manual database or collection creation needed!

## Verify Data in MongoDB Atlas

1. Go to Atlas → "Browse Collections"
2. Select your database (e.g., `home-music-quiz`)
3. You'll see three collections:
   - `artistprofiles` - User profiles
   - `quizsubmissions` - Quiz results
   - `leadevents` - Activity tracking

## Data Storage

All quiz data is now stored exclusively in MongoDB:
- Lead information stored in artist profiles
- Quiz responses and results tracked
- No external webhook integrations needed