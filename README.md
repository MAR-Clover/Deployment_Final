# Appointment App Setup Guide

This guide explains how to get the project running on a new machine without issues.

---

## Setup Instructions

1. **Install Prerequisites**
   - Download and install [Node.js LTS](https://nodejs.org/en/) (npm comes with it).
   - Verify installation:
     ```bash
     node -v
     npm -v
     ```

2. **Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd appointment-app

3. **Install Backend Dependencies**
    From the root folder:

    bash
    Copy
    Edit
    npm install
    This installs packages like express, cors, sqlite3, bcryptjs, jsonwebtoken, and others.\

    Install Frontend Dependencies

4. **Go into the client folder:**

    bash
    Copy
    Edit
    cd client
    npm install
    Installs React, axios, react-router-dom, and other frontend libraries.
    Return to root: "cd .."

5. **Start Backend**
    From root folder: npm start, and terminal should display: "server running on port 4000"
6. **Start Frontend**
    In a new terminal, run these:
    - cd client
    - npm start
    
7. **Access App**
- APP CAN NOW BE ACCESSED ON localhost:3000 not localhost:4000( THIS ONE IS FOR BACKEND )

