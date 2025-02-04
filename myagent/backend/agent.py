import os
import json
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ----------------------------
# Embedding and Chroma DB Setup
# ----------------------------
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

# Initialize the embedding model (this may take a moment at startup)
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize Chroma DB using the latest recommended settings.
# Here we use the "duckdb+parquet" implementation with a persistence directory.
client = chromadb.Client()


collection = client.get_collection(name="agent_files")

# ----------------------------
# SQLite Database Setup
# ----------------------------
DATABASE_URL = "sqlite:///./agents.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

class Agent(Base):
    __tablename__ = "agents"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    files = Column(Text, default="[]")       # JSON list of saved file paths
    urls = Column(Text, default="[]")          # JSON list of URLs
    url_recursive = Column(Boolean, default=False)  # Flag for recursive URL processing
    context = Column(Text, default="[]")       # JSON list for maintaining conversation context
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# ----------------------------
# FastAPI Application Setup
# ----------------------------
app = FastAPI()

# Allow CORS from your Next.js frontend (adjust origins as needed)
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Pydantic Schemas
# ----------------------------
class Message(BaseModel):
    role: str  # "user" or "agent"
    message: str

class AgentOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    files: List[str]
    urls: List[str]
    url_recursive: bool
    context: List[Message] = []  # Maintained conversation context
    created_at: datetime

    class Config:
        orm_mode = True

class AgentUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    files: Optional[List[str]]
    urls: Optional[List[str]]
    url_recursive: Optional[bool]
    context: Optional[List[Message]]

# ----------------------------
# CRUD Endpoints for Agents
# ----------------------------
@app.get("/agents", response_model=List[AgentOut])
def read_agents():
    db = SessionLocal()
    agents = db.query(Agent).all()
    db.close()
    return [
        AgentOut(
            id=agent.id,
            name=agent.name,
            description=agent.description,
            files=json.loads(agent.files),
            urls=json.loads(agent.urls),
            url_recursive=agent.url_recursive,
            context=json.loads(agent.context),
            created_at=agent.created_at,
        )
        for agent in agents
    ]

@app.post("/agents", response_model=AgentOut)
async def create_agent(
    name: str = Form(...),
    description: str = Form(None),
    urls: str = Form(""),
    url_recursive: bool = Form(False),
    files: List[UploadFile] = File(None)
):
    saved_file_paths = []
    file_vectors = []  # Will store tuples: (file_text, filename, file_path)
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    
    if files:
        for file in files:
            file_path = os.path.join(upload_dir, file.filename)
            content = await file.read()  # Binary content
            # Save file locally
            with open(file_path, "wb") as f:
                f.write(content)
            saved_file_paths.append(file_path)
            
            # Attempt to decode file content as text (UTF-8)
            try:
                file_text = content.decode("utf-8")
            except Exception:
                file_text = None
            file_vectors.append((file_text, file.filename, file_path))
    
    # Process URLs (assumed comma-separated)
    urls_list = [u.strip() for u in urls.split(",") if u.strip()]
    
    # Create the agent record in SQLite
    db = SessionLocal()
    db_agent = Agent(
        name=name,
        description=description,
        files=json.dumps(saved_file_paths),
        urls=json.dumps(urls_list),
        url_recursive=url_recursive,
        context=json.dumps([]),  # Start with an empty conversation context
    )
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    db.close()
    
    # For each uploaded file that was successfully decoded as text,
    # compute its embedding and persist it in Chroma DB.
    for file_text, filename, file_path in file_vectors:
        if file_text is None:
            continue  # Skip files that cannot be decoded as text.
        embedding = embedding_model.encode(file_text)
        # Create a unique document ID (combining agent ID and filename)
        doc_id = f"{db_agent.id}-{filename}"
        collection.add(
            documents=[file_text],
            embeddings=[embedding.tolist()],
            metadatas=[{"agent_id": db_agent.id, "file_name": filename, "file_path": file_path}],
            ids=[doc_id]
        )
    
    return AgentOut(
        id=db_agent.id,
        name=db_agent.name,
        description=db_agent.description,
        files=json.loads(db_agent.files),
        urls=json.loads(db_agent.urls),
        url_recursive=db_agent.url_recursive,
        context=json.loads(db_agent.context),
        created_at=db_agent.created_at,
    )

@app.get("/agents/{agent_id}", response_model=AgentOut)
def read_agent(agent_id: int):
    db = SessionLocal()
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    db.close()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return AgentOut(
        id=agent.id,
        name=agent.name,
        description=agent.description,
        files=json.loads(agent.files),
        urls=json.loads(agent.urls),
        url_recursive=agent.url_recursive,
        context=json.loads(agent.context),
        created_at=agent.created_at,
    )

@app.put("/agents/{agent_id}", response_model=AgentOut)
def update_agent(agent_id: int, agent_update: AgentUpdate):
    db = SessionLocal()
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        db.close()
        raise HTTPException(status_code=404, detail="Agent not found")
    if agent_update.name is not None:
        agent.name = agent_update.name
    if agent_update.description is not None:
        agent.description = agent_update.description
    if agent_update.files is not None:
        agent.files = json.dumps(agent_update.files)
    if agent_update.urls is not None:
        agent.urls = json.dumps(agent_update.urls)
    if agent_update.url_recursive is not None:
        agent.url_recursive = agent_update.url_recursive
    if agent_update.context is not None:
        agent.context = json.dumps([m.dict() for m in agent_update.context])
    db.commit()
    db.refresh(agent)
    db.close()
    return AgentOut(
        id=agent.id,
        name=agent.name,
        description=agent.description,
        files=json.loads(agent.files),
        urls=json.loads(agent.urls),
        url_recursive=agent.url_recursive,
        context=json.loads(agent.context),
        created_at=agent.created_at,
    )

@app.delete("/agents/{agent_id}")
def delete_agent(agent_id: int):
    db = SessionLocal()
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        db.close()
        raise HTTPException(status_code=404, detail="Agent not found")
    db.delete(agent)
    db.commit()
    db.close()
    return {"detail": "Agent deleted"}

# ----------------------------
# Chat Endpoint with Context Maintenance
# ----------------------------
class ChatMessage(BaseModel):
    message: str

@app.post("/agents/{agent_id}/chat")
def chat_with_agent(agent_id: int, chat: ChatMessage):
    db = SessionLocal()
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        db.close()
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Load the current conversation context
    context = json.loads(agent.context)
    
    # Append the user's message
    context.append({"role": "user", "message": chat.message})
    
    # For demonstration purposes, the agent echoes the message.
    response_text = f"Echo from agent {agent_id}: {chat.message}"
    context.append({"role": "agent", "message": response_text})
    
    # Persist the updated context
    agent.context = json.dumps(context)
    db.commit()
    db.refresh(agent)
    db.close()
    
    return {"response": response_text, "context": context}
