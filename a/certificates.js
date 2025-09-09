// certificates.js - PDF to Image Display with Automatic Orientation Detection

document.addEventListener('DOMContentLoaded', function() {
    loadCertificates();
});

// List of certificate PDF files from the certificates folder
const certificateFiles = [
    'Agile Scrum in Practice.pdf',
    'Introduction to Artificial Intelligence.pdf',
    'Introduction to Data Science.pdf',
    'OpenAI Generative Pre-trained Transformer 3 (GPT-3) for developers.pdf'
];

// Function to load and display certificates
async function loadCertificates() {
    const certificatesGrid = document.querySelector('.certificatesGrid');
    
    if (!certificatesGrid) {
        console.error('Certificates grid not found');
        return;
    }

    // Clear existing content
    certificatesGrid.innerHTML = '';

    // Load each certificate
    for (let i = 0; i < certificateFiles.length; i++) {
        const fileName = certificateFiles[i];
        const filePath = `../certificates/${fileName}`;
        
        try {
            await createCertificateCard(filePath, fileName, i + 1);
        } catch (error) {
            console.error(`Error loading certificate ${fileName}:`, error);
            createErrorCard(fileName, i + 1);
        }
    }
}

// Function to create a certificate card with PDF preview
async function createCertificateCard(filePath, fileName, index) {
    const certificatesGrid = document.querySelector('.certificatesGrid');
    
    // Create certificate card
    const certificateCard = document.createElement('div');
    certificateCard.className = 'certificateCard';
    certificateCard.id = `certificate-${index}`;

    // Extract title from filename
    const title = fileName.replace('.pdf', '').replace(/([A-Z])/g, ' $1').trim();
    
    certificateCard.innerHTML = `
        <div class="certificateImageContainer">
            <div class="certificateLoader" id="loader-${index}">
                <div class="loading-spinner"></div>
                <p>Loading Certificate...</p>
            </div>
            <canvas id="pdf-canvas-${index}" class="certificateCanvas" style="display: none;"></canvas>
            <div class="certificateOverlay">
                <div class="certificateOverlayContent">
                    <h3>${title}</h3>
                    <p>Issued by: Arshad Pasha</p>
                    <p>Professional Certificate</p>
                    <button class="viewCertificate" onclick="openCertificateModal('${filePath}', '${title}', 'Professional Certificate', '2024')">View Certificate</button>
                </div>
            </div>
        </div>
    `;

    certificatesGrid.appendChild(certificateCard);

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
        canvas.className = `certificateCanvas ${isLandscape ? 'landscape' : 'portrait'}`;
        
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
    placeholder.className = 'certificatePlaceholder';
    placeholder.innerHTML = `
        <div class="placeholderContent">
            <i class="pdf-icon">📄</i>
            <h4>PDF Certificate</h4>
            <p>Click to view PDF</p>
        </div>
    `;
    
    placeholder.onclick = () => window.open(filePath, '_blank');
    
    canvas.parentNode.replaceChild(placeholder, canvas);
}

// Function to create error card
function createErrorCard(fileName, index) {
    const certificatesGrid = document.querySelector('.certificatesGrid');
    
    const errorCard = document.createElement('div');
    errorCard.className = 'certificateCard error-card';
    errorCard.innerHTML = `
        <div class="certificateImageContainer">
            <div class="certificateError">
                <h3>Error Loading Certificate</h3>
                <p>${fileName}</p>
                <p>Please check if the file exists</p>
            </div>
        </div>
    `;
    
    certificatesGrid.appendChild(errorCard);
}

// Enhanced modal functionality for PDF viewing
function openCertificateModal(filePath, title, organization, date) {
    const modal = document.getElementById('certificateModal');
    const modalContent = modal.querySelector('.modalContent');
    
    // Clear existing content
    modalContent.innerHTML = `
        <span class="closeModal" onclick="closeCertificateModal()">&times;</span>
        <div class="modalLoader">
            <div class="loading-spinner"></div>
            <p>Loading Certificate...</p>
        </div>
        <div class="modalCertificateInfo">
            <h3>${title}</h3>
            <p>Issued by: ${organization}</p>
            <p>Date: ${date}</p>
            <a href="${filePath}" target="_blank" class="downloadCertificate">Download PDF</a>
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
        canvas.className = 'modalCertificateImage';
        
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
                <p>Error loading certificate</p>
                <a href="${filePath}" target="_blank" class="viewPdfButton">Open PDF in New Tab</a>
            </div>
        `;
    }
}

// Close modal function
function closeCertificateModal() {
    document.getElementById('certificateModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('certificateModal');
    if (event.target === modal) {
        closeCertificateModal();
    }
};

// Initialize PDF.js if available
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}
