import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { createReactEditorJS } from 'react-editor-js';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import { Redactor } from '@texttree/notepad-rcl';

const ReactEditorJS = createReactEditorJS({
  tools: {
    header: Header,
    paragraph: Paragraph,
  },
});

export default function NotePad({ open, onClose }) {
  const editorCore = useRef(null);
  const [shouldRenderEditor, setShouldRenderEditor] = useState(false);
  const [editorData, setEditorData] = useState(null);
  const [note, setNote] = useState('');
  console.log('adfgsadf',note);
  const [isTyping, setIsTyping] = useState(false);
  // Wait for dialog open before mounting the editor
  useEffect(() => {
    if (open) {
      setShouldRenderEditor(true);
    } else {
      setShouldRenderEditor(false);
    }
  }, [open]);

  const handleSave = async () => {
    const editorData = await editorCore.current.save();
    console.log('Saved editor data:', editorData);

    // Replace with actual API
    await fetch('/api/save-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: editorData }),
    });

    alert('Note saved!');
    onClose();
  };

  // Debounce logic (500ms after user stops typing)
  let typingTimeout = null;
  const handleChange = (e) => {
    const newText = e.target.value;
    setNote(newText);
    setIsTyping(true);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    typingTimeout = setTimeout(() => {
      // sendToAPI(newText);
      setIsTyping(false);
    }, 500);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth >
      <DialogTitle>Patient Medicine Routine</DialogTitle>
      <DialogContent>
        <div style={{ padding: 0 }}>
          <textarea
            rows="25"
            cols="50"
            value={note}
            onChange={handleChange}
            placeholder="Start typing..."
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              resize: 'none',
            }}
          />
          {/* {isTyping && <p>Saving...</p>} */}
        </div>
        {/* <div style={{ minHeight: 200 }}>
          {shouldRenderEditor && (
            <ReactEditorJS
            onInitialize={(instance) => {
              editorCore.current = instance;
            }}
            defaultValue={{
              time: new Date().getTime(),
              blocks: [
                {
                  type: "header",
                  data: { text: "Medicine Routine", level: 2 },
                },
                {
                  type: "paragraph",
                  data: {
                    text: "Morning: Paracetamol\nEvening: Vitamin C",
                  },
                },
              ],
            }}
            />
          )}
        </div> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
