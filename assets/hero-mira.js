/**
 * hero-mira.js — Vapi-powered voice controller (v1)
 *
 * Wires the hero voice widget to the Vapi Web SDK loaded globally as
 * window.Vapi. Config (window.MIRA_PUBLIC_KEY, window.MIRA_ASSISTANT_ID)
 * is injected by assets/_mira-config.js (gitignored). No build step.
 */
'use strict';

(function () {
  const STATES = {
    IDLE: 'idle',
    CONNECTING: 'connecting',
    LISTENING: 'listening',
    SPEAKING: 'speaking',
    DENIED: 'permission-denied',
  };
  const HIDE_GRACE_MS = 3000;
  const VAPI_WAIT_MS = 6000;

  function whenReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function whenVapi(fn) {
    if (typeof window.Vapi === 'function') return fn();
    const t0 = Date.now();
    const iv = setInterval(() => {
      if (typeof window.Vapi === 'function') { clearInterval(iv); fn(); }
      else if (Date.now() - t0 > VAPI_WAIT_MS) {
        clearInterval(iv);
        console.warn('[hero-mira] window.Vapi never loaded; voice disabled.');
      }
    }, 100);
  }

  whenReady(() => whenVapi(init));

  function init() {
    const root = document.querySelector('.hero-mira[data-mira-state]');
    if (!root) return;
    if (!window.MIRA_PUBLIC_KEY || !window.MIRA_ASSISTANT_ID) {
      console.warn('[hero-mira] MIRA_PUBLIC_KEY / MIRA_ASSISTANT_ID missing; voice disabled.');
      return;
    }

    const mic = root.querySelector('.hero-mira__mic');
    const echo = root.querySelector('.hero-mira__transcript-echo');
    const reply = root.querySelector('.hero-mira__reply');
    const form = root.querySelector('.hero-mira__input-row');
    const textInput = form ? form.querySelector('input, textarea') : null;
    const chips = root.querySelectorAll('[data-mira-chip]');

    const vapi = new window.Vapi(window.MIRA_PUBLIC_KEY);
    let active = false;
    let hideTimer = null;
    let deniedNotified = false;

    function setState(next) {
      root.setAttribute('data-mira-state', next);
      if (mic) mic.setAttribute('aria-pressed', String(active));
    }

    function renderFinal(text) {
      if (!echo) return;
      echo.innerHTML = '';
      const span = document.createElement('span');
      span.className = 'hero-mira__transcript-text';
      span.textContent = text;
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'hero-mira__transcript-edit';
      edit.textContent = 'Edit';
      edit.addEventListener('click', () => beginEdit(text));
      const again = document.createElement('button');
      again.type = 'button';
      again.className = 'hero-mira__transcript-again';
      again.textContent = 'Say again';
      again.addEventListener('click', () => { echo.textContent = ''; });
      echo.append(span, edit, again);
    }

    function beginEdit(initial) {
      if (!echo) return;
      echo.innerHTML = '';
      const input = document.createElement('input');
      input.type = 'text';
      input.value = initial;
      input.className = 'hero-mira__transcript-input';
      input.setAttribute('aria-label', 'Edit and resend your message');
      const send = document.createElement('button');
      send.type = 'button';
      send.textContent = 'Send';
      const submit = () => submitText(input.value);
      send.addEventListener('click', submit);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
      echo.append(input, send);
      input.focus();
      input.select();
    }

    function submitText(text) {
      const trimmed = (text || '').trim();
      if (!trimmed) return;
      // TODO: confirm the @vapi-ai/web version we pin exposes
      // vapi.send({type:'add-message', message:{role,content}}) on live calls.
      // Recent builds do; degrades quietly if absent.
      try {
        if (active && typeof vapi.send === 'function') {
          vapi.send({ type: 'add-message', message: { role: 'user', content: trimmed } });
        }
      } catch (err) {
        console.warn('[hero-mira] send failed', err);
      }
      if (echo) echo.textContent = trimmed;
    }

    function onStartError(err) {
      active = false;
      const msg = (err && (err.message || String(err))) || '';
      if (/permission|denied|notallowed/i.test(msg)) {
        setState(STATES.DENIED);
        if (reply && !deniedNotified) {
          reply.textContent = "No worries — your mic is off. Type your question and I'll respond.";
          deniedNotified = true;
        }
        if (textInput) textInput.focus();
      } else {
        setState(STATES.IDLE);
      }
    }

    function onMicClick() {
      if (active) { try { vapi.stop(); } catch (_) {} return; }
      active = true;
      setState(STATES.CONNECTING);
      // Synchronous on purpose: no await before .start() preserves the
      // iOS Safari user-gesture context required by getUserMedia.
      try { vapi.start(window.MIRA_ASSISTANT_ID); }
      catch (err) { onStartError(err); }
    }

    if (mic) mic.addEventListener('click', onMicClick);

    vapi.on('call-start', () => { active = true; setState(STATES.LISTENING); });
    vapi.on('call-end', () => { active = false; setState(STATES.IDLE); });
    vapi.on('speech-start', () => setState(STATES.SPEAKING));
    vapi.on('speech-end', () => { if (active) setState(STATES.LISTENING); });
    vapi.on('error', (err) => { console.warn('[hero-mira] vapi error', err); onStartError(err); });

    vapi.on('message', (msg) => {
      if (!msg || msg.type !== 'transcript' || !msg.transcript) return;
      if (msg.role === 'user') {
        if (msg.transcriptType === 'final') renderFinal(msg.transcript);
        else if (echo) echo.textContent = msg.transcript;
      } else if (msg.role === 'assistant' && reply && msg.transcriptType === 'final') {
        reply.textContent = msg.transcript;
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && active) {
        hideTimer = setTimeout(() => {
          if (document.hidden && active) { try { vapi.stop(); } catch (_) {} }
        }, HIDE_GRACE_MS);
      } else if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    });

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-mira-chip') || chip.textContent || '';
        submitText(text);
      });
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (textInput) { submitText(textInput.value); textInput.value = ''; }
      });
    }

    setState(STATES.IDLE);
  }
})();
