# 606-Project-Frontend

## Overview

This repository contains the frontend implementation of the final project for the **Software Engineering Master's** course at **Texas A&M University**. The project is a **web-based Expense Tracker** that allows users to **log in, track expenses, and set monthly budgets**. It features a clean UI, authentication, and dynamic data fetching.

## Features

- **User Authentication**: Sign-up and login functionality with client-side validation.
- **Expense Management**: Users can add, edit, and delete expenses.
- **Category Filtering**: Expenses can be filtered by month and category.
- **Monthly Budgeting**: Users can set and update their monthly budget.
- **Responsive UI**: Optimized for both desktop and mobile usage.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Custom CSS
- **Client-Side Scripting**: Vanilla JavaScript
- **API Integration**: Fetch API for backend communication

## Folder Structure

```
606-Project-Frontend/
│── home.html          # Expense Tracker main interface
│── index.html         # Login and Signup page
│── styles.css         # General styling for login/signup pages
│── home_styles.css    # Styling specific to the expense tracker
│── script.js          # Expense tracker interactions (add/edit/delete expenses)
│── main.js            # Authentication logic (login/signup)
```

## Setup and Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/606-Project-Frontend.git
   cd 606-Project-Frontend
   ```

2. Open `index.html` in a browser to access the login page.

3. Once logged in, you will be redirected to `home.html`, where you can manage expenses.

4. Make sure your backend server (assumed to be running on `http://localhost:8000`) is active for API communication.

## API Endpoints

The frontend interacts with the following backend endpoints:

- **POST** `/login` - User authentication
- **POST** `/signup` - User registration
- **GET** `/expenses` - Fetch user expenses
- **POST** `/expenses` - Add a new expense
- **PUT** `/expenses/{id}` - Update an expense
- **DELETE** `/expenses/{id}` - Delete an expense
- **GET** `/monthly_budget` - Get the current month's budget
- **POST** `/monthly_budget` - Update the budget

## Future Enhancements

- Implement **real-time analytics** for expense tracking.
- Add **OAuth-based authentication**.
- Improve UI/UX with **React or Vue.js**.
- Support **exporting expenses as CSV or PDF**.

## Contributors

- **Akshat Punjabi** – Texas A&M University
- **Xinyu Wu** – Texas A&M University

## License

This project is for academic purposes and is **not licensed for commercial use**.
