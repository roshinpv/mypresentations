from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    agent_id: str
    message: str

class ChatResponse(BaseModel):
    response: str

# Mock response function - replace with actual LLM integration
def get_agent_response(agent_id: str, message: str) -> str:
    # This is a placeholder. In a real application, you would:
    # 1. Use different prompts based on agent_id
    # 2. Call your LLM service
    # 3. Process and return the response
    responses = {
        "general": "I am a general assistant. I can help you with various tasks.",
        "code": "I am a code assistant. I can help you with programming questions.",
        "writing": "I am a writing assistant. I can help you improve your writing."
    }
    return f"{responses.get(agent_id, 'Unknown agent')}\nYou said: {message}"

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = get_agent_response(request.agent_id, request.message)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)