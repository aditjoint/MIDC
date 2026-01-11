document.addEventListener('DOMContentLoaded', function() {
  // Load header
  fetch('partials/header.html')
    .then(res => res.text())
    .then(html => document.getElementById('header-placeholder').innerHTML = html);
  
  // Load footer  
  fetch('partials/footer.html')
    .then(res => res.text())
    .then(html => document.getElementById('footer-placeholder').innerHTML = html);
});
