// ===== Modal Show/Hide Utilities =====
function showModal(id) {
  document.getElementById(id).classList.add('active');
}
function hideModal(id) {
  document.getElementById(id).classList.remove('active');
}

// ====== State ======
let autoCreatedGoals = [];

// ===== Dependent Modal =====
document.getElementById('addDependentBtn').onclick = function() {
  showModal('dependentModalBg');
};
document.getElementById('cancelDependentBtn').onclick = function() {
  hideModal('dependentModalBg');
  document.getElementById('dependentForm').reset();
};
document.getElementById('dependentForm').onsubmit = function(event) {
  event.preventDefault();
  // Save dependent logic here
  hideModal('dependentModalBg');
  // Optionally update dependents list here
};

// ===== Dependents List Toggle =====
document.getElementById('toggleDependentsBtn').onclick = function() {
  const depList = document.getElementById('dependents-list');
  if (depList.style.display === 'none' || depList.style.display === '') {
    depList.style.display = 'block';
    this.innerText = 'Hide Dependents';
  } else {
    depList.style.display = 'none';
    this.innerText = 'Show Dependents';
  }
};

// ===== Auto Create Goals Modal =====
document.getElementById('autoCreateGoalsBtn').onclick = function() {
  showModal('autoCreateGoalsModalBg');
};
document.getElementById('closeAutoCreateGoalsBtn').onclick = function() {
  hideModal('autoCreateGoalsModalBg');
};
document.getElementById('startAutoCreateGoalsBtn').onclick = function() {
  // Simulate auto-creating goals
  const progressBar = document.getElementById('autoGoalProgressBar');
  const label = document.getElementById('autoGoalProgressLabel');
  const infoText = document.getElementById('autoCreateGoalsInfoText');
  progressBar.style.display = 'block';
  document.getElementById('autoGoalProgress').style.width = '0%';
  label.innerText = '0%';
  infoText.innerText = 'Goals will be created based on dependents added in the system.';
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    document.getElementById('autoGoalProgress').style.width = progress + '%';
    label.innerText = progress + '%';
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        progressBar.style.display = 'none';
        infoText.innerText = 'Goals created successfully!';
        // Simulate created goals (replace with real logic if desired)
        autoCreatedGoals = [
          { name: 'Child Education', amount: 700000, targetDate: '2035-06-01' },
          { name: 'Retirement', amount: 2500000, targetDate: '2045-01-01' },
          { name: 'Vacation', amount: 300000, targetDate: '2027-12-15' }
        ];
        renderAutoCreatedGoals();
        // CLOSE THE MODAL after a short delay
        setTimeout(() => {
          hideModal('autoCreateGoalsModalBg');
          // Optionally, reset infoText for next time
          setTimeout(() => {
            infoText.innerText = 'Goals will be created based on dependents added in the system.';
          }, 400);
        }, 1200);
      }, 500);
    }
  }, 80);
};

function renderAutoCreatedGoals() {
  const tableDiv = document.getElementById('auto-created-goals-table');
  if (!autoCreatedGoals.length) {
    tableDiv.style.display = "none";
    tableDiv.innerHTML = "";
    return;
  }
  let html = `
    <div class="goals-footer">
      <h4>Auto Created Goals</h4>
      <table class="auto-goals-table">
        <thead>
          <tr>
            <th>Goal Name</th>
            <th>Amount</th>
            <th>Target Date</th>
          </tr>
        </thead>
        <tbody>
          ${autoCreatedGoals.map(goal => `
            <tr>
              <td>${goal.name}</td>
              <td>₹${goal.amount.toLocaleString()}</td>
              <td>${goal.targetDate}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  tableDiv.innerHTML = html;
  tableDiv.style.display = "block";
}

// ===== Link Investment Modal =====
document.getElementById('linkInvestmentBtn').onclick = function() {
  showModal('linkInvestmentModalBg');
  // Populate dropdowns with demo data for now
  const goalSel = document.getElementById('link-goal-name');
  const invSel = document.getElementById('link-investment-name');
  // Only populate if empty
  if (goalSel.options.length <= 1) {
    goalSel.innerHTML = `<option value="">Select Goal</option>
      <option value="Retirement">Retirement</option>
      <option value="Child Education">Child Education</option>
      <option value="Vacation">Vacation</option>`;
  }
  if (invSel.options.length <= 1) {
    invSel.innerHTML = `<option value="">Select Investment</option>
      <option value="SIP1" data-type="Mutual Fund">SIP 1</option>
      <option value="FD1" data-type="Fixed Deposit">FD 1</option>
      <option value="StockA" data-type="Stock">Stock A</option>`;
  }
  document.getElementById('link-investment-type-label').innerText = 'N/A';
  document.getElementById('link-investment-name').onchange = updateInvestmentTypeLabel;
  document.getElementById('link-percent').oninput = function() {
    document.getElementById('link-percent-output').value = this.value;
  };
};
document.getElementById('cancelLinkInvestmentBtn').onclick = function() {
  hideModal('linkInvestmentModalBg');
  document.getElementById('linkInvestmentForm').reset();
};
document.getElementById('linkInvestmentForm').onsubmit = function(event) {
  event.preventDefault();
  // Save the link between investment and goal
  hideModal('linkInvestmentModalBg');
  // Optionally update the list of links here
};
function updateInvestmentTypeLabel() {
  const invSel = document.getElementById('link-investment-name');
  const selected = invSel.options[invSel.selectedIndex];
  document.getElementById('link-investment-type-label').innerText = selected.getAttribute('data-type') || 'N/A';
}

// ===== Profile Dropdown =====
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('profileMenuBtn');
  const dropdown = document.getElementById('profileDropdown');
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });
  window.addEventListener('click', function() {
    dropdown.classList.remove('show');
  });
  // Profile actions
  document.getElementById('viewProfileBtn').onclick = function() {
    alert('Profile page is under construction.');
  };
  document.getElementById('logoutBtn').onclick = function() {
    alert('You have been logged out (demo action).');
  };
});