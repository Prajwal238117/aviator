document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculate');
    const totalAmountInput = document.getElementById('total-amount');
    const oddsCountSelect = document.getElementById('odds-count');
    const oddsContainer = document.getElementById('odds-container');
    const resultsContainer = document.getElementById('results-container');
    const toastContainer = document.getElementById('toast-container');

    // Initialize with 3 odds
    updateOddsInputs(3);

    oddsCountSelect.addEventListener('change', (e) => {
        const count = parseInt(e.target.value);
        updateOddsInputs(count);
    });

    calculateButton.addEventListener('click', calculateBets);

    function showToast(message, type = 'error') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="toast-icon fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function updateOddsInputs(count) {
        // Clear existing odds inputs
        oddsContainer.innerHTML = '';
        resultsContainer.innerHTML = '';

        // Create new odds inputs
        for (let i = 1; i <= count; i++) {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            inputGroup.innerHTML = `
                <label for="odd${i}">Odd ${i}:</label>
                <input type="number" id="odd${i}" placeholder="Enter odd" step="0.01" min="1">
            `;
            oddsContainer.appendChild(inputGroup);

            // Create result item
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <span>Bet ${i} Amount:</span>
                <span id="bet${i}-amount">-</span>
            `;
            resultsContainer.appendChild(resultItem);
        }
    }

    function calculateBets() {
        const count = parseInt(oddsCountSelect.value);
        const totalAmount = parseFloat(totalAmountInput.value);
        const odds = [];
        const bets = [];
        const probabilities = [];

        // Get all odds values
        for (let i = 1; i <= count; i++) {
            const odd = parseFloat(document.getElementById(`odd${i}`).value);
            if (isNaN(odd) || odd <= 1) {
                showToast('Please enter valid odds (greater than 1) for all fields');
                return;
            }
            odds.push(odd);
            probabilities.push(1 / odd);
        }

        // Validate total amount
        if (isNaN(totalAmount) || totalAmount <= 0) {
            showToast('Please enter a valid total amount (greater than 0)');
            return;
        }

        // Check if arbitrage is possible
        const totalProbability = probabilities.reduce((sum, prob) => sum + prob, 0);
        
        if (totalProbability >= 1) {
            showToast('No guaranteed profit possible with these odds');
            return;
        }

        // Calculate bet amounts
        for (let i = 0; i < count; i++) {
            const bet = (totalAmount * probabilities[i]) / totalProbability;
            bets.push(bet);
        }

        // Calculate potential returns
        const returns = bets.map((bet, i) => bet * odds[i]);
        const guaranteedProfit = returns[0] - totalAmount;

        // Update results
        for (let i = 0; i < count; i++) {
            document.getElementById(`bet${i + 1}-amount`).textContent = `₹${bets[i].toFixed(2)}`;
        }
        document.getElementById('total-investment').textContent = `₹${totalAmount.toFixed(2)}`;
        document.getElementById('guaranteed-profit').textContent = `₹${guaranteedProfit.toFixed(2)}`;

        // Show success toast
        showToast('Calculation completed successfully!', 'success');
    }
}); 