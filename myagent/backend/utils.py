import mimetypes
import pandas as pd
from docx import Document
from PyPDF2 import PdfReader
import json
import xml.etree.ElementTree as ET
import io
from typing import Tuple, List
from bs4 import BeautifulSoup

def process_text_file(content: bytes) -> str:
    """Process plain text files."""
    return content.decode('utf-8')

def process_xml_file(content: bytes) -> str:
    """Process XML files."""
    root = ET.fromstring(content)
    return ET.tostring(root, encoding='unicode', method='xml')

def process_json_file(content: bytes) -> str:
    """Process JSON files."""
    json_data = json.loads(content)
    return json.dumps(json_data, indent=2)

def process_excel_file(content: bytes, mime_type: str) -> str:
    """Process Excel and CSV files."""
    if mime_type == 'text/csv':
        df = pd.read_csv(io.BytesIO(content))
    else:
        df = pd.read_excel(io.BytesIO(content))
    return df.to_string()

def process_word_file(content: bytes) -> str:
    """Process Word documents."""
    doc = Document(io.BytesIO(content))
    return '\n'.join([paragraph.text for paragraph in doc.paragraphs])

def process_pdf_file(content: bytes) -> str:
    """Process PDF files."""
    pdf = PdfReader(io.BytesIO(content))
    return '\n'.join(page.extract_text() for page in pdf.pages)

def extract_urls_from_html(content: str) -> List[str]:
    """Extract URLs from HTML content."""
    soup = BeautifulSoup(content, 'html.parser')
    links = soup.find_all('a')
    return [
        link.get('href') for link in links 
        if link.get('href') and link.get('href').startswith('http')
    ]

def get_mime_type(filename: str, content: bytes = None) -> Tuple[str, str]:
    """Detect file type and return mime type and extension."""
    mime_type, _ = mimetypes.guess_type(filename)
    if not mime_type:
        # Try to detect from content
        if content and content.startswith(b'%PDF-'):
            mime_type = 'application/pdf'
        elif content and content.startswith(b'PK\x03\x04'):
            if filename.endswith('.xlsx'):
                mime_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            elif filename.endswith('.docx'):
                mime_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        else:
            mime_type = 'text/plain'
    
    extension = mimetypes.guess_extension(mime_type) or '.txt'
    return mime_type, extension