import type { Locale } from "./locales";

export type UploadErrorCode =
  | "NO_FILE"
  | "TOO_MANY_FILES"
  | "FILE_TOO_LARGE"
  | "TOTAL_TOO_LARGE"
  | "FILE_TYPE_REJECTED"
  | "INVALID_FIELDS"
  | "SESSION_EXPIRED"
  | "ORIGIN_REJECTED"
  | "SERVICE_UNAVAILABLE"
  | "REQUEST_TIMEOUT"
  | "CLEANUP_INCOMPLETE"
  | "UPLOAD_FAILED"
  | "INVALID_REQUEST";

export type MedicalUploadCopy = {
  link: string;
  eyebrow: string;
  title: string;
  lead: string;
  trigger: string;
  close: string;
  privatePreview: string;
  whatsappWarning: string;
  urgentNote: string;
  page: {
    acceptedTitle: string;
    acceptedText: string;
    privateTitle: string;
    privateText: string;
    nextTitle: string;
    nextText: string;
  };
  form: {
    detailsLegend: string;
    name: string;
    namePlaceholder: string;
    email: string;
    phone: string;
    optional: string;
    context: string;
    contextPlaceholder: string;
    filesLegend: string;
    chooseFiles: string;
    dropFiles: string;
    fileRules: string;
    dicomHint: string;
    photoTip: string;
    removeFile: string;
    ownershipConsent: string;
    healthConsent: string;
    privacyLink: string;
    clinicalNote: string;
    submit: string;
    uploading: string;
    checking: string;
  };
  success: {
    eyebrow: string;
    title: string;
    body: string;
    referenceLabel: string;
    copyReference: string;
    copied: string;
    copyFailed: string;
    contactClinic: string;
    contactCopied: string;
    contactMessage: string;
    deleteUpload: string;
    deleting: string;
    deleteConfirm: string;
    cancel: string;
    deletedTitle: string;
    deletedText: string;
    deleteFailed: string;
    newUpload: string;
  };
  errors: Record<UploadErrorCode, string>;
  privacy: {
    sectionTitle: string;
    sectionText: string;
  };
};

export const medicalUploadCopy: Record<Locale, MedicalUploadCopy> = {
  en: {
    link: "Clinical file upload",
    eyebrow: "Clinical file upload",
    title: "Upload X-rays and dental photos",
    lead:
      "Share requested images through this separate site upload—not through WhatsApp. A random reference links the files to your next contact.",
    trigger: "Upload X-rays or photos",
    close: "Close clinical file upload",
    privatePreview:
      "Private review mode: use harmless test files until the clinic’s verified data-controller and retention details are connected.",
    whatsappWarning:
      "Do not send X-rays, scans or medical documents through WhatsApp. WhatsApp receives only your reference code.",
    urgentNote:
      "This upload is not for urgent care and does not confirm an appointment. For severe swelling, trouble breathing or swallowing, or uncontrolled bleeding, seek urgent local medical care now.",
    page: {
      acceptedTitle: "File types in this test",
      acceptedText:
        "JPEG, PNG and WebP photos, plus a single DICOM image. Share only what is relevant to your request.",
      privateTitle: "No public file link",
      privateText:
        "In this private test version, files are written to non-public site storage. The website does not offer a route for viewing or downloading them.",
      nextTitle: "Controls for this session",
      nextText:
        "After uploading, copy the reference. While the receipt remains open, you can also delete the upload yourself; closing or refreshing ends that option.",
    },
    form: {
      detailsLegend: "Contact details",
      name: "Full name",
      namePlaceholder: "Your name",
      email: "Email address",
      phone: "Phone / WhatsApp",
      optional: "optional",
      context: "Short context",
      contextPlaceholder:
        "For example: preliminary implant review. Do not use this field for urgent symptoms.",
      filesLegend: "X-rays or dental photos",
      chooseFiles: "Choose files",
      dropFiles: "or drop them here",
      fileRules:
        "{formats} · max. {maxSize} per file · {maxFiles} files · {maxTotal} in total",
      dicomHint:
        "CBCT series or ZIP archive? Ask the clinic for a suitable transfer route.",
      photoTip:
        "Use good light, no filter and a sharp image. Stop if taking a photo causes pain.",
      removeFile: "Remove",
      ownershipConsent:
        "I confirm that these files belong to me, or that I am authorised to share them.",
      healthConsent:
        "I confirm that this private preview may process the contact details, context and harmless test files in this form. I am not submitting real patient data.",
      privacyLink: "Read how your data is processed",
      clinicalNote:
        "An online review is preliminary. Diagnosis, the final treatment plan and price require an examination at the clinic.",
      submit: "Store harmless test files",
      uploading: "Uploading files… Do not close this panel.",
      checking: "Verifying file type and transfer…",
    },
    success: {
      eyebrow: "Test upload received",
      title: "Your test files are stored.",
      body:
        "They are stored under {reference}. Contact the clinic and quote this reference. This is not a diagnosis or confirmed appointment.",
      referenceLabel: "Your reference",
      copyReference: "Copy reference",
      copied: "Reference copied",
      copyFailed: "Copying was blocked. Select and copy the reference above.",
      contactClinic: "Notify the clinic",
      contactCopied: "Clinic message copied",
      contactMessage:
        "Hello Marea Dental, I uploaded clinical images through the site upload. Reference: {reference}. Preferred language: {language}.",
      deleteUpload: "Delete my upload",
      deleting: "Deleting files…",
      deleteConfirm:
        "Permanently delete these uploaded files now? This cannot be undone.",
      cancel: "Keep files",
      deletedTitle: "Upload deleted",
      deletedText:
        "The files and intake record for this reference have been removed from non-public site storage.",
      deleteFailed:
        "The upload could not be deleted right now. Keep the reference and ask the clinic to remove it.",
      newUpload: "Start another upload",
    },
    errors: {
      NO_FILE: "Choose at least one file.",
      TOO_MANY_FILES: "You can upload no more than {maxFiles} files.",
      FILE_TOO_LARGE: "One of the files is larger than {maxSize}.",
      TOTAL_TOO_LARGE: "Together, the files may not exceed {maxTotal}.",
      FILE_TYPE_REJECTED:
        "A file failed the type check. Use an original {formats} file.",
      INVALID_FIELDS: "Check the required details and both confirmations.",
      SESSION_EXPIRED:
        "This upload session expired. Select the files again for your safety.",
      ORIGIN_REJECTED: "This upload request was blocked for security.",
      SERVICE_UNAVAILABLE:
        "The private upload is temporarily unavailable. No files were received.",
      REQUEST_TIMEOUT:
        "The request took too long and no receipt was confirmed. Do not retry with medical files; contact the clinic without attachments.",
      CLEANUP_INCOMPLETE:
        "The upload did not complete and automatic cleanup may be incomplete. Do not retry with medical files; notify the clinic without attachments.",
      UPLOAD_FAILED:
        "The upload failed and no receipt was confirmed. Try again only with a harmless test file, or contact us without attaching medical files to WhatsApp.",
      INVALID_REQUEST: "The upload request could not be read. Try again.",
    },
    privacy: {
      sectionTitle: "Clinical image upload",
      sectionText:
        "Files submitted through the clinical upload are health data. In this private test version they are placed in non-public site storage under a random reference; no public download route is created. A deletion button is available only while the receipt remains open. The 30-day review date is metadata only; automatic deletion is not configured. Before accepting real patient files publicly, the verified controller, processor terms, storage location, access roles, incident process and retention policy must be documented.",
    },
  },
  nl: {
    link: "Klinische bestanden opsturen",
    eyebrow: "Klinische bestandsupload",
    title: "Röntgenfoto’s en gebitsfoto’s opsturen",
    lead:
      "Deel gevraagde beelden via deze aparte site-upload—niet via WhatsApp. Een willekeurige referentie koppelt de bestanden aan uw volgende contact.",
    trigger: "Röntgenfoto’s of foto’s opsturen",
    close: "Upload van klinische bestanden sluiten",
    privatePreview:
      "Privétestmodus: gebruik onschuldige testbestanden totdat de geverifieerde verwerkingsverantwoordelijke en bewaartermijn van de kliniek zijn vastgelegd.",
    whatsappWarning:
      "Stuur geen röntgenfoto’s, scans of medische documenten via WhatsApp. WhatsApp ontvangt alleen uw referentiecode.",
    urgentNote:
      "Deze upload is niet voor spoed en bevestigt geen afspraak. Zoek bij ernstige zwelling, adem- of slikproblemen of een niet te stelpen bloeding direct lokale spoedzorg.",
    page: {
      acceptedTitle: "Bestandstypen in deze test",
      acceptedText:
        "JPEG-, PNG- en WebP-foto’s, plus één DICOM-beeld. Deel alleen wat relevant is voor uw aanvraag.",
      privateTitle: "Geen openbare bestandslink",
      privateText:
        "In deze privétestversie komen bestanden in niet-openbare siteopslag. De website biedt geen route om ze te bekijken of te downloaden.",
      nextTitle: "Regie binnen deze sessie",
      nextText:
        "Kopieer na de upload uw referentie. Zolang de ontvangstbevestiging openstaat, kunt u de upload ook zelf verwijderen; sluiten of herladen beëindigt die mogelijkheid.",
    },
    form: {
      detailsLegend: "Contactgegevens",
      name: "Volledige naam",
      namePlaceholder: "Uw naam",
      email: "E-mailadres",
      phone: "Telefoon / WhatsApp",
      optional: "optioneel",
      context: "Korte context",
      contextPlaceholder:
        "Bijvoorbeeld: voorlopige beoordeling voor implantaten. Gebruik dit veld niet voor spoedklachten.",
      filesLegend: "Röntgenfoto’s of gebitsfoto’s",
      chooseFiles: "Bestanden kiezen",
      dropFiles: "of sleep ze hierheen",
      fileRules:
        "{formats} · maximaal {maxSize} per bestand · {maxFiles} bestanden · {maxTotal} totaal",
      dicomHint:
        "CBCT-serie of ZIP-bestand? Vraag de kliniek om een geschikte overdrachtsroute.",
      photoTip:
        "Gebruik goed licht, geen filter en een scherpe foto. Stop als het maken van de foto pijn doet.",
      removeFile: "Verwijderen",
      ownershipConsent:
        "Ik bevestig dat deze bestanden van mij zijn, of dat ik bevoegd ben ze te delen.",
      healthConsent:
        "Ik bevestig dat deze privépreview de contactgegevens, context en onschuldige testbestanden in dit formulier mag verwerken. Ik stuur geen echte patiëntgegevens in.",
      privacyLink: "Lees hoe uw gegevens worden verwerkt",
      clinicalNote:
        "Een online beoordeling is voorlopig. Voor diagnose, definitief behandelplan en prijs is onderzoek in de kliniek nodig.",
      submit: "Onschuldige testbestanden opslaan",
      uploading: "Bestanden worden geüpload… Sluit dit venster niet.",
      checking: "Bestandstype en overdracht worden gecontroleerd…",
    },
    success: {
      eyebrow: "Testupload ontvangen",
      title: "Uw testbestanden zijn opgeslagen.",
      body:
        "Ze zijn opgeslagen onder {reference}. Neem contact op met de kliniek en noem deze referentie. Dit is geen diagnose of bevestigde afspraak.",
      referenceLabel: "Uw referentie",
      copyReference: "Referentie kopiëren",
      copied: "Referentie gekopieerd",
      copyFailed:
        "Kopiëren werd geblokkeerd. Selecteer en kopieer de referentie hierboven.",
      contactClinic: "Kliniek informeren",
      contactCopied: "Bericht voor kliniek gekopieerd",
      contactMessage:
        "Hallo Marea Dental, ik heb klinische beelden via de site-upload verstuurd. Referentie: {reference}. Voorkeurstaal: {language}.",
      deleteUpload: "Mijn upload verwijderen",
      deleting: "Bestanden worden verwijderd…",
      deleteConfirm:
        "Deze geüploade bestanden nu definitief verwijderen? Dit kan niet ongedaan worden gemaakt.",
      cancel: "Bestanden bewaren",
      deletedTitle: "Upload verwijderd",
      deletedText:
        "De bestanden en het intakebestand bij deze referentie zijn uit de niet-openbare siteopslag verwijderd.",
      deleteFailed:
        "De upload kon nu niet worden verwijderd. Bewaar de referentie en vraag de kliniek om verwijdering.",
      newUpload: "Nog een upload starten",
    },
    errors: {
      NO_FILE: "Kies minimaal één bestand.",
      TOO_MANY_FILES: "U kunt maximaal {maxFiles} bestanden uploaden.",
      FILE_TOO_LARGE: "Een van de bestanden is groter dan {maxSize}.",
      TOTAL_TOO_LARGE: "Samen mogen de bestanden niet groter zijn dan {maxTotal}.",
      FILE_TYPE_REJECTED:
        "Een bestand kwam niet door de typecontrole. Gebruik een origineel {formats}-bestand.",
      INVALID_FIELDS:
        "Controleer de verplichte gegevens en beide bevestigingen.",
      SESSION_EXPIRED:
        "Deze uploadsessie is verlopen. Kies de bestanden voor uw veiligheid opnieuw.",
      ORIGIN_REJECTED: "Deze uploadaanvraag is om veiligheidsredenen geblokkeerd.",
      SERVICE_UNAVAILABLE:
        "De privé-upload is tijdelijk niet beschikbaar. Er zijn geen bestanden ontvangen.",
      REQUEST_TIMEOUT:
        "De aanvraag duurde te lang en er is geen ontvangst bevestigd. Probeer niet opnieuw met medische bestanden; neem zonder bijlagen contact op.",
      CLEANUP_INCOMPLETE:
        "De upload is niet voltooid en de automatische opschoning is mogelijk onvolledig. Probeer niet opnieuw met medische bestanden; meld dit zonder bijlagen aan de kliniek.",
      UPLOAD_FAILED:
        "De upload is mislukt en de ontvangst is niet bevestigd. Probeer alleen opnieuw met een onschuldig testbestand, of neem contact op zonder medische bestanden via WhatsApp mee te sturen.",
      INVALID_REQUEST:
        "De uploadaanvraag kon niet worden gelezen. Probeer opnieuw.",
    },
    privacy: {
      sectionTitle: "Upload van klinische beelden",
      sectionText:
        "Bestanden in de klinische upload zijn gezondheidsgegevens. In deze privétestversie worden ze met een willekeurige referentie in niet-openbare siteopslag geplaatst; er ontstaat geen openbare downloadroute. De verwijderknop is alleen beschikbaar zolang de ontvangstbevestiging openstaat. De datum na 30 dagen is alleen metadata; automatische verwijdering is niet ingesteld. Vóór echte patiëntbestanden publiek worden aangenomen, moeten de geverifieerde verwerkingsverantwoordelijke, verwerkersafspraken, opslaglocatie, toegangsrollen, incidentprocedure en bewaartermijn zijn vastgelegd.",
    },
  },
  de: {
    link: "Klinische Dateien senden",
    eyebrow: "Upload klinischer Dateien",
    title: "Röntgenbilder und Zahnfotos senden",
    lead:
      "Teilen Sie angeforderte Bilder über diesen separaten Website-Upload—nicht über WhatsApp. Eine zufällige Referenz verknüpft die Dateien mit Ihrem nächsten Kontakt.",
    trigger: "Röntgenbilder oder Fotos senden",
    close: "Upload klinischer Dateien schließen",
    privatePreview:
      "Privater Testmodus: Verwenden Sie harmlose Testdateien, bis der verifizierte Verantwortliche und die Speicherfrist der Klinik hinterlegt sind.",
    whatsappWarning:
      "Senden Sie keine Röntgenbilder, Scans oder medizinischen Unterlagen per WhatsApp. WhatsApp erhält nur Ihre Referenz.",
    urgentNote:
      "Dieser Upload ist nicht für Notfälle bestimmt und bestätigt keinen Termin. Suchen Sie bei starker Schwellung, Atem- oder Schluckbeschwerden oder unstillbarer Blutung sofort örtliche Notfallhilfe.",
    page: {
      acceptedTitle: "Dateitypen in diesem Test",
      acceptedText:
        "JPEG-, PNG- und WebP-Fotos sowie ein einzelnes DICOM-Bild. Teilen Sie nur, was für Ihre Anfrage relevant ist.",
      privateTitle: "Kein öffentlicher Dateilink",
      privateText:
        "In dieser privaten Testversion werden Dateien in einem nicht öffentlichen Website-Speicher abgelegt. Die Website bietet keinen Weg zum Anzeigen oder Herunterladen.",
      nextTitle: "Kontrolle in dieser Sitzung",
      nextText:
        "Kopieren Sie nach dem Upload Ihre Referenz. Solange die Empfangsbestätigung geöffnet bleibt, können Sie den Upload selbst löschen; Schließen oder Neuladen beendet diese Möglichkeit.",
    },
    form: {
      detailsLegend: "Kontaktdaten",
      name: "Vollständiger Name",
      namePlaceholder: "Ihr Name",
      email: "E-Mail-Adresse",
      phone: "Telefon / WhatsApp",
      optional: "optional",
      context: "Kurzer Kontext",
      contextPlaceholder:
        "Zum Beispiel: vorläufige Implantatprüfung. Nicht für dringende Beschwerden verwenden.",
      filesLegend: "Röntgenbilder oder Zahnfotos",
      chooseFiles: "Dateien auswählen",
      dropFiles: "oder hier ablegen",
      fileRules:
        "{formats} · max. {maxSize} pro Datei · {maxFiles} Dateien · {maxTotal} insgesamt",
      dicomHint:
        "CBCT-Serie oder ZIP-Datei? Fragen Sie die Klinik nach einem passenden Übertragungsweg.",
      photoTip:
        "Verwenden Sie gutes Licht, keine Filter und ein scharfes Bild. Hören Sie auf, wenn das Fotografieren Schmerzen verursacht.",
      removeFile: "Entfernen",
      ownershipConsent:
        "Ich bestätige, dass diese Dateien mir gehören oder dass ich zu ihrer Weitergabe berechtigt bin.",
      healthConsent:
        "Ich bestätige, dass diese private Vorschau die Kontaktdaten, den Kontext und harmlose Testdateien in diesem Formular verarbeiten darf. Ich übermittle keine echten Patientendaten.",
      privacyLink: "Lesen Sie, wie Ihre Daten verarbeitet werden",
      clinicalNote:
        "Eine Online-Einschätzung ist vorläufig. Diagnose, endgültiger Behandlungsplan und Preis erfordern eine Untersuchung in der Klinik.",
      submit: "Harmlose Testdateien speichern",
      uploading: "Dateien werden hochgeladen… Bitte schließen Sie das Fenster nicht.",
      checking: "Dateityp und Übertragung werden geprüft…",
    },
    success: {
      eyebrow: "Testupload eingegangen",
      title: "Ihre Testdateien wurden gespeichert.",
      body:
        "Sie sind unter {reference} gespeichert. Kontaktieren Sie die Klinik und nennen Sie diese Referenz. Dies ist weder eine Diagnose noch eine Terminbestätigung.",
      referenceLabel: "Ihre Referenz",
      copyReference: "Referenz kopieren",
      copied: "Referenz kopiert",
      copyFailed:
        "Kopieren wurde blockiert. Markieren und kopieren Sie die Referenz oben.",
      contactClinic: "Klinik informieren",
      contactCopied: "Nachricht für die Klinik kopiert",
      contactMessage:
        "Hallo Marea Dental, ich habe klinische Bilder über den Website-Upload gesendet. Referenz: {reference}. Gewünschte Sprache: {language}.",
      deleteUpload: "Meinen Upload löschen",
      deleting: "Dateien werden gelöscht…",
      deleteConfirm:
        "Diese hochgeladenen Dateien jetzt endgültig löschen? Dies kann nicht rückgängig gemacht werden.",
      cancel: "Dateien behalten",
      deletedTitle: "Upload gelöscht",
      deletedText:
        "Die Dateien und der zugehörige Eintrag wurden aus dem nicht öffentlichen Website-Speicher entfernt.",
      deleteFailed:
        "Der Upload konnte gerade nicht gelöscht werden. Bewahren Sie die Referenz auf und bitten Sie die Klinik um Löschung.",
      newUpload: "Weiteren Upload starten",
    },
    errors: {
      NO_FILE: "Wählen Sie mindestens eine Datei aus.",
      TOO_MANY_FILES: "Sie können höchstens {maxFiles} Dateien hochladen.",
      FILE_TOO_LARGE: "Eine der Dateien ist größer als {maxSize}.",
      TOTAL_TOO_LARGE: "Zusammen dürfen die Dateien {maxTotal} nicht überschreiten.",
      FILE_TYPE_REJECTED:
        "Eine Datei hat die Typprüfung nicht bestanden. Verwenden Sie eine originale {formats}-Datei.",
      INVALID_FIELDS:
        "Prüfen Sie die Pflichtangaben und beide Bestätigungen.",
      SESSION_EXPIRED:
        "Diese Upload-Sitzung ist abgelaufen. Wählen Sie die Dateien zu Ihrer Sicherheit erneut aus.",
      ORIGIN_REJECTED:
        "Diese Upload-Anfrage wurde aus Sicherheitsgründen blockiert.",
      SERVICE_UNAVAILABLE:
        "Der private Upload ist vorübergehend nicht verfügbar. Es wurden keine Dateien empfangen.",
      REQUEST_TIMEOUT:
        "Die Anfrage dauerte zu lange; ein Empfang wurde nicht bestätigt. Versuchen Sie es nicht erneut mit medizinischen Dateien und kontaktieren Sie die Klinik ohne Anhang.",
      CLEANUP_INCOMPLETE:
        "Der Upload wurde nicht abgeschlossen und die automatische Bereinigung könnte unvollständig sein. Versuchen Sie es nicht erneut mit medizinischen Dateien und informieren Sie die Klinik ohne Anhang.",
      UPLOAD_FAILED:
        "Der Upload ist fehlgeschlagen; ein Empfang wurde nicht bestätigt. Versuchen Sie es nur mit einer harmlosen Testdatei erneut oder kontaktieren Sie uns ohne medizinische WhatsApp-Anhänge.",
      INVALID_REQUEST:
        "Die Upload-Anfrage konnte nicht gelesen werden. Versuchen Sie es erneut.",
    },
    privacy: {
      sectionTitle: "Upload klinischer Bilder",
      sectionText:
        "Dateien im klinischen Upload sind Gesundheitsdaten. In dieser privaten Testversion werden sie mit einer zufälligen Referenz im nicht öffentlichen Website-Speicher abgelegt; es entsteht kein öffentlicher Downloadweg. Die Löschschaltfläche ist nur verfügbar, solange die Empfangsbestätigung geöffnet bleibt. Das Datum nach 30 Tagen ist lediglich Metadatum; eine automatische Löschung ist nicht eingerichtet. Vor der öffentlichen Annahme echter Patientendateien müssen Verantwortlicher, Auftragsverarbeiter, Speicherort, Zugriffsrollen, Vorfallverfahren und Aufbewahrungsfrist verifiziert dokumentiert sein.",
    },
  },
  fr: {
    link: "Envoyer des fichiers cliniques",
    eyebrow: "Dépôt de fichiers cliniques",
    title: "Envoyer vos radiographies et photos dentaires",
    lead:
      "Partagez les images demandées par ce dépôt distinct du site—pas par WhatsApp. Une référence aléatoire relie les fichiers à votre prochain contact.",
    trigger: "Envoyer radiographies ou photos",
    close: "Fermer l’envoi de fichiers cliniques",
    privatePreview:
      "Mode d’essai privé : utilisez des fichiers de test inoffensifs jusqu’à l’ajout du responsable vérifié et de la durée de conservation.",
    whatsappWarning:
      "N’envoyez aucune radiographie, aucun scan ni document médical par WhatsApp. WhatsApp reçoit uniquement votre référence.",
    urgentNote:
      "Ce dépôt n’est pas destiné aux urgences et ne confirme pas un rendez-vous. En cas de gonflement important, de difficulté à respirer ou avaler, ou de saignement incontrôlé, consultez immédiatement les services d’urgence locaux.",
    page: {
      acceptedTitle: "Types de fichiers dans cet essai",
      acceptedText:
        "Photos JPEG, PNG et WebP, ainsi qu’une image DICOM unique. Partagez uniquement ce qui est pertinent.",
      privateTitle: "Aucun lien public",
      privateText:
        "Dans cette version d’essai privée, les fichiers sont placés dans un stockage non public du site. Le site ne permet ni de les afficher ni de les télécharger.",
      nextTitle: "Contrôle pendant cette session",
      nextText:
        "Après le dépôt, copiez votre référence. Tant que le reçu reste ouvert, vous pouvez aussi supprimer le dépôt ; fermer ou actualiser la page met fin à cette possibilité.",
    },
    form: {
      detailsLegend: "Coordonnées",
      name: "Nom complet",
      namePlaceholder: "Votre nom",
      email: "Adresse e-mail",
      phone: "Téléphone / WhatsApp",
      optional: "facultatif",
      context: "Bref contexte",
      contextPlaceholder:
        "Par exemple : avis préliminaire pour des implants. N’utilisez pas ce champ pour une urgence.",
      filesLegend: "Radiographies ou photos dentaires",
      chooseFiles: "Ajouter des fichiers",
      dropFiles: "ou déposez-les ici",
      fileRules:
        "{formats} · {maxSize} par fichier · {maxFiles} fichiers · {maxTotal} au total",
      dicomHint:
        "Série CBCT ou archive ZIP ? Demandez à la clinique une méthode de transfert adaptée.",
      photoTip:
        "Utilisez un bon éclairage, sans filtre, et une image nette. Arrêtez si la photo provoque une douleur.",
      removeFile: "Supprimer",
      ownershipConsent:
        "Je confirme que ces fichiers m’appartiennent ou que je suis autorisé à les partager.",
      healthConsent:
        "Je confirme que cette prévisualisation privée peut traiter les coordonnées, le contexte et les fichiers de test inoffensifs de ce formulaire. Je n’envoie aucune donnée réelle de patient.",
      privacyLink: "Lire comment vos données sont traitées",
      clinicalNote:
        "L’évaluation en ligne est préliminaire. Le diagnostic, le plan définitif et le prix nécessitent un examen à la clinique.",
      submit: "Enregistrer les fichiers de test inoffensifs",
      uploading: "Envoi des fichiers… Ne fermez pas cette fenêtre.",
      checking: "Vérification du type de fichier et du transfert…",
    },
    success: {
      eyebrow: "Dépôt de test reçu",
      title: "Vos fichiers de test sont enregistrés.",
      body:
        "Ils sont enregistrés sous {reference}. Contactez la clinique et citez cette référence. Ceci ne constitue ni un diagnostic ni une confirmation de rendez-vous.",
      referenceLabel: "Votre référence",
      copyReference: "Copier la référence",
      copied: "Référence copiée",
      copyFailed:
        "La copie a été bloquée. Sélectionnez et copiez la référence ci-dessus.",
      contactClinic: "Informer la clinique",
      contactCopied: "Message pour la clinique copié",
      contactMessage:
        "Bonjour Marea Dental, j’ai envoyé des images cliniques par le dépôt du site. Référence : {reference}. Langue préférée : {language}.",
      deleteUpload: "Supprimer mon dépôt",
      deleting: "Suppression des fichiers…",
      deleteConfirm:
        "Supprimer définitivement ces fichiers maintenant ? Cette action est irréversible.",
      cancel: "Conserver les fichiers",
      deletedTitle: "Dépôt supprimé",
      deletedText:
        "Les fichiers et l’enregistrement associés à cette référence ont été retirés du stockage non public du site.",
      deleteFailed:
        "Le dépôt ne peut pas être supprimé maintenant. Conservez la référence et demandez sa suppression à la clinique.",
      newUpload: "Commencer un autre dépôt",
    },
    errors: {
      NO_FILE: "Ajoutez au moins un fichier.",
      TOO_MANY_FILES: "Vous pouvez envoyer au maximum {maxFiles} fichiers.",
      FILE_TOO_LARGE: "Un des fichiers dépasse {maxSize}.",
      TOTAL_TOO_LARGE: "L’ensemble des fichiers ne peut pas dépasser {maxTotal}.",
      FILE_TYPE_REJECTED:
        "Un fichier a échoué au contrôle de type. Utilisez un fichier {formats} original.",
      INVALID_FIELDS:
        "Vérifiez les champs obligatoires et les deux confirmations.",
      SESSION_EXPIRED:
        "Cette session a expiré. Pour votre sécurité, sélectionnez de nouveau les fichiers.",
      ORIGIN_REJECTED:
        "Cette demande d’envoi a été bloquée pour des raisons de sécurité.",
      SERVICE_UNAVAILABLE:
        "Le dépôt privé est temporairement indisponible. Aucun fichier n’a été reçu.",
      REQUEST_TIMEOUT:
        "La demande a pris trop de temps et aucun reçu n’a été confirmé. Ne réessayez pas avec des fichiers médicaux ; contactez la clinique sans pièce jointe.",
      CLEANUP_INCOMPLETE:
        "Le dépôt n’a pas abouti et le nettoyage automatique peut être incomplet. Ne réessayez pas avec des fichiers médicaux ; avertissez la clinique sans pièce jointe.",
      UPLOAD_FAILED:
        "L’envoi a échoué et aucun reçu n’a été confirmé. Réessayez uniquement avec un fichier de test inoffensif ou contactez-nous sans joindre de fichier médical à WhatsApp.",
      INVALID_REQUEST:
        "La demande d’envoi n’a pas pu être lue. Réessayez.",
    },
    privacy: {
      sectionTitle: "Dépôt d’images cliniques",
      sectionText:
        "Les fichiers du dépôt clinique sont des données de santé. Dans cette version d’essai privée, ils sont placés sous une référence aléatoire dans un stockage non public du site ; aucun téléchargement public n’est créé. Le bouton de suppression n’est disponible que tant que le reçu reste ouvert. La date à 30 jours est une simple métadonnée ; la suppression automatique n’est pas configurée. Avant toute collecte publique de vrais dossiers, le responsable, les sous-traitants, le lieu de stockage, les rôles d’accès, la procédure d’incident et la durée de conservation doivent être documentés et vérifiés.",
    },
  },
  lb: {
    link: "Klinesch Fichiere schécken",
    eyebrow: "Upload vu klinesche Fichieren",
    title: "Röntgenopnamen an Zännfotoe schécken",
    lead:
      "Deelt ugefrote Biller iwwer dëse separaten Upload vum Site—net iwwer WhatsApp. Eng zoufälleg Referenz verbënnt d’Fichiere mat Ärem nächste Kontakt.",
    trigger: "Röntgenopnamen oder Fotoe schécken",
    close: "Upload vu klinesche Fichieren zoumaachen",
    privatePreview:
      "Privaten Testmodus: Benotzt nëmmen harmlos Testfichieren, bis confirméiert ass, wéi eng Organisatioun fir d’Dateveraarbechtung responsabel ass a wéi laang d’Fichiere gespäichert ginn.",
    whatsappWarning:
      "Schéckt keng Röntgenopnamen, Scannen oder medezinesch Dokumenter iwwer WhatsApp. WhatsApp kritt nëmmen Är Referenz.",
    urgentNote:
      "Dësen Upload ass net fir Noutfäll geduecht a confirméiert kee Rendez-vous. Bei staarker Schwellung, Otem- oder Schluckproblemer oder enger Blutung déi net ophält, sicht direkt lokal Nouthëllef.",
    page: {
      acceptedTitle: "Fichierstypen an dësem Test",
      acceptedText:
        "JPEG-, PNG- a WebP-Fotoen, plus een eenzelt DICOM-Bild. Deelt nëmmen dat, wat fir Är Ufro relevant ass.",
      privateTitle: "Keen ëffentleche Fichierslink",
      privateText:
        "An dëser privater Testversioun ginn d’Fichieren an engem net ëffentleche Sitespäicher ofgeluecht. De Site erlaabt weder Uweisen nach Eroflueden.",
      nextTitle: "Kontroll an dëser Sessioun",
      nextText:
        "Kopéiert nom Upload Är Referenz. Soulaang d’Confirmatioun op ass, kënnt Dir den Upload selwer läschen; Zoumaachen oder Nei-Luede mécht dës Méiglechkeet op en Enn.",
    },
    form: {
      detailsLegend: "Kontaktdonnéeën",
      name: "Vollstännegen Numm",
      namePlaceholder: "Ären Numm",
      email: "E-Mail-Adress",
      phone: "Telefon / WhatsApp",
      optional: "optional",
      context: "Kuerze Kontext",
      contextPlaceholder:
        "Zum Beispill: virleefeg Iwwerpréiwung fir Implantater. Net fir Noutfäll benotzen.",
      filesLegend: "Röntgenopnamen oder Zännfotoen",
      chooseFiles: "Fichieren auswielen",
      dropFiles: "oder hei ofleeën",
      fileRules:
        "{formats} · max. {maxSize} pro Fichier · {maxFiles} Fichieren · {maxTotal} am Ganzen",
      dicomHint:
        "CBCT-Serie oder ZIP-Archiv? Frot d’Klinik no engem passenden Iwwerdroungswee.",
      photoTip:
        "Benotzt gutt Luucht, kee Filter an e schaarft Bild. Halt op, wann d’Foto Péng verursaacht.",
      removeFile: "Ewechhuelen",
      ownershipConsent:
        "Ech confirméieren, datt dës Fichiere mir gehéieren oder datt ech se dierf weiderginn.",
      healthConsent:
        "Ech confirméieren, datt dës privat Virschau d’Kontaktdonnéeën, de Kontext an harmlos Testfichieren an dësem Formulaire veraarbechte kann. Ech schécke keng echt Patientendonnéeën.",
      privacyLink: "Liest, wéi Är Donnéeë veraarbecht ginn",
      clinicalNote:
        "Eng Online-Evaluatioun ass virleefeg. Diagnos, definitive Behandlungsplang a Präis erfuerderen eng Ënnersichung an der Klinik.",
      submit: "Harmlos Testfichiere späicheren",
      uploading: "Fichiere ginn eropgelueden… Maacht d’Fënster net zou.",
      checking: "Fichiertyp an Iwwerdroung ginn iwwerpréift…",
    },
    success: {
      eyebrow: "Testupload ukomm",
      title: "Är Testfichiere si gespäichert.",
      body:
        "Si sinn ënner {reference} gespäichert. Kontaktéiert d’Klinik a nennt dës Referenz. Dëst ass keng Diagnos a kee confirméierte Rendez-vous.",
      referenceLabel: "Är Referenz",
      copyReference: "Referenz kopéieren",
      copied: "Referenz kopéiert",
      copyFailed:
        "D’Kopéiere gouf blockéiert. Markéiert a kopéiert d’Referenz uewen.",
      contactClinic: "Klinik informéieren",
      contactCopied: "Message fir d’Klinik kopéiert",
      contactMessage:
        "Moien Marea Dental, ech hu klinesch Biller iwwer de Site-Upload geschéckt. Referenz: {reference}. Gewënschte Sprooch: {language}.",
      deleteUpload: "Mäin Upload läschen",
      deleting: "Fichiere gi geläscht…",
      deleteConfirm:
        "Dës eropgeluede Fichieren elo definitiv läschen? Dat kann net réckgängeg gemaach ginn.",
      cancel: "Fichiere behalen",
      deletedTitle: "Upload geläscht",
      deletedText:
        "D’Fichieren an den Dossier vun dëser Referenz goufen aus dem net ëffentleche Sitespäicher geläscht.",
      deleteFailed:
        "Den Upload konnt elo net geläscht ginn. Späichert d’Referenz a frot d’Klinik ëm d’Läschen.",
      newUpload: "En neien Upload starten",
    },
    errors: {
      NO_FILE: "Füügt op d’mannst ee Fichier dobäi.",
      TOO_MANY_FILES: "Dir kënnt maximal {maxFiles} Fichieren eroplueden.",
      FILE_TOO_LARGE: "Ee vun de Fichieren ass méi grouss wéi {maxSize}.",
      TOTAL_TOO_LARGE: "Zesumme däerfen d’Fichieren {maxTotal} net iwwerschreiden.",
      FILE_TYPE_REJECTED:
        "E Fichier huet d’Typkontroll net gepackt. Benotzt en originale {formats}-Fichier.",
      INVALID_FIELDS:
        "Iwwerpréift déi obligatoresch Felder a béid Confirmatiounen.",
      SESSION_EXPIRED:
        "Dës Upload-Sessioun ass ofgelaf. Wielt d’Fichieren aus Sécherheetsgrënn nei.",
      ORIGIN_REJECTED:
        "Dës Upload-Ufro gouf aus Sécherheetsgrënn blockéiert.",
      SERVICE_UNAVAILABLE:
        "De privaten Upload ass temporär net disponibel. Keng Fichiere goufen empfaangen.",
      REQUEST_TIMEOUT:
        "D’Ufro huet ze laang gedauert an den Empfang ass net confirméiert. Probéiert net nach eng Kéier mat medezinesche Fichieren; kontaktéiert d’Klinik ouni Unhang.",
      CLEANUP_INCOMPLETE:
        "Den Upload gouf net ofgeschloss an d’automatesch Botze kéint onvollstänneg sinn. Probéiert net nach eng Kéier mat medezinesche Fichieren; informéiert d’Klinik ouni Unhang.",
      UPLOAD_FAILED:
        "Den Upload ass feelgeschloen an den Empfang ass net confirméiert. Probéiert nëmme mat engem harmlose Testfichier nach eng Kéier oder kontaktéiert eis ouni medezineschen WhatsApp-Unhang.",
      INVALID_REQUEST:
        "D’Upload-Ufro konnt net gelies ginn. Probéiert nach eng Kéier.",
    },
    privacy: {
      sectionTitle: "Upload vu klinesche Biller",
      sectionText:
        "Fichieren am klineschen Upload si Gesondheetsdaten. An dëser privater Testversioun gi si mat enger zoufälleger Referenz am net ëffentleche Sitespäicher ofgeluecht; et gëtt keen ëffentlechen Downloadwee. De Läschknäppchen ass nëmmen disponibel soulaang d’Confirmatioun op ass. Den Datum no 30 Deeg ass nëmme Metadatum; automatescht Läschen ass net ageriicht. Virun der ëffentlecher Notzung mat echte Patientefichiere musse confirméiert an dokumentéiert sinn: déi responsabel Organisatioun, d’Déngschtleeschter, de Späicheruert, d’Zougrëffsrollen, d’Prozedur bei Dateschutzvirfäll an d’Späicherfrist.",
    },
  },
  ka: {
    link: "რენტგენისა და ფოტოების გაგზავნა",
    eyebrow: "ფაილების ცალკე ატვირთვა",
    title: "რენტგენის სურათებისა და კბილების ფოტოების გაგზავნა",
    lead:
      "მოთხოვნილი სურათები გააზიარეთ საიტის ცალკე ატვირთვით — არა WhatsApp-ით. ამ კერძო სატესტო ვერსიაში ფაილები საიტის არასაჯარო საცავში ინახება და კლინიკას ავტომატურად არ ეგზავნება; შემდგომი კონტაქტისთვის მიიღებთ შემთხვევით რეფერენსს.",
    trigger: "რენტგენის ან ფოტოების გაგზავნა",
    close: "ფაილების ატვირთვის დახურვა",
    privatePreview:
      "კერძო სატესტო რეჟიმი: გამოიყენეთ მხოლოდ უვნებელი სატესტო ფაილები, სანამ მონაცემთა დამუშავებაზე პასუხისმგებელი მხარე და შენახვის ვადა არ დადასტურდება.",
    whatsappWarning:
      "არ გააგზავნოთ რენტგენის სურათები, სკანები ან სამედიცინო დოკუმენტები WhatsApp-ით. WhatsApp მიიღებს მხოლოდ თქვენს რეფერენსს.",
    urgentNote:
      "ეს ატვირთვა არ არის გადაუდებელი დახმარებისთვის და არ ადასტურებს ვიზიტს. ძლიერი შეშუპების, სუნთქვის ან ყლაპვის გაძნელების ან შეუჩერებელი სისხლდენისას დაუყოვნებლივ მიმართეთ ადგილობრივ გადაუდებელ დახმარებას.",
    page: {
      acceptedTitle: "ფაილის ტიპები ამ ტესტში",
      acceptedText:
        "JPEG, PNG და WebP ფოტოები, ასევე ერთი DICOM სურათი. გააზიარეთ მხოლოდ თქვენი მოთხოვნისთვის საჭირო მასალა.",
      privateTitle: "საჯარო ბმული არ იქმნება",
      privateText:
        "ამ კერძო სატესტო ვერსიაში ფაილები ინახება საიტის არასაჯარო საცავში. ვებსაიტი ფაილების ნახვის ან ჩამოტვირთვის გზას არ იძლევა.",
      nextTitle: "კონტროლი ამ სესიის განმავლობაში",
      nextText:
        "ატვირთვის შემდეგ დააკოპირეთ რეფერენსი. სანამ მიღების დასტური ღიაა, ატვირთვის თავად წაშლაც შეგიძლიათ; დახურვა ან გვერდის განახლება ამ შესაძლებლობას ასრულებს.",
    },
    form: {
      detailsLegend: "საკონტაქტო მონაცემები",
      name: "სახელი და გვარი",
      namePlaceholder: "თქვენი სახელი",
      email: "ელფოსტა",
      phone: "ტელეფონი / WhatsApp",
      optional: "არასავალდებულო",
      context: "მოკლე კონტექსტი",
      contextPlaceholder:
        "მაგალითად: იმპლანტების წინასწარი შეფასება. არ გამოიყენოთ გადაუდებელი სიმპტომებისთვის.",
      filesLegend: "რენტგენის სურათები ან კბილების ფოტოები",
      chooseFiles: "ფაილების არჩევა",
      dropFiles: "ან ჩამოაგდეთ აქ",
      fileRules:
        "{formats} · მაქსიმუმ {maxSize} თითო ფაილზე · {maxFiles} ფაილი · სულ {maxTotal}",
      dicomHint:
        "CBCT სერია ან ZIP არქივი? სთხოვეთ კლინიკას შესაბამისი გადაცემის გზა.",
      photoTip:
        "გამოიყენეთ კარგი განათება, მკაფიო ფოტო და არ გამოიყენოთ ფილტრი. შეწყვიტეთ, თუ ფოტოს გადაღება ტკივილს იწვევს.",
      removeFile: "წაშლა",
      ownershipConsent:
        "ვადასტურებ, რომ ეს ფაილები მე მეკუთვნის ან მათი გაზიარების უფლება მაქვს.",
      healthConsent:
        "ვადასტურებ, რომ ამ კერძო წინასწარ ვერსიას შეუძლია ფორმაში შეტანილი საკონტაქტო მონაცემების, კონტექსტისა და უვნებელი სატესტო ფაილების დამუშავება. რეალური პაციენტის მონაცემებს არ ვაგზავნი.",
      privacyLink: "წაიკითხეთ, როგორ მუშავდება თქვენი მონაცემები",
      clinicalNote:
        "ონლაინ განხილვა მხოლოდ წინასწარია. დიაგნოზის, საბოლოო მკურნალობის გეგმისა და ფასისთვის კლინიკაში გამოკვლევაა საჭირო.",
      submit: "უვნებელი სატესტო ფაილების შენახვა",
      uploading: "ფაილები იტვირთება… არ დახუროთ ეს ფანჯარა.",
      checking: "მოწმდება ფაილის ტიპი და გადაცემა…",
    },
    success: {
      eyebrow: "სატესტო ატვირთვა მიღებულია",
      title: "თქვენი სატესტო ფაილები შენახულია.",
      body:
        "ისინი შენახულია რეფერენსით {reference}. დაუკავშირდით კლინიკას და მიუთითეთ ეს რეფერენსი. ეს არ არის დიაგნოზი და არ ადასტურებს ვიზიტს.",
      referenceLabel: "თქვენი რეფერენსი",
      copyReference: "რეფერენსის კოპირება",
      copied: "რეფერენსი დაკოპირდა",
      copyFailed:
        "კოპირება დაიბლოკა. მონიშნეთ და დააკოპირეთ რეფერენსი ზემოთ.",
      contactClinic: "კლინიკის ინფორმირება",
      contactCopied: "კლინიკის შეტყობინება დაკოპირდა",
      contactMessage:
        "გამარჯობა Marea Dental, ფაილები საიტის ცალკე ატვირთვით შევინახე. რეფერენსი: {reference}. სასურველი ენა: {language}.",
      deleteUpload: "ჩემი ატვირთვის წაშლა",
      deleting: "ფაილები იშლება…",
      deleteConfirm:
        "ატვირთული ფაილები ახლა სამუდამოდ წაიშალოს? მოქმედების გაუქმება შეუძლებელია.",
      cancel: "ფაილების შენარჩუნება",
      deletedTitle: "ატვირთვა წაიშალა",
      deletedText:
        "ამ რეფერენსთან დაკავშირებული ფაილები და ჩანაწერი საიტის არასაჯარო საცავიდან წაიშალა.",
      deleteFailed:
        "ატვირთვის წაშლა ახლა ვერ მოხერხდა. შეინახეთ რეფერენსი და სთხოვეთ კლინიკას წაშლა.",
      newUpload: "ახალი ატვირთვის დაწყება",
    },
    errors: {
      NO_FILE: "აირჩიეთ მინიმუმ ერთი ფაილი.",
      TOO_MANY_FILES: "შეგიძლიათ ატვირთოთ მაქსიმუმ {maxFiles} ფაილი.",
      FILE_TOO_LARGE: "ერთ-ერთი ფაილი აღემატება {maxSize}-ს.",
      TOTAL_TOO_LARGE: "ფაილების ჯამური ზომა არ უნდა აღემატებოდეს {maxTotal}-ს.",
      FILE_TYPE_REJECTED:
        "ფაილმა ტიპის შემოწმება ვერ გაიარა. გამოიყენეთ ორიგინალი {formats} ფაილი.",
      INVALID_FIELDS:
        "შეამოწმეთ სავალდებულო მონაცემები და ორივე დადასტურება.",
      SESSION_EXPIRED:
        "ატვირთვის სესია დასრულდა. უსაფრთხოებისთვის ფაილები თავიდან აირჩიეთ.",
      ORIGIN_REJECTED:
        "ატვირთვის მოთხოვნა უსაფრთხოების მიზნით დაიბლოკა.",
      SERVICE_UNAVAILABLE:
        "პირადი ატვირთვა დროებით მიუწვდომელია. ფაილები არ მიგვიღია.",
      REQUEST_TIMEOUT:
        "მოთხოვნას ზედმეტად დიდი დრო დასჭირდა და მიღება არ დადასტურდა. სამედიცინო ფაილებით ხელახლა ნუ სცდით; დაუკავშირდით კლინიკას დანართის გარეშე.",
      CLEANUP_INCOMPLETE:
        "ატვირთვა არ დასრულდა და ავტომატური გასუფთავება შესაძლოა არასრული იყოს. სამედიცინო ფაილებით ხელახლა ნუ სცდით; აცნობეთ კლინიკას დანართის გარეშე.",
      UPLOAD_FAILED:
        "ატვირთვა ვერ შესრულდა და მიღება არ დადასტურდა. ხელახლა სცადეთ მხოლოდ უვნებელი სატესტო ფაილით ან დაგვიკავშირდით WhatsApp-ით სამედიცინო ფაილების მიმაგრების გარეშე.",
      INVALID_REQUEST:
        "ატვირთვის მოთხოვნის წაკითხვა ვერ მოხერხდა. სცადეთ ხელახლა.",
    },
    privacy: {
      sectionTitle: "რენტგენისა და კბილების ფოტოების ატვირთვა",
      sectionText:
        "ატვირთული ფაილები ჯანმრთელობის მონაცემებია. ამ კერძო სატესტო ვერსიაში ისინი შემთხვევითი რეფერენსით საიტის არასაჯარო საცავში ინახება, კლინიკას ავტომატურად არ ეგზავნება და საჯარო ჩამოტვირთვის გზა არ იქმნება. წაშლის ღილაკი ხელმისაწვდომია მხოლოდ სანამ მიღების დასტური ღიაა. 30-დღიანი თარიღი მხოლოდ მეტამონაცემია; ავტომატური წაშლა არ არის გამართული. რეალური პაციენტის ფაილების საჯაროდ მიღებამდე უნდა დადასტურდეს და აღიწეროს მონაცემთა პასუხისმგებელი, დამმუშავებლები, შენახვის ადგილი, წვდომის როლები, ინციდენტის პროცესი და შენახვის ვადა.",
    },
  },
};

export function formatUploadText(
  value: string,
  replacements: Record<string, string | number>,
) {
  return Object.entries(replacements).reduce(
    (result, [key, replacement]) =>
      result.replaceAll(`{${key}}`, String(replacement)),
    value,
  );
}
