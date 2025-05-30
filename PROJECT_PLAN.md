# Project Plan: Pacifica Affiliates XML Editor

**Objective**: Develop a web-based editor to manage entries (Title, Link, Description) in the `pacifica_affiliates.xml` file. The editor will feature a modern Material Design dark mode interface, allowing users to add, edit, and delete station entries. Changes will be saved to the XML file on the server, and the interface will update to reflect these changes.

---

### 1. Project Structure

We'll organize the project into a clear directory structure:

```
pacifica-editor/
├── public/                  # Web server's document root
│   ├── index.php            # Main application entry point (handles routing/display)
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css    # Main stylesheet (Material Design dark mode)
│   │   └── js/
│   │       └── app.js       # Frontend JavaScript logic
│   └── api/                 # Backend PHP scripts for CRUD operations
│       ├── read.php         # Handles reading XML data
│       ├── create.php       # Handles adding new stations
│       ├── update.php       # Handles editing existing stations
│       └── delete.php       # Handles deleting stations
├── data/
│   └── pacifica_affiliates.xml # The XML data file (moved here for better organization)
└── src/                     # PHP helper functions/classes (if needed)
    └── XmlHelper.php        # (Optional) Class for XML manipulation logic
```

*   **Note**: `pacifica_affiliates.xml` will be moved into a `data/` directory within the new `pacifica-editor/` project folder. The main application will reside in `pacifica-editor/public/index.php`.

---

### 2. Frontend Development (HTML, CSS, JavaScript)

**Location**: `public/index.php` (HTML structure), `public/assets/css/style.css`, `public/assets/js/app.js`

**a. HTML (`index.php`)**:
    *   Basic page structure with a dark background.
    *   A container for displaying the list of affiliate stations. Each station will show:
        *   Title
        *   Link
        *   Description
        *   "Edit" button
        *   "Delete" button
    *   An "Add New Station" button, prominently displayed.
    *   A modal (initially hidden) for adding/editing stations. The modal will include:
        *   A title (e.g., "Add New Station" or "Edit Station").
        *   Input fields for Title, Link, and Description.
        *   "Save" and "Cancel" buttons.

**b. CSS (`style.css`)**:
    *   **Material Design Dark Mode**:
        *   Dark background colors (e.g., shades of grey like `#121212`, `#1E1E1E`).
        *   Accent colors for interactive elements (e.g., a vibrant blue or teal).
        *   Typography consistent with Material Design (e.g., Roboto font, if available, or a good sans-serif fallback).
    *   **Layout**: Flexbox or CSS Grid for arranging elements.
    *   **Borders & Drop Shadows**: Subtle borders and drop shadows to create depth and separation for cards/modals, giving that "elevated" Material Design look.
        *   Example: `box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1);`
    *   **Buttons**:
        *   Compact, modern look.
        *   Clear visual states (default, hover, active/pressed).
        *   Possibly icon buttons for edit/delete for a cleaner look.
    *   **Modal**:
        *   Overlay effect to dim the background content.
        *   Centered on the screen.
        *   Styled consistently with the dark theme.
    *   **List Items**: Each station entry styled as a card or distinct list item.

**c. JavaScript (`app.js`)**:
    *   **Fetch & Display Data**:
        *   On page load, make an AJAX (Asynchronous JavaScript and XML) request to `api/read.php` to get the current list of stations.
        *   Dynamically render the station list in the HTML.
    *   **Event Handling**:
        *   **Add Station**:
            *   Clicking "Add New Station" button: Show the modal, clear input fields, set modal title to "Add New Station".
        *   **Edit Station**:
            *   Clicking "Edit" button for a station: Show the modal, populate input fields with the station's current data, set modal title to "Edit Station". Store an identifier (e.g., original title or a unique ID if we add one) to know which station is being edited.
        *   **Delete Station**:
            *   Clicking "Delete" button: Confirm with the user. If confirmed, send an AJAX request to `api/delete.php` with the station's identifier.
        *   **Save (in Modal)**:
            *   Clicking "Save" in the modal:
                *   Gather data from input fields.
                *   Determine if it's an "add" or "edit" operation.
                *   Send an AJAX request to `api/create.php` or `api/update.php` with the data.
    *   **Update UI**:
        *   After any successful create, update, or delete operation, re-fetch the station list (or intelligently update the local list) and re-render it to show the changes without a full page reload.
        *   Hide the modal.
    *   **Error Handling**: Display user-friendly messages if backend operations fail.

---

### 3. Backend Development (PHP)

**Location**: `public/api/` scripts, potentially `src/XmlHelper.php`

**Modern PHP Practices**:
*   Use `SimpleXMLElement` for straightforward XML parsing and manipulation. `DOMDocument` can be used for more complex scenarios if needed.
*   Strict typing where appropriate.
*   Clear separation of concerns (each API script has one job).
*   Proper error handling and HTTP status codes in responses.
*   Input validation and sanitization.

**a. `api/read.php`**:
    *   Reads the `../../data/pacifica_affiliates.xml` file.
    *   Parses the XML.
    *   Converts the list of items (title, link, description) into a PHP array.
    *   Outputs the array as a JSON response (`Content-Type: application/json`).

**b. `api/create.php`**:
    *   Receives station data (title, link, description) via POST request (JSON payload).
    *   Validates input.
    *   Loads `../../data/pacifica_affiliates.xml` using `SimpleXMLElement`.
    *   Adds a new `<item>` child to the `<channel>` element.
    *   Adds `<title>`, `<link>`, and `<description>` children to the new `<item>`.
    *   Saves the modified XML back to the file using `$sxe->asXML('../../data/pacifica_affiliates.xml')`.
    *   Returns a JSON success (e.g., `{"status": "success", "message": "Station added"}`) or error response.

**c. `api/update.php`**:
    *   Receives station data (an identifier for the station to update, plus new title, link, description) via POST (JSON). The identifier could be the original title, assuming titles are unique, or we might need a more robust way if not (e.g., an index or a generated ID). For simplicity, let's assume we'll identify by the current title.
    *   Validates input.
    *   Loads the XML.
    *   Iterates through `<item>` elements to find the one matching the identifier.
    *   Updates its `<title>`, `<link>`, and `<description>` child elements.
    *   Saves the XML.
    *   Returns a JSON success or error response.

**d. `api/delete.php`**:
    *   Receives an identifier for the station to delete (e.g., title) via POST (JSON).
    *   Validates input.
    *   Loads the XML.
    *   Finds the `<item>` to delete.
    *   Removes the item element (e.g., `unset($item_to_delete[0])`).
    *   Saves the XML.
    *   Returns a JSON success or error response.

**(Optional) `src/XmlHelper.php`**:
    *   Could contain reusable functions or a class to encapsulate common XML loading, saving, and manipulation logic to keep the API scripts cleaner.

---

### 4. Data Flow Diagram

```mermaid
graph LR
    subgraph Browser (Frontend)
        A[User Interaction <br/> (Add/Edit/Delete Click)] --> B{app.js};
        B -- AJAX Request (JSON) --> C[api/*.php];
        C -- JSON Response --> B;
        B --> D[Update HTML View];
    end

    subgraph Server (Backend)
        C --> E{PHP Script <br/> (read/create/update/delete.php)};
        E -- Reads/Writes --> F([pacifica_affiliates.xml]);
    end

    D --> A;
```

---

### 5. Key Implementation Steps

1.  **Setup Project Structure**: Create the directories and empty files. Move `pacifica_affiliates.xml` to `pacifica-editor/data/`.
2.  **Basic HTML & CSS**: Create the main layout in `index.php` and initial dark mode styles in `style.css`.
3.  **PHP `read.php`**: Implement the script to read and serve XML data as JSON.
4.  **JS Display List**: Write JavaScript in `app.js` to fetch data from `read.php` and display it.
5.  **Modal HTML & CSS**: Design and style the add/edit modal.
6.  **PHP `create.php` & JS Add Functionality**: Implement adding new stations.
7.  **PHP `update.php` & JS Edit Functionality**: Implement editing existing stations.
8.  **PHP `delete.php` & JS Delete Functionality**: Implement deleting stations.
9.  **Refine Styling**: Polish the Material Design dark mode look and feel, button styles, shadows, etc.
10. **Error Handling & Validation**: Implement robust error handling and input validation on both frontend and backend.
11. **Testing**: Thoroughly test all CRUD operations and edge cases.