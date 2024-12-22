document.getElementById('downloadBtn').addEventListener('click', async function() {
    const url = document.getElementById('urlInput').value;

    if (url) {
        try {
            const response = await fetch(`/download?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            if (data.success) {
                const downloadLink = document.getElementById('downloadLink');
                downloadLink.href = data.downloadUrl;
                document.getElementById('result').style.display = 'block';
            } else {
                alert('Failed to fetch the video');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    } else {
        alert('Please enter a URL');
    }
});
