const axiosSessionConfig = {
    withCredentials: true // Include session cookies with all Axios requests
};

const axiosFormDataConfig = {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
};



/* Charts */

// Define the data for the line chart
const dates = ["2023-07-01", "2023-07-02", "2023-07-03"]; //reyans
const completionRates = [30, 60, 80];

document.addEventListener("DOMContentLoaded", function () {
    // Get the canvas element
    const ctx = document.getElementById("taskCompletionChart").getContext("2d");

    // Initialize the chart
    const taskCompletionChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                data: completionRates,
                borderColor: "#FF5733", // Custom line color
                pointBackgroundColor: "#FF5733", // Custom point color
                backgroundColor: "rgba(255, 87, 51, 0.1)", // Custom background color
                borderWidth: 2,
                fill: true, // Filled area under the line
                pointRadius: 5, // Size of data points //reyans
                pointHoverRadius: 7, // Size of data points on hover
                pointStyle: "circle", // Shape of data points (options: 'circle', 'triangle', 'rect', etc.)
                tension: 0.2, // Adjust tension for wavy effect (0-1)
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        display: false, // Disable x-axis grid lines
                    }, //reyans
                    type: "time",
                    time: {
                        unit: "day",
                        parser: "YYYY-MM-DD",
                        tooltipFormat: "ll",
                    },
                    ticks: {
                        font: {
                            size: 12, // Custom font size for x-axis labels
                        },
                    },
                },
                y: { //reyans
                    grid: {
                        color: "#E0E0E0", // Custom color for y-axis grid lines
                    },
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        font: {
                            size: 12, // Custom font size for y-axis labels
                        },
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        var label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + "%"; // Format y-axis tooltip
                        }
                        return label;
                    },
                }, //reyans
            },
            legend: {
                display: true,
                labels: {
                    font: {
                        size: 14 // Customize the font size of legend labels
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false, // Hide the chart title
                },
            },
            maintainAspectRatio: true, // Disable aspect ratio maintenance
        } //reyans
    });
});



//Sidebar
let menuicn = document.getElementById("menuicn");
let nav = document.querySelector(".navcontainer");
let navIcon = document.querySelectorAll(".iconOpen");

menuicn.addEventListener("click", () => {
    nav.classList.toggle("navclose");
    for (let i = 0; i < navIcon.length; i++) {
        navIcon[i].classList.toggle("iconClose");
    }
}); //reyans

//
let sidebarTab = document.querySelectorAll(".nav-option"); //reyans
const mainSection = document.querySelector(".main");
let selectedTabIndex = 0;

function handleTabClick(tabIndex) {

    sidebarTab.forEach((tab, index) => {
        if (index === tabIndex) {
            tab.classList.add("selected");
        } else {
            tab.classList.remove("selected");
        } //reyans
    });

    mainSection.classList.toggle("selected-section", tabIndex === 0);

    selectedTabIndex = tabIndex;
}

sidebarTab.forEach((sidebarTab, index) => {
    sidebarTab.addEventListener("click", () => {
        handleTabClick(index);
    }); //reyans
});

// By default, select the Dashboard tab and show its section
handleTabClick(selectedTabIndex);



//Modal Screen
const plusIcon = document.getElementById("plus");
const modal = document.querySelector(".modal"); //reyans
const closeModal = document.querySelector(".close");

// Function to open the Modal Screen
plusIcon.addEventListener("click", () => {
    modal.style.display = "flex";
});

// Function to close the modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Closing the modal when clicking outside the modal content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

//Fetch Tasks Pending.
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const tasksPending = await axios.get('/tasks/dashboard/pending-tasks', axiosSessionConfig);
        updateTasksPendingStatsUI(tasksPending.data);

        console.log("TaskPendingStat Updated");

        //Establishing Websocket Connection
        console.log('Initializing WebSocket connection...');
        const socket = io('http://localhost:3000');

        socket.on('connect', () => {
            console.log('WebSocket connection established');
        }); //reyans

        socket.on('disconnect', () => {
            console.log('WebSocket connection disconnected');
        });

        socket.on('task-pending-update', (tasksPendingStat) => {
            console.log('Updating tasks pending:', tasksPendingStat);
            // Update tasks pending.
            updateTasksPendingStatsUI(tasksPendingStat);

        }); //reyans

        socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });


    } catch (error) {
        console.log('Error Fetching Tasks Pending dashboard.js: ', error);
    }
})



//Fetch Announcements.
const announcementForm = document.getElementById("announcementForm");
const announcementsContainer = document.getElementById("announcement-content");

document.addEventListener('DOMContentLoaded', async function () { //reyans
    try {
        // Fetch announcements and update the UI
        const userAnnouncements = await axios.get('/announcements/dashboard/user-announcements', axiosSessionConfig);
        updateAnnouncementsUI(userAnnouncements.data);

        // Establish WebSocket connection
        console.log('Initializing WebSocket connection...');
        const socket = io('http://localhost:3000');

        socket.on('connect', () => {
            console.log('WebSocket connection established');
        }); //reyans

        socket.on('disconnect', () => {
            console.log('WebSocket connection disconnected');
        });

        // Receive new announcements in real-time
        socket.on('new announcement', (newAnnouncement) => {
            console.log('Received new announcement:', newAnnouncement);
            // Update UI with the new announcement
            updateAnnouncementsUI([newAnnouncement]);
        });

        socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    } catch (error) {
        console.log('Error fetching data, dashboard.js:', error);
    }
});

//Create Announcements
announcementForm.addEventListener("submit", async (e) => {
    e.preventDefault(); //reyans

    const formData = new FormData(announcementForm);

    try {
        console.log('Sending announcement form data...');

        // Merge axiosSessionConfig and axiosFormDataConfig
        const combinedConfig = {
            ...axiosSessionConfig,
            ...axiosFormDataConfig
        };

        const response = await axios.post("/announcements/dashboard/createAnnouncements", formData, combinedConfig);
        //reyans
        if (response.status === 201) {
            console.log('Announcement created successfully:', response.data);
            closeModal.click(); // Close the modal

            // Create a new announcement card and append it to the container
            const newAnnouncement = {
                title: formData.get("announcementTitle"),
                content: formData.get("announcementText"),
                created_at: new Date().toLocaleString() // Replace with actual timestamp
            };

            // Create HTML structure for the new announcement card
            const announcementCard = document.createElement("div");
            announcementCard.className = "announcement-card";
            announcementCard.dataset.announcementId = response.data.id;
            announcementCard.innerHTML = `
            <div class="cardHeading">
                <h2 class="announcement-title">${newAnnouncement.title}</h2>
                <i class="fa-solid fa-trash"></i>
            </div>
            <p class="announcement-text">${newAnnouncement.content}</p>
            <span class="announcement-date">${newAnnouncement.created_at}</span> 
            `;

            // Insert the new announcement card at the beginning of the container
            announcementsContainer.appendChild(announcementCard);

        } else {
            // Handle error
            console.error("Error creating announcement");
        }
    } catch (error) {
        // Handle error
        console.error("An error occurred dashboard.js:", error);
    }
});

// Delete Announcement
announcementsContainer.addEventListener("click", async (e) => { //reyans
    if (e.target.classList.contains("fa-trash")) {
        const announcementCard = e.target.closest(".announcement-card");
        const announcementId = announcementCard.dataset.announcementId;
        console.log("Sending Id as: ", announcementId);

        try {
            const response = await axios.delete(`/announcements/dashboard/delete-announcements/${announcementId}`, axiosSessionConfig);

            if (response.status === 200) {
                // Remove the card from the HTML
                announcementCard.remove();
            } else {
                console.error("Error deleting announcement");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
});

//Utility Functions

//Updating UI for Announcements.
function updateAnnouncementsUI(announcements) {
    const announcementsContainer = document.getElementById("announcement-content");

    if (!Array.isArray(announcements) || announcements.length === 0) {
        // Handle cases when announcements is not an array or is empty
        // For example, you can display a message saying "No announcements found."
        return;
    }

    announcements.forEach((announcement) => {
        const announcementCard = document.createElement("div");
        announcementCard.className = "announcement-card";
        announcementCard.innerHTML = `
            <div class="cardHeading">
                <h2 class="announcement-title">${announcement.title}</h2>
                <i class="fa-solid fa-trash"></i>
            </div>
            <p class="announcement-text">${announcement.content}</p>
            <span class="announcement-date">${announcement.created_at}</span> 
        `;

        announcementsContainer.appendChild(announcementCard);
    }); //reyans
}

//Updating UI for Tasks Pending Stat --Card
function updateTasksPendingStatsUI(newTasksPendingStat) {
    const tasksPendingStatElement = document.querySelector('.tasksPendingStat');

    if (tasksPendingStatElement) {
        tasksPendingStatElement.textContent = newTasksPendingStat.toString();
    } else {
        console.error("tasksPendingStat element not found in the DOM.");
    }
}
