
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

import anthropic
import os
import json

from typing import Any

client = anthropic.Anthropic(api_key=os.environ["CLAUDE_API_KEY"])

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

message_db = {
    "F31LI0L8": {
        "id": "F31LI0L8",
        "preview": "웹 서버 코드 작성",
        "history": [
            {
                "role": "user",
                "content": "웹 서버 코드 작성 어떻게 해?"
            },
            {
                "role": "assistant",
                "content": "이렇게 하면 될 것 같아요."
            },
            {
                "role": "user",
                "content": "왜 그렇게 생각하지?"
            },
            {
                "role": "assistant",
                "content": "이유는 이렇게 생각해요."
            }
        ]
    },
    "E9FJ3N9D": {
        "id": "E9FJ3N9D",
        "preview": "동적 라우팅",
        "history": [
            {
                "role": "user",
                "content": "동적 라우팅 어떻게 하지?"
            },
            {
                "role": "assistant",
                "content": "이렇게 하면 될 것 같아요."
            },
            {
                "role": "user",
                "content": "왜 그렇게 생각하지?"
            },
            {
                "role": "assistant",
                "content": "이유는 이렇게 생각해요!"
            }
        ]
    }
}

def stream_ask(messages):
    batch_size = 5
    with client.messages.stream(
        max_tokens=1024,
        messages=messages,
        model="claude-3-opus-20240229",
    ) as stream:
        batch_data = ""
        for text in stream.text_stream:
            batch_data += text
            if len(batch_data) >= batch_size:
                yield batch_data
                batch_data = ""
        if batch_data:
            yield batch_data

import json
@app.get("/api/history")
async def history():
    with open("history.json", "r") as json_file:
        history_list = json.load(json_file)
    return [
        {
            "id": key,
            "preview": value["preview"],
        } for key, value in history_list.items()
    ]

@app.get("/api/history/{id}")
async def history(id: str):
    if os.path.exists("datas/" + id + ".json"):
        with open("datas/" + id + ".json", "r") as json_file:
            history_data = json.load(json_file)
        return history_data

@app.post("/api/chat/{id}")
async def chat(request: Request, id: str):
    data = await request.json()
    with open("datas/" + id + ".json", "r") as json_file:
        history_data = json.load(json_file)
    history_data["history"].append({
        "role": "user",
        "content": data["content"]
    })
    def stream_chat():
        gen = stream_ask(history_data["history"])
        total_data = ""
        for text in gen:
            total_data += text
            yield text
        history_data["history"].append({
            "role": "assistant",
            "content": total_data
        })
        with open("datas/" + id + ".json", "w") as json_file:
            json.dump(history_data, json_file)
    return StreamingResponse(stream_chat(), media_type="text/plain")

@app.post("/api/edit/{id}/{index}")
async def edit(request: Request, id: str, index: int):
    data = await request.json()
    with open("datas/" + id + ".json", "r") as json_file:
        history_data = json.load(json_file)
    original_msg = history_data["history"][index]
    history_data["history"] = history_data["history"][:index]
    history_data["history"].append({
        "role": original_msg["role"],
        "content": data["content"]
    })
    def stream_chat():
        gen = stream_ask(history_data["history"])
        total_data = ""
        for text in gen:
            total_data += text
            yield text
        history_data["history"].append({
            "role": "assistant",
            "content": total_data
        })
        with open("datas/" + id + ".json", "w") as json_file:
            json.dump(history_data, json_file)
    return StreamingResponse(stream_chat(), media_type="text/plain")