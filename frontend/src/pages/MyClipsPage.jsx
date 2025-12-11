// src/pages/MyClipsPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import Shell from "../layout/Shell";
import { API_BASE } from "../api";
import { generateCaptionForEmotion } from "../utils/emotion";

export default function MyClipsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const job = state.job || null;
  const originalUrl = state.originalUrl || "";

  return (
    <Shell>
      <section className="hero">
        <h1>
          My <span className="accent">Clips</span>
        </h1>
        <p className="hero-subtitle">
          Saved clips from your latest processing job. From here you can export
          to TikTok, Instagram Reels, or YouTube Shorts.
        </p>
      </section>

      {!job ? (
        <div className="error-banner">
          No clips loaded. Generate clips first, then press{" "}
          <strong>Save Clips</strong> on the generator page.
          <div style={{ marginTop: 8 }}>
            <button
              className="submit-button"
              type="button"
              onClick={() => navigate("/")}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <>
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
            </div>
          )}

          <section className="job-section">
            <div className="clips-header">
              <h3>Saved Clips (Job #{job.id})</h3>
              <span className="clips-count">
                {job.clips?.length || 0} clip(s)
              </span>
            </div>

            <div className="clips-grid">
              {job.clips.map((clip, idx) => {
                const start = clip.start_time.toFixed(1);
                const end = clip.end_time.toFixed(1);
                const url = `${API_BASE}/${clip.file_path}`;
                const caption = generateCaptionForEmotion(clip.emotion_label);

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
          </section>
        </>
      )}
    </Shell>
  );
}
// End of MyClipsPage.jsx