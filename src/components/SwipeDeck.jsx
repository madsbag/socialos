import { useState } from "react";
import { theme } from "../theme";

export default function SwipeDeck({ cards, onComplete, chapterColor }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards || cards.length === 0) return null;

  const card = cards[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === cards.length - 1;

  function goNext() {
    if (isLast) {
      onComplete();
    } else {
      setFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  }

  function goPrev() {
    if (!isFirst) {
      setFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  }

  return (
    <div style={{ fontFamily: theme.fontFamily }}>
      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          width: "100%",
          minHeight: 320,
          background: flipped
            ? `linear-gradient(160deg, ${chapterColor}12, ${theme.surface})`
            : theme.surface,
          borderRadius: theme.radiusLg,
          border: `2px solid ${chapterColor}30`,
          boxShadow: theme.shadowMd,
          padding: 28,
          cursor: "pointer",
          transition: "background 0.3s ease",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {!flipped ? (
          /* FRONT */
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: chapterColor,
              letterSpacing: 2,
              marginBottom: 24,
              textTransform: "uppercase",
            }}>
              Tap to flip
            </div>
            <div style={{
              fontSize: 22,
              fontWeight: 800,
              color: theme.textPrimary,
              lineHeight: 1.4,
            }}>
              {card.front}
            </div>
          </div>
        ) : (
          /* BACK */
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: chapterColor,
              letterSpacing: 2,
              marginBottom: 12,
              textTransform: "uppercase",
            }}>
              Explanation
            </div>
            <div style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: theme.textPrimary,
              marginBottom: 16,
            }}>
              {card.back}
            </div>
            <div style={{
              padding: "12px 14px",
              background: `${chapterColor}10`,
              borderRadius: theme.radiusSm,
              borderLeft: `3px solid ${chapterColor}`,
            }}>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                color: chapterColor,
                letterSpacing: 2,
                marginBottom: 6,
              }}>
                REAL-WORLD EXAMPLE
              </div>
              <div style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: theme.textSecondary,
              }}>
                {card.example}
              </div>
            </div>
          </div>
        )}

        {/* Tap hint at bottom */}
        <div style={{
          textAlign: "center",
          fontSize: 12,
          color: theme.textMuted,
          marginTop: 20,
        }}>
          {flipped ? "Tap to see concept" : "Tap to see explanation"}
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
        gap: 12,
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          disabled={isFirst}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: `1px solid ${theme.border}`,
            background: isFirst ? theme.bg : theme.surface,
            color: isFirst ? theme.textMuted : theme.textPrimary,
            fontSize: 20,
            cursor: isFirst ? "default" : "pointer",
            opacity: isFirst ? 0.4 : 1,
            fontFamily: theme.fontFamily,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isFirst ? "none" : theme.shadow,
            transition: "all 0.2s ease",
          }}
        >
          {"←"}
        </button>

        {/* Progress */}
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: theme.textPrimary,
            marginBottom: 8,
          }}>
            {currentIndex + 1} of {cards.length}
          </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
          }}>
            {cards.map((_, i) => (
              <div key={i} style={{
                width: i === currentIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i < currentIndex ? chapterColor : i === currentIndex ? chapterColor : theme.border,
                opacity: i < currentIndex ? 0.5 : 1,
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: isLast ? "none" : `1px solid ${theme.border}`,
            background: isLast ? chapterColor : theme.surface,
            color: isLast ? "#fff" : theme.textPrimary,
            fontSize: 20,
            cursor: "pointer",
            fontFamily: theme.fontFamily,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isLast ? `0 4px 12px ${chapterColor}30` : theme.shadow,
            transition: "all 0.2s ease",
          }}
        >
          {isLast ? "✓" : "→"}
        </button>
      </div>
    </div>
  );
}
