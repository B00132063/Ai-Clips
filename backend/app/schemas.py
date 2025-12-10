# backend/app/schemas.py

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .models import JobStatus


class ClipOut(BaseModel):
    id: int
    start_time: float
    end_time: float
    emotion_label: Optional[str] = None
    peak_score: Optional[float] = None
    file_path: str
    thumbnail_path: Optional[str] = None

    class Config:
        orm_mode = True


class JobOut(BaseModel):
    id: int
    status: JobStatus
    progress: int
    stage: str
    created_at: datetime
    updated_at: datetime
    clips: List[ClipOut] = []

    class Config:
        orm_mode = True


class JobCreateResponse(BaseModel):
    job_id: int


class JobCreateFromUrl(BaseModel):
    video_url: str
