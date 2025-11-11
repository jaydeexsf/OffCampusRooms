# Backend Setup and Running Instructions

## Prerequisites

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **MongoDB Connection String**
   - You need a MongoDB database (local or cloud like MongoDB Atlas)
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database_name`

3. **Clerk Secret Key**
   - Get from your Clerk dashboard: https://dashboard.clerk.com/
   - Used for authentication

4. **Google Maps API Key** (optional but recommended)
   - Get from Google Cloud Console
   - Used for distance calculations

## Quick Start

### Option 1: Use the PowerShell Script (Recommended for Windows)
```powershell
cd BackEnd
.\start-backend.ps1
```

### Option 2: Use the Batch Script (Windows Command Prompt)
```cmd
cd BackEnd
start-backend.bat
```

### Option 3: Manual Setup

1. **Install Dependencies**
   ```bash
   cd BackEnd
   npm install
   ```

2. **Create .env File**
   Create a `.env` file in the `BackEnd` directory with:
   ```env
   MONGO_URI=your_mongodb_connection_string_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here
   GOOGLE_API_KEY=your_google_maps_api_key_here
   PORT=5000
   ```

3. **Start the Server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `CLERK_SECRET_KEY` | Yes | Clerk authentication secret key |
| `GOOGLE_API_KEY` | No | Google Maps API key for distance calculations |
| `PORT` | No | Server port (default: 5000) |

## Server Endpoints

The server will run on `http://localhost:5000` by default (or the port specified in `.env`).

### API Routes:
- `/api/rooms` - Room management
- `/api/faq` - FAQ management
- `/api/comments` - Comment management
- `/api/ratings` - Rating management
- `/api/drivers` - Driver management
- `/api/rides` - Ride booking
- `/api/feedback` - Feedback management
- `/api/saved-rooms` - Saved rooms
- `/api/statistics` - Statistics
- `/api/google` - Google Maps distance calculations

## Troubleshooting

### Node.js not found
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation
- Verify with `node --version`

### MongoDB connection error
- Check your `MONGO_URI` in the `.env` file
- Ensure MongoDB is running (if local) or accessible (if cloud)
- Verify network connectivity

### Clerk authentication error
- Verify your `CLERK_SECRET_KEY` is correct
- Check that the key has the necessary permissions

### Port already in use
- Change the `PORT` in `.env` to a different port (e.g., 5001)
- Or stop the process using port 5000

## Development Mode

For development with auto-reload on file changes:
```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

