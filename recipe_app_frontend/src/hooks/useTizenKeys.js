import { useEffect } from 'react';

/**
 * PUBLIC_INTERFACE
 * useTizenKeys
 * A lightweight keyboard/remote key handler for Tizen TV remotes.
 * Pass a handlers object with optional callbacks: onLeft, onRight, onUp, onDown, onEnter, onBack.
 *
 * @param {{onLeft?:Function,onRight?:Function,onUp?:Function,onDown?:Function,onEnter?:Function,onBack?:Function}} handlers
 *        Callback handlers invoked when corresponding key codes are received.
 * @returns {void}
 */
export function useTizenKeys(handlers) {
  useEffect(() => {
    function handleKeyDown(e) {
      switch (e.keyCode) {
        case 37: // LEFT
          handlers?.onLeft?.();
          e.preventDefault();
          break;
        case 38: // UP
          handlers?.onUp?.();
          e.preventDefault();
          break;
        case 39: // RIGHT
          handlers?.onRight?.();
          e.preventDefault();
          break;
        case 40: // DOWN
          handlers?.onDown?.();
          e.preventDefault();
          break;
        case 13: // ENTER
          handlers?.onEnter?.();
          e.preventDefault();
          break;
        case 10009: // BACK
          handlers?.onBack?.();
          e.preventDefault();
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
