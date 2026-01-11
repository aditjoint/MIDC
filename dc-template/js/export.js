// Cross-template data sync
function syncSiteData() {
  const inputs = document.querySelectorAll('.status-input');
  const siteData = {};
  inputs.forEach(input => {
    if (input.value) siteData[input.name || input.placeholder] = input.value;
  });
  localStorage.setItem('dc-site-data', JSON.stringify(siteData));
}

// Auto-save all templates
document.addEventListener('input', function(e) {
  if (e.target.classList.contains('status-input')) {
    syncSiteData();
  }
});

// Export entire site evaluation
function exportSiteCSV() {
  const data = JSON.parse(localStorage.getItem('dc-site-data') || '{}');
  const csv = Object.entries(data).map(([key, value]) => `${key},${value}`).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent('Parameter,Value\n' + csv);
  a.download = 'ADAM-DC-Site-Evaluation-' + Date.now() + '.csv';
  a.click();
}
