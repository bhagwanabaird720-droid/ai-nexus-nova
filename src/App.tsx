export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #312e81 0%, #000000 65%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          AI Nexus Nova
        </h1>

        <div style={{ display: "flex", gap: "14px" }}>
          <button
            style={{
              background: "transparent",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "10px 18px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            Login
          </button>

          <button
            style={{
              background: "#7c3aed",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 20px",
        }}
      >
        <div
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "10px 20px",
            borderRadius: "999px",
            marginBottom: "30px",
            fontSize: "14px",
            color: "#c4b5fd",
          }}
        >
          🚀 Futuristic AI SaaS Platform
        </div>

        <h1
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            maxWidth: "950px",
            lineHeight: "1.1",
            marginBottom: "24px",
          }}
        >
          Create Faster With Powerful AI Tools
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#cbd5e1",
            maxWidth: "760px",
            lineHeight: "1.7",
          }}
        >
          AI Nexus Nova helps creators, students, businesses and developers
          generate ideas, content, AI chats, scripts and much more with a
          premium futuristic experience.
        </p>

        <div
          style={{
            display: "flex",
            gap: "18px",
            marginTop: "40px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              background: "#7c3aed",
              color: "white",
              border: "none",
              padding: "16px 30px",
              borderRadius: "14px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Start Free
          </button>

          <button
            style={{
              background: "transparent",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "16px 30px",
              borderRadius: "14px",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            Explore Features
          </button>
        </div>
      </section>

      {/* Features */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
          padding: "40px",
        }}
      >
        {[
          "AI Chat Assistant",
          "Image Generation",
          "Content Writing",
          "Study Tools",
          "Social Media AI",
          "Premium Dashboard",
        ].map((item) => (
          <div
            key={item}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              padding: "28px",
              backdropFilter: "blur(10px)",
            }}
          >
            <h3
              style={{
                fontSize: "22px",
                marginBottom: "12px",
              }}
            >
              {item}
            </h3>

            <p
              style={{
                color: "#cbd5e1",
                lineHeight: "1.6",
              }}
            >
              Powerful AI features with premium futuristic UI experience.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
