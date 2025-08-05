<div align="center">
  <br />
  <h1>
    Job Portal - Full-Stack (PERN) Application
  </h1>
  <strong>A modern, feature-rich platform for job seekers and recruiters built with React, Node.js, and PostgreSQL.</strong>
  <br />
  <br />
</div>

## 🚀 Introduction

This project is a complete, full-stack web application designed to be a modern and intuitive platform for the job market. It connects applicants with recruiters through a seamless and feature-rich interface. The application supports distinct user roles, secure authentication, and a robust set of functionalities for managing job postings and applications from start to finish. The entire UI is built with a sleek, dark-themed "glassmorphism" aesthetic for an elegant user experience.

## ✨ Key Features

The application is divided into two primary user roles, each with a tailored set of features:

#### 👨‍💻 **For Applicants (Job Seekers)**

* **Modern UI:** A sleek, dark-themed "glassmorphism" interface for an elegant user experience.
* **Job Discovery:** Browse and search for job listings with a real-time, client-side search bar.
* **Secure Authentication:** Create an account and log in securely using JWT.
* **Apply with Ease:** Apply for jobs with a simple form and resume upload.
* **Application Tracking:** View the status of all submitted applications (Pending, Shortlisted, Rejected) in a personal dashboard.
* **Saved Jobs:** Bookmark interesting jobs to a personal list and remove them when no longer needed.
* **Withdraw Applications:** The ability to withdraw a submitted application.

#### 💼 **For Recruiters**

* **Recruiter Dashboard:** A powerful, two-panel dashboard to manage job postings and view applicants.
* **Post & Manage Jobs:** Create new job listings with detailed descriptions.
* **Applicant Management:** Select a job posting to view a detailed list of all applicants.
* **Update Status:** Easily update the status of any application to keep candidates informed.
* **Full Control:** View full details or delete job postings directly from the dashboard.

---

## 🛠️ Tech Stack

This project is built with a modern and robust set of technologies:

| Frontend | Backend | Database | ORM | UI Library |
| :---: | :---: | :---: | :---: | :---: |
| ![React][React.js] | ![Node.js][Node.js] | ![PostgreSQL][PostgreSQL] | ![Sequelize][Sequelize] | ![Material-UI][Material-UI] |
| **React** | **Node.js / Express** | **PostgreSQL** | **Sequelize** | **Material-UI** |

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[Sequelize]: https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white
[Material-UI]: https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=mui&logoColor=white

---

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need the following software installed on your machine:

* [Node.js](https://nodejs.org/en/) (which includes npm)
* [PostgreSQL](https://www.postgresql.org/download/)
* [Git](https://git-scm.com/downloads)

### Installation & Setup

**1. Clone the repository:**

```bash
git clone <your-repository-url>
cd job-portal
```

**2. Backend Setup:**

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a PostgreSQL database with the name you will specify in the .env file (e.g., job_portal_dev)

# Create a .env file in the /server directory
# Copy the contents from .env.example below and fill in your details
touch .env
```

`server/.env.example`

You can find it inside the folder rename it to `.env` and config it properly.

```conf
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=your_postgres_db
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=use_any_256_bit_alpha_numeric_string

# For nodemailer use Google Mail with App Password
EMAIL_USER=example@mail.com
EMAIL_PASS=app_password
```

**3. Frontend setup**

```bash
# Navigate to the client directory from the root folder
cd ../client

# Install dependencies
npm install
```

`client/.env`

This is already present. Ensure it looks like this.

```conf
REACT_APP_API_URL=http://localhost:5000/api
```
Running the Application
You will need to run two terminals simultaneously.

1. In the first terminal, start the Backend Server:

```bash
cd server
npm start
```

The backend will be running on http://localhost:5000.

2. In the second terminal, start the Frontend Client:

```bash
cd client
npm start
```

The frontend application will open automatically in your browser at `http://localhost:3000`.