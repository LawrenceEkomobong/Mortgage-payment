// Radio button highlight
document.querySelectorAll('input[name="mortgageType"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.radio-option').forEach(l => l.classList.remove('selected'));
    radio.closest('.radio-option').classList.add('selected');
  });
});

// Format as currency
function formatCurrency(value) {
  return '£' + value.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Validate a field
function validate(fieldId, value) {
  const field = document.getElementById(fieldId);
  if (!value || isNaN(value) || Number(value) <= 0) {
    field.classList.add('has-error');
    return false;
  }
  field.classList.remove('has-error');
  return true;
}

// Calculate button
document.getElementById('calc-btn').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('input-amount').value);
  const term   = parseFloat(document.getElementById('input-term').value);
  const rate   = parseFloat(document.getElementById('input-rate').value);
  const typeEl = document.querySelector('input[name="mortgageType"]:checked');

  const v1 = validate('field-amount', amount);
  const v2 = validate('field-term', term);
  const v3 = validate('field-rate', rate);

  const typeField = document.getElementById('field-type');
  const typeError = document.getElementById('type-error');
  if (!typeEl) {
    typeField.classList.add('has-error');
    typeError.style.display = 'block';
  } else {
    typeField.classList.remove('has-error');
    typeError.style.display = 'none';
  }

  if (!v1 || !v2 || !v3 || !typeEl) return;

  const monthlyRate = rate / 100 / 12;
  const numPayments = term * 12;
  let monthly, total;

  if (typeEl.value === 'repayment') {
    monthly = amount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))
                     / (Math.pow(1 + monthlyRate, numPayments) - 1);
    total = monthly * numPayments;
  } else {
    monthly = amount * monthlyRate;
    total = (monthly * numPayments) + amount;
  }

  document.getElementById('monthly-result').textContent = formatCurrency(monthly);
  document.getElementById('total-result').textContent   = formatCurrency(total);
  document.getElementById('empty-state').style.display     = 'none';
  document.getElementById('result-subtitle').style.display = 'block';
  document.getElementById('result-card').classList.add('visible');
});

// Clear all
document.getElementById('reset').addEventListener('click', () => {
  document.getElementById('input-amount').value = '';
  document.getElementById('input-term').value   = '';
  document.getElementById('input-rate').value   = '';
  document.querySelectorAll('input[name="mortgageType"]').forEach(r => r.checked = false);
  document.querySelectorAll('.radio-option').forEach(l => l.classList.remove('selected'));
  document.querySelectorAll('.field').forEach(f => f.classList.remove('has-error'));
  document.getElementById('type-error').style.display = 'none';
  document.getElementById('empty-state').style.display     = 'flex';
  document.getElementById('result-subtitle').style.display = 'none';
  document.getElementById('result-card').classList.remove('visible');
});

// Clear error on typing
['input-amount', 'input-term', 'input-rate'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    const fieldKey = id.replace('input-', 'field-');
    document.getElementById(fieldKey).classList.remove('has-error');
  });
});