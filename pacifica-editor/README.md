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
    *   Built with vanilla PHP, HTML, CSS, and JavaScript, making it easy to deploy on any server with PHP support.
    *   Uses PHP's built-in web server for easy local development.

## Project Structure

The project is organized as follows:

```
pacifica-editor/
├── data/
│   └── pacifica_affiliates.xml # The XML data file containing station information.
├── public/                     # Web server's document root.
│   ├── api/                    # Backend PHP scripts for CRUD operations.
│   │   ├── create.php          # Handles adding new stations to the XML.
│   │   ├── delete.php          # Handles deleting stations from the XML.
│   │   ├── read.php            # Handles reading station data from the XML and serving it as JSON.
│   │   └── update.php          # Handles editing existing stations in the XML.
│   ├── assets/                 # Frontend assets.
│   │   ├── css/
│   │   │   └── style.css       # Main stylesheet for the application.
│   │   └── js/
│   │       └── app.js          # Frontend JavaScript logic for interactivity, AJAX calls, and DOM manipulation.
│   └── index.php               # Main application entry point (HTML structure and PHP for basic elements).
├── PROJECT_PLAN.md             # The initial project plan document.
└── README.md                   # This file.
```

## How to Run

1.  **Prerequisites**:
    *   PHP installed on your system.
2.  **Serve the Application**:
    *   Navigate to the `pacifica-editor` directory in your terminal.
    *   Start the PHP built-in web server by running the following command from the parent directory of `pacifica-editor` (e.g., if `pacifica-editor` is on your Desktop, run it from Desktop):
        ```bash
        php -S localhost:8000 -t pacifica-editor/public
        ```
    *   This will serve the application from the `pacifica-editor/public` directory.
3.  **Access in Browser**:
    *   Open your web browser and go to `http://localhost:8000`.

## Key Technologies

*   **Frontend**: HTML5, CSS3, JavaScript (ES6+)
*   **Backend**: PHP (using `SimpleXMLElement` and `DOMDocument` for XML manipulation)
*   **Data Format**: XML
*   **Styling**: Manual CSS implementing a Material Design-inspired dark theme.
*   **Fonts**: Google Fonts (Oswald, Open Sans)

This editor provides a user-friendly way to manage the affiliate list directly by modifying the underlying XML data file.