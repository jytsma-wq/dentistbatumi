import type { Locale } from "./locales";

type PrivacyContent = {
  link: string;
  eyebrow: string;
  title: string;
  lead: string;
  sections: { title: string; text: string }[];
  noteTitle: string;
  noteText: string;
};

export const privacyContent: Record<Locale, PrivacyContent> = {
  en: {
    link: "Privacy",
    eyebrow: "Private prototype",
    title: "Clear about your data from the start.",
    lead:
      "This review version does not pretend to be a finished patient portal. It explains exactly what the appointment planner and WhatsApp handoff currently do.",
    sections: [
      {
        title: "Appointment planner",
        text:
          "Details you enter stay temporarily in your browser. They are not sent to or stored by a Marea Dental server. Closing the panel clears the form.",
      },
      {
        title: "WhatsApp handoff",
        text:
          "WhatsApp receives only a short introduction with your patient route and preferred language. Once you open WhatsApp, its provider processes the contact. Do not send scans or sensitive medical files there.",
      },
      {
        title: "Technical operation",
        text:
          "The prototype intentionally adds no non-essential analytics. The hosting service may still process technical request data needed to operate and secure the site.",
      },
      {
        title: "Before public launch",
        text:
          "The clinic’s verified legal identity, data-controller details, contact information, processors, retention periods, patient rights and a suitable secure intake route must be added before accepting real patient data.",
      },
    ],
    noteTitle: "No diagnosis or confirmed booking",
    noteText:
      "The website provides general information. An appointment exists only after confirmation by the clinic, and treatment decisions follow an in-person clinical examination.",
  },
  nl: {
    link: "Privacy",
    eyebrow: "Privéprototype",
    title: "Vanaf het begin duidelijk over uw gegevens.",
    lead:
      "Deze beoordelingsversie doet zich niet voor als een voltooid patiëntenportaal. Hier staat precies wat de afspraakplanner en WhatsApp-overdracht nu doen.",
    sections: [
      {
        title: "Afspraakplanner",
        text:
          "Gegevens die u invult blijven tijdelijk in uw browser. Ze worden niet naar een server van Marea Dental gestuurd of daar opgeslagen. Bij het sluiten wordt het formulier gewist.",
      },
      {
        title: "Overdracht naar WhatsApp",
        text:
          "WhatsApp ontvangt alleen een korte introductie met uw patiëntenroute en voorkeurstaal. Zodra u WhatsApp opent, verwerkt de aanbieder het contact. Stuur daar geen scans of gevoelige medische bestanden.",
      },
      {
        title: "Technische werking",
        text:
          "Aan dit prototype zijn bewust geen niet-noodzakelijke analysetools toegevoegd. De hostingdienst kan wel technische verzoekgegevens verwerken die nodig zijn voor werking en beveiliging.",
      },
      {
        title: "Vóór publieke lancering",
        text:
          "De geverifieerde juridische identiteit van de kliniek, gegevens van de verwerkingsverantwoordelijke, contactgegevens, verwerkers, bewaartermijnen, patiëntenrechten en een geschikte veilige intakeroute moeten worden toegevoegd vóór echte patiëntgegevens worden aangenomen.",
      },
    ],
    noteTitle: "Geen diagnose of bevestigde afspraak",
    noteText:
      "De website geeft algemene informatie. Een afspraak bestaat pas na bevestiging door de kliniek; behandelbeslissingen volgen na klinisch onderzoek ter plaatse.",
  },
  de: {
    link: "Datenschutz",
    eyebrow: "Privater Prototyp",
    title: "Von Anfang an transparent mit Ihren Daten.",
    lead:
      "Diese Prüfversion gibt sich nicht als fertiges Patientenportal aus. Sie erklärt genau, was Terminplaner und WhatsApp-Übergabe derzeit tun.",
    sections: [
      {
        title: "Terminplaner",
        text:
          "Ihre Eingaben bleiben vorübergehend in Ihrem Browser. Sie werden weder an einen Server von Marea Dental gesendet noch dort gespeichert. Beim Schließen wird das Formular gelöscht.",
      },
      {
        title: "Übergabe an WhatsApp",
        text:
          "WhatsApp erhält nur eine kurze Einführung mit Patientenweg und bevorzugter Sprache. Nach dem Öffnen verarbeitet der Anbieter den Kontakt. Senden Sie dort keine Scans oder sensiblen medizinischen Dateien.",
      },
      {
        title: "Technischer Betrieb",
        text:
          "Der Prototyp enthält bewusst keine nicht notwendigen Analysen. Der Hostingdienst kann technische Anfragedaten verarbeiten, die für Betrieb und Sicherheit erforderlich sind.",
      },
      {
        title: "Vor dem öffentlichen Start",
        text:
          "Verifizierte Rechtsperson und Verantwortlicher, Kontaktdaten, Auftragsverarbeiter, Speicherfristen, Patientenrechte und ein geeigneter Übermittlungsweg müssen ergänzt werden, bevor echte Patientendaten angenommen werden.",
      },
    ],
    noteTitle: "Keine Diagnose oder Terminbestätigung",
    noteText:
      "Die Website bietet allgemeine Informationen. Ein Termin besteht erst nach Bestätigung durch die Klinik; Behandlungsentscheidungen folgen nach klinischer Untersuchung vor Ort.",
  },
  fr: {
    link: "Confidentialité",
    eyebrow: "Prototype privé",
    title: "Clair sur vos données dès le départ.",
    lead:
      "Cette version d’évaluation ne se présente pas comme un portail patient achevé. Elle explique exactement le fonctionnement actuel du planificateur et du passage vers WhatsApp.",
    sections: [
      {
        title: "Planificateur de rendez-vous",
        text:
          "Les informations saisies restent temporairement dans votre navigateur. Elles ne sont ni envoyées ni stockées sur un serveur de Marea Dental. La fermeture du panneau efface le formulaire.",
      },
      {
        title: "Passage vers WhatsApp",
        text:
          "WhatsApp reçoit uniquement une brève introduction avec votre parcours et votre langue. Dès son ouverture, son fournisseur traite le contact. N’y envoyez aucun scan ni document médical sensible.",
      },
      {
        title: "Fonctionnement technique",
        text:
          "Aucun outil d’analyse non essentiel n’est volontairement ajouté au prototype. L’hébergeur peut néanmoins traiter les données techniques nécessaires au fonctionnement et à la sécurité.",
      },
      {
        title: "Avant l’ouverture publique",
        text:
          "L’identité juridique vérifiée de la clinique, le responsable du traitement, les coordonnées, sous-traitants, durées de conservation, droits des patients et un canal d’admission sécurisé adapté doivent être ajoutés avant toute collecte réelle.",
      },
    ],
    noteTitle: "Ni diagnostic ni rendez-vous confirmé",
    noteText:
      "Le site fournit des informations générales. Le rendez-vous n’existe qu’après confirmation par la clinique et toute décision de traitement suit un examen clinique sur place.",
  },
  lb: {
    link: "Dateschutz",
    eyebrow: "Privat Prototyp",
    title: "Vun Ufank u kloer iwwer Är Donnéeën.",
    lead:
      "Dës Versioun fir d’Iwwerpréiwung gëtt sech net als fäerdege Patienteportal aus. Si erkläert genee, wat de Rendez-vous-Planer an d’Weiderleedung op WhatsApp elo maachen.",
    sections: [
      {
        title: "Rendez-vous-Planer",
        text:
          "Är Donnéeë bleiwen temporär an Ärem Browser. Si ginn net un e Server vu Marea Dental geschéckt oder do gespäichert. Beim Zoumaache gëtt de Formulaire geläscht.",
      },
      {
        title: "Weider op WhatsApp",
        text:
          "WhatsApp kritt nëmmen eng kuerz Aféierung mat Ärem Wee an Ärer Sprooch. Nom Opmaache verschafft den Ubidder de Kontakt. Schéckt do keng Scannen oder sensibel medezinesch Dokumenter.",
      },
      {
        title: "Technesche Betrib",
        text:
          "De Prototyp setzt bewosst keng net néideg Analysen an. Den Hostingdéngscht kann technesch Ufrodate verschaffen, déi fir de Betrib an d'Sécherheet néideg sinn.",
      },
      {
        title: "Virum ëffentleche Start",
        text:
          "Déi verifizéiert juristesch Identitéit, d’Organisatioun, déi fir d’Dateveraarbechtung responsabel ass, Kontaktdonnéeën, Déngschtleeschter, Späicherfristen, Patientenrechter an e passenden Iwwerdroungswee musse virun der Notzung mat echte Patientendonnéeën ergänzt ginn.",
      },
    ],
    noteTitle: "Keng Diagnos a keng Bestätegung vun engem Rendez-vous",
    noteText:
      "D’Website gëtt allgemeng Informatiounen. E Rendez-vous besteet eréischt no der Confirmatioun vun der Klinik; Behandlungsentscheedunge ginn no enger klinescher Ënnersichung op der Plaz getraff.",
  },
  ka: {
    link: "კონფიდენციალურობა",
    eyebrow: "პირადი პროტოტიპი",
    title: "თქვენი მონაცემების შესახებ თავიდანვე მკაფიოდ.",
    lead:
      "ეს განსახილველი ვერსია თავს დასრულებულ პაციენტის პორტალად არ წარმოადგენს. აქ ზუსტადაა აღწერილი, რას აკეთებს ახლა ვიზიტის დამგეგმავი და WhatsApp-ზე გადასვლა.",
    sections: [
      {
        title: "ვიზიტის დამგეგმავი",
        text:
          "შეყვანილი მონაცემები დროებით თქვენს ბრაუზერში რჩება. ისინი Marea Dental-ის სერვერზე არ იგზავნება და არ ინახება. ფანჯრის დახურვისას ფორმა იშლება.",
      },
      {
        title: "WhatsApp-ზე გადასვლა",
        text:
          "WhatsApp იღებს მხოლოდ მოკლე შესავალს თქვენი გზისა და სასურველი ენის შესახებ. WhatsApp-ის გახსნის შემდეგ კონტაქტს მისი მომწოდებელი ამუშავებს. იქ ნუ გააგზავნით სკანებს ან მგრძნობიარე სამედიცინო ფაილებს.",
      },
      {
        title: "ტექნიკური მუშაობა",
        text:
          "პროტოტიპს განზრახ არ აქვს დამატებული არასავალდებულო ანალიტიკა. ჰოსტინგის სერვისმა შეიძლება დაამუშაოს მუშაობისა და უსაფრთხოებისთვის საჭირო ტექნიკური მოთხოვნის მონაცემები.",
      },
      {
        title: "საჯარო გაშვებამდე",
        text:
          "რეალური პაციენტის მონაცემების მიღებამდე უნდა დაემატოს კლინიკის გადამოწმებული იურიდიული იდენტობა, მონაცემთა პასუხისმგებელი, საკონტაქტო ინფორმაცია, დამმუშავებლები, შენახვის ვადები, პაციენტის უფლებები და შესაბამისი უსაფრთხო მიღების გზა.",
      },
    ],
    noteTitle: "არც დიაგნოზი, არც დადასტურებული ვიზიტი",
    noteText:
      "ვებსაიტი ზოგად ინფორმაციას იძლევა. ვიზიტი არსებობს მხოლოდ კლინიკის დადასტურების შემდეგ, ხოლო მკურნალობის გადაწყვეტილება მიიღება კლინიკაში გამოკვლევის საფუძველზე.",
  },
};
