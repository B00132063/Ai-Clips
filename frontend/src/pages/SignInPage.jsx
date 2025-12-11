// src/pages/SignInPage.jsx
import Shell from "../layout/Shell";

export default function SignInPage() {
  const exportOptions = [
    {
      name: "Instagram Reels",
      description: "Send clips directly to your Reels library.",
      url: "https://www.instagram.com/",
    },
    {
      name: "TikTok",
      description: "Upload clips straight to TikTok.",
      url: "https://www.tiktok.com/login",
    },
    {
      name: "YouTube Shorts",
      description: "Publish as Shorts via YouTube Studio.",
      url: "https://studio.youtube.com/",
    },
  ];

  return (
    <Shell>
      <section className="hero">
        <h1>
          Export <span className="accent">Anywhere</span>
        </h1>
        <p className="hero-subtitle">
          Connect your social accounts to export your clips directly to TikTok,
          Instagram Reels, and YouTube Shorts.
        </p>
      </section>

      <section className="export-grid">
        {exportOptions.map((opt) => (
          <div key={opt.name} className="export-card">
            <h3>{opt.name}</h3>
            <p>{opt.description}</p>
            <button
              className="export-connect"
              onClick={() => window.open(opt.url, "_blank")}
            >
              Connect
            </button>
          </div>
        ))}
      </section>
    </Shell>
  );
}
// End of SignInPage.jsx