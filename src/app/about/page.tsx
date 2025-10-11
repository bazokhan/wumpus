"use client";
import React from "react";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";

export default function AboutPage() {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/bazokhan",
      icon: "🐙",
      description: "Check out my open source projects and contributions"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/mohamed-elbaz-776bb8202/",
      icon: "💼",
      description: "Connect with me professionally"
    }
  ];

  const projects = [
    {
      name: "CallDoc PM",
      url: "https://baz.trugraph.io/",
      description: "Project Management presentation website for CallDoc case study",
      tech: "Web Development, Project Management"
    },
    {
      name: "MD2DOCX Converter",
      url: "https://md2docx.trugraph.io/",
      description: "Convert Markdown files to DOCX format with custom styling",
      tech: "Document Processing, Web Tools"
    },
    {
      name: "TruGraph Platform",
      url: "https://www.trugraph.io/",
      description: "Personal platform hosting various web applications and tools",
      tech: "Full-Stack Development, Cloud Infrastructure"
    },
    {
      name: "TOIO Android Game",
      url: "https://play.google.com/store/apps/details?id=com.gamercury.toio&pli=1",
      description: "Mobile puzzle game published on Google Play Store",
      tech: "Android Development, Game Design"
    },
    {
      name: "Gamercury Studio",
      url: "https://sites.google.com/view/gamercurystudio/home",
      description: "Game development studio showcasing various projects",
      tech: "Game Development, Studio Management"
    },
    {
      name: "Tile Editor",
      url: "https://tile-editor.vercel.app/",
      description: "Web-based tile editor for game development",
      tech: "Web Development, Canvas API, Game Tools"
    },
    {
      name: "Encryption Tool",
      url: "https://encryption-wine.vercel.app/",
      description: "Web application for encryption and decryption operations",
      tech: "Cryptography, Web Security, JavaScript"
    }
  ];

  return (
    <PageLayout>
      <main
        style={{
          padding: "20px",
          maxWidth: "1000px",
          margin: "0 auto",
          fontFamily: "system-ui, -apple-system, sans-serif",
          minHeight: "100vh",
        }}
      >
      {/* Header */}
      <div
        style={{
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "36px",
            fontWeight: "bold",
            margin: "0 0 16px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          👨‍💻 About Me
        </h1>
        <p
          style={{
            color: "#888",
            fontSize: "18px",
            margin: 0,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: "1.6",
          }}
        >
          Get to know the developer behind this Wumpus World implementation
        </p>
      </div>

      {/* Profile Section */}
      <section
        style={{
          backgroundColor: "#1a1a1a",
          padding: "40px",
          borderRadius: "12px",
          border: "2px solid #333",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "30px",
            alignItems: "center",
          }}
        >
          {/* Profile Image */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "4px solid #4CAF50",
                boxShadow: "0 0 20px rgba(76, 175, 80, 0.3)",
              }}
            >
              <Image
                src="/me.webp"
                alt="Mohamed Elbaz"
                width={150}
                height={150}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </div>

          {/* Profile Information */}
          <div>
            <h2
              style={{
                color: "#fff",
                fontSize: "28px",
                fontWeight: "bold",
                margin: "0 0 12px 0",
              }}
            >
              Mohamed Elbaz
            </h2>
            <h3
              style={{
                color: "#4CAF50",
                fontSize: "18px",
                fontWeight: "600",
                margin: "0 0 8px 0",
              }}
            >
              Student, Professional Master&apos;s in Cloud Computing Networks
            </h3>
            <p
              style={{
                color: "#ccc",
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "0 0 20px 0",
              }}
            >
              A dedicated student pursuing the Professional Master&apos;s degree in Cloud Computing Networks 
              at <strong style={{ color: "#FFD700" }}>Cairo University&apos;s Faculty of Computer Science and Artificial Intelligence</strong>.
            </p>
            
            {/* Social Links */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 20px",
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#333";
                    e.currentTarget.style.borderColor = "#4CAF50";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#0a0a0a";
                    e.currentTarget.style.borderColor = "#333";
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{link.icon}</span>
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Background Section */}
      <section
        style={{
          backgroundColor: "#1a1a1a",
          padding: "30px",
          borderRadius: "12px",
          border: "2px solid #333",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            color: "#2196F3",
            fontSize: "24px",
            fontWeight: "bold",
            margin: "0 0 20px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🎓 Educational Background
        </h2>
        <div
          style={{
            color: "#fff",
            lineHeight: "1.7",
            fontSize: "16px",
          }}
        >
          <p style={{ margin: "0 0 16px 0" }}>
            Currently pursuing advanced studies in Cloud Computing Networks, focusing on modern 
            distributed systems, network architecture, and scalable infrastructure design. 
            My academic journey combines theoretical computer science foundations with 
            practical applications in cloud technologies.
          </p>
          <p style={{ margin: "0" }}>
            The Wumpus World implementation you&apos;re experiencing is a demonstration of my passion 
            for combining classical AI concepts with modern web technologies, showcasing skills 
            in full-stack development, game logic implementation, and user interface design.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section
        style={{
          backgroundColor: "#1a1a1a",
          padding: "30px",
          borderRadius: "12px",
          border: "2px solid #333",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            color: "#FFD700",
            fontSize: "24px",
            fontWeight: "bold",
            margin: "0 0 20px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🚀 Projects & Portfolio
        </h2>
        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          {projects.map((project, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#0a0a0a",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #444",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#4CAF50";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#444";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      color: "#fff",
                      fontSize: "18px",
                      fontWeight: "bold",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {project.name}
                  </h3>
                  <p
                    style={{
                      color: "#ccc",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {project.description}
                  </p>
                  <div
                    style={{
                      color: "#888",
                      fontSize: "12px",
                      fontStyle: "italic",
                    }}
                  >
                    {project.tech}
                  </div>
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    transition: "background-color 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#45a049";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#4CAF50";
                  }}
                >
                  Visit →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section
        style={{
          backgroundColor: "#1a1a1a",
          padding: "30px",
          borderRadius: "12px",
          border: "2px solid #333",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            color: "#FF6B6B",
            fontSize: "24px",
            fontWeight: "bold",
            margin: "0 0 20px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          💻 Technical Skills
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#0a0a0a",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #444",
            }}
          >
            <h4 style={{ color: "#4CAF50", margin: "0 0 12px 0" }}>
              🌐 Web Development
            </h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#ccc" }}>
              React, Next.js, TypeScript, Node.js, HTML5, CSS3, Tailwind CSS
            </p>
          </div>
          <div
            style={{
              backgroundColor: "#0a0a0a",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #444",
            }}
          >
            <h4 style={{ color: "#2196F3", margin: "0 0 12px 0" }}>
              ☁️ Cloud & Infrastructure
            </h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#ccc" }}>
              AWS, Azure, Docker, Kubernetes, CI/CD, Microservices
            </p>
          </div>
          <div
            style={{
              backgroundColor: "#0a0a0a",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #444",
            }}
          >
            <h4 style={{ color: "#FFD700", margin: "0 0 12px 0" }}>
              🎮 Game Development
            </h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#ccc" }}>
              Unity, Android Development, Game Design, Canvas API
            </p>
          </div>
          <div
            style={{
              backgroundColor: "#0a0a0a",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #444",
            }}
          >
            <h4 style={{ color: "#9C27B0", margin: "0 0 12px 0" }}>
              🤖 AI & Machine Learning
            </h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#ccc" }}>
              Python, TensorFlow, Classical AI, Knowledge Representation
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "30px",
          color: "#888",
          fontSize: "14px",
          borderTop: "1px solid #333",
        }}
      >
        <p style={{ margin: "0 0 8px 0" }}>
          Interested in collaborating or have questions?
        </p>
        <a
          href="https://www.linkedin.com/in/mohamed-elbaz-776bb8202/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#4CAF50",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          💼 Let&apos;s Connect on LinkedIn →
        </a>
      </div>
      </main>
    </PageLayout>
  );
}
