# Assistante IA d’IB Design Digital

Le fichier `worker.js` relie le chatbot du site à Claude. Il est séparé du site public afin que la clé API ne soit jamais visible dans le navigateur ou dans le dépôt GitHub.

## Mise en service

1. Déployer `worker.js` comme Worker Cloudflare nommé `ib-design-digital-assistant`.
2. Dans Cloudflare, ouvrir **Workers & Pages → ib-design-digital-assistant → Settings → Variables and Secrets → Add**.
3. Créer une variable de type **Secret** nommée `ANTHROPIC_API_KEY`, y coller la clé créée dans la Console Claude, puis déployer.
4. Copier l’URL `workers.dev` du Worker. Dans `experience.js`, remplacer l’URL de `assistantApiUrl` par cette adresse suivie de `/chat`.
5. Publier à nouveau les fichiers du site sur GitHub Pages.

Ne jamais envoyer la clé dans WhatsApp, dans une conversation ou dans GitHub. Elle doit rester dans le champ **Secret** de Cloudflare.

## Coût

L’utilisation de l’API Claude est facturée selon les tokens réellement utilisés ; elle est distincte d’un éventuel abonnement Claude. Le Worker limite les messages et la taille des réponses pour contenir l’usage. Les tarifs en vigueur sont indiqués dans la [documentation officielle de Claude](https://platform.claude.com/docs/en/about-claude/pricing).

## Fonctionnement et confidentialité

- Seul le domaine GitHub Pages d’IB Design Digital et le serveur local de prévisualisation sont autorisés par CORS.
- Les messages récents sont transmis à Claude pour maintenir le fil de la conversation.
- Le site ne conserve pas cette conversation sur un serveur.
- Une limite simple de débit évite les envois rapides depuis une même adresse IP.
- Le chatbot répond avec les services et les prix connus par le site. Il précise qu’un devis confirme le périmètre exact des projets complexes.
