document.getElementById('summarizeButton').addEventListener('click', async () => {
  const button = document.getElementById('summarizeButton');
  button.textContent = 'Loading...';

  try {
      // Get the current tab URL
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const url = new URL(tab.url);
      const baseURL = url.origin;

      // Check local storage for existing summaries
      const storedSummaries = JSON.parse(localStorage.getItem('summaryData')) || [];
      const existingSummaries = Array.isArray(storedSummaries) ? storedSummaries.filter(item => item.baseURL === baseURL) : [];

      let summariesToSend;

      if (existingSummaries.length > 0) {
          // Use existing summaries
          console.log('Using cached summaries:', existingSummaries);
          summariesToSend = existingSummaries;
      } else {
          // Make the GET request
          const response = await fetch(`https://api.danimahendra0904.workers.dev/cruxx/summarize?url=${tab.url}`, {method : "GET"});
          const data = await response.json();

          // Filter summaries with matching baseURL
          const filteredSummaries = data.data;

          // Store the data in local storage
          localStorage.setItem('summaryData', JSON.stringify(filteredSummaries));

          console.log('Data stored in local storage:', filteredSummaries);
          summariesToSend = filteredSummaries;
      }

      // Send the summaries to the content script
      chrome.tabs.sendMessage(tab.id, { summaries: summariesToSend });

  } catch (error) {
      console.error('Error fetching summary:', error);
  } finally {
      button.textContent = 'Summarize';
  }
});