document.addEventListener("DOMContentLoaded", function () {
  showLoader();
  fetch("/api/epi")
    .then((response) => response.text()) // Get raw response text
    .then((text) => {
      console.log(text); // Log the raw response
      try {
        // Sanitize the text (replace NaN with 0 or null)
        const sanitizedText = text.replace(/NaN/g, "null");

        const data = JSON.parse(sanitizedText); // Attempt to parse the JSON
        if (data.length > 0) {
          initializeEpiPage(data);
        } else {
          console.error("No EPI data available");
          document.querySelector(".main-content").innerHTML =
            '<div class="container"><h2>Error: No data available</h2></div>';
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        document.querySelector(".main-content").innerHTML =
          '<div class="container"><h2>Error loading data</h2></div>';
      }
    })
    .catch((error) => {
      console.error("Error fetching EPI data:", error);
      document.querySelector(".main-content").innerHTML =
        '<div class="container"><h2>Error loading data</h2></div>';
    })
    .finally(() => {
      hideLoader();
    });
});

function initializeEpiPage(data) {
  // Create EPI charts
  createTopEpiChart(data);
  createBottomEpiChart(data);
  createChangeChart(data);

  // Populate country dropdowns for comparison
  const countries = [...new Set(data.map((item) => item.Country))].sort();
  const country1Select = document.getElementById("country1");
  const country2Select = document.getElementById("country2");

  countries.forEach((country) => {
    country1Select.innerHTML += `<option value="${country}">${country}</option>`;
    country2Select.innerHTML += `<option value="${country}">${country}</option>`;
  });

  // Populate table with all data
  populateTable(data);

  // Set up comparison button
  document.getElementById("compareBtn").addEventListener("click", function () {
    const country1 = document.getElementById("country1").value;
    const country2 = document.getElementById("country2").value;

    if (country1 && country2) {
      compareCountries(country1, country2, data);
    } else {
      alert("Please select two countries to compare");
    }
  });
}

function createTopEpiChart(data) {
  // Sort data by EPI score and get top 20
  const topCountries = [...data]
    .sort((a, b) => b["EPI Score"] - a["EPI Score"])
    .slice(0, 20);

  // Create chart
  const topEpiCtx = document.getElementById("topEpiChart").getContext("2d");
  new Chart(topEpiCtx, {
    type: "bar",
    data: {
      labels: topCountries.map((item) => item.Country),
      datasets: [
        {
          label: "Top 20 Countries by EPI Score",
          data: topCountries.map((item) => item["EPI Score"]),
          backgroundColor: "rgba(46, 204, 113, 0.7)",
          borderColor: "rgba(46, 204, 113, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "EPI Score",
          },
        },
      },
    },
  });
}

function createBottomEpiChart(data) {
  // Sort data by EPI score and get bottom 20
  const bottomCountries = [...data]
    .sort((a, b) => a["EPI Score"] - b["EPI Score"])
    .slice(0, 20);

  // Create chart
  const bottomEpiCtx = document
    .getElementById("bottomEpiChart")
    .getContext("2d");
  new Chart(bottomEpiCtx, {
    type: "bar",
    data: {
      labels: bottomCountries.map((item) => item.Country),
      datasets: [
        {
          label: "Bottom 20 Countries by EPI Score",
          data: bottomCountries.map((item) => item["EPI Score"]),
          backgroundColor: "rgba(231, 76, 60, 0.7)",
          borderColor: "rgba(231, 76, 60, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "EPI Score",
          },
        },
      },
    },
  });
}

function createChangeChart(data) {
  // Filter out entries with NA in 10-Year Change
  const filteredData = data.filter((item) => item["10-Year Change"] !== "NA");

  // Sort data by 10-Year Change and get top 20
  const topChangeCountries = [...filteredData]
    .sort((a, b) => b["10-Year Change"] - a["10-Year Change"])
    .slice(0, 20);

  // Create chart
  const changeCtx = document.getElementById("changeChart").getContext("2d");
  new Chart(changeCtx, {
    type: "bar",
    data: {
      labels: topChangeCountries.map((item) => item.Country),
      datasets: [
        {
          label: "Top 20 Countries by 10-Year Change",
          data: topChangeCountries.map((item) => item["10-Year Change"]),
          backgroundColor: "rgba(52, 152, 219, 0.7)",
          borderColor: "rgba(52, 152, 219, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "10-Year Change",
          },
        },
      },
    },
  });
}

function populateTable(data) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  // Sort data by rank
  const sortedData = [...data].sort((a, b) => a.Rank - b.Rank);

  sortedData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.Country}</td>
            <td>${item.Rank}</td>
            <td>${item["EPI Score"]}</td>
            <td>${item["10-Year Change"]}</td>
        `;
    tableBody.appendChild(row);
  });
}

function compareCountries(country1, country2, data) {
  const country1Data = data.find((item) => item.Country === country1);
  const country2Data = data.find((item) => item.Country === country2);

  if (!country1Data || !country2Data) {
    console.error("Country data not found");
    return;
  }

  const comparisonCtx = document
    .getElementById("comparisonChart")
    .getContext("2d");

  // Check if comparisonChart exists and is a valid Chart object before destroying it
  if (window.comparisonChart && window.comparisonChart.destroy) {
    window.comparisonChart.destroy(); // Destroy the previous chart if it exists
  }

  // Create the new comparison chart
  window.comparisonChart = new Chart(comparisonCtx, {
    type: "radar",
    data: {
      labels: ["EPI Score", "10-Year Change", "Inverse Rank"],
      datasets: [
        {
          label: country1,
          data: [
            country1Data["EPI Score"],
            country1Data["10-Year Change"] === "NA"
              ? 0
              : country1Data["10-Year Change"],
            100 - (country1Data.Rank / data.length) * 100, // Inverse rank
          ],
          backgroundColor: "rgba(52, 152, 219, 0.2)",
          borderColor: "rgba(52, 152, 219, 1)",
          pointBackgroundColor: "rgba(52, 152, 219, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(52, 152, 219, 1)",
        },
        {
          label: country2,
          data: [
            country2Data["EPI Score"],
            country2Data["10-Year Change"] === "NA"
              ? 0
              : country2Data["10-Year Change"],
            100 - (country2Data.Rank / data.length) * 100, // Inverse rank
          ],
          backgroundColor: "rgba(231, 76, 60, 0.2)",
          borderColor: "rgba(231, 76, 60, 1)",
          pointBackgroundColor: "rgba(231, 76, 60, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(231, 76, 60, 1)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: {
            display: true,
          },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  });
}
