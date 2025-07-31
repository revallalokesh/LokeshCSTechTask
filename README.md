# MERN Notes App

A MERN stack application for managing agents and distributing task lists.

## Features

- ✅ **Admin User Login** with JWT Authentication
- ✅ **Agent Creation & Management** (Name, Email, Mobile, Password)
- ✅ **Agent Editing & Deletion** with confirmation dialogs
- ✅ **CSV Upload and Task Distribution** (FirstName, Phone, Notes)
- ✅ **Equal Task Distribution** among agents
- ✅ **Task Reassignment** functionality
- ✅ **File Validation** (CSV, XLSX, AXLS formats)
- ✅ **Responsive UI** with Tailwind CSS (mobile-friendly)
- ✅ **Error Handling** and User Feedback
- ✅ **Advanced CRUD Operations** for agents

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd mern-notes-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/mern-notes-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

Create an admin user:
```bash
node scripts/createAdmin.js
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Usage

### Login
- Email: `admin@example.com`
- Password: `admin123`

### Adding Agents
1. Login to the dashboard
2. Fill in the agent details:
   - **Name**: Agent's full name
   - **Email**: Unique email address
   - **Mobile**: Phone number with country code (e.g., +1234567890)
   - **Password**: Agent's password
3. Click "Add Agent"

### Managing Agents
- **Edit Agent**: Click the "Edit" button next to any agent to modify their details
- **Delete Agent**: Click the "Delete" button and confirm to remove an agent
- **Task Reassignment**: Use the "Reassign All Tasks" button to redistribute tasks among remaining agents

### Uploading Task Lists
1. Prepare a CSV file with columns: `FirstName, Phone, Notes`
2. Upload the file using the upload form
3. The system will automatically distribute tasks equally among agents
4. View the distributed tasks on the dashboard

### CSV Format Example
```csv
FirstName,Phone,Notes
John,1234567890,Call for feedback
Jane,2345678901,Send documents
Bob,3456789012,Schedule meeting
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Agents
- `POST /api/agents/add-agent` - Add new agent
- `GET /api/agents/list-agents` - Get all agents
- `POST /api/agents/upload-list` - Upload and distribute task list

## File Structure

```
mern-notes-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   └── App.jsx
    └── package.json
```

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Vite, Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer, CSV Parser

## Troubleshooting

1. **MongoDB Connection Error**: Ensure MongoDB is running locally or update the MONGO_URI in .env
2. **Port Already in Use**: Change the PORT in .env file
3. **JWT Errors**: Ensure JWT_SECRET is set in .env file
4. **File Upload Errors**: Check file format (CSV, XLSX, AXLS only)
5. **Agent Creation Errors**: Ensure all required fields are filled and email is unique

## Testing Edge Cases

- ✅ Login with invalid credentials
- ✅ Add agent with duplicate email
- ✅ Upload invalid file format
- ✅ Upload CSV with missing columns
- ✅ Upload CSV with no agents in system
- ✅ Distribute tasks among different numbers of agents

## License

MIT 