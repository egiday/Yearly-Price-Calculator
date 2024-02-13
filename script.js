document.addEventListener('DOMContentLoaded', function() {
    var subscriptions = [];
    var subscriptionChart;

    // Function to add a subscription
    function addSubscription() {
        var subscriptionType = document.getElementById('subscriptionType').value;
        var rate = parseFloat(document.getElementById('rate').value);
        var startDate = document.getElementById('startDate').value;

        if (isNaN(rate) || rate <= 0 || !startDate) {
            alert('Please enter a valid rate and start date.');
            return;
        }

        subscriptions.push({ type: subscriptionType, rate: rate, startDate: new Date(startDate) });
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
            item.textContent = `${sub.type.charAt(0).toUpperCase() + sub.type.slice(1)} subscription: $${sub.rate}, Start Date: ${sub.startDate.toDateString()}`;
            
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
        const monthlyCosts = new Array(12).fill(0); 
        const currentYear = new Date().getFullYear();

        subscriptions.forEach(sub => {
            const startMonth = sub.startDate.getMonth();
            const startYear = sub.startDate.getFullYear();

            if (startYear === currentYear || sub.type === 'yearly') {
                for (let month = startMonth; month < 12; month++) {
                    if (sub.type === 'monthly') {
                        monthlyCosts[month] += sub.rate;
                    } else if (sub.type === 'weekly') {
                        monthlyCosts[month] += sub.rate * 4;
                    } else if (sub.type === 'yearly' && month === startMonth) {
                        monthlyCosts[month] += sub.rate; // Add yearly rate in the starting month only
                    }
                }
            }
        });

        return monthlyCosts;
    }
    
    function initializeChart(monthlyCostsData) {
        const ctx = document.getElementById('subscriptionChart').getContext('2d');
        subscriptionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [{
                    label: 'Monthly Costs',
                    data: monthlyCostsData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
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
    // Function to update the chart with new data
    function updateChartWithData() {
        const monthlyCostsData = calculateMonthlyCosts();
        if (subscriptionChart) {
            subscriptionChart.data.datasets.forEach((dataset) => {
                dataset.data = monthlyCostsData;
            });
            subscriptionChart.update();
        } else {
            initializeChart(monthlyCostsData); // A separate function to initialize the chart
        }
    }
    

    
    // Attach event listeners to buttons
    document.getElementById('addSubscriptionBtn').addEventListener('click', addSubscription);
    document.getElementById('calculateBtn').addEventListener('click', calculateTotalYearlyCost);
});
