# Visitor Pass Management System Frontend

## About

This is the frontend of the Visitor Pass Management System developed using React.js and Vite.

The frontend provides:

1. User Login and Registration
2. Role Based Dashboard
3. Visitor Management
4. Appointment Management
5. Pass Management
6. Check-In / Check-Out Interface
7. Reports and Analytics
8. Responsive User Interface

---

## Technologies Used

1. React.js
2. Vite
3. React Router DOM
4. Axios
5. JavaScript
6. CSS

---

## Install Required Packages

Install all packages:

```bash
npm install
```

Or install packages individually:

1. React

```bash
npm install react react-dom
```

2. React Router DOM

```bash
npm install react-router-dom
```

3. Axios

```bash
npm install axios
```

4. Vite

```bash
npm install vite --save-dev
```

5. ESLint

```bash
npm install eslint --save-dev
```

---

## Create an .env File

Create a file named `.env` inside the frontend folder and add:

```env
VITE_API_URL=http://localhost:5000/api
```

Change the URL according to your backend server.

---

## Run the Project

Development Mode:

```bash
npm run dev
```

The application will run on:

```text
http://localhost:5173
```


## Features

### Authentication

* User Login
* User Registration
* JWT Token Storage
* Role Based Access

### Visitor Management

* Add Visitor
* Edit Visitor
* Delete Visitor
* Search Visitors

### Appointment Management

* Create Appointment
* Approve Appointment
* Reject Appointment
* View Appointment Status

### Pass Management

* Generate Visitor Pass
* View Pass Details
* Download PDF Pass
* QR Code Display

### Check-In / Check-Out

* Visitor Entry Tracking
* Visitor Exit Tracking
* Visit History

### Dashboard

* Total Visitors
* Total Appointments
* Active Passes
* Check-In / Check-Out Statistics

---

## Connecting Frontend with Backend

Make sure the backend server is running on:

```text
http://localhost:5000
```

and the frontend `.env` file contains:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Developed By

Ayush