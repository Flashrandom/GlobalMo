import os
import pandas as pd
import json
from flask import Flask, send_from_directory, jsonify, send_file

app = Flask(__name__)

# Data loading functions
def load_data_files():
    data_dir = 'data'
    data = {}
    
    try:
        # Load Electricity Usage Data
        electricity_file = os.path.join(data_dir, 'electricity_usage.csv')
        if os.path.exists(electricity_file):
            data['electricity'] = pd.read_csv(electricity_file)
        
        # Load Oil Consumption Data
        oil_file = os.path.join(data_dir, 'oil_consumption.csv')
        if os.path.exists(oil_file):
            data['oil'] = pd.read_csv(oil_file)
        
        # Load EPI Data
        epi_file = os.path.join(data_dir, 'epi_data.csv')
        if os.path.exists(epi_file):
            data['epi'] = pd.read_csv(epi_file)
        
        # Load Earthquake Data
        earthquake_file = os.path.join(data_dir, 'earthquake_data.csv')
        if os.path.exists(earthquake_file):
            data['earthquake'] = pd.read_csv(earthquake_file)
        
        return data
    except Exception as e:
        print(f"Warning: Could not load some data files: {e}")
        return {}

# Load data when app starts
global_data = load_data_files()

# Routes for static HTML files
@app.route('/')
def welcome():
    return send_file('templates/welcome.html')

@app.route('/electricity')
def electricity_page():
    return send_file('templates/electricity.html')

@app.route('/oil')
def oil_page():
    return send_file('templates/oil.html')

@app.route('/epi')
def epi_page():
    return send_file('templates/epi.html')

@app.route('/earthquake')
def earthquake_page():
    return send_file('templates/earthquake.html')

@app.route('/about')
def about_page():
    return send_file('templates/about.html')

# Static file serving (CSS, JS, images)
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

# API Routes for JSON data
@app.route('/api/electricity')
def electricity_data():
    if 'electricity' in global_data:
        return jsonify(global_data['electricity'].to_dict('records'))
    return jsonify([])

@app.route('/api/oil')
def oil_data():
    if 'oil' in global_data:
        return jsonify(global_data['oil'].to_dict('records'))
    return jsonify([])

@app.route('/api/epi')
def epi_data():
    if 'epi' in global_data:
        return jsonify(global_data['epi'].to_dict('records'))
    return jsonify([])

@app.route('/api/earthquake')
def earthquake_data():
    if 'earthquake' in global_data:
        return jsonify(global_data['earthquake'].to_dict('records'))
    return jsonify([])

# Country comparison API
@app.route('/api/compare/<dataset>/<country1>/<country2>')
def compare_countries(dataset, country1, country2):
    if dataset in global_data:
        df = global_data[dataset]
        country1_data = df[df['country'] == country1].to_dict('records') if 'country' in df.columns else []
        country2_data = df[df['country'] == country2].to_dict('records') if 'country' in df.columns else []
        return jsonify({'country1': country1_data, 'country2': country2_data})
    return jsonify({'country1': [], 'country2': []})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)