// Define a function to load JSON data
function loadJSON(callback) {
  const xhr = new XMLHttpRequest();
  xhr.overrideMimeType('application/json');
  xhr.open('GET', 'jobs.json', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const jsonData = JSON.parse(xhr.responseText);
          callback(jsonData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      } else {
        console.error('Error loading JSON:', xhr.status, xhr.statusText);
      }
    }
  };
  xhr.send(null);
}

// Define a function to filter and display job listings
function filterAndDisplayJobs() {
  const keywords = document.getElementById('keywords').value.toLowerCase();
  const location = document.getElementById('location').value.toLowerCase();
  const category = document.getElementById('category').value.toLowerCase();

  const jobListingsSection = document.getElementById('job-listings');
  jobListingsSection.innerHTML = ''; // Clear existing listings

  loadJSON(function (data) {
    if (!data || !data.jobs) {
      console.error('Invalid JSON data format:', data);
      return;
    }

    const jobs = data.jobs;
    for (const job of jobs) {
      if (!job) {
        console.warn('Skipping empty job entry:', job);
        continue;
      }

      const jobTitle = job.title ? job.title.toLowerCase() : '';
      const jobLocation = job.location ? job.location.toLowerCase() : '';
      const jobCategory = job.category ? job.category.toLowerCase() : '';

      // Check if the job matches the filter criteria
      const matchesKeywords = keywords === '' || jobTitle.includes(keywords) || jobCategory.includes(keywords);
      const matchesLocation = location === '' || jobLocation.includes(location);
      const matchesCategory = category === '' || jobCategory === category;

      if (matchesKeywords && matchesLocation && matchesCategory) {
        // Create HTML for the filtered job listing
        const jobListing = document.createElement('div');
        jobListing.classList.add('job-listing');
        jobListing.innerHTML = `
          <h3>${job.title}</h3>
          <p>Company: ${job.company}</p>
          <p>Location: ${job.location}</p>
          <p>Description: ${job.description}</p>
          <a href="${job.applyLink}" target="_blank">Apply Now</a>
        `;
        jobListingsSection.appendChild(jobListing);
      }
    }
  });
}

// Attach event listeners
document.getElementById('search-button').addEventListener('click', filterAndDisplayJobs);
document.getElementById('clear-filters-button').addEventListener('click', function () {
  document.getElementById('keywords').value = '';
  document.getElementById('location').value = '';
  document.getElementById('category').value = '';
  filterAndDisplayJobs();
});

// Initial job listing display
filterAndDisplayJobs();
