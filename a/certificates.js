// certificates.js - Organized Certificate Sections Display

document.addEventListener('DOMContentLoaded', function() {
    loadCertificateSections();
});

// Organized certificate sections
const certificateSections = {
    hackathons: {
        title: "Hackathon Certificates",
        description: "Programming competitions and hackathon achievements",
        files: [
            'photo_5_2025-09-09_23-04-19.jpg',
            'photo_6_2025-09-09_23-04-19.jpg',
            'photo_7_2025-09-09_23-04-19.jpg',
            'photo_8_2025-09-09_23-04-19.jpg',
            'photo_10_2025-09-09_23-04-19.jpg'
        ],
        folder: 'Hackthons'
    },
    other: {
        title: "Other Certificates",
        description: "Competition and achievement certificates",
        files: [
            {
                filename: 'RBI Quize.jpg',
                title: 'RBI Quiz Certificate',
                description: 'State level competition certificate'
            },
            {
                filename: 'Eassy English.jpg',
                title: 'Essay Competition Certificate',
                description: 'English essay competition certificate'
            }
        ],
        folder: 'Other'
    },
    courses: {
        title: "Course Certificates",
        description: "Professional development and online course completions",
        files: [
            'Agile Scrum in Practice.pdf',
            'Introduction to Artificial Intelligence.pdf',
            'Introduction to Data Science.pdf',
            'OpenAI Generative Pre-trained Transformer 3 (GPT-3) for developers.pdf',
            'photo_1_2025-09-09_23-04-19.jpg',
            'photo_2_2025-09-09_23-04-19.jpg'
        ],
        folder: 'Cources'
    },
    college: {
        title: "College Certificates",
        description: "Academic and college-related achievements",
        files: [
            'photo_13_2025-09-09_23-04-19.jpg',
            'photo_14_2025-09-09_23-04-19.jpg',
            'photo_15_2025-09-09_23-04-19.jpg',
            'photo_16_2025-09-09_23-04-19.jpg',
            'photo_17_2025-09-09_23-04-19.jpg',
            'photo_18_2025-09-09_23-04-19.jpg',
            'photo_19_2025-09-09_23-04-19.jpg',
            'photo_20_2025-09-09_23-04-19.jpg',
            'photo_21_2025-09-09_23-04-19.jpg',
            'photo_22_2025-09-09_23-04-19.jpg'
        ],
        folder: 'College'
    }
};

// Function to load and display certificate sections
async function loadCertificateSections() {
    const certificatesGrid = document.querySelector('.certificatesGrid');
    
    if (!certificatesGrid) {
        console.error('Certificates grid not found');
        return;
    }

    // Clear existing content
    certificatesGrid.innerHTML = '';

    // Change grid to single column for sections
    certificatesGrid.style.gridTemplateColumns = '1fr';
    certificatesGrid.style.gap = '50px';

    // Load sections in the specified order
    const sectionOrder = ['hackathons', 'other', 'courses', 'college'];
    
    for (const sectionKey of sectionOrder) {
        const section = certificateSections[sectionKey];
        await createCertificateSection(section, sectionKey);
    }
}

// Function to create a certificate section
async function createCertificateSection(section, sectionKey) {
    const certificatesGrid = document.querySelector('.certificatesGrid');
    
    // Create section container
    const sectionContainer = document.createElement('div');
    sectionContainer.className = 'certificateSection';
    sectionContainer.id = `section-${sectionKey}`;

    // Create section header
    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'sectionHeader';
    sectionHeader.innerHTML = `
        <h2>${section.title}</h2>
        <p>${section.description}</p>
        <div class="sectionDivider"></div>
    `;

    // Create section grid for certificates
    const sectionGrid = document.createElement('div');
    sectionGrid.className = 'sectionGrid';

    sectionContainer.appendChild(sectionHeader);
    sectionContainer.appendChild(sectionGrid);
    certificatesGrid.appendChild(sectionContainer);

    // Load certificates for this section
    let index = 0;
    for (const file of section.files) {
        try {
            if (typeof file === 'object') {
                // Handle special files with custom info (Other section)
                await createSpecialCertificateCard(file, section.folder, index);
            } else {
                // Handle regular files
                await createRegularCertificateCard(file, section.folder, index);
            }
            index++;
        } catch (error) {
            console.error(`Error loading certificate ${file}:`, error);
        }
    }
}

// Function to create a regular certificate card
async function createRegularCertificateCard(filename, folder, index) {
    const sectionGrid = document.querySelector(`#section-${getCurrentSectionKey()} .sectionGrid`);
    const filePath = `../certificates/${folder}/${filename}`;
    
    // Check if file is PDF
    const isPDF = filename.toLowerCase().endsWith('.pdf');
    
    // Create certificate card
    const certificateCard = document.createElement('div');
    certificateCard.className = 'certificateCard simpleCard';
    certificateCard.id = `certificate-${folder}-${index}`;

    if (isPDF) {
        // Handle PDF files with PDF.js
        certificateCard.innerHTML = `
            <div class="certificateImageContainer">
                <div class="certificateLoader" id="loader-${folder}-${index}">
                    <div class="loading-spinner"></div>
                    <p>Loading Certificate...</p>
                </div>
                <canvas id="pdf-canvas-${folder}-${index}" class="certificateCanvas" style="display: none;"></canvas>
                <div class="certificateSimpleOverlay">
                    <button class="viewCertificateSimple" onclick="openCertificateModal('${filePath}', 'Course Certificate', 'Professional Certificate', 'Achievement')">View Certificate</button>
                </div>
            </div>
        `;
        
        sectionGrid.appendChild(certificateCard);
        
        // Load PDF and render first page
        await loadPDFPreview(filePath, folder, index);
    } else {
        // Handle image files
        certificateCard.innerHTML = `
            <div class="certificateImageContainer">
                <div class="certificateLoader" id="loader-${folder}-${index}">
                    <div class="loading-spinner"></div>
                    <p>Loading Certificate...</p>
                </div>
                <img src="${filePath}" alt="Certificate" class="certificateImage" style="display: none;" onload="hideLoader('${folder}', ${index})" onerror="showError('${folder}', ${index})">
                <div class="certificateSimpleOverlay">
                    <button class="viewCertificateSimple" onclick="openCertificateModal('${filePath}', 'Certificate', 'Achievement', 'Professional')">View Certificate</button>
                </div>
            </div>
        `;
        
        sectionGrid.appendChild(certificateCard);
    }
}

// Function to create a special certificate card (with custom info)
async function createSpecialCertificateCard(fileInfo, folder, index) {
    const sectionGrid = document.querySelector(`#section-${getCurrentSectionKey()} .sectionGrid`);
    const filePath = `../certificates/${folder}/${fileInfo.filename}`;
    
    // Create certificate card
    const certificateCard = document.createElement('div');
    certificateCard.className = 'certificateCard specialCard';
    certificateCard.id = `certificate-${folder}-${index}`;

    certificateCard.innerHTML = `
        <div class="certificateImageContainer">
            <div class="certificateLoader" id="loader-${folder}-${index}">
                <div class="loading-spinner"></div>
                <p>Loading Certificate...</p>
            </div>
            <img src="${filePath}" alt="${fileInfo.title}" class="certificateImage" style="display: none;" onload="hideLoader('${folder}', ${index})" onerror="showError('${folder}', ${index})">
            <div class="certificateOverlay">
                <div class="certificateOverlayContent">
                    <h3>${fileInfo.title}</h3>
                    <p>${fileInfo.description}</p>
                    <button class="viewCertificate" onclick="openCertificateModal('${filePath}', '${fileInfo.title}', 'Achievement Certificate', 'Professional')">View Certificate</button>
                </div>
            </div>
        </div>
    `;

    sectionGrid.appendChild(certificateCard);
}

// Helper function to get current section key
function getCurrentSectionKey() {
    const sectionOrder = ['hackathons', 'other', 'courses', 'college'];
    const sections = document.querySelectorAll('.certificateSection');
    return sectionOrder[sections.length - 1] || 'hackathons';
}

// Helper functions for image loading
function hideLoader(folder, index) {
    const loader = document.getElementById(`loader-${folder}-${index}`);
    const image = loader.nextElementSibling;
    if (loader) loader.style.display = 'none';
    if (image) image.style.display = 'block';
}

function showError(folder, index) {
    const loader = document.getElementById(`loader-${folder}-${index}`);
    if (loader) {
        loader.innerHTML = `
            <div class="certificateError">
                <h3>Error Loading Certificate</h3>
                <p>Image not found</p>
            </div>
        `;
    }
}

// Enhanced modal functionality for image and PDF viewing
function openCertificateModal(filePath, title, organization, date) {
    const modal = document.getElementById('certificateModal');
    const modalContent = modal.querySelector('.modalContent');
    
    // Check if file is PDF
    const isPDF = filePath.toLowerCase().endsWith('.pdf');
    
    if (isPDF) {
        // Handle PDF files
        modalContent.innerHTML = `
            <span class="closeModal" onclick="closeCertificateModal()">&times;</span>
            <div class="pdfContainer">
                <canvas id="modalPdfCanvas" class="modalCertificateCanvas"></canvas>
                <div class="pdfControls">
                    <button onclick="previousPage()" id="prevBtn">Previous</button>
                    <span id="pageInfo">Page 1 of 1</span>
                    <button onclick="nextPage()" id="nextBtn">Next</button>
                </div>
            </div>
            <div class="modalCertificateInfo">
                <h3>${title}</h3>
                <p>Type: ${organization}</p>
                <p>Category: ${date}</p>
            </div>
        `;
        
        // Load PDF
        loadModalPDF(filePath);
    } else {
        // Handle image files
        modalContent.innerHTML = `
            <span class="closeModal" onclick="closeCertificateModal()">&times;</span>
            <img src="${filePath}" alt="${title}" class="modalCertificateImage">
            <div class="modalCertificateInfo">
                <h3>${title}</h3>
                <p>Type: ${organization}</p>
                <p>Category: ${date}</p>
            </div>
        `;
    }
    
    modal.style.display = 'block';
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

// Variables for PDF modal handling
let currentPDF = null;
let currentPage = 1;
let totalPages = 1;

// Function to load and display PDF preview
async function loadPDFPreview(pdfPath, folder, index) {
    try {
        const pdf = await pdfjsLib.getDocument(pdfPath).promise;
        const page = await pdf.getPage(1);
        
        const canvas = document.getElementById(`pdf-canvas-${folder}-${index}`);
        const ctx = canvas.getContext('2d');
        
        // Calculate scale to fit 300px width
        const desiredWidth = 300;
        const viewport = page.getViewport({ scale: 1 });
        const scale = desiredWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });
        
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        
        const renderContext = {
            canvasContext: ctx,
            viewport: scaledViewport
        };
        
        await page.render(renderContext).promise;
        
        // Hide loader and show canvas
        hideLoader(folder, index);
        canvas.style.display = 'block';
        
    } catch (error) {
        console.error(`Error loading PDF ${pdfPath}:`, error);
        showError(folder, index);
    }
}

// Function to load PDF in modal
async function loadModalPDF(pdfPath) {
    try {
        currentPDF = await pdfjsLib.getDocument(pdfPath).promise;
        totalPages = currentPDF.numPages;
        currentPage = 1;
        
        await renderModalPage(currentPage);
        updatePageInfo();
        
    } catch (error) {
        console.error('Error loading PDF in modal:', error);
        document.querySelector('.modalContent').innerHTML += '<p>Error loading PDF certificate</p>';
    }
}

// Function to render PDF page in modal
async function renderModalPage(pageNum) {
    try {
        const page = await currentPDF.getPage(pageNum);
        const canvas = document.getElementById('modalPdfCanvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate scale to fit modal (max width 80% of window)
        const maxWidth = window.innerWidth * 0.7;
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(maxWidth / viewport.width, 2); // Max scale of 2
        const scaledViewport = page.getViewport({ scale });
        
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        
        const renderContext = {
            canvasContext: ctx,
            viewport: scaledViewport
        };
        
        await page.render(renderContext).promise;
        
    } catch (error) {
        console.error('Error rendering PDF page:', error);
    }
}

// Function to go to previous page
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderModalPage(currentPage);
        updatePageInfo();
    }
}

// Function to go to next page
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        renderModalPage(currentPage);
        updatePageInfo();
    }
}

// Function to update page information
function updatePageInfo() {
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
}
