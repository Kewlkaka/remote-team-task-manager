const axios = require('axios');
console.log("Active");


//Fetching data from endpoints:
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const pendingTasksResponse = await axios.get('/tasks/dashboard/pending-tasks');
        const completedTasksResponse = await axios.get('/tasks/dashboard/completed-tasks');

        //Extracting data
        const pendingTasksData = pendingTasksResponse.data.pendingTasks;
        const completedTasksData = completedTasksResponse.data.completedTasks;

        //Update Content
        const tasksPendingStats = document.querySelector('.tasksPendingStats');
        tasksPendingStats.textContent = pendingTasksData.length;

        const tasksCompletedStats = document.querySelector('.tasksCompletedStats');
        tasksCompletedStats.textContent = completedTasksData.length;
    } catch (error) {
        console.log('Error fetching data, dashboard.js:', error);
    }
});



// Define the data for the line chart
const dates = ["2023-07-01", "2023-07-02", "2023-07-03"];
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
                pointRadius: 5, // Size of data points
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
                    },
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
                y: {
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
                },
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
        }
    });
});

const sidebar = document.querySelector('.sidebar');
const menuToggle = document.querySelector('.menu-toggle');
const welcomeHeading = document.querySelector('.welcome');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    welcomeHeading.classList.toggle('sidebar-open');
});

// Close the sidebar when clicking outside
document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        if (!sidebar.classList.contains('collapsed')) {
            sidebar.classList.add('collapsed');
            welcomeHeading.classList.remove('sidebar-open');
        }
    }
});



