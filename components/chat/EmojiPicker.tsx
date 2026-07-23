"use client";

const EMOJIS = [
  "😀", "😊", "🙂", "😉", "😍", "🤝", "👍", "👋",
  "🙏", "💡", "✅", "❤️", "🔥", "⭐", "🎉", "💬",
  "📱", "💻", "🌐", "🚀", "📸", "🎥", "📎", "✨",
  "🤔", "😅", "👏", "💪", "📧", "🏆", "🎯", "⚡",
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">Emoji</span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-text-muted hover:text-text-primary"
        >
          Close
        </button>
      </div>
      <div className="grid grid-cols-8 gap-1">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            className="rounded-lg p-1.5 text-lg transition-colors hover:bg-surface"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
