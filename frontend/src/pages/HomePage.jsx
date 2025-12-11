// src/pages/HomePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../layout/Shell";
import { createJobFromUrl } from "../api";
import { isSupportedClipUrl } from "../utils/urlValidation";

export default function HomePage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loadingJob, setLoadingJob] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmed = videoUrl.trim();
    if (!trimmed) {
      setError("Please paste a video URL.");
      return;
    }

    if (!isSupportedClipUrl(trimmed)) {
      setError(
        "Please enter a valid YouTube, TikTok, or Instagram Reel URL."
      );
      return;
    }

    try {
      setLoadingJob(true);
      const jobId = await createJobFromUrl(trimmed);

      // ✅ Navigate to Clip Generator page
      navigate(`/generator/${jobId}?url=${encodeURIComponent(trimmed)}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create job.");
    } finally {
      setLoadingJob(false);
    }
  };

  return (
    <Shell>
      <section className="hero">
        <h1>
          Turn Long Videos into <span className="accent">Viral Clips</span>
        </h1>
        <p className="hero-subtitle">
          Paste a YouTube, TikTok, or Instagram Reel link. CLIPZZ finds emotional
          peaks, hooks, and highlights — then slices them into short clips.
        </p>

        <form className="url-form" onSubmit={handleSubmit}>
          <input
            type="url"
            className="url-input"
            placeholder="Paste YouTube / TikTok / Instagram Reel URL..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <button
            className="submit-button"
            type="submit"
            disabled={loadingJob}
          >
            {loadingJob ? "Creating job..." : "Generate Clips"}
          </button>
        </form>

        {error && <div className="error-banner">{error}</div>}
      </section>
    </Shell>
  );
}
// End of HomePage.jsx