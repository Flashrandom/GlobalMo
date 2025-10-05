document.addEventListener("DOMContentLoaded", function () {
  showLoader();
  fetch("/api/earthquake")
    .then((res) => res.json())
    .then((data) => {
      if (data.length > 0) {
        initializeEarthquakePage(data);
      } else {
        document.querySelector(".main-content").innerHTML =
          '<h2 class="text-center">No Earthquake Data Found</h2>';
      }
    })
    .catch((err) => {
      console.error("Error fetching earthquake data:", err);
      document.querySelector(".main-content").innerHTML =
        '<h2 class="text-center text-danger">Error loading data</h2>';
    })
    .finally(() => {
      hideLoader();
    });
});

let timeSeriesChart = null;
let comparisonChart = null;

function initializeEarthquakePage(data) {
  const countries = [...new Set(data.map((d) => d.Country))].sort();
  const selects = ["countrySelect", "country1", "country2"];
  selects.forEach((id) => {
    const sel = document.getElementById(id);
    countries.forEach((c) => {
      sel.innerHTML += `<option value="${c}">${c}</option>`;
    });
  });

  const defaultCountry = countries.includes("India") ? "India" : countries[0];
  document.getElementById("countrySelect").value = defaultCountry;
  updateCharts(defaultCountry, data);
  createTopCountriesChart(data);
  populateTable(data.slice(0, 100));

  document.getElementById("countrySelect").addEventListener("change", (e) => {
    updateCharts(e.target.value, data);
  });

  document.getElementById("compareBtn").addEventListener("click", () => {
    const c1 = document.getElementById("country1").value;
    const c2 = document.getElementById("country2").value;
    if (c1 && c2) {
      compareCountries(c1, c2, data);
    } else {
      alert("Please select two countries.");
    }
  });
}

function updateCharts(country, data) {
  const filtered = data
    .filter((d) => d.Country === country)
    .sort((a, b) => a.Year - b.Year);
  const years = filtered.map((d) => d.Year);
  const counts = filtered.map((d) => d["Number of Earthquakes"]);

  if (timeSeriesChart) timeSeriesChart.destroy();

  timeSeriesChart = new Chart(
    document.getElementById("timeSeriesChart").getContext("2d"),
    {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: `Earthquakes in ${country}`,
            data: counts,
            borderColor: "#e74c3c",
            backgroundColor: "rgba(231,76,60,0.2)",
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Number of Earthquakes" },
          },
          x: { title: { display: true, text: "Year" } },
        },
      },
    }
  );

  populateTable(filtered);
}

function createTopCountriesChart(data) {
  const totals = {};
  data.forEach((d) => {
    totals[d.Country] =
      (totals[d.Country] || 0) + parseInt(d["Number of Earthquakes"]);
  });

  const top = Object.entries(totals)
    .map(([k, v]) => ({ country: k, total: v }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  new Chart(document.getElementById("topCountriesChart").getContext("2d"), {
    type: "bar",
    data: {
      labels: top.map((d) => d.country),
      datasets: [
        {
          label: "Total Earthquakes",
          data: top.map((d) => d.total),
          backgroundColor: "rgba(231,76,60,0.7)",
          borderColor: "#e74c3c",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Number of Earthquakes" },
        },
        x: { title: { display: true, text: "Country" } },
      },
    },
  });
}

function populateTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  data.forEach((d) => {
    tbody.innerHTML += `
            <tr>
                <td>${d.Country}</td>
                <td>${d.Year}</td>
                <td>${d["Number of Earthquakes"]}</td>
            </tr>
        `;
  });
}

function compareCountries(c1, c2, data) {
  const d1 = data
    .filter((d) => d.Country === c1)
    .sort((a, b) => a.Year - b.Year);
  const d2 = data
    .filter((d) => d.Country === c2)
    .sort((a, b) => a.Year - b.Year);
  const years = d1
    .map((d) => d.Year)
    .filter((y) => d2.some((d) => d.Year === y));
  const y1 = d1
    .filter((d) => years.includes(d.Year))
    .map((d) => d["Number of Earthquakes"]);
  const y2 = d2
    .filter((d) => years.includes(d.Year))
    .map((d) => d["Number of Earthquakes"]);

  if (comparisonChart) comparisonChart.destroy();

  comparisonChart = new Chart(
    document.getElementById("comparisonChart").getContext("2d"),
    {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: `${c1}`,
            data: y1,
            borderColor: "#e74c3c",
            backgroundColor: "rgba(231,76,60,0.2)",
            borderWidth: 2,
          },
          {
            label: `${c2}`,
            data: y2,
            borderColor: "#3498db",
            backgroundColor: "rgba(52,152,219,0.2)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Number of Earthquakes" },
          },
          x: { title: { display: true, text: "Year" } },
        },
      },
    }
  );
}
