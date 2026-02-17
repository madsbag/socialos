import { useState } from "react";
import { theme } from "../theme";

const SLIDES = [
  {
    icon: "\u26A1",
    title: "Energy",
    subtitle: "Your Social Battery",
    body: "Every social interaction uses energy \u2014 just like in real life. Each scenario costs Energy to play. When you're low, you need to recharge. This teaches you that being social takes real effort, and it's okay to manage your limits.",
    color: theme.accent,
    bgColor: theme.accentBg,
  },
  {
    icon: "\u2B50",
    title: "XP",
    subtitle: "Experience Points",
    body: "You earn XP by completing scenarios. It doesn't matter if you make 'perfect' choices \u2014 you learn from every path. XP tracks how much practice you've put in, not how 'good' you are.",
    color: theme.xp,
    bgColor: "#FFF8E5",
  },
  {
    icon: "\uD83D\uDCC8",
    title: "Status",
    subtitle: "Your Social Standing",
    body: "Every choice you make changes how others see you. Status goes up when you read the room well, and down when you misread it. Think of it like your reputation meter in an RPG \u2014 it shifts based on your actions.",
    color: theme.info,
    bgColor: "#E8F4FD",
  },
  {
    icon: "\uD83C\uDFF7\uFE0F",
    title: "Reputation Tags",
    subtitle: "What People Call You",
    body: "Your choices earn you labels like 'thoughtful', 'leader', or 'know-it-all'. These stack up over time. In real life, people form impressions the same way \u2014 based on patterns, not single moments.",
    color: theme.purple,
    bgColor: "#F3EEFF",
  },
  {
    icon: "\uD83C\uDFAE",
    title: "How It Works",
    subtitle: "Your Training Ground",
    body: "First, learn the concepts through flashcards. Then practice in real social scenarios with branching choices. Each choice sends signals to others. After each scenario, your AI coach breaks down what happened and why.",
    color: theme.accent,
    bgColor: theme.accentBg,
  },
];

export default function OnboardingScreen({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 20px",
      fontFamily: theme.fontFamily,
    }}>
      {/* Skip */}
      <button
        onClick={onComplete}
        style={{
          position: "absolute",
          top: 20,
          right: 24,
          background: "none",
          border: "none",
          fontSize: 14,
          fontWeight: 600,
          color: theme.textMuted,
          cursor: "pointer",
          fontFamily: theme.fontFamily,
        }}
      >
        Skip
      </button>

      {/* Content */}
      <div style={{
        maxWidth: 400,
        width: "100%",
        textAlign: "center",
      }}>
        {/* Icon circle */}
        <div style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: slide.bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 44,
          margin: "0 auto 28px",
          boxShadow: `0 4px 20px ${slide.color}20`,
        }}>
          {slide.icon}
        </div>

        <div style={{
          fontSize: 12,
          fontWeight: 700,
          color: slide.color,
          letterSpacing: 2,
          marginBottom: 8,
          textTransform: "uppercase",
        }}>
          {slide.subtitle}
        </div>

        <h2 style={{
          fontSize: 32,
          fontWeight: 800,
          color: theme.textPrimary,
          margin: "0 0 16px",
        }}>
          {slide.title}
        </h2>

        <p style={{
          fontSize: 16,
          lineHeight: 1.7,
          color: theme.textSecondary,
          margin: "0 0 40px",
        }}>
          {slide.body}
        </p>

        {/* Button */}
        <button
          onClick={() => isLast ? onComplete() : setCurrent(current + 1)}
          style={{
            width: "100%",
            padding: "14px 28px",
            borderRadius: theme.radiusMd,
            background: slide.color,
            border: "none",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: theme.fontFamily,
            boxShadow: `0 4px 12px ${slide.color}30`,
            transition: "transform 0.15s ease",
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {isLast ? "Let's Go!" : "Next"}
        </button>

        {/* Dots */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 28,
        }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? slide.color : theme.border,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
