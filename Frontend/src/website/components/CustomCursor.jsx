import { useEffect, useRef } from 'react';

const interactiveSelector = 'a, button, input, textarea, select, [role="button"]';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const textRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100, tx: -100, ty: -100 });
  const rafRef = useRef(null);
  const stateRef = useRef({ pointer: false, text: false, mode: '' });

  useEffect(() => {
    const cursor = cursorRef.current;
    const text = textRef.current;
    if (!cursor || !text || window.matchMedia('(pointer: coarse)').matches) {
      return undefined;
    }

    const setState = (cls, add) => cursor.classList[add ? 'add' : 'remove'](cls);

    const onMove = (event) => {
      posRef.current.tx = event.clientX;
      posRef.current.ty = event.clientY;
      setState('-visible', true);

      const hovered = document.elementFromPoint(event.clientX, event.clientY);
      const isPointer = Boolean(hovered?.closest(interactiveSelector));
      if (isPointer !== stateRef.current.pointer) {
        setState('-pointer', isPointer);
        stateRef.current.pointer = isPointer;
      }

      const textElement = hovered?.closest('[data-cursor-text]');
      const nextText = textElement?.getAttribute('data-cursor-text') || '';
      const hasText = Boolean(nextText);
      if (hasText) {
        text.textContent = nextText;
      }
      if (hasText !== stateRef.current.text) {
        setState('-text', hasText);
        stateRef.current.text = hasText;
      }

      const modeElement = hovered?.closest('[data-cursor]');
      const nextMode = modeElement?.getAttribute('data-cursor') || '';
      if (stateRef.current.mode && stateRef.current.mode !== nextMode) {
        setState(stateRef.current.mode, false);
      }
      if (nextMode && nextMode !== stateRef.current.mode) {
        setState(nextMode, true);
      }
      stateRef.current.mode = nextMode;
    };

    const onLeave = () => {
      setState('-visible', false);
      if (stateRef.current.pointer) setState('-pointer', false);
      if (stateRef.current.text) setState('-text', false);
      if (stateRef.current.mode) setState(stateRef.current.mode, false);
      stateRef.current = { pointer: false, text: false, mode: '' };
    };
    const onDown = () => setState('-active', true);
    const onUp = () => setState('-active', false);

    const animate = () => {
      const pos = posRef.current;
      pos.x += (pos.tx - pos.x) * 0.18;
      pos.y += (pos.ty - pos.y) * 0.18;
      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div className="cb-cursor-wrap">
      <div ref={cursorRef} className="cb-cursor">
        <div ref={textRef} className="cb-cursor-text" />
      </div>
    </div>
  );
}
