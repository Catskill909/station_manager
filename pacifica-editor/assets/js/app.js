document.addEventListener('DOMContentLoaded', () => {
    const stationListContainer = document.getElementById('stationListContainer');
    const addStationBtn = document.getElementById('addStationBtn');
    const viewXmlBtn = document.getElementById('viewXmlBtn');
    const searchInput = document.getElementById('searchInput');
    const xmlViewerModal = document.getElementById('xmlViewerModal');
    const closeXmlViewer = document.getElementById('closeXmlViewer');
    const xmlContent = document.getElementById('xmlContent');

    // Add/Edit Modal Elements
    const stationModal = document.getElementById('stationModal');
    const modalTitle = document.getElementById('modalTitle');
    const stationForm = document.getElementById('stationForm');
    const originalTitleInput = document.getElementById('originalTitle');
    const titleInput = document.getElementById('title');
    const linkInput = document.getElementById('link');
    const descriptionInput = document.getElementById('description');
    const closeStationModalBtn = stationModal.querySelector('.close-button');
    const cancelStationModalBtn = document.getElementById('cancelModalBtn');

    // Delete Confirmation Modal Elements
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const deleteModalMessage = document.getElementById('deleteModalMessage');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    let titleToDeleteGlobally = null;

    const apiBaseUrl = '/api/';
    let allStationsCache = []; // Cache for all stations to filter locally

    async function fetchAndDisplayStations(searchTerm = '') {
        if (allStationsCache.length === 0 && !searchTerm) { // Initial load or no search term means fetch
            stationListContainer.innerHTML = '<p>Loading stations...</p>';
            try {
                const response = await fetch(`${apiBaseUrl}read.php`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                allStationsCache = data.stations || [];
            } catch (error) {
                console.error('Error fetching stations:', error);
                stationListContainer.innerHTML = `<p>Error loading stations: ${error.message}. Please try again later.</p>`;
                allStationsCache = []; // Reset cache on error
                return; // Exit if fetch fails
            }
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        const filteredStations = allStationsCache.filter(station => {
            return (station.title && station.title.toLowerCase().includes(lowerSearchTerm)) ||
                (station.link && station.link.toLowerCase().includes(lowerSearchTerm)) ||
                (station.description && station.description.toLowerCase().includes(lowerSearchTerm));
        });

        filteredStations.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

        if (filteredStations.length > 0) {
            stationListContainer.innerHTML = '';
            filteredStations.forEach(station => {
                const stationDiv = document.createElement('div');
                stationDiv.classList.add('station-item');
                // If searching, and the item is hidden by search, it won't be in filteredStations
                // stationDiv.classList.toggle('hidden', searchTerm && !stationDiv.textContent.toLowerCase().includes(lowerSearchTerm));

                stationDiv.innerHTML = `
                    <h3>${escapeHTML(station.title)}</h3>
                    <p><a href="${escapeHTML(station.link)}" target="_blank" rel="noopener noreferrer">${escapeHTML(station.link)}</a></p>
                    <p>${escapeHTML(station.description)}</p>
                    <div class="station-actions">
                        <button class="edit-btn" data-title="${escapeHTML(station.title)}" data-link="${escapeHTML(station.link)}" data-description="${escapeHTML(station.description)}">Edit</button>
                        <button class="delete-btn" data-title="${escapeHTML(station.title)}">Delete</button>
                    </div>
                `;
                stationListContainer.appendChild(stationDiv);
            });
            addEventListenersToButtons();
        } else if (searchTerm) {
            stationListContainer.innerHTML = '<p>No stations match your search.</p>';
        } else {
            stationListContainer.innerHTML = '<p>No stations found. Add one!</p>';
        }
    }

    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return str.toString().replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, '&#039;');
    }

    function openStationModal(mode = 'add', station = null) {
        stationForm.reset();
        originalTitleInput.value = '';
        if (mode === 'edit' && station) {
            modalTitle.textContent = 'Edit Station';
            originalTitleInput.value = station.title;
            titleInput.value = station.title;
            linkInput.value = station.link;
            descriptionInput.value = station.description;
        } else {
            modalTitle.textContent = 'Add New Station';
        }
        stationModal.style.display = 'flex';
    }

    function closeStationModal() {
        stationModal.style.display = 'none';
    }

    function openDeleteConfirmModal(title) {
        titleToDeleteGlobally = title;
        deleteModalMessage.textContent = `Are you sure you want to delete "${escapeHTML(title)}"? This action cannot be undone.`;
        deleteConfirmModal.style.display = 'flex';
    }

    function closeDeleteConfirmModal() {
        deleteConfirmModal.style.display = 'none';
        titleToDeleteGlobally = null;
    }

        // View XML functionality
    viewXmlBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/get_xml.php');
            if (!response.ok) throw new Error('Failed to load XML');
            const xmlText = await response.text();
            
            // Format XML with proper indentation
            const formattedXml = formatXml(xmlText);
            xmlContent.textContent = formattedXml;
            xmlViewerModal.style.display = 'block';
        } catch (error) {
            console.error('Error loading XML:', error);
            alert('Failed to load XML file. Please check console for details.');
        }
    });

    // Close XML viewer when clicking the close button
    closeXmlViewer.addEventListener('click', () => {
        xmlViewerModal.style.display = 'none';
    });

    // Close modal when clicking outside the content
    window.addEventListener('click', (event) => {
        if (event.target === xmlViewerModal) {
            xmlViewerModal.style.display = 'none';
        }
    });

    // Format XML string with proper indentation
    function formatXml(xml) {
        const PADDING = '  ';
        const reg = /(>)(<)(\/*)/g;
        let formatted = '';
        let pad = 0;
        
        // Add newlines and indentation
        xml = xml.replace(reg, '$1\r\n$2$3');
        
        // Split by newlines and process each line
        const nodes = xml.split('\r\n');
        for (let node of nodes) {
            let indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/) && pad > 0) {
                pad -= 1;
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }
            
            let padding = '';
            for (let i = 0; i < pad; i++) {
                padding += PADDING;
            }
            
            formatted += padding + node + '\r\n';
            pad += indent;
        }
        
        return formatted.trim();
    }

    addStationBtn.addEventListener('click', () => openStationModal('add'));
    closeStationModalBtn.addEventListener('click', closeStationModal);
    cancelStationModalBtn.addEventListener('click', closeStationModal);

    cancelDeleteBtn.addEventListener('click', closeDeleteConfirmModal);
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!titleToDeleteGlobally) return;
        try {
            const response = await fetch(`${apiBaseUrl}delete.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: titleToDeleteGlobally }),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
                throw new Error(`Server error: ${response.status} - ${errorData.message || 'Failed to delete station'}`);
            }
            const result = await response.json();
            if (result.status === 'success') {
                allStationsCache = []; // Invalidate cache
                fetchAndDisplayStations(searchInput.value.trim()); // Re-fetch and filter
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error deleting station:', error);
            alert(`An error occurred while deleting: ${error.message}`);
        } finally {
            closeDeleteConfirmModal();
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target === stationModal) closeStationModal();
        if (event.target === deleteConfirmModal) closeDeleteConfirmModal();
    });

    stationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = titleInput.value.trim();
        const link = linkInput.value.trim();
        const description = descriptionInput.value.trim();
        const originalTitle = originalTitleInput.value;

        if (!title || !link || !description) {
            alert('Please fill in all fields.');
            return;
        }

        const stationData = { title, link, description };
        let url = `${apiBaseUrl}create.php`;
        if (originalTitle) {
            stationData.originalTitle = originalTitle;
            url = `${apiBaseUrl}update.php`;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stationData),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
                throw new Error(`Server error: ${response.status} - ${errorData.message || 'Failed to save station'}`);
            }
            const result = await response.json();
            if (result.status === 'success') {
                closeStationModal();
                allStationsCache = []; // Invalidate cache
                fetchAndDisplayStations(searchInput.value.trim()); // Re-fetch and filter
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error saving station:', error);
            alert(`An error occurred: ${error.message}`);
        }
    });

    function addEventListenersToButtons() {
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                openStationModal('edit', {
                    title: e.target.dataset.title,
                    link: e.target.dataset.link,
                    description: e.target.dataset.description,
                });
            });
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                openDeleteConfirmModal(e.target.dataset.title);
            });
        });
    }

    searchInput.addEventListener('input', (e) => {
        fetchAndDisplayStations(e.target.value.trim());
    });

    // Initial fetch
    fetchAndDisplayStations();
});