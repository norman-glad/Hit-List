import React, { useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/lib/common';
import 'highlight.js/styles/atom-one-dark.css';
import { parseCodeBlock } from '../utils/code';

export default function HitlistItem({
  listId,
  item,
  index,
  editingItem,
  editingValue,
  draggedItem,
  dragOverState,
  onItemDragStart,
  onItemDragOver,
  onItemDrop,
  onItemDragEnd,
  startEditing,
  saveEditing,
  cancelEditing,
  setEditingValue,
  removeItem
}) {
  const isEditing = editingItem && editingItem.listId === listId && editingItem.index === index;
  const isDraggingItem = draggedItem && draggedItem.listId === listId && draggedItem.index === index;
  const dragOverBefore = dragOverState && dragOverState.listId === listId && dragOverState.index === index && dragOverState.position === 'before';
  const dragOverAfter = dragOverState && dragOverState.listId === listId && dragOverState.index === index && dragOverState.position === 'after';

  const parsed = useMemo(() => parseCodeBlock(item.text), [item.text]);
  const highlighted = useMemo(() => {
    if (!parsed.code) return '';
    const lang = parsed.language && hljs.getLanguage(parsed.language) ? parsed.language : 'plaintext';
    return hljs.highlight(parsed.code, { language: lang }).value;
  }, [parsed]);

  return (
    <li
      key={item.id}
      className={`list-item ${dragOverBefore ? 'drag-over-before' : ''} ${dragOverAfter ? 'drag-over-after' : ''} ${isEditing ? 'editing' : ''} ${isDraggingItem ? 'dragging' : ''}`}
      draggable
      onDragStart={(e) => onItemDragStart(e, listId, index)}
      onDragOver={(e) => onItemDragOver(e, listId, index)}
      onDrop={(e) => onItemDrop(e, listId, index)}
      onDragEnd={onItemDragEnd}
    >
      {isEditing ? (
        item.type === 'code' ? (
          <textarea
            className="item-edit-textarea"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') cancelEditing(); }}
            onBlur={saveEditing}
            autoFocus
            rows={6}
          />
        ) : (
          <input
            className="item-edit-input"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') saveEditing(); if (e.key === 'Escape') cancelEditing(); }}
            onBlur={saveEditing}
            autoFocus
          />
        )
      ) : item.type === 'code' ? (
        <>
          <div className="code-item-wrapper">
            {parsed.language && <span className="code-lang-badge">{parsed.language}</span>}
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(parsed.code)} aria-label="Copy code">Copy</button>
            <pre onDoubleClick={() => startEditing(listId, index, item.text)}>
              <code className={`hljs${parsed.language ? ` language-${parsed.language}` : ''}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
            </pre>
          </div>
          <div className="item-actions">
            <button className="remove-item" onClick={() => removeItem(listId, index)}>Remove</button>
          </div>
        </>
      ) : (
        <>
          <span className="item-text" onDoubleClick={() => startEditing(listId, index, item.text)}>{item.text}</span>
          <div className="item-actions">
            <button className="remove-item" onClick={() => removeItem(listId, index)}>Remove</button>
          </div>
        </>
      )}
    </li>
  );
}
