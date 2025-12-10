# backend/app/routes/jobs.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pathlib import Path
import uuid

from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/jobs",
    tags=["jobs"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/from-url", response_model=schemas.JobCreateResponse)
def create_job_from_url(
    payload: schemas.JobCreateFromUrl,
    db: Session = Depends(get_db),
):
    """
    Create a job from a video URL.
    For now we just save the URL and create a placeholder local_path.
    The worker will later download the video.
    """

    fake_filename = f"{uuid.uuid4()}.mp4"
    local_path = str(UPLOAD_DIR / fake_filename)

    video = models.Video(
        source_url=payload.video_url,
        local_path=local_path,
    )
    db.add(video)
    db.commit()
    db.refresh(video)

    job = models.Job(
        video_id=video.id,
        status=models.JobStatus.PENDING,
        progress=0,
        stage="Queued",
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    return schemas.JobCreateResponse(job_id=job.id)


@router.get("/{job_id}", response_model=schemas.JobOut)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
):
    """
    Get info about a job and its clips.
    """
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return job
# End of app/routes/jobs.py