# Visitor Pass Management System Backend

## About

This is the backend of the Visitor Pass Management System developed using Node.js, Express.js and MongoDB.

The backend handles:

1. User Authentication
2. Visitor Management
3. Appointment Management
4. Pass Generation
5. QR Code Generation
6. PDF Pass Generation
7. Check-In / Check-Out
8. Email Notifications

---

## Technologies Used

1. Node.js
2. Express.js
3. MongoDB
4. JWT Authentication
5. QR Code
6. PDFKit
7. Nodemailer

---

## Install Required Packages

Install all packages:

```bash
npm install
```

Or install packages individually:

1. Express.js

```bash
npm install express
```

2. Mongoose

```bash
npm install mongoose
```

3. CORS

```bash
npm install cors
```

4. dotenv

```bash
npm install dotenv
```

5. bcryptjs

```bash
npm install bcryptjs
```

6. jsonwebtoken

```bash
npm install jsonwebtoken
```

7. multer

```bash
npm install multer
```

8. nodemailer

```bash
npm install nodemailer
```

9. pdfkit

```bash
npm install pdfkit
```

10. qrcode

```bash
npm install qrcode
```

11. nodemon (Dev Dependency)

```bash
npm install nodemon --save-dev
```

---

## Create an .env File

Create a file named `.env` inside the backend folder and add the following:

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/visitorpass

JWT_SECRET=mysecretkey

EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

## Start MongoDB

Make sure MongoDB is running before starting the server.

---

## Run the seed.js

```bash
node seed.js
```

## Run the Project

```bash
npm run dev
```



The server will run on:

```text
http://localhost:5000
```

---
## API Endpoints

### Authentication
METHOD      Endpoint
POST -      /api/auth/register
POST -      /api/auth/login
GET -       /api/auth/hosts
GET -       /api/auth/hosts

### Visitor Management
METHOD      Endpoint
GET -       /api/visitors
POST -      /api/visitors
PUT -       /api/visitors/
DELETE -    /api/visitors/

### Appointment Management
METHOD      Endpoint
GET -       /api/appointments
POST -      /api/appointments
PUT -       /api/appointments//approve
PUT -       /api/appointments//reject

### Pass Management
METHOD      Endpoint
GET -      /api/passes
GET -      /api/passes/

### Check-In / Check-Out
METHOD      Endpoint
POST -      /api/checklogs/checkin
POST -      /api/checklogs/checkout
GET -       /api/checklogs

### Analytics
METHOD      Endpoint
GET -      /api/auth/stats
GET -      /api/analytics/trends

### OTP Verification
METHOD      Endpoint
POST -      /api/otp/send
POST -      /api/otp/verify

## Example Seed Data

### Admin User

```json
{
  "name": "Admin User",
  "email": "admin@gmail.com",
  "password": "admin123",
  "role": "admin"
}
```

### Security User

```json
{
  "name": "Security User",
  "email": "security@gmail.com",
  "password": "security123",
  "role": "security"
}
```

### Host User

```json
{
  "name": "Host User",
  "email": "host@gmail.com",
  "password": "host123",
  "role": "host"
}
```

### Visitor User

```json
{
  "name": "Visitor User",
  "email": "visitor@gmail.com",
  "password": "visitor123",
  "role": "visitor"
}
```

---

## API Testing

The APIs can be tested using:

* Postman
* Thunder Client

Example Login Request:

```http
POST /api/auth/login
```

Request Body:

```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

---
`SMS notification integration has been implemented using Twilio Trial Account`
`Due to Twilio trial restrictions, SMS messages can only be sent to verified phone numbers. A paid Twilio account is required for unrestricted production use.`

## Developed By

Ayush- Yes, I have taken help of AI but the whole project is not done using AI, the flagged files you mentioned, I understood those 2-3 files and did the rest code myself. I have previous know of MERN stack and Web Development. So, Please approve this. 