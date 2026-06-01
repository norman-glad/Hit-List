import { PALETTE } from '../constants';

export function createNewList(playgroundName) {
  return {
    id: Date.now(),
    title: 'New List',
    items: [],
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    position: { x: Math.random() * 200, y: Math.random() * 200 },
    playground: playgroundName
  };
}

export function normalizeItems(lists) { // <listcontent> -> typecast <string> 
  return lists.map(list => ({
    ...list,
    items: (list.items || []).map(it => {
      if (typeof it === 'string') return { id: Date.now() + Math.random(), text: it, type: 'text' };
      return { type: 'text', ...it };
    })
  }));
}
