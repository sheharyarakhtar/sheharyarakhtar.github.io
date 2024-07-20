function loadCode(filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('codeBlock').textContent = data;
            Prism.highlightAll();
        })
        .catch(error => console.error('Error fetching the Python file:', error));
}

// Automatically load a default file on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCode('assets/sample.py');
});
