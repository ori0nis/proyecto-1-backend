## 🌱 Welcome to myplants.io, a fun plant-themed REST API!
I'm making my backend career sprout by creating this cute API where you can collect your plants, post new ones, and find other plant-loving users.

## 🌿 About the Project
myplants.io is a RESTful API built with ``Node.js`` and ``Express`` that allows plant enthusiasts to manage their plant collections, see other users, and share their botanical treasures. This API provides full CRUD functionality for plants and users with secure authentication and authorization.

## 🛠️ Tech Stack & Libraries
- Runtime: ``Node.js`` with ``nodemon`` to expedite development
- Framework: ``Express.js``
- Database: ``MongoDB``, managed from ``MongoAtlas`` 
- Authentication: ``JWT``
- Password hashing: ``bcrypt``
- Cloud storage (for user and plant pictures): ``cloudinary``
- File upload: ``multer``
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
- Here's an example of required fields to complete a register, which has to be sent as a multipart form:

```json
"name": "John",
"email": "john@email.com",
"password": "ExamplePassword101",
"img": "profile-pic.png", ---> locally uploaded by the user,
"plantCareSkillLevel": "intermedio", ---> enforced by an enum in the User schema,
"role": "user", ---> only user is allowed,
"plants": ["68a3a286aa3e0b8b2f909eac", "68a3a286aa3e0b8b2f909eb6"] ---> plant id's can be found in the public plant list. User must send each as a "plants" field in the multipart form
```

- Password is then hashed using ``bcrypt`` before storage

### Login
- Users provide name, email and password
- System verifies credentials against hashed password
- User gets a ``JWT`` token for authentication

## 🚫 Protected routes
All internal endpoints except ``GET /plants/plant-list`` require authentication via ``JWT`` token sent in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

## 🔑 Authorization
- Users can edit plants, but only admin can delete them
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
- ``GET /plants/plant-list`` - Get all plants (this is the only internal endpoint that is fully public)
- ``GET /plants/plant/:id`` - Get plant by id
- ``POST /plants/post-new-plant`` - Post new plant
- ``PUT /plants/plant/:id`` - Update a plant
- ``DELETE /plants/plant/:id`` - Delete plant, only available for admin

### 🌱 Posting (potting?) a plant
To post a plant, user must fulfill the required fields:

```json
"scientificName": "Crassula ovata",
"nickName": "Árbol de jade",
"img": "crassula-ovata.png", ---> locally uploaded by the user
"type": "tropical" ---> enforced by an enum in the Plant schema
```

## 📢 Responses
### User
- Here's an example of a response provided by ``GET /users/user/:id``. The field "plants" gets populated with the corresponding plants owned by the user:

```json
{
	"message": "User created",
	"user": {
		"_id": "68a584f77b48a970c0d67404",
		"name": "John",
		"email": "john@email.com",
		"password": "$2b$10$Iu1gtrAtWoYProxIgkKiAO9py9jl9Yz8YPmPe7faYYWDw982EePlu",
		"img": "https://res.cloudinary.com/dxanwvegw/image/upload/v1755677929/myplants.io/s2mpclzlekfgbigtofuf.png",
		"plantCareSkillLevel": "intermedio",
		"role": "user",
		"plants": [
			{
				"_id": "68a3a286aa3e0b8b2f909eb6",
				"scientificName": "Edelweiss leontopodium alpinum",
				"nickName": "Edelweiss",
				"img": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Leontopodium_alpinum_%28Edelweiss%29.jpg",
				"type": "alpina",
				"__v": 0,
				"createdAt": "2025-08-18T22:00:38.065Z",
				"updatedAt": "2025-08-18T22:00:38.065Z"
			}
		],
		"createdAt": "2025-08-20T08:19:03.109Z",
		"updatedAt": "2025-08-20T08:19:03.109Z",
		"__v": 0
	}
}
```

## 🌟 Future Enhancements
- Plant categorization and tagging system (with a more-info approach)
- Plant care reminder system
- Plant favoriting system
- Advanced search and filtering options

## 📄 License
This project is open source and available under the ``MIT License``.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Contact me for more info, and stay up to date with the issues page.


