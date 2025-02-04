from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
import httpx
import mimetypes
import pandas as pd
from bs4 import BeautifulSoup
from docx import Document
from PyPDF2 import PdfReader
import json
import xml.etree.ElementTree as ET
import io
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize mimetypes
mimetypes.init()

# Supported MIME types
SUPPORTED_MIMES = {
    'text/plain': '.txt',
    'text/xml': '.xml',
    'application/json': '.json',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.ms-excel': '.xls',
    'text/csv': '.csv',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/pdf': '.pdf'
}

class UrlRequest(BaseModel):
    url: HttpUrl
    recursive: bool = False

class ProcessingResponse(BaseModel):
    content: str
    linked_urls: List[str] = []

def get_mime_type(filename: str, content: bytes = None) -> str:
    """Determine MIME type from filename and optionally content."""
    # First try to get MIME type from filename
    mime_type, _ = mimetypes.guess_type(filename)
    
    if not mime_type:
        # If can't determine from filename, try to guess from content
        if content and content.startswith(b'%PDF-'):
            return 'application/pdf'
        elif content and content.startswith(b'PK\x03\x04'):
            # Check for Office Open XML formats
            if filename.endswith('.xlsx'):
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            elif filename.endswith('.docx'):
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        # Add more content-based detection as needed
        
        # Default to plain text if we can't determine the type
        mime_type = 'text/plain'
    
    return mime_type

@app.post("/api/process-file", response_model=ProcessingResponse)
async def process_file(file: UploadFile):
    try:
        content = await file.read()
        mime_type = get_mime_type(file.filename, content)
        
        if mime_type not in SUPPORTED_MIMES:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        # Process based on file type
        if mime_type == 'text/plain':
            text_content = content.decode('utf-8')
        
        elif mime_type in ['text/xml', 'application/xml']:
            root = ET.fromstring(content)
            text_content = ET.tostring(root, encoding='unicode', method='xml')
        
        elif mime_type == 'application/json':
            json_data = json.loads(content)
            text_content = json.dumps(json_data, indent=2)
        
        elif mime_type in ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']:
            df = pd.read_excel(io.BytesIO(content)) if 'excel' in mime_type else pd.read_csv(io.BytesIO(content))
            text_content = df.to_string()
        
        elif mime_type in ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']:
            doc = Document(io.BytesIO(content))
            text_content = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
        
        elif mime_type == 'application/pdf':
            pdf = PdfReader(io.BytesIO(content))
            text_content = '\n'.join(page.extract_text() for page in pdf.pages)
        
        else:
            text_content = content.decode('utf-8')
        
        print(text_content)
        return ProcessingResponse(content=text_content, linked_urls=[])
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process-url", response_model=ProcessingResponse)
async def process_url(request: UrlRequest):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(str(request.url))
            response.raise_for_status()
            content = response.text
            
            linked_urls = []
            if request.recursive:
                soup = BeautifulSoup(content, 'html.parser')
                links = soup.find_all('a')
                linked_urls = [
                    link.get('href') for link in links 
                    if link.get('href') and link.get('href').startswith('http')
                ][:5]  # Limit to 5 URLs to prevent overwhelming
            
            return ProcessingResponse(content=content, linked_urls=linked_urls)
    
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching URL: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(message: str):
    # Here you would integrate with your AI model
    # For now, we'll just echo the message
    return {"response": f"I received your message: {message}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)