document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display data from the CSV file
    fetch("DataBase.csv")
        .then((response) => response.text())
        .then((data) => {
            populateTable(data);
        })
        .catch((error) => console.error("Error loading CSV:", error));
});

function populateTable(csvData) {
    const rows = csvData.split("\n").filter((row) => row.trim() !== ""); // Remove empty rows
    const tableBody = document.getElementById("table-body");

    // Clear the existing table body to prevent duplication
    tableBody.innerHTML = "";

    rows.forEach((row, index) => {
        if (index === 0) return; // Skip the header row

        const cols = row.split(",");

        if (cols.length < 5) {
            console.warn(`Row ${index} skipped (not enough columns):`, row);
            return;
        }

        const tr = document.createElement("tr");

        const orderedCols = [
            cols[0], // Date of Birth
            cols[2], // Name
            cols[1], // Mother's Name
            cols[3], // #
            cols[4], // Contact
        ];

        orderedCols.forEach((col, colIndex) => {
            const td = document.createElement("td");

            // For the Contact column, create a WhatsApp link
            if (colIndex === 4) {
                const whatsappLink = document.createElement("a");
                whatsappLink.href = `https://wa.me/${col.trim()}`; // Use WhatsApp URL with the number
                whatsappLink.target = "_blank"; // Open in a new tab
                whatsappLink.textContent = col.trim();
                whatsappLink.style.textDecoration = "none"; // Optional: Remove underline
                whatsappLink.style.color = "green"; // Optional: Make it green to resemble WhatsApp
                td.appendChild(whatsappLink);
            } else {
                td.textContent = col.trim();
            }

            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });
}




function searchTable() {
    const input = document.getElementById("search-input").value.toLowerCase();
    const rows = document.querySelectorAll("#family-table tbody tr");

    rows.forEach((row) => {
        const cells = Array.from(row.getElementsByTagName("td"));
        const match = cells.some((cell) => cell.textContent.toLowerCase().includes(input));
        row.style.display = match ? "" : "none";
    });
}

function displayContactModal(name, contact) {
    // Create modal container
    const modal = document.createElement("div");
    modal.classList.add("modal");

    // Add modal content
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h3>Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${contact || "N/A"}</p>
        </div>
    `;

    // Add to the body
    document.body.appendChild(modal);

    // Add close functionality
    const closeButton = modal.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
        modal.remove();
    });

    // Close modal when clicking outside the content
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.remove();
        }
    });
}

// Style the modal with CSS (optional)
const modalStyle = document.createElement("style");
modalStyle.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
        width: 300px;
        position: relative;
    }
    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 1.5em;
        cursor: pointer;
        color: #555;
    }
    .close-button:hover {
        color: red;
    }
`;
document.head.appendChild(modalStyle);

