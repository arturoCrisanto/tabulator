# 🎯 Tabulator - Event Scoring & Voting System

A comprehensive RESTful API built with Express.js and MongoDB for managing events, judges, candidates, and scoring systems. Perfect for competitions, contests, and any event requiring structured judging and tabulation.

## ✨ Features

- **Event Management**: Create and manage multiple events with dates and details
- **Judge Administration**: Register and manage judges for events
- **Category System**: Organize events into multiple scoring categories
- **Candidate Management**: Add and manage participants/candidates
- **Voting & Scoring**: Secure voting system with score tracking
- **Real-time Rankings**: Calculate and display event rankings
- **Admin Dashboard**: Comprehensive admin panel with statistics
- **Authentication**: JWT-based authentication for secure access
- **Database Seeding**: Built-in data seeding for testing
- **API Documentation**: Built-in API endpoint documentation
- **Graceful Shutdown**: Proper server shutdown handling
- **Modular Architecture**: Well-organized codebase with separation of concerns

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration
- **Development**: nodemon for hot reloading
- **Logging**: Morgan for HTTP request logging
- **CORS**: Cross-Origin Resource Sharing enabled
- **Architecture**: Modular MVC pattern with separated utilities

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tabulator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGO_URI=mongodb://localhost:27017/tabulator

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   ```

4. **Database Setup**

   Make sure MongoDB is running, then seed the database:

   ```bash
   npm run seed
   ```

5. **Start the application**

   For development:

   ```bash
   npm run dev
   ```

   For production:

   ```bash
   npm start
   ```

## 📚 API Documentation

The API will be available at `http://localhost:5000/api`

### � Interactive API Documentation

Visit `http://localhost:5000/api` to see the complete interactive API documentation with all available endpoints, request/response formats, and examples.

### �🔐 Authentication Endpoints

| Method | Endpoint              | Description        |
| ------ | --------------------- | ------------------ |
| POST   | `/api/admin/register` | Register new admin |
| POST   | `/api/admin/login`    | Admin login        |

### 📊 Admin Dashboard

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/api/admin/dashboard` | Get dashboard statistics |

### 🎪 Event Management

| Method | Endpoint                | Description      |
| ------ | ----------------------- | ---------------- |
| GET    | `/api/admin/events`     | Get all events   |
| POST   | `/api/admin/events`     | Create new event |
| GET    | `/api/admin/events/:id` | Get single event |
| PUT    | `/api/admin/events/:id` | Update event     |
| DELETE | `/api/admin/events/:id` | Delete event     |

### 📂 Category Management

| Method | Endpoint                                            | Description           |
| ------ | --------------------------------------------------- | --------------------- |
| GET    | `/api/admin/events/:eventId/categories`             | Get event categories  |
| POST   | `/api/admin/events/:eventId/categories`             | Add category to event |
| PUT    | `/api/admin/events/:eventId/categories/:categoryId` | Update category       |
| DELETE | `/api/admin/events/:eventId/categories/:categoryId` | Delete category       |

### 👥 Candidate Management

| Method | Endpoint                                             | Description            |
| ------ | ---------------------------------------------------- | ---------------------- |
| GET    | `/api/admin/events/:eventId/candidates`              | Get event candidates   |
| POST   | `/api/admin/events/:eventId/candidates`              | Add candidate to event |
| PUT    | `/api/admin/events/:eventId/candidates/:candidateId` | Update candidate       |
| DELETE | `/api/admin/events/:eventId/candidates/:candidateId` | Delete candidate       |

### ⚖️ Judge Management

| Method | Endpoint                                     | Description        |
| ------ | -------------------------------------------- | ------------------ |
| GET    | `/api/admin/events/:eventId/judges`          | Get event judges   |
| POST   | `/api/admin/events/:eventId/judges`          | Add judge to event |
| PUT    | `/api/admin/events/:eventId/judges/:judgeId` | Update judge       |
| DELETE | `/api/admin/events/:eventId/judges/:judgeId` | Delete judge       |

### 🗳️ Voting System

| Method | Endpoint                      | Description        |
| ------ | ----------------------------- | ------------------ |
| POST   | `/api/votes`                  | Submit vote/score  |
| GET    | `/api/votes/ranking/:eventId` | Get event ranking  |
| GET    | `/api/votes/judge/:judgeId`   | Get votes by judge |
| PUT    | `/api/votes/:voteId`          | Update vote        |
| DELETE | `/api/votes/:voteId`          | Delete vote        |

## 📁 Project Structure

```
tabulator/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── adminController.js    # Admin operations
│   ├── eventController.js    # Event management
│   └── voteController.js     # Voting operations
├── middleware/
│   ├── authMiddleware.js     # JWT authentication
│   └── errorMiddleware.js    # Error handling
├── models/
│   ├── candidateModel.js     # Candidate schema
│   ├── categoryModel.js      # Category schema
│   ├── eventModel.js         # Event schema
│   ├── judgeModel.js         # Judge schema
│   ├── userModel.js          # User schema
│   └── voteModel.js          # Vote schema
├── routes/
│   ├── adminRoutes.js        # Admin API routes
│   ├── apiInfoRoutes.js      # API documentation route
│   └── voteRoutes.js         # Voting API routes
├── seeders/
│   └── seeder.js            # Database seeding
├── utils/
│   ├── generateToken.js      # JWT utilities
│   └── serverUtils.js        # Server startup & shutdown utilities
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies & scripts
├── server.js                # Main application file
└── README.md                # This file
```

## 🔧 Code Architecture

### Server Structure

- **Modular Design**: Separated concerns with dedicated utility modules
- **Route Organization**: Clean route separation with dedicated API info endpoint
- **Error Handling**: Comprehensive error handling with custom middleware
- **Graceful Shutdown**: Proper process signal handling for clean shutdowns
- **Environment Management**: Robust configuration management with dotenv

### Key Components

- **Server Utils**: Centralized server startup and shutdown logic
- **API Info Routes**: Self-documenting API with endpoint listings
- **Authentication Middleware**: JWT-based security implementation
- **Database Integration**: MongoDB with Mongoose ODM
- **Error Middleware**: Standardized error responses

## 🔧 Available Scripts

```bash
# Start the server in production mode
npm start

# Start the server in development mode with auto-restart
npm run dev

# Seed the database with sample data
npm run seed

# Clear all data and reseed the database
npm run seed:clear

# Run tests (not implemented yet)
npm test
```

## 🗄️ Database Schema

### Events

- Name, date, categories, judges

### Categories

- Name, description, event reference

### Candidates

- Name, details, event reference

### Judges/Users

- Username, email, password (hashed), role

### Votes

- Event, category, judge, candidate, score references

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🌱 Seeding Data

To populate your database with sample data for testing:

```bash
# Add sample data
npm run seed

# Clear all data and add fresh sample data
npm run seed:clear
```

## 🚦 Health Check

Check if the API is running:

```bash
GET http://localhost:5000/
```

Response:

```json
{
  "message": "🎯 Tabulator API Server is running!",
  "status": "healthy",
  "timestamp": "2025-10-26T10:30:45.123Z",
  "version": "1.0.0"
}
```

## 🔧 Configuration

### Environment Variables

| Variable       | Description               | Default                 |
| -------------- | ------------------------- | ----------------------- |
| `PORT`         | Server port               | `5000`                  |
| `NODE_ENV`     | Environment mode          | `development`           |
| `MONGO_URI`    | MongoDB connection string | Required                |
| `JWT_SECRET`   | JWT signing secret        | Required                |
| `FRONTEND_URL` | Frontend URL for CORS     | `http://localhost:3000` |

## 🐛 Error Handling

The API includes comprehensive error handling:

- **JSON Parse Errors**: Invalid JSON format responses
- **404 Errors**: Resource not found handling
- **Validation Errors**: Mongoose validation error responses
- **Authentication Errors**: JWT verification failures
- **Database Errors**: MongoDB connection and query errors

## 🚀 Deployment

### Local Deployment

1. Ensure MongoDB is running
2. Set production environment variables
3. Run `npm start`

### Production Considerations

- Use process managers like PM2
- Set up MongoDB Atlas for cloud database
- Configure proper CORS origins
- Use HTTPS in production
- Set secure JWT secrets
- Enable MongoDB authentication
- Implement rate limiting
- Add request logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the server logs for error messages
2. Ensure MongoDB is running and accessible
3. Verify environment variables are set correctly
4. Check that all dependencies are installed

## 🔮 Future Enhancements

- [ ] Real-time voting updates with WebSockets
- [ ] Email notifications for judges
- [ ] Advanced analytics and reporting
- [ ] Mobile app integration
- [ ] Export results to PDF/Excel
- [ ] Multi-language support
- [ ] Advanced user roles and permissions
- [ ] API rate limiting
- [ ] Comprehensive test suite

---

Built with ❤️ using Node.js and Express.js
