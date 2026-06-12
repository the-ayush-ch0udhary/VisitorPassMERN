# Visitor Pass Management System - Frontend

## About the Project

This is the frontend of my Visitor Pass Management System project built using **React.js** and **Vite**.

The frontend provides different dashboards and interfaces for Admin, Security, Host, and Visitor users. It allows users to manage visitors, appointments, passes, and check-in/check-out activities through a simple web interface.

---

## Features

* User Login and Registration
* Role-Based Dashboards
* Visitor Management
* Appointment Management
* Pass Management
* QR Code Display
* Check-In / Check-Out System
* Reports and Analytics
* Responsive User Interface
* Multi-Organization Support

---

## Technologies Used

* React.js
* Vite
* React Router DOM
* Axios
* JavaScript
* CSS

---

## Installation

Install all required packages:

```bash
npm install
```

Or install packages manually:

```bash
npm install react react-dom
npm install react-router-dom
npm install axios
npm install vite --save-dev
npm install eslint --save-dev
```

---

## Environment Variables

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Update the URL if your backend is running on a different port or server.

---

## Running the Project

Start the development server:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## Functional Modules

### Authentication

* User Registration
* User Login
* JWT Token Storage
* Role-Based Access

### Visitor Management

* Add Visitor
* Edit Visitor
* Delete Visitor
* Search Visitors

### Appointment Management

* Create Appointment Requests
* Approve Appointments
* Reject Appointments
* View Appointment Status

### Pass Management

* Generate Visitor Passes
* View Pass Details
* Download PDF Passes
* Display QR Codes

### Check-In / Check-Out

* Visitor Entry Tracking
* Visitor Exit Tracking
* Visit History

### Analytics Dashboard

* Total Visitors
* Total Passes
* Active Visitors
* Today's Check-Ins
* Today's Check-Outs
* Appointment Statistics
* Weekly Visitor Trends

---

## QR Code Support

The Security Dashboard supports:

* Manual Pass ID Entry
* QR Code Scanning

Visitors can be checked in and checked out using either method.

---

## Connecting Frontend with Backend

Make sure the backend server is running:

```text
http://localhost:5000
```

and your frontend `.env` file contains:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Project Notes

* SMS notifications are implemented using a Twilio Trial Account.
* OTP verification is implemented as a basic learning feature.
* Multi-organization support has been implemented and tested with multiple organizations.
* Database seed data is available in the backend project through the `seed.js` file.
* Docker deployment has not been implemented in this project.

---

## Developed By

Ayush

Student Project - Visitor Pass Management System