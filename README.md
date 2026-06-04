# 🎫 System-Ticket (SPA)

Welcome to **System-Ticket**! This is a Single Page Application (SPA) designed to efficiently manage the workflow of support tickets, reports, and service requests between clients, technicians, and administrators.

The project is built using **Modern JavaScript (ES6+)**, modularized with components, and styled with **Tailwind CSS**.

---

## 🚀 Key Features

*   **Authentication & Access Control:** Dynamic views tailored precisely to the role of the logged-in user.
*   **System Roles:**
    *   **Client:** Can create new tickets and view their personal support history.
    *   **Technician:** Can view and track tickets assigned directly to their account.
    *   **Administrator:** Full system control. Can view, edit, and delete any ticket in the database.
*   **Full CRUD Operations:** Create, Read, Update, and Delete tickets in real-time by connecting to a REST API.
*   **SPA Architecture:** Smooth and fast navigation without page reloads through dynamic DOM manipulation.

---

## 🛠️ Technologies Used

*   **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules).
*   **Styling:** [Tailwind CSS](https://tailwindcss.com) (Clean, modern, and responsive design).
*   **HTTP Requests:** [Axios](https://axios-http.com) (For consuming REST API services).
*   **Database / Mock Server:** JSON Server (or your custom local API configured on port `3002`).

---

## 📂 Project Structure

The source code is organized modularly within the `System-Ticket` folder:

```text
System-Ticket/
├── css/
│   └── style.css          # Global styles and Tailwind utility classes
├── js/
│   ├── auth.js            # Login management and session storage
│   ├── dashboard.js       # Main panel and system layout orchestration
│   ├── tickets.js         # CRUD logic (Load, Create, Edit, and Delete)
│   └── utils.js           # Authentication guards and helper functions
├── index.html             # Single entry point of the application
└── main.js                # Main orchestrator and SPA initialization
```

---

## 💻 Installation & Local Setup

Follow these steps to set up the development environment on your local machine:

### 1. Clone the repository
```bash
git clone https://github.com
cd spa-1/Spa_trabajo\ final/System-Ticket/
```

### 2. Start the Backend Server (API)
The project consumes services from `http://localhost:3002`. Make sure your local server is running on that port. If you are using `json-server`, you can start it with:
```bash
json-server --watch db.json --port 3002
```

### 3. Run the Application
Because this project relies on JavaScript native modules (`import/export`), you need a local server environment to avoid CORS errors:
*   **Option A (Visual Studio Code):** Install the **Live Server** extension, right-click on `index.html`, and select *Open with Live Server*.
*   **Option B (Node.js):** If you have Node installed, you can quickly host it using:
    ```bash
    npx serve .
    ```

---

## 🔒 Environment Variables

The API base URL is centralized in the `js/tickets.js` file. If your backend server runs on a different address or port, simply update this constant:

```javascript
const API = 'http://localhost:3002';
```

---

## 👥 Developer
*   **Johns8729** - *Development & Implementation* - [GitHub](https://github.com)
