<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pacifica Affiliates Editor</title>

    <!-- Preconnect to Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Load Google Fonts: Oswald (Bold 700) and Open Sans (Regular 400, Semibold 600) -->
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="/assets/css/style.css">
</head>

<body>
    <header>
        <h1>Pacifica Network Affiliates Editor</h1>
    </header>

    <main>
        <div class="controls">
            <div class="search-container">
                <span class="search-icon">&#128269;</span> <!-- Eyeglass icon -->
                <input type="text" id="searchInput" placeholder="Search stations...">
            </div>
            <div class="button-group">
                <button id="viewXmlBtn" class="secondary-btn">View XML</button>
                <button id="addStationBtn">Add New Station</button>
            </div>
        </div>
        <div id="stationListContainer">
            <!-- Stations will be loaded here by JavaScript -->
            <p>Loading stations...</p>
        </div>
    </main>

    <!-- Modal for Add/Edit Station -->
    <div id="stationModal" class="modal" style="display:none;">
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2 id="modalTitle">Add/Edit Station</h2>
            <form id="stationForm">
                <input type="hidden" id="originalTitle" name="originalTitle">
                <div>
                    <label for="title">Title:</label>
                    <input type="text" id="title" name="title" required>
                </div>
                <div>
                    <label for="link">Link:</label>
                    <input type="url" id="link" name="link" required>
                </div>
                <div>
                    <label for="description">Description:</label>
                    <input type="text" id="description" name="description" required>
                </div>
                <div class="modal-actions">
                    <button type="submit" id="saveStationBtn">Save</button>
                    <button type="button" id="cancelModalBtn">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal for Delete Confirmation -->
    <div id="deleteConfirmModal" class="modal" style="display:none;">
        <div class="modal-content">
            <h2 id="deleteModalTitle">Confirm Deletion</h2>
            <p id="deleteModalMessage">Are you sure you want to delete this station?</p>
            <div class="modal-actions">
                <button type="button" id="confirmDeleteBtn" class="danger-btn">Delete</button>
                <button type="button" id="cancelDeleteBtn">Cancel</button>
            </div>
        </div>
    </div>

    <footer>
        <p>&copy; <?php echo date("Y"); ?> Pacifica Editor</p>
    </footer>

    <!-- XML Viewer Modal -->
    <div id="xmlViewerModal" class="modal" style="display:none;">
        <div class="modal-content" style="max-width: 90%; max-height: 80vh; overflow: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2>XML View</h2>
                <span class="close-button" id="closeXmlViewer">&times;</span>
            </div>
            <pre id="xmlContent" style="background: #1e1e1e; padding: 15px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; color: #e0e0e0; font-family: 'Courier New', monospace;"></pre>
        </div>
    </div>

    <script src="/assets/js/app.js"></script>
</body>

</html>