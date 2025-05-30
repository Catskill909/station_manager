# Pacifica Affiliates XML Editor

This is a simple and portable web-based editor for managing a list of Pacifica Network affiliate stations stored in an XML file (`pacifica_affiliates.xml`). It allows users to add, edit, and delete station entries through a modern, dark-mode Material Design-inspired interface.

## Features

*   **CRUD Operations**:
    *   **Create**: Add new affiliate stations with a title, link, and description.
    *   **Read**: View the list of existing affiliate stations.
    *   **Update**: Edit the details of existing stations.
    *   **Delete**: Remove stations from the list.
*   **Modern Interface**:
    *   Dark mode theme inspired by Material Design.
    *   Monochromatic color scheme with subtle color hints for actions and focus states.
    *   Responsive card-based layout for displaying station information (two columns on desktop).
    *   Custom modals for adding, editing, and confirming deletions, replacing standard browser dialogs.
*   **Real-time Updates (Client-Side Perception)**:
    *   Changes made (add, edit, delete) are sent to the PHP backend.
    *   The backend updates the `pacifica_affiliates.xml` file on the server.
    *   The station list in the browser refreshes via AJAX to reflect the changes without a full page reload.
*   **Search Functionality**:
    *   Filter the list of stations by searching through titles, links, or descriptions.
    *   Search results update in real-time as the user types.
*   **Alphabetical Sorting**:
    *   Stations are displayed alphabetically by title.
*   **Typography**:
    *   Uses Google Fonts: Oswald for the main header and Open Sans for body text, ensuring a clean and readable interface.
*   **Portability**:
    *   The entire `pacifica-editor` folder is self-contained and can be placed anywhere on a system with PHP. All internal file paths are relative and self-contained within this project folder.
    *   Built with vanilla PHP, HTML, CSS, and JavaScript.
    *   Uses PHP's built-in web server for easy local development.

## Project Structure

The project is organized as follows:

```
pacifica-editor/  (This entire folder is the portable application)
├── data/
│   └── pacifica_affiliates.xml # The XML data file. Stays INSIDE pacifica-editor/data/.
├── public/                     # Web server's document root.
│   ├── api/                    # Backend PHP scripts for CRUD operations.
│   │   ├── create.php
│   │   ├── delete.php
│   │   ├── read.php
│   │   └── update.php
│   ├── assets/                 # Frontend assets (CSS, JS).
│   │   ├── css/style.css
│   │   └── js/app.js
│   └── index.php               # Main application entry point (HTML structure).
├── PROJECT_PLAN.md
└── README.md                   # This file.
```

## How it Works (File Access - The Key to Portability)

The web server's document root is set to the `public/` directory *within* the `pacifica-editor` folder.
The `pacifica_affiliates.xml` data file is located at `pacifica-editor/data/pacifica_affiliates.xml`. It is **not** outside the main `pacifica-editor` project folder.

The PHP scripts that modify the XML file (e.g., `pacifica-editor/public/api/create.php`) use the following line to determine the path to the XML file:
`$xmlFilePath = __DIR__ . '/../../data/pacifica_affiliates.xml';`

Let's break down how this path works, ensuring it always points to the XML file *inside* the `pacifica-editor` structure, no matter where `pacifica-editor` is moved:

1.  **`__DIR__`**: This is a special PHP constant. When a script like `create.php` runs, `__DIR__` gives the full absolute path to the directory *where `create.php` is located*.
    *   Example: If `pacifica-editor` is on your Desktop, `__DIR__` inside `create.php` would be `/Users/YourName/Desktop/pacifica-editor/public/api`.

2.  **`'/../'` (Relative Navigation)**: Each `../` means "go up one directory level" *from the current location (`__DIR__`)*.

3.  **Tracing the Path from `.../public/api/`**:
    *   `__DIR__` is `.../pacifica-editor/public/api/`
    *   The first `../` in `../../` takes us from `api/` up to `public/`.
        Path so far: `.../pacifica-editor/public/`
    *   The second `../` in `../../` takes us from `public/` up to the main `pacifica-editor/` directory.
        Path so far: `.../pacifica-editor/`
    *   Then, `/data/pacifica_affiliates.xml` navigates into the `data` subfolder (which is a direct child of `pacifica-editor/`) and selects the XML file.

4.  **Final Resolved Path**: `.../pacifica-editor/data/pacifica_affiliates.xml`

This means the PHP scripts correctly find the `pacifica_affiliates.xml` file within the `pacifica-editor/data/` directory by navigating relative to their own position *inside the project structure*. The `index.php` file is at the root of the *web-accessible* `public/` directory, but the API scripts are deeper and correctly navigate "up and over" to the `data/` directory, all while staying within the bounds of the main `pacifica-editor` folder.

**The application does not require any files or folders to exist *outside* or *above* the main `pacifica-editor` directory.**

## How to Run

1.  **Prerequisites**:
    *   PHP installed on your system.
2.  **Serve the Application**:
    *   Open your terminal or command prompt.
    *   Navigate **into** the `pacifica-editor` directory:
        ```bash
        cd path/to/your/pacifica-editor
        ```
        (Replace `path/to/your/` with the actual path to where you've placed the `pacifica-editor` folder).
    *   Once inside the `pacifica-editor` directory, start the PHP built-in web server:
        ```bash
        php -S localhost:8000 -t public
        ```
    *   This command tells PHP to:
        *   Start a web server (`-S`) at `localhost:8000`.
        *   Set the document root (`-t`) to the `public` directory (which is directly inside your current `pacifica-editor` directory).
3.  **Access in Browser**:
    *   Open your web browser and go to `http://localhost:8000`.

## Key Technologies

*   **Frontend**: HTML5, CSS3, JavaScript (ES6+)
*   **Backend**: PHP (using `SimpleXMLElement` and `DOMDocument` for XML manipulation)
*   **Data Format**: XML
*   **Styling**: Manual CSS implementing a Material Design-inspired dark theme.
*   **Fonts**: Google Fonts (Oswald, Open Sans)

This editor provides a user-friendly way to manage the affiliate list directly by modifying the underlying XML data file.