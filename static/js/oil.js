// Fetch oil consumption data
document.addEventListener('DOMContentLoaded', function() {
    showLoader();
    fetch('/api/oil')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                initializeOilPage(data);
            } else {
                console.error('No oil consumption data available');
                document.querySelector('.main-content').innerHTML = '<div class="container"><h2>Error: No data available</h2></div>';
            }
        })
        .catch(error => {
            console.error('Error fetching oil consumption data:', error);
            document.querySelector('.main-content').innerHTML = '<div class="container"><h2>Error loading data</h2></div>';
        })
        .finally(() => {
            hideLoader();
        });
});

function initializeOilPage(data) {
    // Filter out aggregated regions if needed
    const filteredData = data.filter(item => !item.country.includes('(EI)'));
    
    // Populate country dropdown
    const countries = [...new Set(filteredData.map(item => item.country))].sort();
    const countrySelect = document.getElementById('countrySelect');
    const country1Select = document.getElementById('country1');
    const country2Select = document.getElementById('country2');
    
    countries.forEach(country => {
        countrySelect.innerHTML += `<option value="${country}">${country}</option>`;
        country1Select.innerHTML += `<option value="${country}">${country}</option>`;
        country2Select.innerHTML += `<option value="${country}">${country}</option>`;
    });
    
    // Initialize with a default country if available
    if (countries.includes('India')) {
        countrySelect.value = 'India';
        updateCharts('United States', filteredData);
    } else if (countries.length > 0) {
        countrySelect.value = countries[0];
        updateCharts(countries[0], filteredData);
    }
    
    // Create top consumers chart
    createTopConsumersChart(filteredData);
    
    // Update when country selection changes
    countrySelect.addEventListener('change', function() {
        updateCharts(this.value, filteredData);
    });
    
    // Populate table with initial data (limited to 100 rows for performance)
    populateTable(filteredData.slice(0, 100));
    
    // Set up comparison button
    document.getElementById('compareBtn').addEventListener('click', function() {
        const country1 = document.getElementById('country1').value;
        const country2 = document.getElementById('country2').value;
        
        if (country1 && country2) {
            compareCountries(country1, country2, filteredData);
        } else {
            alert('Please select two countries to compare');
        }
    });
}

function updateCharts(country, data) {
    const countryData = data.filter(item => item.country === country);
    
    if (countryData.length === 0) {
        console.error(`No data available for ${country}`);
        return;
    }
    
    // Sort by year
    countryData.sort((a, b) => a.year - b.year);
    
    // Extract years and values for charts
    const years = countryData.map(item => item.year);
    const consumptionValues = countryData.map(item => item.oil_consumption_twh);
    
    // Create or update consumption chart
    const consumptionCtx = document.getElementById('oilConsumptionChart').getContext('2d');
    if (window.consumptionChart) {
        window.consumptionChart.destroy();
    }
    window.consumptionChart = new Chart(consumptionCtx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: `Oil Consumption (TWh) - ${country}`,
                data: consumptionValues,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Oil Consumption (TWh)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
    
    // Update table with data for selected country
    populateTable(countryData);
}

function createTopConsumersChart(data) {
    // Get the most recent year
    const years = [...new Set(data.map(item => item.year))].sort((a, b) => b - a);
    const mostRecentYear = years[0];
    
    // Filter data for most recent year
    const recentData = data.filter(item => item.year === mostRecentYear);
    
    // Sort by consumption and get top 10
    const topConsumers = recentData.sort((a, b) => b.oil_consumption_twh - a.oil_consumption_twh).slice(0, 10);
    
    // Create chart
    const topConsumersCtx = document.getElementById('topConsumersChart').getContext('2d');
    new Chart(topConsumersCtx, {
        type: 'bar',
        data: {
            labels: topConsumers.map(item => item.country),
            datasets: [{
                label: `Top Oil Consumers (${mostRecentYear})`,
                data: topConsumers.map(item => item.oil_consumption_twh),
                backgroundColor: 'rgba(231, 76, 60, 0.7)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Oil Consumption (TWh)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Country'
                    }
                }
            }
        }
    });
}

function populateTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.country}</td>
            <td>${item.year}</td>
            <td>${item.oil_consumption_twh}</td>
        `;
        tableBody.appendChild(row);
    });
}

// function compareCountries(country1, country2, data) {
//     const country1Data = data.filter(item => item.country === country1).sort((a, b) => a.year - b.year);
//     const country2Data = data.filter(item => item.country === country2).sort((a, b) => a.year - b.year);
    
//     // Find common years between both countries
//     const country1Years = country1Data.map(item => item.year);
//     const country2Years = country2Data.map(item => item.year);
//     const commonYears = country1Years.filter(year => country2Years.includes(year));
    
//     // Filter data to only include common years
//     const filteredCountry1Data = country1Data.filter(item => commonYears.includes(item.year));
//     const filteredCountry2Data = country2Data.filter(item => commonYears.includes(item.year));
    
//     // Create comparison chart
//     const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
//     if (window.comparisonChart) {
//         window.comparisonChart.destroy();
//     }
    
//     window.comparisonChart = new Chart(comparisonCtx, {
//         type: 'line',
//         data: {
//             labels: commonYears,
//             datasets: [
//                 {
//                     label: `${country1} - Oil Consumption (TWh)`,
//                     data: filteredCountry1Data.map(item => item.oil_consumption_twh),
//                     borderColor: '#e74c3c',
//                     backgroundColor: 'rgba(231, 76, 60, 0.1)',
//                     borderWidth: 2
//                 },
//                 {
//                     label: `${country2} - Oil Consumption (TWh)`,
//                     data: filteredCountry2Data.map(item => item.oil_consumption_twh),
//                     borderColor: '#9b59b6',
//                     backgroundColor: 'rgba(155, 89, 182, 0.1)',
//                     borderWidth: 2
//                 }
//             ]
//         },
//         options: {
//             responsive: true,
//             scales: {
//                 y: {
//                     title: {
//                         display: true,
//                         text: 'Oil Consumption (TWh)'
//                     }
//                 },
//                 x: {
//                     title: {
//                         display: true,
//                         text: 'Year'
//                     }
//                 }
//             }
//         }
//     });
// }

function compareCountries(country1, country2, data) {
    const country1Data = data.filter(item => item.country === country1).sort((a, b) => a.year - b.year);
    const country2Data = data.filter(item => item.country === country2).sort((a, b) => a.year - b.year);
    
    // Find common years between both countries
    const country1Years = country1Data.map(item => item.year);
    const country2Years = country2Data.map(item => item.year);
    const commonYears = country1Years.filter(year => country2Years.includes(year));
    
    // Filter data to only include common years
    const filteredCountry1Data = country1Data.filter(item => commonYears.includes(item.year));
    const filteredCountry2Data = country2Data.filter(item => commonYears.includes(item.year));
    
    // Destroy existing comparison chart if it exists
    if (window.comparisonChart && window.comparisonChart.destroy) {
        window.comparisonChart.destroy(); // Destroy the old chart before creating a new one
    }
    
    // Create new comparison chart
    window.comparisonChart = new Chart(document.getElementById('comparisonChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: commonYears,
            datasets: [
                {
                    label: `${country1} - Oil Consumption (TWh)`,
                    data: filteredCountry1Data.map(item => item.oil_consumption_twh),
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2
                },
                {
                    label: `${country2} - Oil Consumption (TWh)`,
                    data: filteredCountry2Data.map(item => item.oil_consumption_twh),
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Oil Consumption (TWh)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
}






















