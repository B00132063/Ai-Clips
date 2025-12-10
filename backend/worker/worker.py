# worker/worker.py

import time
from pathlib import Path

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models

CLIPS_DIR = Path("clips")
CLIPS_DIR.mkdir(parents=True, exist_ok=True)


def update_job_status(job: models.Job,
                      status: models.JobStatus | None = None,
                      progress: int | None = None,
                      stage: str | None = None,
                      error: str | None = None):
    """
    Helper to update job fields.
    """
    if status is not None:
        job.status = status
    if progress is not None:
        job.progress = progress
    if stage is not None:
        job.stage = stage
    if error is not None:
        job.error_message = error


def process_job(db: Session, job: models.Job):
    """
    Dummy processing for now:

    - Pretend we download the video
    - Pretend we analyse it
    - Generate 2 fake clips
    """

    update_job_status(job, status=models.JobStatus.RUNNING, progress=5, stage="Starting")
    db.commit()
    db.refresh(job)

    # 1. (TODO) Download the video using job.video.source_url into job.video.local_path

    # 2. (TODO) Run emotion + speech analysis over the video

    # 3. (DUMMY) Create 2 fake clips, 10s each
    update_job_status(job, progress=50, stage="Generating dummy clips")
    db.commit()
    db.refresh(job)

    fake_clip_paths = []
    for i in range(2):
        clip_filename = f"job{job.id}_clip{i+1}.mp4"
        clip_path = CLIPS_DIR / clip_filename

        # We don't actually create video data here – just register metadata.
        fake_clip_paths.append(str(clip_path))

        clip = models.Clip(
            job_id=job.id,
            start_time=i * 15.0,
            end_time=i * 15.0 + 10.0,  # 10s long
            emotion_label="dummy",
            peak_score=0.9,
            file_path=str(clip_path),
            thumbnail_path=None,
        )
        db.add(clip)

    update_job_status(job, progress=100, stage="Done", status=models.JobStatus.DONE)
    db.commit()
    db.refresh(job)


def run_worker_loop(poll_interval_seconds: int = 3):
    print("Worker started. Polling for PENDING jobs...")
    while True:
        db = SessionLocal()
        try:
            job = (
                db.query(models.Job)
                .filter(models.Job.status == models.JobStatus.PENDING)
                .order_by(models.Job.created_at.asc())
                .first()
            )

            if job:
                print(f"Processing job {job.id}")
                try:
                    process_job(db, job)
                    print(f"Job {job.id} finished.")
                except Exception as exc:
                    print(f"Job {job.id} failed: {exc}")
                    update_job_status(
                        job,
                        status=models.JobStatus.FAILED,
                        progress=100,
                        stage="Failed",
                        error=str(exc),
                    )
                    db.commit()
            else:
                # No jobs, sleep a bit
                time.sleep(poll_interval_seconds)
        finally:
            db.close()


if __name__ == "__main__":
    run_worker_loop()
# End of worker/worker.py