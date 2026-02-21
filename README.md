# 🎬 Cinepick

🎬 **Intelligent Movie Recommendation App** - Discover your next favorite movie with mood-based suggestions, personalized recommendations, and social features!

## ✨ Features

### 🎯 Core Features
- **🎭 Mood-Based Recommendations** - Get movies based on your current mood
- **📚 Watchlist Management** - Add/remove movies from your personal watchlist
- **❤️ Like System** - Like/dislike movies to improve recommendations
- **🔍 Smart Search** - Search movies by title, genre, or mood
- **🎲 Movie Discovery** - Roulette-style movie discovery
- **📅 Movie Night Planner** - Plan movie nights with friends

### 🛡️ Authentication & Social
- **🔐 Google OAuth** - Secure authentication with Google
- **👤 User Profiles** - Personalized experience for each user
- **📊 User Stats** - Track your movie preferences and history

### 🎨 User Experience
- **📱 Responsive Design** - Works perfectly on all devices
- **🌙 Dark Theme** - Beautiful Netflix-inspired dark theme
- **⚡ Fast Performance** - Optimized for speed and smooth interactions
- **🎬 Beautiful UI** - Modern Material-UI components with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MySQL (local or cloud)
- TMDB API key ([Get it here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/eshika-s/cinepick.git
cd cinepick
```

2. **Install dependencies:**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

3. **Set up environment variables:**

Create `.env` file in the root directory:
```env
# TMDB API Key
TMDB_API_KEY=your_tmdb_api_key_here

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cinepick

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3005/auth/google/callback
```

4. **Start the application:**

**Quick Start (Recommended):**
```bash
npm run start:quick
```

**Full Development:**
```bash
npm run start:full
```

**Manual Start:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
npm run dev
```

### 🌐 Access Points

- **Frontend:** http://localhost:3005
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** - Beautiful UI components
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** with Express
- **TypeScript** - Type-safe development
- **MySQL** with Sequelize - Relational Database ORM
- **JWT** - Authentication tokens
- **Passport.js** - OAuth authentication
- **TMDB API** - Movie data source

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Concurrently** - Run multiple scripts
- **Nodemon** - Auto-restart development server

## 📁 Project Structure

```
cinepick/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   └── styles/            # Global styles and themes
├── backend/                # Backend source code
│   ├── src/
│   │   ├── config/        # Database and auth configuration
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # MySQL models (Sequelize)
│   │   ├── routes/        # API routes
│   │   └── types/         # TypeScript types
├── public/                # Static assets
└── scripts/              # Setup and utility scripts
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/search` - Search movies
- `GET /api/movies/:id` - Get movie details

### Recommendations
- `POST /api/recommendations/watchlist` - Add to watchlist
- `DELETE /api/recommendations/watchlist/:movieId` - Remove from watchlist
- `POST /api/recommendations/like/:movieId` - Like movie

## 🎨 Features in Detail

### 🎭 Mood Picker
- **6 Mood Categories:** Happy, Thriller, Cozy, Mind-Bending, Romantic, Epic
- **Smart Recommendations:** Movies selected based on mood keywords
- **Learning System:** Improves suggestions based on user preferences

### 🎲 Movie Discovery
- **Roulette Interface:** Fun, gamified movie discovery
- **Random Selection:** Discover hidden gems
- **Quick Actions:** Like, add to watchlist, or spin again

### 📅 Movie Night Planner
- **Social Planning:** Plan movie nights with friends
- **Voting System:** Vote on movie selections
- **Scheduling:** Set dates and times for movie nights

## 🔧 Configuration

### Environment Variables
```env
# Required
TMDB_API_KEY=your_tmdb_api_key
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cinepick
JWT_SECRET=your_jwt_secret

# Optional (for Google OAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3005/auth/google/callback

# Development
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3005
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables
# Start with: npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TMDB** - For providing the movie database API
- **Material-UI** - For the beautiful React components
- **MySQL / PlanetScale** - For relation database processing and hosting

## 📬 Connect With Me

**Made with ❤️ by [Eshika Shukla](https://github.com/eshika-s)**

- 📧 [Email](mailto:eshika081@gmail.com)
- 💼 [LinkedIn](https://www.linkedin.com/in/eshika-shukla-608440331)
- 🐙 [GitHub](https://github.com/eshika-s)

---

⭐ **If you like this project, please give it a star!** ⭐


