## 🌱 Welcome to myplants.io, a fun plant-themed REST API!
I'm making my backend career sprout by creating this cute API where you can collect your plants, post new ones, and find other plant-loving users.

## 🌿 About the Project
myplants.io is a RESTful API built with ``Node.js`` and ``Express`` that allows plant enthusiasts to manage their plant collections, see other users, and share their botanical treasures. This API provides full CRUD functionality for plants and users with secure authentication and authorization.

## 🛠️ Tech Stack & Libraries
- Runtime: ``Node.js`` with ``nodemon`` to expedite development
- Framework: ``Express.js``
- Database: ``MongoDB``, managed from ``MongoAtlas`` 
- Authentication: ``JWT``
- Password Hashing: ``bcrypt``
- Cloud storage (for user and plant pictures): ``cloudinary``
- File Upload: ``multer``
- Testing: For version 1.0.0, testing is manual

## 📦 Installation & Setup
### 1. Clone the repository:

```bash
git clone https://github.com/ori0nis/proyecto-1-backend.git
cd proyecto-1-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

## 📋 API Features
- User management
- User registration and profile creation
- User login with ``JWT`` authentication
- User profile viewing and editing
- Secure password storage with ``bcrypt`` hashing

## 👔 Plant Management
- Create new plant entries with images
- View all plants or filter by id
- Update existing plants
- Plant image upload and storage

## 📱 Social Features
- Browse other plant enthusiasts
- View other users' plant collections

## 🔐 Authentication System
### Registration
- Users register with name, email and password
- Passwords are hashed using ``bcrypt`` before storage

### Login
- Users provide name, email and password
- System verifies credentials against hashed password
- User gets a ``JWT`` token for authentication

## 🚫 Protected routes
All internal endpoints require authentication via ``JWT`` token sent in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

## 🔑 Authorization
- Users can only edit/delete their own plants
- Profile modifications require ownership validation
- Admin privileges are implemented for special actions

## ✅ Validation System
### Input Validation
In version 1.0.0, all input validation depends on native ``mongoose`` schema constraints

## 🚀 API Endpoints
### Authentication routes
- ``POST /users/register`` - Create a new user account
- ``POST /users/login`` - Authenticate and receive ``JWT`` token

### User routes
- ``GET /users/user-list`` - Get all users (only for admin, minus password field)
- ``GET /users/user/:id`` - Get user profile by id, minus password field for admin, minus password and role fields for user
- ``PUT /users/user/:id`` - Update user profile, with validations
- ``DELETE /users/user/:id`` - Delete own account for user, any account for admin

### Plant routes
- ``GET /plants/plant-list`` - Get all plants
- ``GET /plants/plant/:id`` - Get plant by id
- ``POST /plants/post-new-plant`` - Post new plant
- ``PUT /plants/plant/:id`` - Update a plant
- ``DELETE /plants/plant/:id`` - Delete plant, only available for admin

## 🌟 Future Enhancements
- Plant categorization and tagging system (with a more-info approach)
- Plant care reminder system
- Plant favoriting system
- Advanced search and filtering options

## 📄 License
This project is open source and available under the ``MIT License``.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Contact me for more info, and stay up to date with the issues page.


