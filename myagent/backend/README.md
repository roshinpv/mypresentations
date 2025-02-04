# AI Agent Backend

This is the Python backend for the AI agent application. It provides APIs for processing files and URLs, and handles chat interactions.

## Features

- File processing for multiple formats:
  - Text files (.txt)
  - XML files (.xml)
  - JSON files (.json)
  - Excel files (.xls, .xlsx)
  - CSV files (.csv)
  - Word documents (.doc, .docx)
- URL processing with recursive option
- Chat functionality (placeholder for AI integration)

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

- `POST /api/process-file`: Process uploaded files
- `POST /api/process-url`: Process URLs with optional recursive fetching
- `POST /api/chat`: Handle chat messages

## Configuration

The server runs on port 8000 by default. CORS is enabled for development.