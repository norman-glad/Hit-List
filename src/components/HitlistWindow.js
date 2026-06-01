import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { PALETTE } from '../constants';
import HitlistItem from './HitlistItem';

export default function HitlistWindow({
  list,
  nodeRef,
  isDragging,
  isFocused,
  isSelected,
  paletteOpenId,
  draggingIds,
  setDraggingIds,
  selectedIds,
  handleDragStop,
  setListColor,
  updateListTitle,
  setPaletteOpenId,
  closeList,
  toggleSelect,
  addItem,
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
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeText, setCodeText] = useState('');

  const handleAddCode = () => {
    if (codeText.trim()) {
      addItem(list.id, codeText.trim(), 'code');
      setCodeText('');
      setShowCodeInput(false);
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      defaultPosition={list.position || { x: 0, y: 0 }}
      handle=".window-header"
      onStart={() => setDraggingIds(s => Array.from(new Set([...s, list.id])))}
      onStop={(e, data) => { setDraggingIds(s => s.filter(i => i !== list.id)); handleDragStop(list.id, e, data); }}
    >
      <div ref={nodeRef} style={{ ['--accent-color']: list.color || PALETTE[0] }} className={`window ${isDragging ? 'dragging' : ''} ${isFocused ? 'focused' : ''} ${isSelected ? 'selected' : ''}`}>
        <div className="window-header">
          <input
            type="checkbox"
            className="select-checkbox"
            checked={isSelected}
            onChange={() => toggleSelect(list.id)}
            aria-label="Select list"
          />
          <input
            className="list-input title"
            value={list.title}
            onChange={(e) => updateListTitle(list.id, e.target.value)}
          />
          <div className="window-controls">
            <button className={`color-btn ${paletteOpenId === list.id ? 'open' : ''}`} aria-label="Pick color" onClick={() => setPaletteOpenId(paletteOpenId === list.id ? null : list.id)}>
              <span className="color-indicator" style={{ background: list.color || PALETTE[0] }} />
            </button>
            {paletteOpenId === list.id && (
              <div className="color-palette" role="dialog" aria-label="Color palette">
                {PALETTE.map(c => (
                  <button key={c} className={`color-swatch ${list.color === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => setListColor(list.id, c)} aria-label={`Set color ${c}`} />
                ))}
              </div>
            )}
            <button className="close-btn" onClick={() => closeList(list.id)}>×</button>
          </div>
        </div>
        <ul className="list-items">
          {list.items.map((item, index) => (
            <HitlistItem
              key={item.id}
              listId={list.id}
              item={item}
              index={index}
              editingItem={editingItem}
              editingValue={editingValue}
              draggedItem={draggedItem}
              dragOverState={dragOverState}
              onItemDragStart={onItemDragStart}
              onItemDragOver={onItemDragOver}
              onItemDrop={onItemDrop}
              onItemDragEnd={onItemDragEnd}
              startEditing={startEditing}
              saveEditing={saveEditing}
              cancelEditing={cancelEditing}
              setEditingValue={setEditingValue}
              removeItem={removeItem}
            />
          ))}
        </ul>
        <div className="add-row">
          <input
            className="list-input add"
            placeholder="Add item"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                addItem(list.id, e.target.value, 'text');
                e.target.value = '';
              }
            }}
          />
          <button className="btn small" onClick={(e) => {
            const input = e.target.parentElement.querySelector('.list-input.add');
            if (input && input.value) { addItem(list.id, input.value, 'text'); input.value = ''; }
          }}>Add</button>
          <button className={`btn small code ${showCodeInput ? 'active' : ''}`} onClick={() => setShowCodeInput(s => !s)}>Code</button>
        </div>
        {showCodeInput && (
          <div className="code-input-area">
            <textarea
              className="code-input-textarea"
              placeholder={'```language\ncode\n```'}
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleAddCode();
                if (e.key === 'Escape') { setShowCodeInput(false); setCodeText(''); }
              }}
              rows={6}
              autoFocus
            />
            <button className="btn small" onClick={handleAddCode}>Add Code</button>
          </div>
        )}
      </div>
    </Draggable>
  );
}
