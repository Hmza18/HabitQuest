import { useEffect, useRef } from 'react';
import { EMOJIS } from '../utils/constants';

export default function EmojiPicker({ selected, onSelect, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div className="emoji-picker" ref={ref}>
      <div className="emoji-grid">
        {EMOJIS.map(emoji => (
          <button
            key={emoji}
            type="button"
            className={`emoji-option${emoji === selected ? ' selected' : ''}`}
            aria-label={emoji}
            onClick={() => { onSelect(emoji); onClose(); }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
