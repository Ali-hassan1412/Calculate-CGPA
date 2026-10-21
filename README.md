# GPA & CGPA Calculator

A simple GPA and CGPA calculator built with React and Tailwind CSS. It allows students to enter their subjects, credit hours, and marks to calculate their semester GPA and overall CGPA.

## Features

- Add and remove semesters (up to 8).
- Add subjects with credit hours and marks.
- Calculate quality points, grades, and semester GPA.
- Calculate overall CGPA using credit-hour weighting.
- Validate inputs and display errors for invalid entries.
- Responsive styling with Tailwind CSS.

## Technologies Used

- **React** — Builds the user interface using reusable components.
- **Vite** — Provides the development server and builds the project for deployment.
- **Tailwind CSS** — Styles the application using utility classes.
- **JavaScript (ES6+)** — Handles calculations, validation, and application logic.
- **npm** — Installs and manages project dependencies.

## React Concepts Used

- **`useState`** — Stores and updates semesters, subjects, and form data.
- **`map()`** — Displays semester and subject lists dynamically.
- **Conditional rendering** — Shows validation errors and calculated results when needed.
- **Reusable functions** — Handles GPA calculations, grades, quality points, and validation.
- **Event handling** — Responds to user actions such as adding subjects and updating marks.

## Getting Started

### 1. Clone the Repository

```bash
git clone REPOSITORY_URL
```

### 2. Open the Project Folder

```bash
cd calculate-CGPA
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL shown in your terminal, usually `http://localhost:5173`.

## Note

This is a small student project designed to make GPA and CGPA calculations easier. Always verify the grading rules against your university's official grading policy.
