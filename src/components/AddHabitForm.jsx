import { useState, useRef } from 'react';
import EmojiPicker from './EmojiPicker';

export default function AddHabitForm({ onAdd }) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('💧');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      inputRef.current?.focus();
      return;
    }
    onAdd(name, emoji);
    setName('');
    inputRef.current?.blur();
  };

  return (
    <footer className="add-habit-bar">
      <form className="add-habit-form" onSubmit={handleSubmit}>
        <button
          type="button"
          className="emoji-btn"
          title="Pick emoji"
          onClick={() => setPickerOpen(o => !o)}
        >
          {emoji}
        </button>
        <input
          ref={inputRef}
          type="text"
          className={`habit-input${shake ? ' shake' : ''}`}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Add a new habit..."
          maxLength={40}
          autoComplete="off"
        />
        <button type="submit" className="add-btn">Add</button>
      </form>

      {pickerOpen && (
        <EmojiPicker
          selected={emoji}
          onSelect={setEmoji}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </footer>
  );
}
