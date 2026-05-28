export default function App() {
  return (
    <div
      style={{
        background:
          "radial-gradient(circle at top, #3b1fa1 0%, #050505 70%)",
        minHeight: "100vh",
        color: "white",
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
            alt="logo"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "14px",
              boxShadow: "0 0 25px #8b5cf6",
            }}
          />

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
            }}
          >
            AIVIO
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
          }}
        >
          <button
            style={{
              background: "transparent",
              border: "1px solid #666",
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

      {/* Hero */}
      <div
        style={{
          textAlign: "center",
          marginTop: "120px",
        }}
      >
        <p
          style={{
            color: "#c084fc",
            fontSize: "18px",
          }}
        >
          🚀 Futuristic AI SaaS Platform
        </p>

        <h2
          style={{
            fontSize: "58px",
            lineHeight: "1.1",
            marginTop: "20px",
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
            margin: "30px auto",
            lineHeight: "1.8",
            fontSize: "20px",
          }}
        >
          AIVIO helps creators, students, businesses and developers
          generate ideas, AI chats, content and much more with a
          futuristic premium experience.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "40px",
          }}
        >
          <button
            style={{
              background: "#7c3aed",
              border: "none",
              color: "white",
              padding: "16px 30px",
              borderRadius: "14px",
              fontSize: "18px",
              cursor: "pointer",
              boxShadow: "0 0 30px #7c3aed",
            }}
          >
            Start Free
          </button>

          <button
            style={{
              background: "transparent",
              border: "1px solid #666",
              color: "white",
              padding: "16px 30px",
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
