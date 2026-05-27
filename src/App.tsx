export default function App() {
  return (
    <div
      style={{
        background:
          "radial-gradient(circle at top, #3b1fa1 0%, #0a0a0a 60%)",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "100px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <img
         src="/favicon.png"
            alt="AIVIO"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "12px",
              boxShadow: "0 0 20px #7c3aed",
            }}
          />

          <h1
            style={{
              fontSize: "28px",
              margin: 0,
            }}
          >
            AIVIO
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
          }}
        >
          <button
            style={{
              background: "transparent",
              border: "1px solid #555",
              color: "white",
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
              border: "none",
              color: "white",
              padding: "10px 20px",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: "0 0 20px #7c3aed",
            }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          marginTop: "80px",
        }}
      >
        <p
          style={{
            color: "#c084fc",
            marginBottom: "20px",
            fontSize: "18px",
          }}
        >
          🚀 Futuristic AI SaaS Platform
        </p>

        <h2
          style={{
            fontSize: "60px",
            marginBottom: "20px",
            lineHeight: "1.1",
          }}
        >
          Create Faster With
          <br />
          Powerful AI Tools
        </h2>

        <p
          style={{
            color: "#b3b3b3",
            maxWidth: "700px",
            margin: "0 auto",
            fontSize: "20px",
            lineHeight: "1.8",
          }}
        >
          AIVIO helps creators, students, businesses and developers
          generate ideas, AI chats, content and much more with a
          futuristic premium experience.
        </p>

        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              background: "#7c3aed",
              border: "none",
              color: "white",
              padding: "16px 28px",
              borderRadius: "14px",
              fontSize: "18px",
              cursor: "pointer",
              boxShadow: "0 0 25px #7c3aed",
            }}
          >
            Start Free
          </button>

          <button
            style={{
              background: "transparent",
              border: "1px solid #555",
              color: "white",
              padding: "16px 28px",
              borderRadius: "14px",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            Explore Features
          </button>
        </div>
      </div>
    </div>
  );
}
