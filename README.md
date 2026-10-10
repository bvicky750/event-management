# College Event Hub

A full-stack application organized into modular `frontend` and `backend` services.

## Project Structure

```
event man/
├── frontend/             # React + Vite client app
│   ├── src/             # UI components, pages, context, and services
│   ├── public/          # Static assets
│   ├── index.html
│   └── package.json
├── backend/              # Node.js + Express server app
│   ├── src/
│   │   ├── config/      # Server and database configuration
│   │   ├── controllers/ # Request handlers and business logic
│   │   ├── models/      # Data models / schemas
│   │   ├── routes/      # API routes
│   │   └── server.js    # Express app bootstrap
│   └── package.json
├── package.json          # Root scripts to run & build both services
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
Install dependencies for both frontend and backend services:
```bash
npm run install:all
```

### Running in Development Mode
To run both the frontend and backend concurrently:
```bash
npm run dev
```

Or run services individually:
- **Frontend only:** `npm run dev:frontend`
- **Backend only:** `npm run dev:backend`

### Building for Production
- **Build Frontend:** `npm run build:frontend`

- post the events to get students connected
