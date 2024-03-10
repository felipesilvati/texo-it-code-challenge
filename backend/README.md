# Backend Python/Flask Application

This document provides setup and operational guidance for the backend component of this application, developed using Python and Flask. It covers environment setup, application execution, and testing procedures.

## Requirements

- Python 3.9.6
- pip3 (pip 21.2.4)

## Environment Setup

1. **Create a Virtual Environment**: Navigate to the `/backend` folder and execute the following command to create a virtual environment named `.venv`:

    ```bash
    python3 -m venv .venv
    ```

2. **Activate the Virtual Environment**: Before proceeding with the installation of dependencies or running the app, activate the virtual environment with:

    ```bash
    source .venv/bin/activate
    ```

3. **Install Dependencies**: Ensure your virtual environment is activated, then install the required dependencies using:

    ```bash
    pip3 install -r requirements.txt
    ```

## Running the Application

With the virtual environment activated and dependencies installed, you can start the application with the following command:

```bash
python3 app.py
```

This launches the Flask application, by default on port 8000, as configured for compatibility with macOS Monterey (12.x) and newer versions.

## Running Tests

To execute the integration tests and ensure all components are functioning correctly, use:

```bash
python3 -m pytest
```

Ensure this is run within the activated virtual environment.

## Highlights of the Application

### Endpoints

The application features the following key endpoints:

- **Health Check (`/api/healthcheck`)**: Verifies the application's health and database connectivity, returning the status of both.
- **Producer Award Intervals (`/api/producers/award-intervals`)**: Calculates and returns the intervals between awards for producers, highlighting those with the shortest and longest spans between wins.

### In-Memory Database

The application utilizes an in-memory database configured with a schema designed to accommodate the structure and needs of the provided CSV files. This setup is ideal for testing and demonstration purposes, ensuring fast setup and teardown times without the need for persistent storage.

### CSV Ingestion

An essential feature of the application is its ability to ingest data from a CSV file at startup, populating the in-memory database with movies, studios, producers, and their award statuses. To facilitate this, ensure a `.env` file exists in the /backend folder with the relative path to the CSV file specified by the `CSV_PATH` variable. An example can be found in the `.env.example` file.

### Integration Tests

The application includes a suite of integration tests designed to validate the functionality of its components, from endpoint responses to the correctness of the CSV ingestion process. These tests are crucial for maintaining the reliability and integrity of the application as it evolves.
