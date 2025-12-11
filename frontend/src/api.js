const API_BASE = "http://localhost:8000";

export async function createJobFromUrl(videoUrl) {
  const resp = await fetch(`${API_BASE}/jobs/from-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ video_url: videoUrl }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to create job: ${resp.status} ${text}`);
  }

  const data = await resp.json();
  return data.job_id;
}

export async function getJob(jobId) {
  const resp = await fetch(`${API_BASE}/jobs/${jobId}`);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to fetch job: ${resp.status} ${text}`);
  }
  return resp.json();
}

export { API_BASE };
