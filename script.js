document.addEventListener('DOMContentLoaded', function() {
    var subscriptions = [];
    var subscriptionChart;
    var categoryColors = {
        "entertainment": "#ff6384",
        "utilities": "#36a2eb",
        "health & fitness": "#ffcd56",
        "education": "#fd6b19",
        "food & dining": "#4bc0c0",
        "shopping & retail": "#9d32a8",
        "travel": "#c9cbcf",
        "finance & investment": "#ff9f40",
        "news & magazines": "#ff6384",
        "productivity & tools": "#36a2eb",
        "charity & donations": "#4bc0c0",
        "pets": "#7e57c2",
        // Add more categories & their colors as needed
        "total": "#ff0000" // Color for the total category
    };
    
    function addSubscription() {
        var subscriptionType = document.getElementById('subscriptionType').value;
        var rate = parseFloat(document.getElementById('rate').value);
        var startDate = document.getElementById('startDate').value;
        var category = document.getElementById('category').value; // Capture category
        
    
        // Validation remains the same
    
        subscriptions.push({
            type: subscriptionType,
            rate: rate,
            startDate: new Date(startDate),
            category: category // Include category in subscription details
        });
        displaySubscriptions();
        updateChartWithData(); // Update chart with new data
    }
    

    // Function to display subscriptions
    function displaySubscriptions() {
        var list = document.getElementById('subscriptions');
        list.innerHTML = '';
        subscriptions.forEach(function(sub, index) {
            var item = document.createElement('li');
            item.classList.add('slide-in');
            item.textContent = `${sub.category.toUpperCase()}: ${sub.type.charAt(0).toUpperCase() + sub.type.slice(1)} subscription - $${sub.rate}, Start Date: ${sub.startDate.toDateString()}`;
            
            var deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.setAttribute('data-index', index);
            deleteBtn.onclick = removeSubscription;
            item.appendChild(deleteBtn);
            
            list.appendChild(item);
        });
    }
    
    // Function to remove a subscription
    function removeSubscription(event) {
        var index = event.target.getAttribute('data-index');
        subscriptions.splice(index, 1);
        displaySubscriptions();
        updateChartWithData(); // Refresh chart data
    }

    // Function to calculate the total yearly cost
    function calculateTotalYearlyCost() {
        var total = subscriptions.reduce(function(acc, sub) {
            if (sub.type === 'monthly') {
                return acc + (sub.rate * 12);
            } else if (sub.type === 'weekly') {
                return acc + (sub.rate * 52.1775);
            } else {
                return acc + sub.rate;
            }
        }, 0);

        document.getElementById('result').innerHTML = `Total Yearly Cost: $${total.toFixed(2)}`;
    }

    // Function to calculate monthly costs considering the start dates
    function calculateMonthlyCosts() {
        const costsByCategory = {};
        const currentYear = new Date().getFullYear();
    
        subscriptions.forEach(sub => {
            const startMonth = sub.startDate.getMonth();
            const startYear = sub.startDate.getFullYear();
            const category = sub.category;
            
            if (!(category in costsByCategory)) {
                costsByCategory[category] = new Array(12).fill(0);
            }
    
            if (startYear === currentYear || sub.type === 'yearly') {
                for (let month = startMonth; month < 12; month++) {
                    if (sub.type === 'monthly') {
                        costsByCategory[category][month] += sub.rate;
                    } else if (sub.type === 'weekly') {
                        costsByCategory[category][month] += sub.rate * 4.34524; // Approx. weeks in a month
                    } else if (sub.type === 'yearly' && month === startMonth) {
                        costsByCategory[category][month] += sub.rate; // Add yearly rate in the starting month only
                    }
                }
            }
        });
    
        return costsByCategory;
    }
    
    
    function initializeChart(costsByCategory) {
        const ctx = document.getElementById('subscriptionChart').getContext('2d');
        const datasets = Object.keys(costsByCategory).map(category => ({
            label: category,
            data: costsByCategory[category],
            fill: false,
            borderColor: categoryColors[category], // Use predefined color
            borderWidth: 1
        }));
    
        subscriptionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: datasets
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
function updateChartWithData() {
    const costsByCategory = calculateMonthlyCosts();
    const totalMonthlyCosts = Object.values(costsByCategory).reduce((acc, categoryCosts) => categoryCosts.map((cost, i) => cost + (acc[i] || 0)), []);

    if (subscriptionChart) {
        subscriptionChart.data.datasets = Object.keys(costsByCategory).map(category => ({
            label: category,
            data: costsByCategory[category],
            fill: false,
            borderColor: categoryColors[category], // Use predefined color
            borderWidth: 1
        }));
        // Ensure the total dataset is updated to use the predefined color for total
        subscriptionChart.data.datasets.push({
            label: 'Total',
            data: totalMonthlyCosts,
            fill: false,
            borderColor: categoryColors['total'], // Color for the total
            borderWidth: 2
        });
        subscriptionChart.update();
    } else {
        initializeChart(costsByCategory); // This should not happen, but just in case
    }
}


    
    // Attach event listeners to buttons
    document.getElementById('addSubscriptionBtn').addEventListener('click', addSubscription);
    document.getElementById('calculateBtn').addEventListener('click', calculateTotalYearlyCost);
});
