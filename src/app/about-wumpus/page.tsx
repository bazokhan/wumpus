"use client";
import React from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export default function AboutWumpusPage() {
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
          🗺️ About Wumpus World
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
          Discover the fascinating history and significance of this classic artificial intelligence problem
        </p>
      </div>

      {/* History Section */}
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
            color: "#4CAF50",
            fontSize: "24px",
            fontWeight: "bold",
            margin: "0 0 20px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          📜 Historical Origins
        </h2>
        <div
          style={{
            color: "#fff",
            lineHeight: "1.7",
            fontSize: "16px",
          }}
        >
          <p style={{ margin: "0 0 16px 0" }}>
            Wumpus World, originally called &quot;Hunt the Wumpus,&quot; was created by <strong style={{ color: "#FFD700" }}>Gregory Yob</strong> in 1973. 
            Yob designed this game as a response to the then-popular &quot;Hunt the Wumpus&quot; text adventure game, 
            but with a twist that would make it perfect for artificial intelligence research.
          </p>
          <p style={{ margin: "0 0 16px 0" }}>
            The game was conceived as a simplified environment where an intelligent agent must navigate through 
            a cave system filled with dangers, using only partial information to make rational decisions. 
            This made it an ideal testbed for exploring concepts in artificial intelligence, particularly 
            knowledge representation and reasoning under uncertainty.
          </p>
          <p style={{ margin: "0" }}>
            What started as a simple game concept has become one of the most influential problems in AI education, 
            appearing in countless textbooks, courses, and research papers over the past five decades.
          </p>
        </div>
      </section>

      {/* Cultural Impact Section */}
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
          🧠 Cultural Impact in AI
        </h2>
        <div
          style={{
            color: "#fff",
            lineHeight: "1.7",
            fontSize: "16px",
          }}
        >
          <h3 style={{ color: "#FFD700", fontSize: "18px", margin: "0 0 12px 0" }}>
            Educational Significance
          </h3>
          <p style={{ margin: "0 0 16px 0" }}>
            Wumpus World has become a cornerstone in AI education because it elegantly demonstrates 
            several fundamental concepts:
          </p>
          <ul style={{ margin: "0 0 20px 20px", padding: 0 }}>
            <li style={{ marginBottom: "8px" }}>
              <strong style={{ color: "#4CAF50" }}>Percept-Action Paradigm:</strong> Agents receive 
              sensory information (breeze, stench, glitter) and must decide on actions (move, shoot, grab)
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong style={{ color: "#4CAF50" }}>Logical Reasoning:</strong> Players must use 
              propositional logic to infer the locations of hazards from sensory cues
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong style={{ color: "#4CAF50" }}>Uncertainty Handling:</strong> The environment 
              is partially observable, requiring probabilistic reasoning
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong style={{ color: "#4CAF50" }}>Rational Agent Design:</strong> Demonstrates 
              how to build agents that maximize expected utility
            </li>
          </ul>
          
          <h3 style={{ color: "#FFD700", fontSize: "18px", margin: "0 0 12px 0" }}>
            Research Applications
          </h3>
          <p style={{ margin: "0" }}>
            Beyond education, Wumpus World has been used in research on machine learning, 
            reinforcement learning, multi-agent systems, and human-AI interaction. Its simple 
            yet rich environment makes it perfect for testing new algorithms and approaches 
            to artificial intelligence.
          </p>
        </div>
      </section>

      {/* Importance Section */}
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
          ⭐ Why Wumpus World Matters
        </h2>
        <div
          style={{
            color: "#fff",
            lineHeight: "1.7",
            fontSize: "16px",
          }}
        >
          <p style={{ margin: "0 0 16px 0" }}>
            Wumpus World represents a perfect balance between simplicity and complexity. 
            It&apos;s simple enough for beginners to understand, yet complex enough to challenge 
            advanced AI systems. This makes it an ideal benchmark for:
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              margin: "20px 0",
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
                🎯 Algorithm Testing
              </h4>
              <p style={{ margin: 0, fontSize: "14px", color: "#ccc" }}>
                Perfect environment for testing search algorithms, logical inference, 
                and decision-making strategies
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
                🧠 Learning Platform
              </h4>
              <p style={{ margin: 0, fontSize: "14px", color: "#ccc" }}>
                Excellent for teaching AI concepts without overwhelming complexity, 
                making it accessible to students at all levels
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
                🔬 Research Tool
              </h4>
              <p style={{ margin: 0, fontSize: "14px", color: "#ccc" }}>
                Widely used in academic research for studying agent behavior, 
                multi-agent systems, and human-AI collaboration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
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
            color: "#9C27B0",
            fontSize: "24px",
            fontWeight: "bold",
            margin: "0 0 20px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          📚 References & Further Reading
        </h2>
        <div
          style={{
            color: "#fff",
            lineHeight: "1.7",
            fontSize: "16px",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "16px",
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
              <h4 style={{ color: "#4CAF50", margin: "0 0 8px 0" }}>
                📖 Primary Textbook
              </h4>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                Russell, S. J., & Norvig, P. (2020). <em>Artificial Intelligence: A Modern Approach</em> (4th ed.). 
                Prentice Hall. Chapter 7: Logical Agents
              </p>
              <a
                href="https://aima.cs.berkeley.edu/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#4CAF50",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                🔗 Official AIMA Website →
              </a>
            </div>

            <div
              style={{
                backgroundColor: "#0a0a0a",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #444",
              }}
            >
              <h4 style={{ color: "#2196F3", margin: "0 0 8px 0" }}>
                🎮 Original Game
              </h4>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                Yob, G. (1973). Hunt the Wumpus. <em>Creative Computing</em>, Vol. 1, No. 1.
              </p>
              <a
                href="https://www.atariarchives.org/bcc1/showpage.php?page=247"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#2196F3",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                🔗 Original Article →
              </a>
            </div>

            <div
              style={{
                backgroundColor: "#0a0a0a",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #444",
              }}
            >
              <h4 style={{ color: "#FFD700", margin: "0 0 8px 0" }}>
                🎓 Educational Resources
              </h4>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                Stanford CS221: Artificial Intelligence course materials and assignments
              </p>
              <a
                href="https://stanford-cs221.github.io/autumn2021/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#FFD700",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                🔗 Stanford CS221 →
              </a>
            </div>

            <div
              style={{
                backgroundColor: "#0a0a0a",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #444",
              }}
            >
              <h4 style={{ color: "#FF6B6B", margin: "0 0 8px 0" }}>
                🔬 Research Papers
              </h4>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                Academic papers on Wumpus World applications in machine learning and multi-agent systems
              </p>
              <a
                href="https://scholar.google.com/scholar?q=wumpus+world+artificial+intelligence"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#FF6B6B",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                🔗 Google Scholar →
              </a>
            </div>
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
          Ready to test your logical reasoning skills?
        </p>
        <Link
          href="/"
          style={{
            color: "#4CAF50",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          🎮 Play Wumpus World Now →
        </Link>
      </div>
      </main>
    </PageLayout>
  );
}
