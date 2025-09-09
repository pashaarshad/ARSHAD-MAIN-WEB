// internships.js - PDF to Image Display for Internship Certificates

document.addEventListener('DOMContentLoaded', function() {
    loadInternships();
});

// List of internship PDF files with extracted information
const internshipFiles = [
    {
        filename: 'AICTE B1 PD Certificate-30.pdf',
        title: 'Cyber Security Internship',
        organization: 'AICTE & Edunet Foundation',
        date: 'June 2025',
        description: '6-week virtual internship in Cyber Security'
    },
    {
        filename: 'Arshad  Pasha_AICTE_Certificate (3).pdf',
        title: 'AI and Data Analytics Internship',
        organization: 'AICTE, Shell India & Edunet Foundation',
        date: 'July - August 2025',
        description: '4-week internship on AI & Data Analytics focused on Green Skills'
    },
    {
        filename: 'Arshad  Pasha_AICTE_Certificate.pdf',
        title: 'AI and Data Analytics Program',
        organization: 'AICTE, Shell India & Edunet Foundation',
        date: 'June - July 2025',
        description: '4-week virtual internship under Skills4Future program'
    },
    {
        filename: 'Arshad Pasha __ID__ (1) (1).pdf',
        title: 'Full Stack Development Internship',
        organization: 'Micro IT',
        date: 'April 2025',
        description: '1-month Full Stack Development certification program'
    },
    {
        filename: 'Arshad Pasha_Completion_Certificate.pdf',
        title: 'Web Development Internship',
        organization: 'NexusLogic Technologies',
        date: 'March - May 2025',
        description: '2-month internship as Web Development Intern'
    },
    {
        filename: 'Foundations of AI certificate.pdf',
        title: 'Foundations of Artificial Intelligence',
        organization: 'Microsoft, AICTE & Edunet Foundation',
        date: 'April - May 2025',
        description: '4-week Microsoft initiative internship program'
    },
    {
        filename: 'ThegoodgameTheory.pdf',
        title: 'Game Theory Research Internship',
        organization: 'The Good Game Theory',
        date: 'July 2025 - Ongoing',
        description: '6-month research internship (Currently Active)'
    }
];

// Function to load and display internships
async function loadInternships() {
    const internshipsGrid = document.querySelector('.internshipsGrid');
    
    if (!internshipsGrid) {
        console.error('Internships grid not found');
        return;
    }

    // Clear existing content
    internshipsGrid.innerHTML = '';

    // Load each internship
    for (let i = 0; i < internshipFiles.length; i++) {
        const internship = internshipFiles[i];
        const filePath = `../intenships/${internship.filename}`;
        
        try {
            await createInternshipCard(filePath, internship, i + 1);
        } catch (error) {
            console.error(`Error loading internship ${internship.filename}:`, error);
            createErrorCard(internship, i + 1);
        }
    }
}

// Function to create an internship card with PDF preview
async function createInternshipCard(filePath, internship, index) {
    const internshipsGrid = document.querySelector('.internshipsGrid');
    
    // Create internship card
    const internshipCard = document.createElement('div');
    internshipCard.className = 'internshipCard';
    internshipCard.id = `internship-${index}`;

    internshipCard.innerHTML = `
        <div class="internshipImageContainer">
            <div class="internshipLoader" id="loader-${index}">
                <div class="loading-spinner"></div>
                <p>Loading Internship...</p>
            </div>
            <canvas id="pdf-canvas-${index}" class="internshipCanvas" style="display: none;"></canvas>
            <div class="internshipOverlay">
                <div class="internshipOverlayContent">
                    <h3>${internship.title}</h3>
                    <p><strong>Organization:</strong> ${internship.organization}</p>
                    <p><strong>Duration:</strong> ${internship.date}</p>
                    <p class="internshipDesc">${internship.description}</p>
                    ${internship.date.includes('Ongoing') ? '<p class="ongoingBadge">🔥 Currently Active</p>' : ''}
                    <button class="viewInternship" onclick="openInternshipModal('${filePath}', '${internship.title}', '${internship.organization}', '${internship.date}')">View Certificate</button>
                </div>
            </div>
        </div>
    `;

    internshipsGrid.appendChild(internshipCard);

    // Load PDF and render first page
    await loadPDFPreview(filePath, index);
}

// Function to load PDF and render as image
async function loadPDFPreview(filePath, index) {
    try {
        // Check if PDF.js is available
        if (typeof pdfjsLib === 'undefined') {
            console.warn('PDF.js not loaded, using fallback display');
            createFallbackDisplay(filePath, index);
            return;
        }

        const loadingTask = pdfjsLib.getDocument(filePath);
        const pdf = await loadingTask.promise;
        
        // Get first page
        const page = await pdf.getPage(1);
        
        // Get canvas element
        const canvas = document.getElementById(`pdf-canvas-${index}`);
        const context = canvas.getContext('2d');
        
        // Get page dimensions
        const viewport = page.getViewport({ scale: 1 });
        
        // Determine orientation and scale
        const isLandscape = viewport.width > viewport.height;
        const maxWidth = isLandscape ? 500 : 350;
        const maxHeight = isLandscape ? 350 : 500;
        
        let scale = Math.min(maxWidth / viewport.width, maxHeight / viewport.height);
        
        // Apply the scale
        const scaledViewport = page.getViewport({ scale: scale });
        
        // Set canvas dimensions
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        
        // Add orientation class
        canvas.className = `internshipCanvas ${isLandscape ? 'landscape' : 'portrait'}`;
        
        // Render PDF page to canvas
        const renderContext = {
            canvasContext: context,
            viewport: scaledViewport
        };
        
        await page.render(renderContext).promise;
        
        // Hide loader and show canvas
        const loader = document.getElementById(`loader-${index}`);
        if (loader) loader.style.display = 'none';
        canvas.style.display = 'block';
        
    } catch (error) {
        console.error(`Error loading PDF ${filePath}:`, error);
        createFallbackDisplay(filePath, index);
    }
}

// Fallback display when PDF.js is not available
function createFallbackDisplay(filePath, index) {
    const canvas = document.getElementById(`pdf-canvas-${index}`);
    const loader = document.getElementById(`loader-${index}`);
    
    if (loader) loader.style.display = 'none';
    
    // Create a placeholder image
    const placeholder = document.createElement('div');
    placeholder.className = 'internshipPlaceholder';
    placeholder.innerHTML = `
        <div class="placeholderContent">
            <i class="pdf-icon">📄</i>
            <h4>Internship Certificate</h4>
            <p>Click to view PDF</p>
        </div>
    `;
    
    placeholder.onclick = () => window.open(filePath, '_blank');
    
    canvas.parentNode.replaceChild(placeholder, canvas);
}

// Function to create error card
function createErrorCard(internship, index) {
    const internshipsGrid = document.querySelector('.internshipsGrid');
    
    const errorCard = document.createElement('div');
    errorCard.className = 'internshipCard error-card';
    errorCard.innerHTML = `
        <div class="internshipImageContainer">
            <div class="internshipError">
                <h3>Error Loading Internship</h3>
                <p>${internship.filename}</p>
                <p>Please check if the file exists</p>
            </div>
        </div>
    `;
    
    internshipsGrid.appendChild(errorCard);
}

// Enhanced modal functionality for PDF viewing
function openInternshipModal(filePath, title, organization, date) {
    const modal = document.getElementById('internshipModal');
    const modalContent = modal.querySelector('.modalContent');
    
    // Clear existing content
    modalContent.innerHTML = `
        <span class="closeModal" onclick="closeInternshipModal()">&times;</span>
        <div class="modalLoader">
            <div class="loading-spinner"></div>
            <p>Loading Internship Certificate...</p>
        </div>
        <div class="modalInternshipInfo">
            <h3>${title}</h3>
            <p>Issued by: ${organization}</p>
            <p>Year: ${date}</p>
            <a href="${filePath}" target="_blank" class="downloadInternship">Download PDF</a>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Load PDF in modal
    loadModalPDF(filePath);
}

// Function to load PDF in modal with full size
async function loadModalPDF(filePath) {
    try {
        if (typeof pdfjsLib === 'undefined') {
            // Fallback: show download link
            const modalContent = document.querySelector('.modalContent');
            modalContent.querySelector('.modalLoader').innerHTML = `
                <div class="modalFallback">
                    <i class="pdf-icon">📄</i>
                    <p>PDF Preview not available</p>
                    <a href="${filePath}" target="_blank" class="viewPdfButton">Open PDF in New Tab</a>
                </div>
            `;
            return;
        }

        const loadingTask = pdfjsLib.getDocument(filePath);
        const pdf = await loadingTask.promise;
        
        // Get first page
        const page = await pdf.getPage(1);
        
        // Create canvas for modal
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Get page dimensions
        const viewport = page.getViewport({ scale: 1 });
        
        // Scale for modal (larger display)
        const maxWidth = window.innerWidth * 0.8;
        const maxHeight = window.innerHeight * 0.7;
        const scale = Math.min(maxWidth / viewport.width, maxHeight / viewport.height);
        
        const scaledViewport = page.getViewport({ scale: scale });
        
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        canvas.className = 'modalInternshipImage';
        
        // Render PDF page
        const renderContext = {
            canvasContext: context,
            viewport: scaledViewport
        };
        
        await page.render(renderContext).promise;
        
        // Replace loader with canvas
        const modalLoader = document.querySelector('.modalLoader');
        modalLoader.replaceWith(canvas);
        
    } catch (error) {
        console.error('Error loading PDF in modal:', error);
        const modalLoader = document.querySelector('.modalLoader');
        modalLoader.innerHTML = `
            <div class="modalError">
                <p>Error loading internship certificate</p>
                <a href="${filePath}" target="_blank" class="viewPdfButton">Open PDF in New Tab</a>
            </div>
        `;
    }
}

// Close modal function
function closeInternshipModal() {
    document.getElementById('internshipModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('internshipModal');
    if (event.target === modal) {
        closeInternshipModal();
    }
};

// Initialize PDF.js if available
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}
