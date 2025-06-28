// main.js for Plan Your Wealth (multi-page, no inline JS required)
// Handles: profile menu, modal popups, goals/dependents/investments logic, auto-create goals, etc.

document.addEventListener("DOMContentLoaded", function () {
  // ------------------ Profile Menu Logic ------------------
  const profileMenuBtn = document.getElementById("profileMenuBtn");
  const profileMenuContainer = document.getElementById("profileMenuContainer");
  const viewProfileBtn = document.getElementById("viewProfileBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (profileMenuBtn && profileMenuContainer) {
    document.addEventListener("click", function (e) {
      if (profileMenuContainer.contains(e.target)) {
        profileMenuContainer.classList.toggle("active");
      } else {
        profileMenuContainer.classList.remove("active");
      }
    });
  }
  if (viewProfileBtn) {
    viewProfileBtn.addEventListener("click", function () {
      alert("Profile Details:\nName: MO-GulshanK-23504\nEmail: gulshank@example.com\nRole: User\nMember since: Jan 2024");
    });
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      alert("Logout successful.");
    });
  }

  // ------------------ Tabs (Income/Budget/Expense) ------------------
  const tabs = document.querySelectorAll(".tab");
  const forms = document.querySelectorAll(".form-container");
  if (tabs && forms) {
    tabs.forEach(tab => {
      tab.addEventListener("click", function () {
        const tabId = tab.textContent.toLowerCase().replace(/ /g, '-');
        tabs.forEach(t => t.classList.remove("active"));
        forms.forEach(f => f.classList.remove("active"));
        tab.classList.add("active");
        const form = document.getElementById(tabId);
        if (form) form.classList.add("active");
      });
    });
  }

  // ------------------ Calculator Tabs (FV/EMI/Corpus) ------------------
  const calcTabs = document.querySelectorAll(".calc-tab");
  if (calcTabs.length) {
    calcTabs.forEach(tab => {
      tab.addEventListener("click", function () {
        const tabName = tab.id.replace("tab-", "");
        calcTabs.forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".calc-form-container").forEach(c => c.style.display = "none");
        tab.classList.add("active");
        const panel = document.getElementById("calc-" + tabName);
        if (panel) panel.style.display = "";
        const resultsPanel = document.getElementById('calc-results-panel');
        if (resultsPanel) resultsPanel.classList.remove('active');
      });
    });
  }

  // ------------------ Calculator Logic ------------------
  let calcPieChart = null;
  function showCalcResultsPanel(labels, values, colors, detailsHTML) {
    const panel = document.getElementById('calc-results-panel');
    if (panel) panel.classList.add('active');
    const pieCanvas = document.getElementById('calculationPieChart');
    if (pieCanvas) {
      if (calcPieChart) { calcPieChart.destroy(); }
      calcPieChart = new Chart(pieCanvas, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: colors,
            borderColor: '#222',
            borderWidth: 2
          }]
        },
        options: {
          plugins: {
            legend: {
              display: true,
              labels: { color: '#fff' }
            }
          }
        }
      });
    }
    const valuesList = document.getElementById('calc-values-list');
    if (valuesList) valuesList.innerHTML = detailsHTML;
  }

  const fvForm = document.querySelector("#calc-fv form");
  if (fvForm) {
    fvForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const pv = parseFloat(document.getElementById('fv-pv').value);
      const rate = parseFloat(document.getElementById('fv-rate').value) / 100;
      const years = parseInt(document.getElementById('fv-years').value, 10);
      const freq = parseInt(document.getElementById('fv-type').value, 10);
      const n = freq * years;
      const fv = pv * Math.pow(1 + rate / freq, n);

      document.getElementById('fv-result').innerHTML = `Future Value after <b>${years} years</b>: <span style="color:var(--accent)">₹ ${fv.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>`;
      document.getElementById('fv-result').style.display = '';

      const interestEarned = fv - pv;
      showCalcResultsPanel(
        ['Principal', 'Interest Earned'],
        [pv, interestEarned],
        ['#00ffb8', '#ff8c00'],
        `<b>Future Value:</b> ₹ ${fv.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}<br>
         <b>Principal:</b> ₹ ${pv.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}<br>
         <b>Interest Earned:</b> ₹ ${interestEarned.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}<br>
         <b>Years:</b> ${years}<br>
         <b>Rate (annual):</b> ${(rate*100).toFixed(2)}%<br>
         <b>Compounding:</b> ${freq}x/year`
      );
    });
  }
  const emiForm = document.querySelector("#calc-emi form");
  if (emiForm) {
    emiForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const P = parseFloat(document.getElementById('emi-p').value);
      const annualRate = parseFloat(document.getElementById('emi-rate').value);
      const N = parseInt(document.getElementById('emi-n').value, 10);
      const r = annualRate / 12 / 100;
      const emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
      const total = emi * N;
      const interest = total - P;
      document.getElementById('emi-result').innerHTML =
        `Monthly EMI: <span style="color:var(--accent)">₹ ${emi.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span><br>` +
        `Total Payment: ₹ ${total.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}<br>` +
        `Total Interest: ₹ ${interest.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
      document.getElementById('emi-result').style.display = '';

      showCalcResultsPanel(
        ['Principal', 'Interest'],
        [P, interest],
        ['#00ffb8', '#ff8c00'],
        `<b>Total Paid:</b> ₹ ${total.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}<br>
         <b>Principal:</b> ₹ ${P.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}<br>
         <b>Interest:</b> ₹ ${interest.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}<br>
         <b>EMI:</b> ₹ ${emi.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}<br>
         <b>Tenure:</b> ${N} months<br>
         <b>Rate (annual):</b> ${annualRate}%`
      );
    });
  }
  const corpusForm = document.querySelector("#calc-corpus form");
  if (corpusForm) {
    corpusForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const sip = parseFloat(document.getElementById('corpus-sip').value);
      const annualRate = parseFloat(document.getElementById('corpus-rate').value);
      const years = parseInt(document.getElementById('corpus-years').value, 10);
      const n = years * 12;
      const r = annualRate / 12 / 100;
      const corpus = sip * (Math.pow(1 + r, n) - 1) * (1 + r) / r;
      const totalInvested = sip * n;
      const returns = corpus - totalInvested;
      document.getElementById('corpus-result').innerHTML =
        `Corpus after <b>${years} years</b>: <span style="color:var(--accent)">₹ ${corpus.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>`;
      document.getElementById('corpus-result').style.display = '';

      showCalcResultsPanel(
        ['Total Invested', 'Returns'],
        [totalInvested, returns],
        ['#00ffb8', '#ff8c00'],
        `<b>Corpus:</b> ₹ ${corpus.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}<br>
         <b>Total Invested:</b> ₹ ${totalInvested.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}<br>
         <b>Returns:</b> ₹ ${returns.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}<br>
         <b>Monthly SIP:</b> ₹ ${sip.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}<br>
         <b>Years:</b> ${years}<br>
         <b>Rate (annual):</b> ${annualRate}%`
      );
    });
  }

  // ------------------ Dashboard Networth Chart ------------------
  if (document.getElementById('networthChart')) {
    new Chart(document.getElementById('networthChart'), {
      type: 'doughnut',
      data: {
        labels: ['Assets', 'Liabilities'],
        datasets: [
          {
            data: [1900000, 550000],
            backgroundColor: ['#00ffb8', '#ff8c00'],
            borderColor: ['#111', '#111'],
            borderWidth: 2
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: true,
            labels: { color: '#fff' }
          }
        }
      }
    });
  }

  // ------------------ Goals, Dependents, Investments, Auto-Create Goals ------------------
  // Data store
  let investments = [];
  let goals = [];
  let dependents = [
    { name: "Self", dob: "1978-12-05", gender: "male", relation: "self" },
    { name: "Spouse", dob: "1984-04-20", gender: "female", relation: "spouse" },
    { name: "Kid1", dob: "2008-08-13", gender: "female", relation: "daughter" },
    { name: "Kid2", dob: "2013-03-01", gender: "female", relation: "daughter" }
  ];

  // ------ GOALS PAGE ONLY ------
  // Add Goal
  const goalsForm = document.getElementById("goalsForm");
  if (goalsForm) {
    goalsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById('goal-name').value.trim();
      const amount = parseFloat(document.getElementById('goal-amount').value);
      const targetDate = document.getElementById('goal-target-date').value;
      const notes = document.getElementById('goal-notes').value.trim();
      if (!name || !amount || !targetDate) return;
      goals.push({ name, amount, targetDate, notes });
      alert("Goal added!");
      goalsForm.reset();
      renderGoalsTable();
    });
    function renderGoalsTable() {
      const area = document.getElementById('auto-created-goals-table');
      if (!area) return;
      if (!goals.length) {
        area.style.display = "none";
        return;
      }
      area.style.display = "";
      let html = `<table>
        <tr><th>Goal Name</th><th>Amount</th><th>Target Date</th><th>Notes</th></tr>`;
      goals.forEach(g => {
        html += `<tr><td>${g.name}</td><td>₹ ${g.amount.toLocaleString()}</td><td>${g.targetDate}</td><td>${g.notes}</td></tr>`;
      });
      html += `</table>`;
      area.innerHTML = html;
    }
  }
  // Add Dependent Modal
  const addDependentBtn = document.getElementById("addDependentBtn");
  const dependentModalBg = document.getElementById("dependentModalBg");
  const cancelDependentBtn = document.getElementById("cancelDependentBtn");
  const dependentForm = document.getElementById("dependentForm");
  if (addDependentBtn && dependentModalBg) {
    addDependentBtn.addEventListener("click", function () {
      dependentModalBg.classList.add("active");
    });
  }
  if (cancelDependentBtn && dependentModalBg) {
    cancelDependentBtn.addEventListener("click", function () {
      dependentModalBg.classList.remove("active");
    });
  }
  if (dependentForm && dependentModalBg) {
    dependentForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById('dep-name').value.trim();
      const dob = document.getElementById('dep-dob').value;
      const gender = document.getElementById('dep-gender').value;
      const relation = document.getElementById('dep-relation').value;
      if (!name || !dob || !gender || !relation) return;
      dependents.push({ name, dob, gender, relation });
      alert("Dependent added!");
      dependentForm.reset();
      dependentModalBg.classList.remove("active");
    });
  }
  // Show Dependents
  const toggleDependentsBtn = document.getElementById("toggleDependentsBtn");
  const dependentsList = document.getElementById("dependents-list");
  if (toggleDependentsBtn && dependentsList) {
    toggleDependentsBtn.addEventListener("click", function () {
      if (dependentsList.style.display === "none" || !dependentsList.style.display) {
        dependentsList.style.display = "";
        let html = '<table class="dependents-table"><tr><th>Name</th><th>DOB</th><th>Gender</th><th>Relation</th></tr>';
        dependents.forEach(dep => {
          html += `<tr><td>${dep.name}</td><td>${dep.dob}</td><td>${dep.gender}</td><td>${dep.relation}</td></tr>`;
        });
        html += '</table>';
        dependentsList.innerHTML = html;
        toggleDependentsBtn.textContent = "Hide Dependents";
      } else {
        dependentsList.style.display = "none";
        toggleDependentsBtn.textContent = "Show Dependents";
      }
    });
  }
  // Auto Create Goals Modal
  const autoCreateGoalsBtn = document.getElementById("autoCreateGoalsBtn");
  const autoCreateGoalsModalBg = document.getElementById("autoCreateGoalsModalBg");
  const autoGoalProgressBar = document.getElementById("autoGoalProgressBar");
  const autoGoalProgress = document.getElementById("autoGoalProgress");
  const autoGoalProgressLabel = document.getElementById("autoGoalProgressLabel");
  const autoGoalsProceedBtn = document.getElementById("autoGoalsProceedBtn");
  const autoGoalsCancelBtn = document.getElementById("autoGoalsCancelBtn");
  const autoCreatedGoalsTable = document.getElementById('auto-created-goals-table');
  if (autoCreateGoalsBtn && autoCreateGoalsModalBg) {
    autoCreateGoalsBtn.addEventListener("click", function () {
      autoCreateGoalsModalBg.classList.add('active');
      if (autoGoalProgressBar) autoGoalProgressBar.style.display = "none";
      if (autoCreatedGoalsTable) autoCreatedGoalsTable.style.display = "none";
    });
  }
  if (autoGoalsCancelBtn && autoCreateGoalsModalBg) {
    autoGoalsCancelBtn.addEventListener("click", function () {
      autoCreateGoalsModalBg.classList.remove("active");
    });
  }
  if (autoGoalsProceedBtn && autoGoalProgressBar && autoGoalProgress && autoGoalProgressLabel) {
    autoGoalsProceedBtn.addEventListener("click", function () {
      if (!dependents || dependents.length === 0) {
        alert("Please add dependents first!");
        return;
      }
      autoGoalProgressBar.style.display = "";
      autoGoalProgress.style.width = "0%";
      autoGoalProgressLabel.textContent = "0%";
      let percent = 0;
      const interval = setInterval(() => {
        percent += 10;
        autoGoalProgress.style.width = percent + "%";
        autoGoalProgressLabel.textContent = percent + "%";
        if (percent >= 100) {
          clearInterval(interval);
          finishAutoCreateGoals();
        }
      }, 100);
    });
    function finishAutoCreateGoals() {
      // Example: create goals for each dependent
      goals = dependents.map(dep => ({
        name: dep.name + "'s Education Fund",
        amount: 500000,
        targetDate: "2030-12-31",
        notes: "Auto-created goal for " + dep.name
      }));
      // Show table
      if (autoCreatedGoalsTable) {
        autoCreatedGoalsTable.style.display = "";
        let html = `<table>
          <tr><th>Goal Name</th><th>Amount</th><th>Target Date</th><th>Notes</th></tr>`;
        goals.forEach(g => {
          html += `<tr><td>${g.name}</td><td>₹ ${g.amount.toLocaleString()}</td><td>${g.targetDate}</td><td>${g.notes}</td></tr>`;
        });
        html += `</table>`;
        autoCreatedGoalsTable.innerHTML = html;
      }
      autoGoalProgressBar.style.display = "none";
    }
  }

  // Link Investment Modal (Stub, demo only)
  const linkInvestmentBtn = document.getElementById("linkInvestmentBtn");
  const linkInvestmentModalBg = document.getElementById("linkInvestmentModalBg");
  const cancelLinkInvestmentBtn = document.getElementById("cancelLinkInvestmentBtn");
  if (linkInvestmentBtn && linkInvestmentModalBg) {
    linkInvestmentBtn.addEventListener("click", function () {
      linkInvestmentModalBg.classList.add("active");
    });
  }
  if (cancelLinkInvestmentBtn && linkInvestmentModalBg) {
    cancelLinkInvestmentBtn.addEventListener("click", function () {
      linkInvestmentModalBg.classList.remove("active");
    });
  }
  // Investment form (for Investments page)
  const investmentForm = document.getElementById('investmentForm');
  if (investmentForm) {
    investmentForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const name = document.getElementById('investment-name').value.trim();
      const type = document.getElementById('investment-type').value;
      const value = document.getElementById('investment-value').value;
      const monthly = document.getElementById('investment-monthly').value;
      const notes = document.getElementById('investment-notes').value;
      if (!name || !type || !value || !monthly) return;
      const exists = investments.some(i => i.name === name);
      if (exists) {
        alert('Investment name already exists.');
        return;
      }
      investments.push({ name, type, value, monthly, notes });
      alert("Investment added!");
      investmentForm.reset();
    });
  }

  // Link Investment percentage slider (demo)
  const linkPercentSlider = document.getElementById('link-percent');
  const linkPercentOutput = document.getElementById('link-percent-output');
  if (linkPercentSlider && linkPercentOutput) {
    linkPercentSlider.addEventListener("input", function () {
      linkPercentOutput.value = linkPercentSlider.value;
    });
  }
});