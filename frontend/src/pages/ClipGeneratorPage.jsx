// src/pages/ClipGeneratorPage.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Shell from "../layout/Shell";
import { getJob, API_BASE } from "../api";
import { generateCaptionForEmotion, computeDominantEmotion } from "../utils/emotion";

export default function ClipGeneratorPage() {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const pollIntervalRef = useRef(null);

  const searchParams = new URLSearchParams(location.search);
  const originalUrl = searchParams.get("url") || "";

  useEffect(() => {
    const fetchOnce = async () => {
      try {
        const data = await getJob(jobId);
        setJob(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchOnce();

    // Poll until DONE / FAILED
    pollIntervalRef.current = setInterval(async () => {
      try {
        const data = await getJob(jobId);
        setJob(data);
        if (data.status === "DONE" || data.status === "FAILED") {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }, 2000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [jobId]);

  const overallEmotion = computeDominantEmotion(job?.clips || []);

  const renderStatusBadge = () => {
    if (!job) return null;
    const status = job.status;
    let className = "status-badge";
    if (status === "DONE") className += " status-done";
    else if (status === "FAILED") className += " status-failed";
    else className += " status-pending";
    return <span className={className}>{status}</span>;
  };

  const renderProgressBar = () => {
    if (!job) return null;
    const progress = job.progress ?? 0;
    return (
      <div className="progress-bar">
        <div
          className="progress-bar-inner"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  const handleSaveClips = () => {
    if (!job || job.status !== "DONE" || !job.clips?.length) return;
    // ✅ send job & url to My Clips page
    navigate("/my-clips", { state: { job, originalUrl } });
  };

  const longVideoEmbed = (() => {
    if (!originalUrl) return null;
    try {
      const u = new URL(originalUrl);
      const host = u.hostname.toLowerCase();

      if (host.includes("youtube.com") || host.includes("youtu.be")) {
        let videoId = u.searchParams.get("v");
        if (!videoId && host.includes("youtu.be")) {
          videoId = u.pathname.slice(1);
        }
        if (!videoId) return null;
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
          <iframe
            className="long-video-embed"
            src={embedUrl}
            title="Source video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }

      // For TikTok / IG just show link
      return (
        <a
          href={originalUrl}
          target="_blank"
          rel="noreferrer"
          className="long-video-link"
        >
          Open original video
        </a>
      );
    } catch {
      return null;
    }
  })();

  return (
    <Shell>
      <section className="hero">
        <h1>
          Clip <span className="accent">Generator</span>
        </h1>
        <p className="hero-subtitle">
          Analysing your video for emotional peaks and highlights. Clips will
          appear once processing is done.
        </p>
      </section>

      {error && <div className="error-banner">{error}</div>}

      {originalUrl && (
        <div className="long-video-card">
          <div className="long-video-header">
            <span className="meta-label">Source Video</span>
            <a
              href={originalUrl}
              target="_blank"
              rel="noreferrer"
              className="meta-value"
            >
              {originalUrl}
            </a>
          </div>
          <div className="long-video-body">{longVideoEmbed}</div>
          {overallEmotion && (
            <div className="emotion-summary">
              <span className="meta-label">Dominant Emotion</span>
              <span className="meta-value-strong">
                {overallEmotion.label} (
                {(overallEmotion.prob * 100).toFixed(1)}%)
              </span>
            </div>
          )}
        </div>
      )}

      {job && (
        <section className="job-section">
          <div className="job-header">
            <div>
              <h2>Job #{jobId}</h2>
              <p className="job-stage">{job.stage}</p>
            </div>
            {renderStatusBadge()}
          </div>

          {renderProgressBar()}

          <div className="job-meta">
            <div>
              <span className="meta-label">Created</span>
              <span className="meta-value">
                {new Date(job.created_at).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="meta-label">Updated</span>
              <span className="meta-value">
                {new Date(job.updated_at).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="clips-header">
            <h3>Generated Clips</h3>
            <span className="clips-count">
              {job.clips?.length || 0} clip(s)
            </span>
          </div>

          {job.clips && job.clips.length > 0 ? (
            <div className="clips-grid">
              {job.clips.map((clip, idx) => {
                const start = clip.start_time.toFixed(1);
                const end = clip.end_time.toFixed(1);
                const url = `${API_BASE}/${clip.file_path}`;
                const caption = generateCaptionForEmotion(
                  clip.emotion_label
                );

                return (
                  <div key={clip.id} className="clip-card">
                    <div className="clip-thumb">
                      <video src={url} controls className="clip-video" />
                      <div className="clip-overlay">
                        <span>Clip #{idx + 1}</span>
                        <span>
                          {start}s – {end}s
                        </span>
                      </div>
                    </div>
                    <div className="clip-info">
                      <div className="clip-meta-row">
                        <span className="meta-label-small">Emotion</span>
                        <span className="meta-value-strong">
                          {clip.emotion_label || "N/A"}
                        </span>
                      </div>
                      <div className="clip-meta-row">
                        <span className="meta-label-small">Score</span>
                        <span className="meta-value">
                          {clip.peak_score != null
                            ? clip.peak_score.toFixed(2)
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="clip-caption">
                      <span className="meta-label-small">AI Caption</span>
                      <p className="caption-text">{caption}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-clips">
              {job.status === "DONE"
                ? "No clips were generated for this job."
                : "Clips will appear here once processing is done."}
            </p>
          )}

          {job?.status === "DONE" && job.clips?.length > 0 && (
            <button
              className="save-clips-button"
              onClick={handleSaveClips}
            >
              Save Clips
            </button>
          )}
        </section>
      )}
    </Shell>
  );
}
// End of ClipGeneratorPage.jsx