# app/models.py

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Enum,
    ForeignKey,
    DateTime,
    Text,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import enum


class JobStatus(str, enum.Enum):
    """
    Status for a processing job.
    """
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    DONE = "DONE"
    FAILED = "FAILED"


class Video(Base):
    """
    Stores information about the original video.
    """
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    source_url = Column(Text, nullable=True)       # where it came from (YouTube/TikTok/etc)
    local_path = Column(Text, nullable=False)      # where the raw video is saved on disk
    duration = Column(Float, nullable=True)        # in seconds (optional)
    created_at = Column(DateTime, default=datetime.utcnow)

    jobs = relationship("Job", back_populates="video")


class Job(Base):
    """
    A processing job for a given video.
    """
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    status = Column(Enum(JobStatus), default=JobStatus.PENDING)
    progress = Column(Integer, default=0)          # 0–100
    stage = Column(String, default="Queued")
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    video = relationship("Video", back_populates="jobs")
    clips = relationship("Clip", back_populates="job", cascade="all, delete-orphan")


class Clip(Base):
    """
    Short clips that the job produced.
    """
    __tablename__ = "clips"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    start_time = Column(Float, nullable=False)      # seconds from start
    end_time = Column(Float, nullable=False)        # seconds from start
    emotion_label = Column(String, nullable=True)   # e.g. "happy", "surprise"
    peak_score = Column(Float, nullable=True)       # 0–1 how strong
    file_path = Column(Text, nullable=False)        # path to the short clip file
    thumbnail_path = Column(Text, nullable=True)    # optional thumbnail

    job = relationship("Job", back_populates="clips")
# End of app/models.py