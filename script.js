// Initialize an array to hold subscription objects
var subscriptions = [];
// Add event listener to the "Add Subscription" button
document.getElementById('addSubscriptionBtn').addEventListener('click', addSubscription);

// Add event listener to the "Calculate Total Yearly Cost" button
document.getElementById('calculateBtn').addEventListener('click', calculateTotalYearlyCost);

// Function to add a subscription
function addSubscription() {
    var subscriptionType = document.getElementById('subscriptionType').value;
    var rate = parseFloat(document.getElementById('rate').value);
    if (isNaN(rate) || rate <= 0) {
        alert('Please enter a valid rate.');
        return;
    }
    // Add the subscription object to the array
    subscriptions.push({ type: subscriptionType, rate: rate });
    displaySubscriptions(); // Update the display
}

// Function to display subscriptions
function displaySubscriptions() {
    var list = document.getElementById('subscriptions');
    list.innerHTML = ''; // Clear the list
    subscriptions.forEach(function(sub, index) {
        var item = document.createElement('li');
        item.classList.add('slide-in');
        item.textContent = `${sub.type.charAt(0).toUpperCase() + sub.type.slice(1)} subscription: $${sub.rate}`;
        
        // Create and add a delete button for each subscription
        var deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('data-index', index); // Set the index as a data attribute
        deleteBtn.onclick = removeSubscription; // Attach the remove function to the click event
        item.appendChild(deleteBtn);
        
        list.appendChild(item);
    });
}

// Function to remove a subscription
function removeSubscription(event) {
    var index = event.target.getAttribute('data-index'); // Retrieve the index from the data attribute
    subscriptions.splice(index, 1); // Remove the subscription at the specified index
    displaySubscriptions(); // Update the display
}

// Function to calculate the total yearly cost
function calculateTotalYearlyCost() {
    var total = subscriptions.reduce(function(acc, sub) {
        if (sub.type === 'monthly') {
            return acc + (sub.rate * 12);
        } else if (sub.type === 'weekly') {
            return acc + (sub.rate * 52.1775); // Use accurate count for weeks in a year
        } else if (sub.type === 'yearly') {
            return acc + sub.rate;
        }
        return acc;
    }, 0);

    document.getElementById('result').innerHTML = `Total Yearly Cost: $${total.toFixed(2)}`;
}

