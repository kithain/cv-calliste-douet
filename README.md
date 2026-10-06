https://kithain.github.io/cv-calliste-douet/

## Export Word

Le bouton « Télécharger en Word » génère un véritable fichier `.docx` à partir
du contenu de la page, directement dans le navigateur. Le document utilise une
seule colonne, des titres Word et du texte sélectionnable pour faciliter la
lecture par les outils de recrutement. La photo et les éléments de navigation
ne sont pas inclus ; les coordonnées et l’URL LinkedIn sont conservées.

Aucune installation ni service externe n’est nécessaire. Après une modification
du CV dans `index.html`, l’export reprend automatiquement le contenu actualisé.
Si la structure HTML change, adapter les sélecteurs dans `cv-export-data.js`,
qui fournit le contenu commun aux exports Word et PDF ATS.

Bibliothèque embarquée : docx 9.6.1 (`vendor/docx.js`), sous licence MIT
(`vendor/docx.LICENSE`). Le bouton d’impression PDF reste disponible.

## Export PDF ATS

Le bouton « Télécharger PDF ATS » télécharge directement
`CV-Calliste-DOUET-ATS.pdf`. Le fichier contient du texte sélectionnable dans
une seule colonne A4, des titres explicites et toutes les coordonnées, y compris
l’URL LinkedIn. Les sauts de page gardent les titres avec le contenu qui suit.
Le CV est généré à partir du contenu actuel de la page, dans le navigateur.

La police Helvetica couvre les accents français et la ponctuation du CV.
La photo, les icônes et les éléments de navigation sont exclus de cet export.
L’impression du CV avec sa mise en page habituelle reste accessible via
« Imprimer en PDF ». Le rendu ATS facilite l’extraction du texte ; l’import
exact des champs dépend du logiciel de recrutement utilisé.

Bibliothèque embarquée : pdf-lib 1.17.1 (`vendor/pdf-lib.min.js`), sous licence
MIT (`vendor/pdf-lib.LICENSE`). Aucun appel à un service externe.
