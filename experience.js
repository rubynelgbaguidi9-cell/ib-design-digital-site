// Mini-film animé, voix française et assistante virtuelle d'IB Design Digital.
(() => {
  const scriptElement = document.currentScript;
  const assetUrl = (file) => new URL(file, scriptElement.src).href;
  const prefersLessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const spokenReplies = {
    welcome: 'Bonjour, je suis l’assistante virtuelle d’IB Design Digital. Je peux vous guider vers les visuels publicitaires, l’automatisation ou la création de sites web. Quel projet souhaitez-vous réaliser ?',
    visuals: 'Pour votre communication, nous pouvons créer trois choses : un logo ou une identité visuelle, un flyer ou des visuels pour les réseaux, ou une vidéo publicitaire avec l’intelligence artificielle. Que souhaitez-vous promouvoir ?',
    automation: 'Pour gagner du temps, nous pouvons préparer des réponses aux messages clients, organiser le suivi de vos demandes ou automatiser vos relances. Quelle tâche vous prend le plus de temps ?',
    website: 'Pour votre présence en ligne, plusieurs options sont possibles : une page vitrine, un site de plusieurs pages, ou un site avec un formulaire relié à WhatsApp. Quelle activité souhaitez-vous présenter ?',
    pricing: 'Nos prestations sont sur devis, selon votre besoin. Décrivez votre projet sur WhatsApp et IB Design Digital vous proposera une offre adaptée, sans engagement.',
    timing: 'Le délai dépend du projet. Un visuel peut prendre quelques jours et un site web de quelques jours à quelques semaines. Le délai précis sera défini après échange.',
    payment: 'Sur le site, vous pouvez demander les informations de paiement par WhatsApp. Pour le moment, le règlement s’organise ensuite directement avec IB Design Digital.',
    handoff: 'Pour parler directement avec IB Design Digital, cliquez sur le bouton WhatsApp. Je peux y ajouter le service qui vous intéresse.',
    help: 'Je peux vous orienter vers des visuels et vidéos publicitaires, une automatisation ou la création d’un site web. Choisissez un service et je proposerai plusieurs pistes.',
  };

  const film = document.querySelector('[data-film-player]');
  if (film) {
    const stage = film.querySelector('[data-film-stage]');
    const audio = film.querySelector('[data-film-audio]');
    const toggle = film.querySelector('[data-film-toggle]');
    const buttonLabel = film.querySelector('[data-film-button-label]');
    const buttonIcon = film.querySelector('.film-button-icon');
    const count = film.querySelector('[data-film-count]');
    const caption = film.querySelector('[data-film-caption]');
    const progress = film.querySelector('[data-film-progress]');
    const voiceSegments = [
      { title: '01', caption: 'Des visuels qui attirent l’attention et racontent votre marque.' },
      { title: '02', caption: 'Des automatisations simples pour alléger vos tâches répétitives.' },
      { title: '03', caption: 'Un site moderne pour présenter votre activité au monde.' },
    ];

    let fallbackUtterance = null;
    let filmPlaying = false;

    const setFilmScene = (index) => {
      const scene = Math.max(0, Math.min(2, index));
      stage.dataset.scene = String(scene);
      count.textContent = voiceSegments[scene].title;
      caption.textContent = voiceSegments[scene].caption;
      progress.style.transform = 'scaleX(' + ((scene + 1) / 3) + ')';
    };

    const finishFilm = () => {
      filmPlaying = false;
      stage.classList.remove('is-playing');
      toggle.setAttribute('aria-pressed', 'false');
      buttonLabel.textContent = 'Revoir la présentation';
      buttonIcon.textContent = '▶';
      if (prefersLessMotion) setFilmScene(0);
    };

    const startBrowserFallback = () => {
      if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
        caption.textContent = 'Activez le son de votre appareil pour écouter la présentation.';
        finishFilm();
        return;
      }
      const text = [
        'Bienvenue chez IB Design Digital, votre studio de création numérique au Bénin.',
        'Nous créons des visuels et vidéos publicitaires avec l’intelligence artificielle.',
        'Nous imaginons des automatisations simples pour vous faire gagner du temps.',
        'Et nous développons des sites web modernes pour présenter votre activité.',
        'Vous avez une idée ? Écrivez-nous sur WhatsApp pour en parler.',
      ].join(' ');
      fallbackUtterance = new SpeechSynthesisUtterance(text);
      fallbackUtterance.lang = 'fr-FR';
      fallbackUtterance.rate = 0.94;
      fallbackUtterance.pitch = 1.12;
      const available = window.speechSynthesis.getVoices();
      const frenchVoice = available.find((voice) => /^fr[-_]/i.test(voice.lang) && /denise|eloise|am[eé]lie|audrey|camille|celine|julie|hortense|marie|sophie|agnes|female|femme/i.test(voice.name))
        || available.find((voice) => /^fr[-_]/i.test(voice.lang));
      if (frenchVoice) fallbackUtterance.voice = frenchVoice;
      fallbackUtterance.onend = finishFilm;
      fallbackUtterance.onerror = finishFilm;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(fallbackUtterance);
    };

    toggle.addEventListener('click', () => {
      if (filmPlaying) {
        if (audio && !audio.paused) {
          audio.pause();
          filmPlaying = false;
          stage.classList.remove('is-playing');
          toggle.setAttribute('aria-pressed', 'false');
          buttonLabel.textContent = 'Reprendre la présentation';
          buttonIcon.textContent = '▶';
        } else {
          if (fallbackUtterance && 'speechSynthesis' in window) window.speechSynthesis.cancel();
          finishFilm();
        }
        return;
      }

      filmPlaying = true;
      stage.classList.add('is-playing');
      toggle.setAttribute('aria-pressed', 'true');
      buttonLabel.textContent = 'Mettre en pause';
      buttonIcon.textContent = 'Ⅱ';

      if (audio) {
        if (audio.ended || audio.currentTime >= audio.duration) audio.currentTime = 0;
        else if (!Number.isFinite(audio.duration) || audio.currentTime === 0) audio.currentTime = 0;
        const playRequest = audio.play();
        if (playRequest && typeof playRequest.catch === 'function') {
          playRequest.catch(() => startBrowserFallback());
        }
      } else {
        startBrowserFallback();
      }
    });

    if (audio) {
      audio.addEventListener('timeupdate', () => {
        if (!filmPlaying || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
        const ratio = audio.currentTime / audio.duration;
        setFilmScene(audio.currentTime < 10.64 ? 0 : audio.currentTime < 14.94 ? 1 : 2);
        progress.style.transform = 'scaleX(' + Math.max(.03, ratio) + ')';
      });
      audio.addEventListener('ended', finishFilm);
      audio.addEventListener('pause', () => {
        if (filmPlaying && audio.currentTime > 0 && audio.currentTime < audio.duration) {
          buttonLabel.textContent = 'Reprendre la présentation';
          buttonIcon.textContent = '▶';
          toggle.setAttribute('aria-pressed', 'false');
        }
      });
    }
    setFilmScene(0);
  }

  const whatsappNumber = '2290162383722';
  const shell = document.createElement('div');
  shell.className = 'ib-assistant';
  shell.innerHTML = [
    '<button class="ib-assistant-launcher" type="button" aria-expanded="false" aria-controls="ib-assistant-panel">',
    '<span class="ib-assistant-avatar" aria-hidden="true">IB</span><span class="ib-assistant-launcher-label">Besoin d’aide ?</span><span class="assistant-spark" aria-hidden="true">✦</span></button>',
    '<section class="ib-assistant-panel" id="ib-assistant-panel" role="dialog" aria-label="Assistante virtuelle IB Design Digital" hidden>',
    '<header class="ib-assistant-header"><div class="ib-assistant-identity"><span class="ib-assistant-avatar" aria-hidden="true">IB</span><span class="ib-assistant-name"><b>Assistante IB</b><small>Conseils instantanés · en ligne</small></span></div>',
    '<div class="ib-assistant-header-actions">',
    '<button class="ib-assistant-icon-button" type="button" data-voice-toggle aria-label="Activer la voix féminine" aria-pressed="false" title="Activer ou couper la voix"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 9a4 4 0 0 1 0 6"/><path d="M17.5 6.5a8 8 0 0 1 0 11"/></svg><span class="ib-assistant-voice-text">Activer la voix féminine</span></button>',
    '<button class="ib-assistant-icon-button" type="button" data-assistant-close aria-label="Fermer l’assistante"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div></header>',
    '<div class="ib-assistant-messages" data-assistant-messages role="log" aria-live="polite" aria-relevant="additions text"></div>',
    '<div class="ib-assistant-quick" data-assistant-quick></div>',
    '<div class="ib-assistant-actions"><a class="ib-assistant-whatsapp" data-assistant-whatsapp href="https://wa.me/2290162383722" target="_blank" rel="noopener noreferrer">Continuer sur WhatsApp <span aria-hidden="true">↗</span></a></div>',
    '<p class="ib-assistant-status" data-assistant-status aria-live="polite"></p>',
    '<form class="ib-assistant-form" data-assistant-form><label class="ib-assistant-voice-text" for="ib-assistant-input">Votre question</label>',
    '<input class="ib-assistant-input" id="ib-assistant-input" name="message" maxlength="400" autocomplete="off" placeholder="Écrivez votre question…" required>',
    '<button class="ib-assistant-send" type="submit" aria-label="Envoyer le message"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 17 8-17 8 3-8-3-8Z"/><path d="M7 12h14"/></svg></button></form>',
    '<p class="ib-assistant-footnote">Réponses automatiques basées sur les informations du site. Votre message part sur WhatsApp seulement si vous cliquez.</p></section>',
  ].join('');

  document.body.append(shell);

  const launcher = shell.querySelector('.ib-assistant-launcher');
  const panel = shell.querySelector('.ib-assistant-panel');
  const closeButton = shell.querySelector('[data-assistant-close]');
  const voiceButton = shell.querySelector('[data-voice-toggle]');
  const messages = shell.querySelector('[data-assistant-messages]');
  const quickReplies = shell.querySelector('[data-assistant-quick]');
  const form = shell.querySelector('[data-assistant-form]');
  const input = shell.querySelector('.ib-assistant-input');
  const whatsappLink = shell.querySelector('[data-assistant-whatsapp]');
  const status = shell.querySelector('[data-assistant-status]');
  const transcript = [];
  let voiceEnabled = false;
  let audioMap = null;
  let voiceLoadPromise = null;
  let activeClip = null;
  let currentReplyKey = 'welcome';
  const assistantAudio = new Audio(assetUrl('assets/assistant-voice-bank.mp3'));
  assistantAudio.preload = 'none';

  const setPanelOpen = (open) => {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) window.setTimeout(() => input.focus(), 80);
  };

  const normalized = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const makeWhatsAppUrl = () => {
    const summary = transcript.slice(-10).join('\n');
    const message = 'Bonjour IB Design Digital, je viens du site et je souhaite parler de mon projet.'
      + (summary ? '\n\nÉchange avec l’assistante :\n' + summary : '');
    return 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);
  };

  const updateWhatsAppLink = () => {
    whatsappLink.href = makeWhatsAppUrl();
  };

  const addBubble = (who, text) => {
    const bubble = document.createElement('div');
    bubble.className = 'ib-assistant-message' + (who === 'user' ? ' is-user' : '');
    bubble.textContent = text;
    if (who === 'bot') {
      const signature = document.createElement('small');
      signature.textContent = 'Assistante IB';
      bubble.append(signature);
    }
    messages.append(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  };

  const addQuickReplies = (items) => {
    quickReplies.replaceChildren();
    items.forEach((label) => {
      const choice = document.createElement('button');
      choice.className = 'ib-assistant-choice';
      choice.type = 'button';
      choice.textContent = label;
      choice.addEventListener('click', () => handleUserMessage(label));
      quickReplies.append(choice);
    });
  };

  const answerFor = (text) => {
    const query = normalized(text);
    if (/prix|tarif|cout|coute|combien|devis/.test(query)) {
      return { key: 'pricing', options: ['Visuels & vidéos', 'Automatisation', 'Site web'] };
    }
    if (/paiement|payer|momo|moov|argent|regler/.test(query)) {
      return { key: 'payment', options: ['Demander les infos sur WhatsApp', 'Voir les services'] };
    }
    if (/delai|temps|livraison|quand|rapide/.test(query)) {
      return { key: 'timing', options: ['Créer un visuel', 'Créer un site web'] };
    }
    if (/whatsapp|contact|parler|appeler|telephone|humain|personne/.test(query)) {
      return { key: 'handoff', options: ['Continuer sur WhatsApp', 'Voir les services'] };
    }
    if (/automatis|tache|reponse|commande|suivi|relance|processus|repetitif|robot/.test(query)) {
      return { key: 'automation', options: ['Répondre aux clients', 'Suivre mes demandes', 'Automatiser des relances'] };
    }
    if (/site|web|internet|page|en ligne|vitrine/.test(query)) {
      return { key: 'website', options: ['Une page vitrine', 'Un site de plusieurs pages', 'Formulaire relié à WhatsApp'] };
    }
    if (/visuel|video|image|logo|flyer|affiche|publicite|pub|produit|marque|reseaux sociaux/.test(query)) {
      return { key: 'visuals', options: ['Un logo', 'Un flyer', 'Une vidéo publicitaire IA'] };
    }
    if (/bonjour|salut|bonsoir|hello|coucou/.test(query)) {
      return { key: 'welcome', options: ['Créer des visuels ou vidéos', 'Automatiser une tâche', 'Créer un site web'] };
    }
    return { key: 'help', options: ['Visuels & vidéos', 'Automatisation', 'Site web', 'Tarifs'] };
  };

  const loadVoiceMap = () => {
    if (audioMap) return Promise.resolve(audioMap);
    if (!voiceLoadPromise) {
      voiceLoadPromise = fetch(assetUrl('assets/assistant-voice-map.json'))
        .then((response) => {
          if (!response.ok) throw new Error('Voix indisponible');
          return response.json();
        })
        .then((data) => { audioMap = data; return data; })
        .catch(() => null);
    }
    return voiceLoadPromise;
  };

  const speakWithBrowser = (text) => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      status.textContent = 'La synthèse vocale n’est pas disponible sur cet appareil.';
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = .94;
    utterance.pitch = 1.12;
    const voices = window.speechSynthesis.getVoices();
    const frenchFemale = voices.find((voice) => /^fr[-_]/i.test(voice.lang) && /denise|eloise|am[eé]lie|audrey|camille|celine|julie|hortense|marie|sophie|agnes|female|femme/i.test(voice.name));
    const frenchVoice = frenchFemale || voices.find((voice) => /^fr[-_]/i.test(voice.lang));
    if (frenchVoice) utterance.voice = frenchVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    status.textContent = frenchFemale || frenchVoice ? 'Lecture en français.' : 'Ajoutez une voix française dans les réglages de votre appareil.';
  };

  const playVoice = async (key) => {
    currentReplyKey = key;
    status.textContent = 'Préparation de la voix…';
    if (activeClip) {
      assistantAudio.pause();
      assistantAudio.removeEventListener('timeupdate', activeClip);
      activeClip = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const map = await loadVoiceMap();
    const segment = map && map[key];
    if (!segment) {
      speakWithBrowser(spokenReplies[key] || spokenReplies.help);
      return;
    }

    try {
      if (assistantAudio.readyState < 1) {
        await new Promise((resolve, reject) => {
          const done = () => { cleanup(); resolve(); };
          const fail = () => { cleanup(); reject(new Error('Audio indisponible')); };
          const cleanup = () => {
            assistantAudio.removeEventListener('loadedmetadata', done);
            assistantAudio.removeEventListener('error', fail);
          };
          assistantAudio.addEventListener('loadedmetadata', done, { once: true });
          assistantAudio.addEventListener('error', fail, { once: true });
          assistantAudio.load();
        });
      }
      assistantAudio.currentTime = segment.start;
      const stopAtEnd = () => {
        if (assistantAudio.currentTime >= segment.end) {
          assistantAudio.pause();
          assistantAudio.currentTime = segment.end;
          assistantAudio.removeEventListener('timeupdate', stopAtEnd);
          if (activeClip === stopAtEnd) activeClip = null;
          status.textContent = 'Voix féminine française.';
        }
      };
      activeClip = stopAtEnd;
      assistantAudio.addEventListener('timeupdate', stopAtEnd);
      await assistantAudio.play();
      status.textContent = 'Voix féminine française.';
    } catch {
      status.textContent = 'Lecture vocale en cours…';
      speakWithBrowser(spokenReplies[key] || spokenReplies.help);
    }
  };

  const renderReply = (reply) => {
    const text = spokenReplies[reply.key] || spokenReplies.help;
    addBubble('bot', text);
    transcript.push('IB : ' + text);
    updateWhatsAppLink();
    addQuickReplies(reply.options || []);
    if (voiceEnabled) playVoice(reply.key);
  };

  function handleUserMessage(value) {
    const text = String(value || '').trim();
    if (!text) return;
    addBubble('user', text);
    transcript.push('Client : ' + text.slice(0, 400));
    input.value = '';
    updateWhatsAppLink();
    renderReply(answerFor(text));
  }

  launcher.addEventListener('click', () => setPanelOpen(panel.hidden));
  closeButton.addEventListener('click', () => setPanelOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setPanelOpen(false);
  });
  voiceButton.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    voiceButton.setAttribute('aria-pressed', String(voiceEnabled));
    voiceButton.setAttribute('aria-label', voiceEnabled ? 'Couper la voix féminine' : 'Activer la voix féminine');
    voiceButton.title = voiceEnabled ? 'Couper la voix' : 'Activer la voix féminine';
    status.textContent = voiceEnabled ? 'Voix féminine activée.' : 'Voix coupée.';
    if (voiceEnabled) playVoice(currentReplyKey);
    else {
      assistantAudio.pause();
      if (activeClip) assistantAudio.removeEventListener('timeupdate', activeClip);
      activeClip = null;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleUserMessage(input.value);
  });

  updateWhatsAppLink();
  addBubble('bot', spokenReplies.welcome);
  transcript.push('IB : ' + spokenReplies.welcome);
  addQuickReplies(['Créer des visuels ou vidéos', 'Automatiser une tâche', 'Créer un site web', 'Connaître les tarifs']);
})();


