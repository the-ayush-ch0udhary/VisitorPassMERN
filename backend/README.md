# Visitor Pass Management System - Backend

## About the Project

This is the backend of my Visitor Pass Management System project built using **Node.js**, **Express.js**, and **MongoDB**.

The purpose of this project is to manage visitor entries, appointments, digital passes, and check-in/check-out records for an organization.

I have used my knowledge of MERN Stack and Web Development while building this project. I also used AI as a learning and debugging tool in a few places, but I reviewed, understood, and modified the code before using it in the project.

---

## Features

* User Authentication using JWT
* Role-Based Access Control (Admin, Host, Security, Visitor)
* Visitor Profile Management
* Appointment Booking and Approval System
* QR Code Generation
* PDF Visitor Pass Generation
* Visitor Check-In / Check-Out Tracking
* Email Notifications
* SMS Notifications (Twilio Trial Account)
* Analytics Dashboard
* Multi-Organization Support

---

## Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Token)
* bcryptjs
* Nodemailer
* QRCode
* PDFKit
* Multer

---

## Installation

Install all required packages:

```bash
npm install
```

Or install packages manually:

```bash
npm install express mongoose cors dotenv
npm install bcryptjs jsonwebtoken multer
npm install nodemailer pdfkit qrcode
npm install nodemon --save-dev
```

---

## Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/visitorpass

JWT_SECRET=mysecretkey

EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_email_here
EMAIL_PASS=your_password_here
```

---

## Database Seeding

A `seed.js` file is included to generate sample data for testing.

Run:

```bash
node seed.js
```

This creates:

* Acme Corporation Organization
* Admin User
* Security User
* Host User
* Visitor User

### Sample Login Credentials

Role     Email                 Password
Admin    admin@gmail.com        admin123
Security security@gmail.com  securtity123
Host     host@gmail.com          host123
Visitor  moon@gmail.com       moon123
---

## Running the Project

Start the development server:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

---

## API Endpoints

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`
* GET `/api/auth/me`
* GET `/api/auth/hosts`

### Visitor Management

* GET `/api/visitors`
* GET `/api/visitors/:id`
* POST `/api/visitors`
* PUT `/api/visitors/:id`
* DELETE `/api/visitors/:id`

### Appointment Management

* GET `/api/appointments`
* POST `/api/appointments`
* PUT `/api/appointments/:id/approve`
* PUT `/api/appointments/:id/reject`

### Pass Management

* GET `/api/passes`
* GET `/api/passes/:id`

### Check-In / Check-Out

* POST `/api/checklogs/checkin`
* POST `/api/checklogs/checkout`
* GET `/api/checklogs`

### Analytics

* GET `/api/analytics/stats`
* GET `/api/analytics/trends`

### OTP Verification

* POST `/api/otp/send`
* POST `/api/otp/verify`

---

## Testing

The APIs can be tested using:

* Postman
* Thunder Client

Example Login Request:

**POST** `/api/auth/login`

```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

---

## SMS Notification Note

SMS notifications are implemented using a **Twilio Trial Account**.

Due to Twilio trial limitations, SMS messages can only be delivered to verified phone numbers like(8910007871). A paid Twilio account is required for unrestricted production usage.

---

## Developed By

Ayush

Student Project - Visitor Pass Management System