# 🌍 Global Environmental Monitor

A comprehensive web application built with **Flask** and **Chart.js** for visualizing and analyzing critical global environmental and seismic data. Our mission is to make complex environmental information accessible and understandable through interactive visualizations and country-specific insights.

✨ Features

## 📊 Data Visualization & Monitoring

* **Interactive Charts:** Display data over time and compare countries using **Chart.js**.
    * **Time Series Charts:** Visualize trends for selected countries (e.g., Earthquake frequency, Oil Consumption).
    * **Top 10 Rankings:** See the leading countries for each metric.
    * **Country Comparison:** Directly contrast two countries' performance on a single chart using a dedicated API route (`/api/compare/<dataset>/<country1>/<country2>`).
* **Four Key Datasets:** Dedicated pages and API endpoints for:
    * **Electricity Usage:** Explore consumption patterns and trends.
    * **Oil Consumption:** Analyze historical and current usage data measured in terawatt-hours.
    * **Environment Performance Index (EPI):** Track environmental health and ecosystem vitality scores.
    * **Earthquake Data:** Monitor global seismic activity with detailed earthquake counts by country and year.
* **Dynamic Data Tables:** View the raw data feeding the visualizations in structured, scrollable tables.

---

## 🛠️ Technologies

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Backend** | Python, **Flask** | Serving the web pages and providing REST API endpoints (e.g., `/api/electricity`). |
| **Data Processing** | **Pandas** | Loading, processing, and filtering the CSV datasets upon application startup. |
| **Visualization** | **Chart.js** | Rendering dynamic, interactive line and bar charts for data display. |
| **Frontend** | HTML, CSS, JavaScript, Bootstrap 5 | User interface, responsive design, and interactivity. |

---

## 🚀 Quick Start

### Prerequisites

* Python 3.8 or higher
* Git

### Local Development Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/global-environmental-monitor.git](https://github.com/your-username/global-environmental-monitor.git)
    cd global-environmental-monitor
    ```

2.  **Create and activate a virtual environment**
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```

3.  **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```
    *(The main dependencies are `Flask`, `Pandas`, and `json`)*

4.  **Place Data Files**
    Ensure your required data files (`electricity_usage.csv`, `oil_consumption.csv`, `epi_data.csv`, `earthquake_data.csv`) are located in a folder named **`data/`** in the project root. The application loads data from this directory upon launch.

5.  **Run the application**
    ```bash
    python app.py
    ```

6.  **Access the application**
    Open your browser and navigate to `http://127.0.0.1:5000` or `http://localhost:5000`.

---

## 🏗️ Project Structure

The Flask application is structured to separate data loading, routing, and static assets.

```
global-environmental-monitor/
├── app.py                  # Main Flask application with data loading and API/HTML routes
├── requirements.txt        # Python dependencies
├── data/                   # CSV data files loaded by Pandas
│   ├── electricity_usage.csv
│   └── ... (other data files)
├── templates/              # HTML files served as the application's pages
│   ├── welcome.html        # Home page
│   ├── electricity.html
│   ├── oil.html
│   └── ... (other pages)
└── static/                 # Static assets (CSS, JS, Images)
    ├── css/
    ├── js/                 # Includes client-side logic for fetching data and rendering charts (e.g., earthquake.js)
    └── images/
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to suggest improvements or report bugs by creating an issue.

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/new-chart`).
3.  Commit your changes (`git commit -m 'Implement new chart feature'`).
4.  Push to the branch (`git push origin feature/new-chart`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details
