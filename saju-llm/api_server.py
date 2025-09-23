#!/usr/bin/env python3
"""
사주풀이 LLM 번역기 HTTP API 서버
FastAPI 기반 REST API 서버
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import tempfile
import os
from src.translator import SajuTranslator

app = FastAPI(title="Saju LLM Translation API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 번역기 인스턴스
translator = None

class TranslationRequest(BaseModel):
    text: str
    target_language: str = "en"
    include_terms: bool = True

class AudioTranslationRequest(BaseModel):
    target_language: str = "en"
    include_terms: bool = True

@app.on_event("startup")
async def startup_event():
    """서버 시작 시 번역기 초기화"""
    global translator
    try:
        translator = SajuTranslator(enable_context=True)
        print("✅ Saju Translator initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize translator: {e}")
        translator = None

@app.get("/")
async def root():
    """API 상태 확인"""
    return {
        "message": "Saju LLM Translation API",
        "status": "running",
        "translator_ready": translator is not None
    }

@app.post("/translate")
async def translate_text(request: TranslationRequest):
    """텍스트 번역 API"""
    if not translator:
        raise HTTPException(status_code=500, detail="Translator not initialized")

    try:
        result = translator.translate(
            input_text=request.text,
            target_language=request.target_language,
            include_terms=request.include_terms
        )

        if result["success"]:
            return {
                "success": True,
                "original_text": result["original_text"],
                "translated_text": result["translated_text"],
                "target_language": result["target_language"],
                "extracted_terms": result.get("extracted_terms", []),
                "processing_time": result["processing_time"]
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/translate/audio")
async def translate_audio(
    audio_file: UploadFile = File(...),
    target_language: str = Form("en"),
    source_language: str = Form("ko"),
    include_terms: bool = Form(True)
):
    """음성 파일 번역 API"""
    if not translator:
        raise HTTPException(status_code=500, detail="Translator not initialized")

    try:
        # 임시 파일로 오디오 저장
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            content = await audio_file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name

        try:
            print(f"🎤 Audio translation request - Source: {source_language}, Target: {target_language}")

            # 웹에서 업로드된 음성 파일 번역 처리
            result = translator.translate_from_audio_file(
                audio_file_path=tmp_file_path,
                target_language=target_language,
                include_terms=include_terms,
                source_language=source_language
            )

            if result["success"]:
                return {
                    "success": True,
                    "original_text": result["original_text"],
                    "translated_text": result["translated_text"],
                    "target_language": result["target_language"],
                    "extracted_terms": result.get("extracted_terms", []),
                    "processing_time": result["processing_time"],
                    "stt_info": result.get("stt_info", {})
                }
            else:
                raise HTTPException(status_code=400, detail=result["error"])

        finally:
            # 임시 파일 정리
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)