let SUMMARY = `This HTML code represents a blog post titled "Are Your React Components Really Reusable?" by Mahendra Dani. The post discusses the importance of writing reusable React components for improving code maintainability and efficiency. It highlights common mistakes made when creating components and proposes a better approach that involves breaking down components into smaller, self-contained units with predefined variants (css classes) to ensure flexibility and customization. The post also provides useful references for further learning on this topic`;

let currentPopup = null;

document.addEventListener('mouseover', function(event) {
    const hoveredElement = event.target;
    console.log('Hovered element:', hoveredElement);

    if (hoveredElement.tagName.toLowerCase() === 'a') {
        // Remove the current popup if it exists
        if (currentPopup) {
            currentPopup.remove();
            currentPopup = null;
        }

        const summaryCard = document.createElement('div');
        summaryCard.style.position = 'absolute';
        summaryCard.style.backgroundColor = 'white';
        summaryCard.style.color = 'black';
        summaryCard.style.padding = '10px';
        summaryCard.style.border = '1px solid black';
        summaryCard.style.zIndex = '1000';
        summaryCard.style.maxWidth = '300px';
        summaryCard.style.maxHeight = '400px';
        summaryCard.style.overflow = 'auto';
        summaryCard.style.whiteSpace = 'pre-wrap';
        summaryCard.style.opacity = '0';
        summaryCard.style.transition = 'opacity 0.3s ease-in-out';

        // Position the summaryCard near the hovered element
        const rect = hoveredElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        if (rect.bottom + summaryCard.offsetHeight > viewportHeight) {
            // Position above the hovered element
            summaryCard.style.top = `${rect.top + window.scrollY - summaryCard.offsetHeight}px`;
        } else {
            // Position below the hovered element
            summaryCard.style.top = `${rect.bottom + window.scrollY}px`;
        }

        if (rect.left + summaryCard.offsetWidth > viewportWidth) {
            // Adjust to fit within the viewport width
            summaryCard.style.left = `${viewportWidth - summaryCard.offsetWidth}px`;
        } else {
            summaryCard.style.left = `${rect.left + window.scrollX}px`;
        }

        // Create the summarize button
        const summarizeButton = document.createElement('button');
        summarizeButton.textContent = 'Summarize';
        summaryCard.appendChild(summarizeButton);

        // Append the summaryCard to the body
        document.body.appendChild(summaryCard);
        currentPopup = summaryCard;

        // Event listeners for mouse enter and leave
        hoveredElement.addEventListener('mouseenter', () => {
            summaryCard.style.opacity = '1';
        });

        hoveredElement.addEventListener('mouseleave', (event) => {
            if (!summaryCard.contains(event.relatedTarget)) {
                summaryCard.style.opacity = '0';
            }
        });

        summaryCard.addEventListener('mouseenter', () => {
            summaryCard.style.opacity = '1';
        });

        summaryCard.addEventListener('mouseleave', (event) => {
            if (!hoveredElement.contains(event.relatedTarget)) {
                summaryCard.style.opacity = '0';
            }
        });

        summarizeButton.addEventListener('click', () => {
            summarizeButton.textContent = 'Summarizing...';
            const url = hoveredElement.href;
            console.log(url);
            fetch(`https://api.danimahendra0904.workers.dev/cruxx/summarize?url=${encodeURIComponent(url)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        summarizeButton.textContent = 'Error generating summary';
                    } else {
                        const summary = data.data.summary;
                        console.log(summary);
                        summaryCard.textContent = summary;
                    }
                })
                .catch(error => {
                    summarizeButton.textContent = 'Error generating summary';
                    console.error('Error fetching summary:', error);
                });
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.summaries) {
    console.log('Received summaries:', message.summaries);
    SUMMARY = message.summaries.summary;
    // Handle the summaries data as needed
  }
});