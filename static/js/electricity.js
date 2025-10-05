document.addEventListener("DOMContentLoaded", function () {
  showLoader();
  fetch("/api/electricity")
    .then((res) => res.json())
    .then((data) => {
      if (data.length > 0) {
        initializeElectricityPage(data);
      } else {
        throw new Error("No data available");
      }
    })
    .catch((err) => {
      console.error("Error fetching electricity data:", err);
      document.querySelector(".main-content").innerHTML = `
          <div class="container"><h2>Error loading data</h2><p>${err.message}</p></div>`;
    })
    .finally(() => {
      hideLoader();
    });
});

let demandChart, perCapitaChart, comparisonChart;

function initializeElectricityPage(data) {
  const countries = [...new Set(data.map((item) => item.country))].sort();
  const countrySelect = document.getElementById("countrySelect");
  const country1 = document.getElementById("country1");
  const country2 = document.getElementById("country2");

  countries.forEach((country) => {
    const option = `<option value="${country}">${country}</option>`;
    countrySelect.innerHTML += option;
    country1.innerHTML += option;
    country2.innerHTML += option;
  });

  const defaultCountry = countries.includes("India") ? "India" : countries[0];
  countrySelect.value = defaultCountry;
  updateCharts(defaultCountry, data);

  countrySelect.addEventListener("change", () => {
    updateCharts(countrySelect.value, data);
  });

  document.getElementById("compareBtn").addEventListener("click", () => {
    if (country1.value && country2.value) {
      compareCountries(country1.value, country2.value, data);
    } else {
      alert("Select two countries to compare.");
    }
  });

  populateTable(data.slice(0, 100));
}

function updateCharts(country, data) {
  const filtered = data
    .filter((d) => d.country === country)
    .sort((a, b) => a.year - b.year);
  const years = filtered.map((d) => d.year);
  const demand = filtered.map((d) => d.electricity_demand);
  const perCapita = filtered.map((d) => d.electricity_demand_per_capita);

  if (demandChart instanceof Chart) demandChart.destroy();
  if (perCapitaChart instanceof Chart) perCapitaChart.destroy();

  demandChart = new Chart(document.getElementById("demandChart"), {
    type: "line",
    data: {
      labels: years,
      datasets: [
        {
          label: `Electricity Demand - ${country} (TWh)`,
          data: demand,
          borderColor: "#3498db",
          backgroundColor: "rgba(52,152,219,0.1)",
          fill: true,
        },
      ],
    },
  });

  perCapitaChart = new Chart(document.getElementById("perCapitaChart"), {
    type: "line",
    data: {
      labels: years,
      datasets: [
        {
          label: `Per Capita - ${country} (kWh)`,
          data: perCapita,
          borderColor: "#2ecc71",
          backgroundColor: "rgba(46,204,113,0.1)",
          fill: true,
        },
      ],
    },
  });

  populateTable(filtered);
}

function populateTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  data.forEach((row) => {
    tbody.innerHTML += `
        <tr>
          <td>${row.country}</td>
          <td>${row.year}</td>
          <td>${row.electricity_demand}</td>
          <td>${row.electricity_demand_per_capita}</td>
        </tr>`;
  });
}

function compareCountries(c1, c2, data) {
  const data1 = data
    .filter((d) => d.country === c1)
    .sort((a, b) => a.year - b.year);
  const data2 = data
    .filter((d) => d.country === c2)
    .sort((a, b) => a.year - b.year);
  const commonYears = data1
    .map((d) => d.year)
    .filter((y) => data2.map((d) => d.year).includes(y));

  const values1 = data1.filter((d) => commonYears.includes(d.year));
  const values2 = data2.filter((d) => commonYears.includes(d.year));

  if (comparisonChart instanceof Chart) comparisonChart.destroy();

  comparisonChart = new Chart(document.getElementById("comparisonChart"), {
    type: "line",
    data: {
      labels: commonYears,
      datasets: [
        {
          label: `${c1} - Per Capita (kWh)`,
          data: values1.map((d) => d.electricity_demand_per_capita),
          borderColor: "#2980b9",
          fill: false,
        },
        {
          label: `${c2} - Per Capita (kWh)`,
          data: values2.map((d) => d.electricity_demand_per_capita),
          borderColor: "#c0392b",
          fill: false,
        },
      ],
    },
  });
}
