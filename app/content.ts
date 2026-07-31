import type { Locale, TreatmentSlug } from "./locales";

export type TreatmentContent = {
  slug: TreatmentSlug;
  number: string;
  title: string;
  short: string;
  audience: string;
  timing: string;
};

export type SiteCopy = {
  languageName: string;
  utility: string;
  nav: {
    home: string;
    treatments: string;
    results: string;
    clinic: string;
    local: string;
    international: string;
    contact: string;
    language: string;
    menu: string;
    primaryLabel: string;
  };
  actions: {
    whatsapp: string;
    appointment: string;
    onlineAssessment: string;
    call: string;
    quickActions: string;
    quickQuestion: string;
    chooseMoment: string;
    learnMore: string;
    viewAll: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    emphasis: string;
    lead: string;
    localCta: string;
    internationalLink: string;
    proof: string[];
    imageAlt: string;
  };
  routes: {
    eyebrow: string;
    title: string;
    local: {
      eyebrow: string;
      title: string;
      text: string;
      cta: string;
    };
    international: {
      eyebrow: string;
      title: string;
      text: string;
      cta: string;
    };
  };
  needs: {
    eyebrow: string;
    title: string;
    items: string[];
  };
  treatmentSection: {
    eyebrow: string;
    title: string;
    intro: string;
  };
  treatments: TreatmentContent[];
  process: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: { title: string; text: string }[];
  };
  stay21: {
    eyebrow: string;
    title: string;
    text: string;
    note: string;
    link: string;
  };
  proof: {
    eyebrow: string;
    title: string;
    items: string[];
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { question: string; answer: string }[];
  };
  pages: {
    treatmentsTitle: string;
    treatmentsLead: string;
    treatmentDetailEyebrow: string;
    forWhom: string;
    forWhomText: string;
    planTitle: string;
    planSteps: string[];
    timing: string;
    timingNote: string;
    priceTitle: string;
    priceText: string;
    resultsTitle: string;
    resultsLead: string;
    resultsPrinciple: string;
    resultsPrincipleText: string;
    casePending: string;
    caseFields: string[];
    clinicTitle: string;
    clinicLead: string;
    clinicPrinciples: { title: string; text: string }[];
    teamTitle: string;
    teamText: string;
    teamRoles: string[];
    verification: string;
    localTitle: string;
    localLead: string;
    localCards: { title: string; text: string }[];
    internationalTitle: string;
    internationalLead: string;
    internationalSteps: { title: string; text: string }[];
    autonomyTitle: string;
    autonomyText: string;
    contactTitle: string;
    contactLead: string;
    contactCards: { title: string; text: string }[];
  };
  booking: {
    eyebrow: string;
    title: string;
    close: string;
    closeWhatsApp: string;
    routeQuestion: string;
    routeLabel: string;
    localRoute: string;
    internationalRoute: string;
    name: string;
    namePlaceholder: string;
    phone: string;
    email: string;
    treatment: string;
    choose: string;
    date: string;
    time: string;
    flexible: string;
    language: string;
    note: string;
    noteLocal: string;
    noteInternational: string;
    consent: string;
    privacy: string;
    review: string;
    readyEyebrow: string;
    readyTitle: string;
    readyText: string;
    sendWhatsApp: string;
    copy: string;
    copied: string;
    copyFailed: string;
    edit: string;
    numberPending: string;
    messageGreeting: string;
    messageClosing: string;
    treatmentOptions: string[];
    timeOptions: string[];
  };
  footer: {
    eyebrow: string;
    title: string;
    description: string;
    visit: string;
    navigate: string;
    contact: string;
    addressPending: string;
    contactPending: string;
    prototypeNote: string;
  };
};

const sharedPlanSteps = {
  en: ["Assessment", "Written plan", "Treatment", "Review & records"],
  nl: ["Onderzoek", "Schriftelijk plan", "Behandeling", "Controle & dossier"],
  de: ["Untersuchung", "Schriftlicher Plan", "Behandlung", "Kontrolle & Unterlagen"],
  fr: ["Examen", "Plan écrit", "Traitement", "Contrôle et dossier"],
  lb: ["Ënnersichung", "Schrëftleche Plang", "Behandlung", "Kontroll & Dossier"],
  ka: ["გამოკვლევა", "წერილობითი გეგმა", "მკურნალობა", "კონტროლი და დოკუმენტები"],
} as const;

export const siteCopy: Record<Locale, SiteCopy> = {
  en: {
    languageName: "English",
    utility: "For local and international patients",
    nav: {
      home: "Home",
      treatments: "Treatments",
      results: "Results",
      clinic: "Dentists & clinic",
      local: "In Batumi",
      international: "International",
      contact: "Contact",
      language: "Choose language",
      menu: "Open menu",
      primaryLabel: "Primary navigation",
    },
    actions: {
      whatsapp: "WhatsApp",
      appointment: "Request appointment",
      onlineAssessment: "Start online assessment",
      call: "Call clinic",
      quickActions: "Quick contact",
      quickQuestion: "Ask a practical question",
      chooseMoment: "Choose your preferred time",
      learnMore: "Learn more",
      viewAll: "View all",
    },
    hero: {
      eyebrow: "One dental clinic · Batumi",
      title: "Skilled dentistry.",
      emphasis: "A clear plan. No unnecessary waiting.",
      lead:
        "From check-ups and urgent pain to implants, restorations and complete smile rehabilitation—for people in Batumi and patients travelling from abroad.",
      localCta: "Request an appointment",
      internationalLink: "Explore the 21-day pathway",
      proof: [
        "Local & international care",
        "Written treatment planning",
        "You decide at every step",
      ],
      imageAlt:
        "Editorial still life of a ceramic dental crown, dental mirror and sea glass",
    },
    routes: {
      eyebrow: "Choose your route",
      title: "One clinic. Two ways to begin.",
      local: {
        eyebrow: "I need care in Batumi",
        title: "Dental care in Batumi.",
        text:
          "Book a check-up, discuss pain or request a personal plan for ongoing dental care.",
        cta: "Appointment in Batumi",
      },
      international: {
        eyebrow: "I am travelling to Batumi",
        title: "Start at home with a careful review.",
        text:
          "Tell us what you need. We then discuss possible options, realistic timing and the next step before you travel.",
        cta: "Start online assessment",
      },
    },
    needs: {
      eyebrow: "Start with your question",
      title: "What would you like to solve?",
      items: [
        "Pain or an urgent dental problem",
        "One or more missing teeth",
        "Damaged crowns or worn teeth",
        "A more natural, confident smile",
        "A check-up or professional cleaning",
        "A complete mouth rehabilitation",
      ],
    },
    treatmentSection: {
      eyebrow: "Treatments",
      title: "Care for health, function and a natural smile.",
      intro:
        "Each treatment starts with diagnosis and a conversation about alternatives, timing and cost.",
    },
    treatments: [
      {
        slug: "general-dentistry",
        number: "01",
        title: "General dentistry",
        short: "Check-ups, hygiene and restorative care focused on preserving teeth.",
        audience: "For routine care, sensitivity, decay, broken fillings and prevention.",
        timing: "Often one or several clinic visits, depending on the diagnosis.",
      },
      {
        slug: "emergency-dentist",
        number: "02",
        title: "Urgent dental care",
        short: "A prompt clinical assessment for pain, swelling or a broken tooth.",
        audience: "For dental pain or damage that should not wait for a routine visit.",
        timing: "We first determine what is urgent and what definitive care is needed.",
      },
      {
        slug: "dental-implants",
        number: "03",
        title: "Dental implants",
        short: "Planned tooth replacement with function, hygiene and longevity in mind.",
        audience: "For one, several or all missing teeth after a full clinical assessment.",
        timing: "Implant treatment may require biological healing and a second phase.",
      },
      {
        slug: "crowns-bridges",
        number: "04",
        title: "Crowns & bridges",
        short: "Restore strength and appearance with carefully planned ceramic work.",
        audience: "For weakened, heavily restored or missing teeth.",
        timing: "The number of visits depends on preparation, laboratory work and fit checks.",
      },
      {
        slug: "full-mouth-rehabilitation",
        number: "05",
        title: "Full-mouth rehabilitation",
        short: "A coordinated plan for complex wear, failing dentistry or multiple problems.",
        audience: "For people who need function, comfort and appearance restored together.",
        timing: "Many stages can fit one stay; healing can require a later phase.",
      },
      {
        slug: "veneers-cosmetic-dentistry",
        number: "06",
        title: "Veneers & smile design",
        short: "Conservative aesthetic planning that respects natural teeth and facial balance.",
        audience: "For shape, colour, proportion or alignment concerns after health checks.",
        timing: "Timing depends on whether gums, bite or alignment need treatment first.",
      },
    ],
    process: {
      eyebrow: "How care works",
      title: "Clarity before treatment begins.",
      intro:
        "You receive the information needed to decide—without pressure and without hiding uncertainty.",
      steps: [
        { title: "Assessment", text: "We listen, examine and establish what information is still needed." },
        { title: "Written plan", text: "Options, expected steps, timing and costs are set out clearly." },
        { title: "Treatment", text: "Care follows the agreed plan and changes require your consent." },
        { title: "Review", text: "You leave with instructions, records and an appropriate follow-up route." },
      ],
    },
    stay21: {
      eyebrow: "Planning your stay",
      title: "A treatment pathway within 21 days—when medically appropriate.",
      text:
        "After assessment, we plan what can be performed safely during your stay. Healing, complexity or laboratory work may require more time or another visit.",
      note:
        "A time estimate is not a guarantee. Medical quality determines the pace.",
      link: "See the complete international pathway",
    },
    proof: {
      eyebrow: "Trust should be verifiable",
      title: "No anonymous clinic. No vague promises.",
      items: [
        "Named treating dentists and verifiable credentials",
        "Real clinical cases with consent and context",
        "Materials, stages and likely costs explained",
        "A clear distinction between temporary and definitive care",
      ],
    },
    faq: {
      eyebrow: "Good to know",
      title: "Frequently asked questions",
      items: [
        {
          question: "Can my treatment be completed within 21 days?",
          answer:
            "Some restorative and cosmetic pathways can fit within that period. Implant healing, bone treatment or complex findings may require more time or another phase.",
        },
        {
          question: "What should I share for an online assessment?",
          answer:
            "Your main concern, relevant medical information and any recent images you already have. Sensitive files should use a secure upload route, not WhatsApp.",
        },
        {
          question: "Is an online assessment already a diagnosis?",
          answer:
            "No. It helps prepare options and timing. Diagnosis, final plan and price follow an examination in the clinic.",
        },
        {
          question: "Do I have to use organised travel or aftercare?",
          answer:
            "No. You remain in control of travel and accommodation. The clinic provides treatment dates, practical information and appropriate follow-up documentation.",
        },
      ],
    },
    pages: {
      treatmentsTitle: "Dental treatment built around a proper diagnosis.",
      treatmentsLead:
        "Daily care and complex rehabilitation belong in one responsible clinical plan.",
      treatmentDetailEyebrow: "Treatment at Marea Dental",
      forWhom: "When can this treatment help?",
      forWhomText: "Suitability is confirmed only after a clinical examination and relevant imaging.",
      planTitle: "The treatment pathway",
      planSteps: [...sharedPlanSteps.en],
      timing: "Timing",
      timingNote: "A personal schedule is confirmed after assessment.",
      priceTitle: "Costs without surprises",
      priceText:
        "After examination you receive a written plan with expected costs. Any range given beforehand is indicative, not a final quotation.",
      resultsTitle: "Real treatments. Clearly documented.",
      resultsLead:
        "Results should prove clinical judgement—not merely show a perfect smile.",
      resultsPrinciple: "A case is evidence only when context is included.",
      resultsPrincipleText:
        "Each published case will identify the starting point, alternatives, treatment, materials, number of visits, calendar duration and treating dentist.",
      casePending: "Reserved for a verified patient case with written consent.",
      caseFields: ["Starting point", "Treatment", "Appointments", "Duration", "Dentist", "Materials"],
      clinicTitle: "One clinic. One accountable treatment team.",
      clinicLead:
        "You should know who plans your care, who performs it and how to reach them.",
      clinicPrinciples: [
        { title: "Explain first", text: "Diagnosis, options and limits come before treatment." },
        { title: "Preserve where possible", text: "Natural tissue is never sacrificed for a marketing promise." },
        { title: "Document clearly", text: "Your plan, materials and follow-up belong in your record." },
      ],
      teamTitle: "Meet the people behind your treatment",
      teamText:
        "Verified names, registrations, education, focus areas and spoken languages will be shown here before public launch.",
      teamRoles: ["Implant & surgical care", "Restorative dentistry", "Patient coordination"],
      verification: "Profile awaiting verification with the clinic.",
      localTitle: "Your regular dentist in Batumi.",
      localLead:
        "For check-ups, hygiene, pain and complete dental treatment—with clear appointments and explanation in your language.",
      localCards: [
        { title: "New patient visit", text: "A thorough first appointment, diagnosis and a plan you can understand." },
        { title: "Pain and urgent concerns", text: "Ask today about the first suitable assessment time." },
        { title: "Ongoing care", text: "Prevention, repairs and review arranged around your long-term oral health." },
      ],
      internationalTitle: "Dental treatment in Batumi, planned before you leave home.",
      internationalLead:
        "A careful pre-assessment helps establish realistic options, time and cost before you commit to a journey.",
      internationalSteps: [
        { title: "Tell us your goal", text: "Start with a short request—without sending sensitive records through WhatsApp." },
        { title: "Clinical pre-review", text: "Available images and health information are reviewed through an appropriate secure route." },
        { title: "Video conversation", text: "Discuss options, assumptions, timing and questions with the team." },
        { title: "Provisional written pathway", text: "Receive expected stages, range of costs and the days likely to be needed." },
        { title: "Arrival examination", text: "Diagnosis and the definitive plan are confirmed in the clinic." },
        { title: "Treatment and checks", text: "Appointments include necessary review and adjustment time." },
        { title: "Records for departure", text: "Leave with instructions, material information and your treatment record." },
      ],
      autonomyTitle: "Your journey. Your accommodation. Your decision.",
      autonomyText:
        "You organise travel independently. The clinic supplies confirmed appointment dates and practical treatment information so you can make your own choices.",
      contactTitle: "Start with a conversation.",
      contactLead:
        "Choose an appointment request or a practical WhatsApp question. Medical records use a secure route after initial contact.",
      contactCards: [
        { title: "Appointment request", text: "Tell us whether you live locally or plan to travel." },
        { title: "WhatsApp", text: "Best for quick, practical questions—not medical documents." },
        { title: "Clinic details", text: "Verified address, number and opening hours are linked before public launch." },
      ],
    },
    booking: {
      eyebrow: "Appointment request",
      title: "Tell us how we can help.",
      close: "Close appointment request",
      closeWhatsApp: "Close WhatsApp panel",
      routeQuestion: "Which route fits you?",
      routeLabel: "Patient route",
      localRoute: "I need dental care in Batumi",
      internationalRoute: "I am travelling from abroad",
      name: "Full name",
      namePlaceholder: "Your name",
      phone: "Phone / WhatsApp",
      email: "Email address",
      treatment: "Main reason",
      choose: "Choose an option",
      date: "Preferred date",
      time: "Preferred time",
      flexible: "No preference",
      language: "Preferred language",
      note: "Short note",
      noteLocal: "For example: check-up, pain or a broken filling.",
      noteInternational: "Tell us your goal and possible travel period. Do not include confidential medical records here.",
      consent:
        "I agree that my details may be used to contact me about this request.",
      privacy:
        "This request is not a diagnosis or confirmed appointment. Do not send scans or sensitive medical files through WhatsApp.",
      review: "Review request",
      readyEyebrow: "Ready for contact",
      readyTitle: "Your request is prepared.",
      readyText:
        "Your details stay in this browser. WhatsApp receives only a short introduction with your route and language; the clinic must still confirm availability.",
      sendWhatsApp: "Continue in WhatsApp",
      copy: "Copy safe introduction",
      copied: "Introduction copied",
      copyFailed: "Copying was blocked. Select and copy the introduction above.",
      edit: "Edit details",
      numberPending:
        "The verified clinic number still needs to be connected before public launch.",
      messageGreeting: "Hello Marea Dental, I have a practical question or would like to request an appointment.",
      messageClosing: "Please contact me to discuss a suitable next step.",
      treatmentOptions: [
        "Check-up or hygiene",
        "Pain or urgent concern",
        "Dental implants",
        "Crowns or bridges",
        "Full-mouth rehabilitation",
        "Veneers or smile design",
        "I am not sure yet",
      ],
      timeOptions: ["Morning", "Afternoon", "Evening"],
    },
    footer: {
      eyebrow: "Your next step",
      title: "A clear plan starts with a good conversation.",
      description:
        "A single dental clinic in Batumi for local and international patients.",
      visit: "Visit",
      navigate: "Explore",
      contact: "Contact",
      addressPending: "The exact clinic entrance and map link are added after verification.",
      contactPending: "Verified contact details are connected before public launch.",
      prototypeNote: "Private concept · clinical details require verification",
    },
  },

  nl: {
    languageName: "Nederlands",
    utility: "Voor lokale en internationale patiënten",
    nav: {
      home: "Home",
      treatments: "Behandelingen",
      results: "Resultaten",
      clinic: "Tandartsen & kliniek",
      local: "In Batumi",
      international: "Internationaal",
      contact: "Contact",
      language: "Kies taal",
      menu: "Open menu",
      primaryLabel: "Hoofdnavigatie",
    },
    actions: {
      whatsapp: "WhatsApp",
      appointment: "Afspraak aanvragen",
      onlineAssessment: "Start online beoordeling",
      call: "Bel de kliniek",
      quickActions: "Snel contact",
      quickQuestion: "Stel een praktische vraag",
      chooseMoment: "Kies uw voorkeursmoment",
      learnMore: "Lees meer",
      viewAll: "Bekijk alles",
    },
    hero: {
      eyebrow: "Eén tandartskliniek · Batumi",
      title: "Bekwame tandheelkunde.",
      emphasis: "Een duidelijk plan. Zonder onnodig wachten.",
      lead:
        "Van controle en acute pijn tot implantaten, restauraties en complete gebitsrehabilitatie — voor inwoners van Batumi en patiënten uit het buitenland.",
      localCta: "Afspraak aanvragen",
      internationalLink: "Bekijk het 21-dagentraject",
      proof: [
        "Lokale & internationale zorg",
        "Schriftelijk behandelplan",
        "U beslist bij iedere stap",
      ],
      imageAlt:
        "Redactioneel beeld van een keramische kroon, tandheelkundige spiegel en zeeglas",
    },
    routes: {
      eyebrow: "Kies uw route",
      title: "Eén kliniek. Twee manieren om te beginnen.",
      local: {
        eyebrow: "Ik zoek zorg in Batumi",
        title: "Tandheelkundige zorg in Batumi.",
        text:
          "Plan een controle, bespreek pijnklachten of vraag een persoonlijk plan voor duurzame mondzorg.",
        cta: "Afspraak in Batumi",
      },
      international: {
        eyebrow: "Ik reis naar Batumi",
        title: "Begin thuis met een zorgvuldige beoordeling.",
        text:
          "Vertel wat u nodig heeft. Daarna bespreken we mogelijke opties, een realistische planning en de volgende stap vóór uw reis.",
        cta: "Start online beoordeling",
      },
    },
    needs: {
      eyebrow: "Begin bij uw vraag",
      title: "Wat wilt u oplossen?",
      items: [
        "Pijn of een dringend tandprobleem",
        "Eén of meer ontbrekende tanden",
        "Beschadigde kronen of versleten tanden",
        "Een natuurlijke, zelfverzekerde glimlach",
        "Een controle of professionele reiniging",
        "Een volledige gebitsrehabilitatie",
      ],
    },
    treatmentSection: {
      eyebrow: "Behandelingen",
      title: "Zorg voor gezondheid, functie en een natuurlijke glimlach.",
      intro:
        "Iedere behandeling begint met diagnostiek en een gesprek over alternatieven, tijd en kosten.",
    },
    treatments: [
      { slug: "general-dentistry", number: "01", title: "Algemene tandheelkunde", short: "Controle, mondhygiëne en restauratieve zorg gericht op behoud.", audience: "Voor controles, gevoeligheid, gaatjes, gebroken vullingen en preventie.", timing: "Vaak één of meerdere kliniekbezoeken, afhankelijk van de diagnose." },
      { slug: "emergency-dentist", number: "02", title: "Dringende tandzorg", short: "Een snelle klinische beoordeling bij pijn, zwelling of een afgebroken tand.", audience: "Voor pijn of schade die niet op een routineafspraak kan wachten.", timing: "We bepalen eerst wat direct nodig is en welke definitieve zorg volgt." },
      { slug: "dental-implants", number: "03", title: "Tandimplantaten", short: "Geplande tandvervanging met aandacht voor functie, hygiëne en levensduur.", audience: "Voor één, meerdere of alle ontbrekende tanden na volledig onderzoek.", timing: "Implantaatzorg kan biologische genezing en een tweede fase vereisen." },
      { slug: "crowns-bridges", number: "04", title: "Kronen & bruggen", short: "Herstel van sterkte en vorm met zorgvuldig gepland keramiek.", audience: "Voor verzwakte, zwaar gevulde of ontbrekende tanden.", timing: "Het aantal bezoeken hangt af van voorbereiding, labwerk en pascontroles." },
      { slug: "full-mouth-rehabilitation", number: "05", title: "Volledige gebitsrehabilitatie", short: "Eén gecoördineerd plan bij ernstige slijtage of meerdere problemen.", audience: "Voor mensen bij wie functie, comfort en uiterlijk samen moeten worden hersteld.", timing: "Veel stappen passen in één verblijf; genezing kan een latere fase vragen." },
      { slug: "veneers-cosmetic-dentistry", number: "06", title: "Facings & smile design", short: "Conservatieve esthetische planning met respect voor natuurlijke tanden.", audience: "Bij wensen rond vorm, kleur, verhouding of stand na gezondheidscontrole.", timing: "De planning hangt af van tandvlees, beet en eventuele voorbehandeling." },
    ],
    process: {
      eyebrow: "Zo werkt de zorg",
      title: "Duidelijkheid vóór de behandeling begint.",
      intro:
        "U krijgt de informatie om zelf te beslissen — zonder druk en zonder onzekerheid te verbergen.",
      steps: [
        { title: "Onderzoek", text: "We luisteren, onderzoeken en bepalen welke informatie nog nodig is." },
        { title: "Schriftelijk plan", text: "Opties, stappen, planning en kosten worden helder vastgelegd." },
        { title: "Behandeling", text: "De zorg volgt het afgesproken plan; wijzigingen vragen uw toestemming." },
        { title: "Controle", text: "U vertrekt met instructies, dossier en passend vervolgadvies." },
      ],
    },
    stay21: {
      eyebrow: "Planning voor uw verblijf",
      title: "Een behandeltraject binnen 21 dagen — als dat medisch verantwoord is.",
      text:
        "Na beoordeling plannen we wat veilig tijdens uw verblijf kan worden uitgevoerd. Genezing, complexiteit of laboratoriumwerk kunnen meer tijd of een extra bezoek vragen.",
      note:
        "Een tijdsinschatting is geen garantie. Medische kwaliteit bepaalt het tempo.",
      link: "Bekijk het volledige internationale traject",
    },
    proof: {
      eyebrow: "Vertrouwen moet controleerbaar zijn",
      title: "Geen anonieme kliniek. Geen vage beloften.",
      items: [
        "Benoemde tandartsen met controleerbare kwalificaties",
        "Echte behandelcases met toestemming en context",
        "Materialen, stappen en verwachte kosten uitgelegd",
        "Duidelijk verschil tussen tijdelijke en definitieve zorg",
      ],
    },
    faq: {
      eyebrow: "Goed om te weten",
      title: "Veelgestelde vragen",
      items: [
        { question: "Kan mijn behandeling binnen 21 dagen worden afgerond?", answer: "Sommige restauratieve en cosmetische trajecten passen binnen die periode. Implantaatgenezing, botbehandeling of complexe bevindingen kunnen meer tijd of een tweede fase vragen." },
        { question: "Wat deel ik voor een online beoordeling?", answer: "Uw hoofdvraag, relevante medische informatie en recente beelden die u al heeft. Gevoelige bestanden gaan via een veilige route, niet via WhatsApp." },
        { question: "Is een online beoordeling al een diagnose?", answer: "Nee. Ze helpt opties en planning voorbereiden. Diagnose, definitief plan en prijs volgen na onderzoek in de kliniek." },
        { question: "Moet ik georganiseerde reis of nazorg gebruiken?", answer: "Nee. U houdt zelf de regie over reis en verblijf. De kliniek levert behandeldagen, praktische informatie en passende documentatie." },
      ],
    },
    pages: {
      treatmentsTitle: "Tandheelkundige behandeling op basis van een goede diagnose.",
      treatmentsLead: "Dagelijkse zorg en complexe rehabilitatie horen in één verantwoordelijk klinisch plan.",
      treatmentDetailEyebrow: "Behandeling bij Marea Dental",
      forWhom: "Wanneer kan deze behandeling helpen?",
      forWhomText: "Geschiktheid wordt pas bevestigd na klinisch onderzoek en relevante beeldvorming.",
      planTitle: "Het behandeltraject",
      planSteps: [...sharedPlanSteps.nl],
      timing: "Planning",
      timingNote: "Na beoordeling ontvangt u een persoonlijk tijdschema.",
      priceTitle: "Kosten zonder verrassingen",
      priceText: "Na onderzoek ontvangt u een schriftelijk plan met verwachte kosten. Een eerdere prijsrange is indicatief, geen definitieve offerte.",
      resultsTitle: "Echte behandelingen. Duidelijk gedocumenteerd.",
      resultsLead: "Resultaten moeten klinische afweging aantonen — niet alleen een perfecte glimlach tonen.",
      resultsPrinciple: "Een case is pas bewijs wanneer de context erbij staat.",
      resultsPrincipleText: "Iedere case vermeldt beginsituatie, alternatieven, behandeling, materialen, afspraken, kalenderduur en behandelaar.",
      casePending: "Gereserveerd voor een geverifieerde patiëntcase met schriftelijke toestemming.",
      caseFields: ["Beginsituatie", "Behandeling", "Afspraken", "Duur", "Tandarts", "Materialen"],
      clinicTitle: "Eén kliniek. Eén verantwoordelijk behandelteam.",
      clinicLead: "U hoort te weten wie uw zorg plant, wie haar uitvoert en hoe u die persoon bereikt.",
      clinicPrinciples: [
        { title: "Eerst uitleggen", text: "Diagnose, opties en grenzen komen vóór behandeling." },
        { title: "Behouden waar mogelijk", text: "Natuurlijk weefsel wijkt niet voor een marketingbelofte." },
        { title: "Helder documenteren", text: "Uw plan, materialen en vervolg horen in uw dossier." },
      ],
      teamTitle: "Ontmoet de mensen achter uw behandeling",
      teamText: "Geverifieerde namen, registraties, opleidingen, expertise en talen worden vóór publieke lancering getoond.",
      teamRoles: ["Implantologie & chirurgie", "Restauratieve tandheelkunde", "Patiëntcoördinatie"],
      verification: "Profiel wacht op verificatie door de kliniek.",
      localTitle: "Uw vaste tandarts in Batumi.",
      localLead: "Voor controle, mondhygiëne, pijn en complete behandeling — met duidelijke afspraken en uitleg in uw taal.",
      localCards: [
        { title: "Eerste bezoek", text: "Een grondige intake, diagnose en een plan dat u begrijpt." },
        { title: "Pijn en urgente vragen", text: "Vraag vandaag naar het eerste passende beoordelingsmoment." },
        { title: "Doorlopende zorg", text: "Preventie, herstel en controle gericht op mondgezondheid op lange termijn." },
      ],
      internationalTitle: "Tandheelkundige behandeling in Batumi, gepland vóór u vertrekt.",
      internationalLead: "Een zorgvuldige voorbeoordeling maakt opties, tijd en kosten realistischer voordat u een reis vastlegt.",
      internationalSteps: [
        { title: "Vertel uw doel", text: "Start met een korte aanvraag — zonder medische dossiers via WhatsApp." },
        { title: "Klinische voorbeoordeling", text: "Beelden en gezondheidsinformatie gaan via een passende veilige route." },
        { title: "Videogesprek", text: "Bespreek opties, aannames, planning en vragen met het team." },
        { title: "Voorlopig schriftelijk traject", text: "Ontvang stappen, kostenrange en waarschijnlijk benodigde dagen." },
        { title: "Onderzoek bij aankomst", text: "Diagnose en definitief plan worden in de kliniek bevestigd." },
        { title: "Behandeling en controles", text: "De planning bevat noodzakelijke controle- en aanpassingstijd." },
        { title: "Dossier voor vertrek", text: "U vertrekt met instructies, materiaalgegevens en behandelverslag." },
      ],
      autonomyTitle: "Uw reis. Uw verblijf. Uw beslissing.",
      autonomyText: "U organiseert de reis zelfstandig. De kliniek levert bevestigde behandeldagen en praktische informatie zodat u zelf kiest.",
      contactTitle: "Begin met een gesprek.",
      contactLead: "Kies een afspraakaanvraag of een praktische WhatsApp-vraag. Medische dossiers volgen via een veilige route.",
      contactCards: [
        { title: "Afspraak aanvragen", text: "Vertel of u lokaal woont of een reis plant." },
        { title: "WhatsApp", text: "Voor snelle praktische vragen — niet voor medische documenten." },
        { title: "Kliniekgegevens", text: "Geverifieerd adres, nummer en openingstijden worden vóór publieke lancering gekoppeld." },
      ],
    },
    booking: {
      eyebrow: "Afspraak aanvragen",
      title: "Vertel ons hoe we u kunnen helpen.",
      close: "Sluit afspraakaanvraag",
      closeWhatsApp: "Sluit WhatsApp-paneel",
      routeQuestion: "Welke route past bij u?",
      routeLabel: "Patiëntroute",
      localRoute: "Ik zoek tandzorg in Batumi",
      internationalRoute: "Ik reis vanuit het buitenland",
      name: "Volledige naam",
      namePlaceholder: "Uw naam",
      phone: "Telefoon / WhatsApp",
      email: "E-mailadres",
      treatment: "Hoofdreden",
      choose: "Kies een optie",
      date: "Gewenste datum",
      time: "Gewenst moment",
      flexible: "Geen voorkeur",
      language: "Voorkeurstaal",
      note: "Korte toelichting",
      noteLocal: "Bijvoorbeeld: controle, pijn of een gebroken vulling.",
      noteInternational: "Vertel uw doel en mogelijke reisperiode. Deel hier geen vertrouwelijke medische dossiers.",
      consent: "Ik geef toestemming om mijn gegevens te gebruiken om over deze aanvraag contact op te nemen.",
      privacy: "Deze aanvraag is geen diagnose of bevestigde afspraak. Stuur geen scans of medische bestanden via WhatsApp.",
      review: "Controleer aanvraag",
      readyEyebrow: "Klaar voor contact",
      readyTitle: "Uw aanvraag staat klaar.",
      readyText: "Uw gegevens blijven in deze browser. WhatsApp krijgt alleen een korte introductie met uw route en taal; de kliniek moet de beschikbaarheid nog bevestigen.",
      sendWhatsApp: "Ga verder in WhatsApp",
      copy: "Kopieer veilige introductie",
      copied: "Introductie gekopieerd",
      copyFailed: "Kopiëren is geblokkeerd. Selecteer en kopieer de introductie hierboven.",
      edit: "Gegevens wijzigen",
      numberPending: "Het geverifieerde klinieknummer moet nog worden gekoppeld vóór publieke lancering.",
      messageGreeting: "Hallo Marea Dental, ik heb een praktische vraag of wil graag een afspraak aanvragen.",
      messageClosing: "Wilt u contact met mij opnemen om een passende volgende stap te bespreken?",
      treatmentOptions: ["Controle of mondhygiëne", "Pijn of dringende klacht", "Tandimplantaten", "Kronen of bruggen", "Volledige gebitsrehabilitatie", "Facings of smile design", "Ik weet het nog niet"],
      timeOptions: ["Ochtend", "Middag", "Avond"],
    },
    footer: {
      eyebrow: "Uw volgende stap",
      title: "Een duidelijk plan begint met een goed gesprek.",
      description: "Eén tandartskliniek in Batumi voor lokale en internationale patiënten.",
      visit: "Bezoek",
      navigate: "Ontdek",
      contact: "Contact",
      addressPending: "De exacte ingang en kaartlink volgen na verificatie.",
      contactPending: "Geverifieerde contactgegevens worden vóór publieke lancering gekoppeld.",
      prototypeNote: "Privéconcept · klinische gegevens vereisen verificatie",
    },
  },

  de: {
    languageName: "Deutsch",
    utility: "Für lokale und internationale Patienten",
    nav: { home: "Startseite", treatments: "Behandlungen", results: "Ergebnisse", clinic: "Zahnärzte & Klinik", local: "In Batumi", international: "International", contact: "Kontakt", language: "Sprache wählen", menu: "Menü öffnen", primaryLabel: "Hauptnavigation" },
    actions: { whatsapp: "WhatsApp", appointment: "Termin anfragen", onlineAssessment: "Online-Einschätzung starten", call: "Klinik anrufen", quickActions: "Schnellkontakt", quickQuestion: "Praktische Frage stellen", chooseMoment: "Wunschzeit wählen", learnMore: "Mehr erfahren", viewAll: "Alle ansehen" },
    hero: { eyebrow: "Eine Zahnklinik · Batumi", title: "Kompetente Zahnmedizin.", emphasis: "Ein klarer Plan. Ohne unnötiges Warten.", lead: "Von Kontrolle und akuten Schmerzen bis zu Implantaten, Restaurationen und vollständiger Rehabilitation – für Menschen in Batumi und Patienten aus dem Ausland.", localCta: "Termin anfragen", internationalLink: "21-Tage-Ablauf ansehen", proof: ["Lokale & internationale Betreuung", "Schriftlicher Behandlungsplan", "Sie entscheiden bei jedem Schritt"], imageAlt: "Redaktionelles Stillleben mit Keramikkrone, Mundspiegel und Meerglas" },
    routes: {
      eyebrow: "Wählen Sie Ihren Weg", title: "Eine Klinik. Zwei Wege zum Start.",
      local: { eyebrow: "Ich suche Behandlung in Batumi", title: "Zahnmedizinische Betreuung in Batumi.", text: "Vereinbaren Sie eine Kontrolle, besprechen Sie Schmerzen oder fragen Sie nach einem persönlichen Langzeitplan.", cta: "Termin in Batumi" },
      international: { eyebrow: "Ich reise nach Batumi", title: "Beginnen Sie zu Hause mit einer sorgfältigen Einschätzung.", text: "Schildern Sie Ihr Anliegen. Danach besprechen wir mögliche Optionen, realistische Zeiten und den nächsten Schritt vor der Reise.", cta: "Online-Einschätzung starten" },
    },
    needs: { eyebrow: "Beginnen Sie mit Ihrer Frage", title: "Was möchten Sie lösen?", items: ["Schmerzen oder ein dringendes Problem", "Ein oder mehrere fehlende Zähne", "Beschädigte Kronen oder abgenutzte Zähne", "Ein natürliches, sicheres Lächeln", "Kontrolle oder professionelle Reinigung", "Vollständige Gebissrehabilitation"] },
    treatmentSection: { eyebrow: "Behandlungen", title: "Gesundheit, Funktion und ein natürliches Lächeln.", intro: "Jede Behandlung beginnt mit Diagnostik und einem Gespräch über Alternativen, Zeit und Kosten." },
    treatments: [
      { slug: "general-dentistry", number: "01", title: "Allgemeine Zahnmedizin", short: "Kontrolle, Prophylaxe und zahnerhaltende Versorgung.", audience: "Für Vorsorge, Empfindlichkeit, Karies und defekte Füllungen.", timing: "Je nach Diagnose ein oder mehrere Kliniktermine." },
      { slug: "emergency-dentist", number: "02", title: "Dringende Zahnbehandlung", short: "Zeitnahe Untersuchung bei Schmerzen, Schwellung oder Zahnbruch.", audience: "Für Beschwerden, die nicht bis zum Routinetermin warten sollten.", timing: "Zuerst klären wir das Dringende und dann die definitive Versorgung." },
      { slug: "dental-implants", number: "03", title: "Zahnimplantate", short: "Geplanter Zahnersatz mit Blick auf Funktion, Hygiene und Haltbarkeit.", audience: "Für einzelne, mehrere oder alle fehlenden Zähne nach Untersuchung.", timing: "Implantate können Heilung und eine zweite Behandlungsphase erfordern." },
      { slug: "crowns-bridges", number: "04", title: "Kronen & Brücken", short: "Stabilität und Ästhetik mit sorgfältig geplanter Keramik.", audience: "Für geschwächte, stark versorgte oder fehlende Zähne.", timing: "Termine hängen von Vorbereitung, Labor und Passkontrollen ab." },
      { slug: "full-mouth-rehabilitation", number: "05", title: "Komplette Rehabilitation", short: "Ein koordinierter Plan bei Verschleiß und mehreren Problemen.", audience: "Wenn Funktion, Komfort und Aussehen gemeinsam wiederhergestellt werden.", timing: "Viele Schritte passen in einen Aufenthalt; Heilung kann eine spätere Phase verlangen." },
      { slug: "veneers-cosmetic-dentistry", number: "06", title: "Veneers & Smile Design", short: "Schonende ästhetische Planung mit Respekt vor natürlichen Zähnen.", audience: "Bei Wünschen zu Form, Farbe, Proportion oder Stellung nach Gesundheitscheck.", timing: "Der Ablauf hängt von Zahnfleisch, Biss und Vorbehandlungen ab." },
    ],
    process: { eyebrow: "So läuft die Behandlung", title: "Klarheit, bevor die Behandlung beginnt.", intro: "Sie erhalten alle Informationen für Ihre Entscheidung – ohne Druck.", steps: [{ title: "Untersuchung", text: "Wir hören zu, untersuchen und klären fehlende Informationen." }, { title: "Schriftlicher Plan", text: "Optionen, Schritte, Zeit und Kosten werden verständlich festgehalten." }, { title: "Behandlung", text: "Die Versorgung folgt dem vereinbarten Plan; Änderungen brauchen Ihre Zustimmung." }, { title: "Kontrolle", text: "Sie erhalten Anweisungen, Unterlagen und eine passende Nachsorgeempfehlung." }] },
    stay21: { eyebrow: "Planung Ihres Aufenthalts", title: "Ein Behandlungsablauf innerhalb von 21 Tagen – wenn medizinisch vertretbar.", text: "Nach der Beurteilung planen wir, was während Ihres Aufenthalts sicher möglich ist. Heilung, Komplexität oder Laborarbeit können mehr Zeit oder einen weiteren Besuch verlangen.", note: "Eine Zeitangabe ist keine Garantie. Medizinische Qualität bestimmt das Tempo.", link: "Vollständigen internationalen Ablauf ansehen" },
    proof: { eyebrow: "Vertrauen muss überprüfbar sein", title: "Keine anonyme Klinik. Keine vagen Versprechen.", items: ["Namentlich genannte Behandler mit überprüfbaren Qualifikationen", "Echte Fälle mit Einwilligung und Kontext", "Erklärte Materialien, Schritte und erwartete Kosten", "Klare Trennung zwischen provisorischer und definitiver Versorgung"] },
    faq: { eyebrow: "Gut zu wissen", title: "Häufige Fragen", items: [
      { question: "Kann meine Behandlung in 21 Tagen abgeschlossen werden?", answer: "Einige restaurative und ästhetische Abläufe passen in diesen Zeitraum. Implantatheilung, Knochenbehandlung oder komplexe Befunde können mehr Zeit benötigen." },
      { question: "Was brauche ich für die Online-Einschätzung?", answer: "Ihr Anliegen, relevante Gesundheitsangaben und vorhandene aktuelle Bilder. Sensible Dateien werden sicher und nicht per WhatsApp geteilt." },
      { question: "Ist die Online-Einschätzung eine Diagnose?", answer: "Nein. Diagnose, definitiver Plan und Preis folgen nach der Untersuchung in der Klinik." },
      { question: "Muss ich organisierte Reise oder Nachsorge nutzen?", answer: "Nein. Sie organisieren Reise und Unterkunft selbst. Die Klinik liefert Termine, praktische Informationen und Unterlagen." },
    ] },
    pages: {
      treatmentsTitle: "Zahnbehandlung auf Grundlage einer guten Diagnose.", treatmentsLead: "Alltagsversorgung und komplexe Rehabilitation gehören in einen verantwortlichen klinischen Plan.", treatmentDetailEyebrow: "Behandlung bei Marea Dental", forWhom: "Wann kann diese Behandlung helfen?", forWhomText: "Die Eignung wird erst nach Untersuchung und relevanter Bildgebung bestätigt.", planTitle: "Der Behandlungsablauf", planSteps: [...sharedPlanSteps.de], timing: "Zeitplanung", timingNote: "Nach der Beurteilung erhalten Sie einen persönlichen Zeitplan.", priceTitle: "Kosten ohne Überraschungen", priceText: "Nach der Untersuchung erhalten Sie einen schriftlichen Plan mit erwarteten Kosten. Frühere Preisspannen sind unverbindlich.",
      resultsTitle: "Echte Behandlungen. Klar dokumentiert.", resultsLead: "Ergebnisse sollen klinische Entscheidungen belegen – nicht nur ein perfektes Lächeln zeigen.", resultsPrinciple: "Ein Fall ist nur mit Kontext ein Beleg.", resultsPrincipleText: "Jeder Fall nennt Ausgangslage, Alternativen, Behandlung, Material, Termine, Dauer und Behandler.", casePending: "Reserviert für einen verifizierten Patientenfall mit schriftlicher Einwilligung.", caseFields: ["Ausgangslage", "Behandlung", "Termine", "Dauer", "Zahnarzt", "Materialien"],
      clinicTitle: "Eine Klinik. Ein verantwortliches Behandlungsteam.", clinicLead: "Sie sollen wissen, wer plant, behandelt und für Fragen erreichbar ist.", clinicPrinciples: [{ title: "Zuerst erklären", text: "Diagnose, Optionen und Grenzen kommen vor der Behandlung." }, { title: "Erhalten, wo möglich", text: "Natürliches Gewebe weicht keinem Werbeversprechen." }, { title: "Klar dokumentieren", text: "Plan, Materialien und Nachsorge gehören in Ihre Unterlagen." }], teamTitle: "Die Menschen hinter Ihrer Behandlung", teamText: "Verifizierte Namen, Registrierungen, Ausbildung, Schwerpunkte und Sprachen erscheinen vor dem öffentlichen Start.", teamRoles: ["Implantologie & Chirurgie", "Restaurative Zahnmedizin", "Patientenkoordination"], verification: "Profil wartet auf Bestätigung durch die Klinik.",
      localTitle: "Ihre feste Zahnarztpraxis in Batumi.", localLead: "Für Kontrolle, Prophylaxe, Schmerzen und umfassende Behandlung – mit klaren Terminen und Erklärungen.", localCards: [{ title: "Erster Besuch", text: "Gründliche Aufnahme, Diagnose und ein verständlicher Plan." }, { title: "Schmerzen und Dringendes", text: "Fragen Sie heute nach dem ersten passenden Untersuchungstermin." }, { title: "Langfristige Betreuung", text: "Vorsorge, Reparatur und Kontrolle mit Blick auf dauerhafte Mundgesundheit." }],
      internationalTitle: "Zahnbehandlung in Batumi – geplant, bevor Sie abreisen.", internationalLead: "Eine sorgfältige Vorbeurteilung macht Optionen, Zeit und Kosten realistischer.", internationalSteps: [{ title: "Ziel beschreiben", text: "Starten Sie mit einer kurzen Anfrage – ohne Krankenunterlagen per WhatsApp." }, { title: "Klinische Vorprüfung", text: "Bilder und Gesundheitsangaben nutzen einen passenden sicheren Weg." }, { title: "Videogespräch", text: "Besprechen Sie Optionen, Annahmen, Zeit und Fragen." }, { title: "Vorläufiger schriftlicher Ablauf", text: "Erhalten Sie Schritte, Kostenrahmen und voraussichtliche Tage." }, { title: "Untersuchung bei Ankunft", text: "Diagnose und definitiver Plan werden in der Klinik bestätigt." }, { title: "Behandlung und Kontrollen", text: "Notwendige Kontroll- und Anpassungszeiten sind eingeplant." }, { title: "Unterlagen zur Abreise", text: "Sie erhalten Anweisungen, Materialdaten und Behandlungsbericht." }], autonomyTitle: "Ihre Reise. Ihre Unterkunft. Ihre Entscheidung.", autonomyText: "Sie organisieren die Reise selbst. Die Klinik stellt bestätigte Behandlungstage und praktische Informationen bereit.",
      contactTitle: "Beginnen Sie mit einem Gespräch.", contactLead: "Wählen Sie eine Terminanfrage oder eine praktische WhatsApp-Frage. Medizinische Unterlagen folgen über einen geeigneten sicheren Weg.", contactCards: [{ title: "Termin anfragen", text: "Sagen Sie uns, ob Sie vor Ort leben oder eine Reise planen." }, { title: "WhatsApp", text: "Für kurze praktische Fragen – nicht für medizinische Dokumente." }, { title: "Klinikdaten", text: "Verifizierte Adresse, Nummer und Öffnungszeiten folgen vor dem öffentlichen Start." }],
    },
    booking: {
      eyebrow: "Termin anfragen", title: "Sagen Sie uns, wie wir helfen können.", close: "Terminanfrage schließen", closeWhatsApp: "WhatsApp-Bereich schließen", routeQuestion: "Welcher Weg passt zu Ihnen?", routeLabel: "Patientenweg", localRoute: "Ich suche Zahnbehandlung in Batumi", internationalRoute: "Ich reise aus dem Ausland an", name: "Vor- und Nachname", namePlaceholder: "Ihr Name", phone: "Telefon / WhatsApp", email: "E-Mail-Adresse", treatment: "Hauptanliegen", choose: "Option wählen", date: "Wunschdatum", time: "Wunschzeit", flexible: "Keine Präferenz", language: "Bevorzugte Sprache", note: "Kurze Erläuterung", noteLocal: "Zum Beispiel Kontrolle, Schmerzen oder defekte Füllung.", noteInternational: "Nennen Sie Ziel und möglichen Reisezeitraum. Keine vertraulichen Krankenakten.", consent: "Ich stimme der Nutzung meiner Daten zur Kontaktaufnahme zu.", privacy: "Diese Anfrage ist keine Diagnose oder bestätigte Buchung. Keine Scans über WhatsApp.", review: "Anfrage prüfen", readyEyebrow: "Bereit zur Kontaktaufnahme", readyTitle: "Ihre Anfrage ist vorbereitet.", readyText: "Ihre Angaben bleiben in diesem Browser. WhatsApp erhält nur eine kurze Einführung mit Patientenweg und Sprache; die Klinik muss die Verfügbarkeit noch bestätigen.", sendWhatsApp: "Weiter zu WhatsApp", copy: "Sichere Einführung kopieren", copied: "Einführung kopiert", copyFailed: "Kopieren wurde blockiert. Markieren und kopieren Sie die Einführung oben.", edit: "Angaben ändern", numberPending: "Die verifizierte Kliniknummer wird vor dem öffentlichen Start verbunden.", messageGreeting: "Hallo Marea Dental, ich habe eine praktische Frage oder möchte einen Termin anfragen.", messageClosing: "Bitte kontaktieren Sie mich für den passenden nächsten Schritt.", treatmentOptions: ["Kontrolle oder Prophylaxe", "Schmerzen oder dringende Beschwerde", "Zahnimplantate", "Kronen oder Brücken", "Komplette Rehabilitation", "Veneers oder Smile Design", "Noch unsicher"], timeOptions: ["Vormittag", "Nachmittag", "Abend"],
    },
    footer: { eyebrow: "Ihr nächster Schritt", title: "Ein klarer Plan beginnt mit einem guten Gespräch.", description: "Eine Zahnklinik in Batumi für lokale und internationale Patienten.", visit: "Besuch", navigate: "Entdecken", contact: "Kontakt", addressPending: "Genauer Eingang und Kartenlink folgen nach Bestätigung.", contactPending: "Verifizierte Kontaktdaten werden vor dem öffentlichen Start verbunden.", prototypeNote: "Privates Konzept · klinische Angaben müssen bestätigt werden" },
  },

  fr: {
    languageName: "Français",
    utility: "Pour les patients locaux et internationaux",
    nav: { home: "Accueil", treatments: "Soins", results: "Résultats", clinic: "Dentistes & clinique", local: "À Batoumi", international: "International", contact: "Contact", language: "Choisir la langue", menu: "Ouvrir le menu", primaryLabel: "Navigation principale" },
    actions: { whatsapp: "WhatsApp", appointment: "Demander un rendez-vous", onlineAssessment: "Commencer l’évaluation", call: "Appeler la clinique", quickActions: "Contact rapide", quickQuestion: "Poser une question pratique", chooseMoment: "Choisir votre moment", learnMore: "En savoir plus", viewAll: "Tout voir" },
    hero: { eyebrow: "Une clinique dentaire · Batoumi", title: "Une dentisterie compétente.", emphasis: "Un plan clair. Sans attente inutile.", lead: "Du contrôle et de la douleur urgente aux implants, restaurations et réhabilitations complètes — pour les habitants de Batoumi et les patients venant de l’étranger.", localCta: "Demander un rendez-vous", internationalLink: "Voir le parcours de 21 jours", proof: ["Soins locaux & internationaux", "Plan de traitement écrit", "Vous décidez à chaque étape"], imageAlt: "Nature morte éditoriale avec couronne céramique, miroir dentaire et verre marin" },
    routes: {
      eyebrow: "Choisissez votre parcours", title: "Une clinique. Deux façons de commencer.",
      local: { eyebrow: "Je cherche des soins à Batoumi", title: "Des soins dentaires à Batoumi.", text: "Planifiez un contrôle, parlez-nous d’une douleur ou demandez un plan personnel à long terme.", cta: "Rendez-vous à Batoumi" },
      international: { eyebrow: "Je voyage à Batoumi", title: "Commencez chez vous par une évaluation attentive.", text: "Expliquez votre besoin. Nous abordons ensuite les options, un calendrier réaliste et la prochaine étape avant votre voyage.", cta: "Commencer l’évaluation" },
    },
    needs: { eyebrow: "Commencez par votre besoin", title: "Que souhaitez-vous résoudre ?", items: ["Douleur ou problème dentaire urgent", "Une ou plusieurs dents manquantes", "Couronnes endommagées ou dents usées", "Un sourire naturel et confiant", "Un contrôle ou nettoyage professionnel", "Une réhabilitation complète"] },
    treatmentSection: { eyebrow: "Soins", title: "La santé, la fonction et un sourire naturel.", intro: "Chaque traitement commence par un diagnostic et une discussion sur les alternatives, le temps et le coût." },
    treatments: [
      { slug: "general-dentistry", number: "01", title: "Dentisterie générale", short: "Contrôles, hygiène et soins conservateurs.", audience: "Pour la prévention, la sensibilité, les caries et les obturations cassées.", timing: "Une ou plusieurs visites selon le diagnostic." },
      { slug: "emergency-dentist", number: "02", title: "Soins dentaires urgents", short: "Évaluation rapide en cas de douleur, gonflement ou dent cassée.", audience: "Pour une douleur ou un dommage qui ne doit pas attendre.", timing: "Nous déterminons d’abord l’urgence puis le soin définitif." },
      { slug: "dental-implants", number: "03", title: "Implants dentaires", short: "Remplacement planifié en pensant à la fonction, l’hygiène et la durée.", audience: "Pour une, plusieurs ou toutes les dents manquantes après examen.", timing: "Les implants peuvent nécessiter cicatrisation et seconde phase." },
      { slug: "crowns-bridges", number: "04", title: "Couronnes & bridges", short: "Restaurer solidité et aspect avec une céramique soigneusement planifiée.", audience: "Pour des dents fragiles, très restaurées ou absentes.", timing: "Le nombre de visites dépend du laboratoire et des contrôles d’ajustement." },
      { slug: "full-mouth-rehabilitation", number: "05", title: "Réhabilitation complète", short: "Un plan coordonné en cas d’usure ou de problèmes multiples.", audience: "Quand fonction, confort et esthétique doivent être restaurés ensemble.", timing: "De nombreuses étapes tiennent en un séjour ; la cicatrisation peut imposer une autre phase." },
      { slug: "veneers-cosmetic-dentistry", number: "06", title: "Facettes & smile design", short: "Planification esthétique conservatrice respectant les dents naturelles.", audience: "Pour la forme, la couleur, les proportions ou l’alignement après contrôle.", timing: "Le calendrier dépend des gencives, de l’occlusion et des prétraitements." },
    ],
    process: { eyebrow: "Le déroulement", title: "La clarté avant de commencer.", intro: "Vous recevez les informations nécessaires pour décider, sans pression.", steps: [{ title: "Examen", text: "Nous écoutons, examinons et identifions les informations manquantes." }, { title: "Plan écrit", text: "Options, étapes, calendrier et coûts sont expliqués clairement." }, { title: "Traitement", text: "Les soins suivent le plan convenu ; tout changement exige votre accord." }, { title: "Contrôle", text: "Vous repartez avec instructions, dossier et suivi adapté." }] },
    stay21: { eyebrow: "Planifier votre séjour", title: "Un parcours en 21 jours — lorsque cela est médicalement approprié.", text: "Après évaluation, nous planifions ce qui peut être fait en sécurité. La cicatrisation, la complexité ou le laboratoire peuvent demander plus de temps.", note: "Une estimation n’est pas une garantie. La qualité médicale détermine le rythme.", link: "Voir tout le parcours international" },
    proof: { eyebrow: "La confiance doit être vérifiable", title: "Pas de clinique anonyme. Pas de promesses vagues.", items: ["Dentistes nommés et qualifications vérifiables", "Cas réels avec consentement et contexte", "Matériaux, étapes et coûts expliqués", "Distinction claire entre provisoire et définitif"] },
    faq: { eyebrow: "À savoir", title: "Questions fréquentes", items: [
      { question: "Mon traitement peut-il être terminé en 21 jours ?", answer: "Certains parcours restaurateurs ou esthétiques le permettent. La cicatrisation implantaire ou les cas complexes peuvent demander plus de temps." },
      { question: "Que transmettre pour une évaluation en ligne ?", answer: "Votre besoin, les informations de santé utiles et les images récentes disponibles. Les fichiers sensibles suivent une voie sécurisée." },
      { question: "L’évaluation en ligne est-elle un diagnostic ?", answer: "Non. Le diagnostic, le plan final et le prix suivent l’examen à la clinique." },
      { question: "Dois-je utiliser un voyage ou un suivi organisés ?", answer: "Non. Vous gardez la maîtrise du voyage. La clinique fournit dates, informations pratiques et dossier." },
    ] },
    pages: {
      treatmentsTitle: "Des soins fondés sur un diagnostic sérieux.", treatmentsLead: "Soins quotidiens et réhabilitation complexe appartiennent au même plan clinique responsable.", treatmentDetailEyebrow: "Traitement chez Marea Dental", forWhom: "Quand ce traitement peut-il aider ?", forWhomText: "L’indication n’est confirmée qu’après examen clinique et imagerie utile.", planTitle: "Le parcours de traitement", planSteps: [...sharedPlanSteps.fr], timing: "Calendrier", timingNote: "Un calendrier personnel est confirmé après l’évaluation.", priceTitle: "Des coûts sans surprise", priceText: "Après l’examen, vous recevez un plan écrit avec les coûts prévus. Toute fourchette préalable reste indicative.",
      resultsTitle: "De vrais traitements. Clairement documentés.", resultsLead: "Les résultats doivent montrer le raisonnement clinique, pas seulement un sourire parfait.", resultsPrinciple: "Un cas ne prouve quelque chose qu’avec son contexte.", resultsPrincipleText: "Chaque cas précise situation initiale, alternatives, traitement, matériaux, visites, durée et praticien.", casePending: "Réservé à un cas patient vérifié avec consentement écrit.", caseFields: ["Situation initiale", "Traitement", "Rendez-vous", "Durée", "Dentiste", "Matériaux"],
      clinicTitle: "Une clinique. Une équipe responsable.", clinicLead: "Vous devez savoir qui planifie, traite et répond à vos questions.", clinicPrinciples: [{ title: "Expliquer d’abord", text: "Diagnostic, options et limites précèdent le traitement." }, { title: "Préserver si possible", text: "Les tissus naturels ne sont jamais sacrifiés à une promesse marketing." }, { title: "Documenter clairement", text: "Plan, matériaux et suivi appartiennent à votre dossier." }], teamTitle: "Les personnes derrière votre traitement", teamText: "Noms, inscriptions, formations, domaines et langues vérifiés seront publiés avant l’ouverture publique.", teamRoles: ["Implantologie & chirurgie", "Dentisterie restauratrice", "Coordination patient"], verification: "Profil en attente de vérification par la clinique.",
      localTitle: "Votre dentiste habituel à Batoumi.", localLead: "Contrôles, hygiène, douleurs et traitements complets — avec des rendez-vous clairs et des explications dans votre langue.", localCards: [{ title: "Première visite", text: "Une consultation complète, un diagnostic et un plan compréhensible." }, { title: "Douleur et urgence", text: "Demandez aujourd’hui le premier créneau d’évaluation adapté." }, { title: "Suivi régulier", text: "Prévention, réparation et contrôle pour la santé à long terme." }],
      internationalTitle: "Un traitement à Batoumi, planifié avant votre départ.", internationalLead: "Une pré-évaluation sérieuse rend options, temps et coûts plus réalistes.", internationalSteps: [{ title: "Décrivez votre objectif", text: "Commencez par une demande courte, sans dossier médical sur WhatsApp." }, { title: "Pré-évaluation clinique", text: "Images et données de santé suivent un canal sécurisé approprié." }, { title: "Échange vidéo", text: "Discutez options, hypothèses, calendrier et questions." }, { title: "Parcours écrit provisoire", text: "Recevez les étapes, la fourchette de coûts et les jours probables." }, { title: "Examen à l’arrivée", text: "Diagnostic et plan définitif sont confirmés à la clinique." }, { title: "Traitement et contrôles", text: "Le calendrier intègre les contrôles et ajustements nécessaires." }, { title: "Dossier de départ", text: "Repartez avec instructions, matériaux et compte-rendu." }], autonomyTitle: "Votre voyage. Votre séjour. Votre décision.", autonomyText: "Vous organisez le voyage vous-même. La clinique fournit les dates confirmées et les informations pratiques.",
      contactTitle: "Commencez par une conversation.", contactLead: "Choisissez une demande de rendez-vous ou une question pratique sur WhatsApp. Les dossiers médicaux suivent une voie sécurisée.", contactCards: [{ title: "Demande de rendez-vous", text: "Dites-nous si vous vivez sur place ou préparez un voyage." }, { title: "WhatsApp", text: "Pour les questions pratiques, pas les documents médicaux." }, { title: "Coordonnées", text: "Adresse, numéro et horaires vérifiés seront reliés avant l’ouverture publique." }],
    },
    booking: {
      eyebrow: "Demande de rendez-vous", title: "Dites-nous comment vous aider.", close: "Fermer la demande", closeWhatsApp: "Fermer le panneau WhatsApp", routeQuestion: "Quel parcours vous correspond ?", routeLabel: "Parcours patient", localRoute: "Je cherche des soins à Batoumi", internationalRoute: "Je viens de l’étranger", name: "Nom complet", namePlaceholder: "Votre nom", phone: "Téléphone / WhatsApp", email: "Adresse e-mail", treatment: "Motif principal", choose: "Choisir une option", date: "Date souhaitée", time: "Moment souhaité", flexible: "Sans préférence", language: "Langue préférée", note: "Courte précision", noteLocal: "Par exemple : contrôle, douleur ou obturation cassée.", noteInternational: "Indiquez votre objectif et la période possible. Aucun dossier confidentiel ici.", consent: "J’accepte que mes données soient utilisées pour me recontacter.", privacy: "Cette demande n’est ni un diagnostic ni un rendez-vous confirmé. Aucun scan via WhatsApp.", review: "Vérifier la demande", readyEyebrow: "Prêt à contacter", readyTitle: "Votre demande est préparée.", readyText: "Vos informations restent dans ce navigateur. WhatsApp ne reçoit qu’une brève introduction avec votre parcours et votre langue ; la clinique doit encore confirmer la disponibilité.", sendWhatsApp: "Continuer sur WhatsApp", copy: "Copier l’introduction sûre", copied: "Introduction copiée", copyFailed: "La copie a été bloquée. Sélectionnez et copiez l’introduction ci-dessus.", edit: "Modifier", numberPending: "Le numéro vérifié de la clinique doit encore être relié avant l’ouverture publique.", messageGreeting: "Bonjour Marea Dental, j’ai une question pratique ou je souhaite demander un rendez-vous.", messageClosing: "Merci de me contacter pour discuter de la prochaine étape adaptée.", treatmentOptions: ["Contrôle ou hygiène", "Douleur ou urgence", "Implants dentaires", "Couronnes ou bridges", "Réhabilitation complète", "Facettes ou smile design", "Je ne sais pas encore"], timeOptions: ["Matin", "Après-midi", "Soir"],
    },
    footer: { eyebrow: "Votre prochaine étape", title: "Un plan clair commence par une bonne conversation.", description: "Une clinique dentaire à Batoumi pour patients locaux et internationaux.", visit: "Visiter", navigate: "Explorer", contact: "Contact", addressPending: "L’entrée exacte et la carte seront ajoutées après vérification.", contactPending: "Les coordonnées vérifiées seront reliées avant l’ouverture publique.", prototypeNote: "Concept privé · informations cliniques à vérifier" },
  },

  lb: {
    languageName: "Lëtzebuergesch",
    utility: "Fir lokal an international Patienten",
    nav: { home: "Startsäit", treatments: "Behandlungen", results: "Resultater", clinic: "Zänndokteren & Klinik", local: "Zu Batumi", international: "International", contact: "Kontakt", language: "Sprooch wielen", menu: "Menü opmaachen", primaryLabel: "Haaptnavigatioun" },
    actions: { whatsapp: "WhatsApp", appointment: "Rendez-vous ufroen", onlineAssessment: "Online-Evaluatioun starten", call: "D’Klinik uruffen", quickActions: "Séiere Kontakt", quickQuestion: "Eng praktesch Fro stellen", chooseMoment: "Wonschzäit wielen", learnMore: "Méi gewuer ginn", viewAll: "Alles gesinn" },
    hero: { eyebrow: "Eng Zännklinik · Batumi", title: "Kompetent Zännmedizin.", emphasis: "E klore Plang. Ouni onnéideg Waarden.", lead: "Vun der Kontroll an akute Péng bis zu Implantater, Restauratiounen a kompletter Rehabilitatioun — fir Leit zu Batumi a Patienten aus dem Ausland.", localCta: "Rendez-vous ufroen", internationalLink: "21-Deeg-Parcours kucken", proof: ["Lokal & international Betreiung", "Schrëftleche Behandlungsplang", "Dir decidéiert bei all Schrëtt"], imageAlt: "Editorial Stillliewe mat Keramikkroun, Zännspigel a Mieresglas" },
    routes: {
      eyebrow: "Wielt Äre Wee", title: "Eng Klinik. Zwou Manéiere fir unzefänken.",
      local: { eyebrow: "Ech sichen Zännfleeg zu Batumi", title: "Zännfleeg zu Batumi.", text: "Maacht eng Kontroll, beschreift Péng oder frot no engem perséinleche laangfristege Plang.", cta: "Rendez-vous zu Batumi" },
      international: { eyebrow: "Ech reesen op Batumi", title: "Start doheem mat enger grëndlecher Evaluatioun.", text: "Beschreift Äert Uleies. Duerno schwätze mir iwwer Optiounen, realistesch Zäit an de nächste Schrëtt virun der Rees.", cta: "Online-Evaluatioun starten" },
    },
    needs: { eyebrow: "Start mat Ärer Fro", title: "Wat wëllt Dir léisen?", items: ["Péng oder en dréngende Problem", "Een oder méi feelend Zänn", "Beschiedegt Krounen oder ofgenotzt Zänn", "En natierlecht, séchert Laachen", "Kontroll oder professionell Botzen", "Komplett Rehabilitatioun"] },
    treatmentSection: { eyebrow: "Behandlungen", title: "Gesondheet, Funktioun an en natierlecht Laachen.", intro: "All Behandlung fänkt mat Diagnostik an engem Gespréich iwwer Alternativen, Zäit a Käschten un." },
    treatments: [
      { slug: "general-dentistry", number: "01", title: "Allgemeng Zännmedizin", short: "Kontrollen, Hygiène an erhalend Versuergung.", audience: "Fir Preventioun, Sensibilitéit, Karies a futtis Fëllungen.", timing: "Een oder méi Rendez-vousen, jee no Diagnos." },
      { slug: "emergency-dentist", number: "02", title: "Dréngend Zännfleeg", short: "Séier Evaluatioun bei Péng, Schwellung oder engem futtissen Zant.", audience: "Fir Problemer, déi net op eng Routinekontroll waarde sollen.", timing: "Mir klären als éischt dat Dréngend an duerno déi definitiv Versuergung." },
      { slug: "dental-implants", number: "03", title: "Zännimplantater", short: "Geplangten Ersatz mat Bléck op Funktioun, Hygiène an Haltbarkeet.", audience: "Fir een, méi oder all feelend Zänn no enger voller Ënnersichung.", timing: "Implantater kënnen Heelzäit an eng zweet Phas verlaangen." },
      { slug: "crowns-bridges", number: "04", title: "Krounen & Brécken", short: "Stäerkt an Ästhetik mat suergfälteg geplanter Keramik.", audience: "Fir geschwächt, staark restauréiert oder feelend Zänn.", timing: "D’Zuel vun de Besich hänkt vu Virbereedung, Labo a Kontrollen of." },
      { slug: "full-mouth-rehabilitation", number: "05", title: "Komplett Rehabilitatioun", short: "E koordinéierte Plang bei Ofnotzung a ville Problemer.", audience: "Wann Funktioun, Confort an Ausgesinn zesumme restauréiert ginn.", timing: "Vill Schrëtt passen an een Openthalt; Heelung ka méi spéit weidergoen." },
      { slug: "veneers-cosmetic-dentistry", number: "06", title: "Veneers & Smile Design", short: "Schounend ästhetesch Planung mat Respekt virun natierlechen Zänn.", audience: "Fir Form, Faarf, Proportioun oder Stellung no engem Gesondheetscheck.", timing: "D’Zäit hänkt vu Zännfleesch, Bëss a Virbehandlungen of." },
    ],
    process: { eyebrow: "Esou leeft et", title: "Kloerheet, ier d’Behandlung ufänkt.", intro: "Dir kritt d’Informatioun fir selwer ze decidéieren — ouni Drock.", steps: [{ title: "Ënnersichung", text: "Mir lauschteren, ënnersichen a klären, wat nach feelt." }, { title: "Schrëftleche Plang", text: "Optiounen, Schrëtt, Zäit a Käschte gi kloer festgehalen." }, { title: "Behandlung", text: "D’Fleeg follegt dem ofgemaachte Plang; Ännerunge brauchen Är Zoustëmmung." }, { title: "Kontroll", text: "Dir kritt Instruktiounen, Dossier a passend Nofleeg." }] },
    stay21: { eyebrow: "Ären Openthalt plangen", title: "E Behandlungswee bannent 21 Deeg — wann et medezinesch sënnvoll ass.", text: "No der Evaluatioun plange mir, wat sécher méiglech ass. Heelung, Komplexitéit oder Labaarbecht kënnen méi Zäit verlaangen.", note: "Eng Zäitschätzung ass keng Garantie. Medezinesch Qualitéit bestëmmt den Tempo.", link: "De ganzen internationale Parcours gesinn" },
    proof: { eyebrow: "Vertraue muss iwwerpréifbar sinn", title: "Keng anonym Klinik. Keng vague Verspriechen.", items: ["Genannte Behandler mat iwwerpréifbare Qualifikatiounen", "Echt Fäll mat Zoustëmmung a Kontext", "Materialien, Schrëtt a Käschte kloer erkläert", "Kloeren Ënnerscheed tëscht provisoresch an definitiv"] },
    faq: { eyebrow: "Gutt ze wëssen", title: "Heefeg Froen", items: [
      { question: "Kann meng Behandlung a 21 Deeg fäerdeg sinn?", answer: "Verschidde restaurativ oder ästhetesch Weeër passen an dës Zäit. Implantatheelung oder komplex Situatioune kënne méi Zäit verlaangen." },
      { question: "Wat brauch ech fir d’Online-Evaluatioun?", answer: "Äert Uleies, relevant Gesondheetsinformatioun an aktuell Biller. Sensibel Date ginn iwwer e séchere Wee gedeelt." },
      { question: "Ass d’Online-Evaluatioun schonn eng Diagnos?", answer: "Nee. Diagnos, definitive Plang a Präis kommen no der Ënnersichung an der Klinik." },
      { question: "Muss ech organiséiert Rees oder Nofleeg benotzen?", answer: "Nee. Dir organiséiert Rees an Openthalt selwer. D’Klinik liwwert Rendez-vousen, Informatioun an Dossier." },
    ] },
    pages: {
      treatmentsTitle: "Zännbehandlung op Basis vun enger gudder Diagnos.", treatmentsLead: "Alldeeglech Fleeg a komplex Rehabilitatioun gehéieren an ee verantwortleche klinesche Plang.", treatmentDetailEyebrow: "Behandlung bei Marea Dental", forWhom: "Wéini kann dës Behandlung hëllefen?", forWhomText: "D’Eegnung gëtt eréischt no Ënnersichung an noutwenneger Bildgebung confirméiert.", planTitle: "De Behandlungswee", planSteps: [...sharedPlanSteps.lb], timing: "Zäitplang", timingNote: "E perséinleche Plang gëtt no der Evaluatioun confirméiert.", priceTitle: "Käschten ouni Iwwerraschungen", priceText: "No der Ënnersichung kritt Dir e schrëftleche Plang mat erwaarte Käschten. Fréier Präisberäicher si just indikativ.",
      resultsTitle: "Echt Behandlungen. Kloer dokumentéiert.", resultsLead: "Resultater sollen déi klinesch Entscheedung weisen, net nëmmen e perfekt Laachen.", resultsPrinciple: "E Fall ass nëmme mat Kontext e Beweis.", resultsPrincipleText: "All Fall nennt Ausgangssituatioun, Alternativen, Behandlung, Material, Rendez-vousen, Dauer a Behandler.", casePending: "Reservéiert fir e verifizéierte Patientefall mat schrëftlecher Zoustëmmung.", caseFields: ["Ausgangssituatioun", "Behandlung", "Rendez-vousen", "Dauer", "Zänndokter", "Materialien"],
      clinicTitle: "Eng Klinik. Eng verantwortlech Ekipp.", clinicLead: "Dir sollt wëssen, wien plangt, behandelt a fir Froe do ass.", clinicPrinciples: [{ title: "Als éischt erklären", text: "Diagnos, Optiounen a Grenze komme virun der Behandlung." }, { title: "Erhalen, wa méiglech", text: "Natierlecht Gewebe gëtt net fir e Marketingverspriechen geaffert." }, { title: "Kloer dokumentéieren", text: "Plang, Materialien an Nofleeg gehéieren an Ären Dossier." }], teamTitle: "D’Leit hannert Ärer Behandlung", teamText: "Verifizéiert Nimm, Registréierungen, Ausbildung, Beräicher a Sprooche ginn virum ëffentleche Start gewisen.", teamRoles: ["Implantologie & Chirurgie", "Restaurativ Zännmedizin", "Patientekoordinatioun"], verification: "Profil waart op d’Verifikatioun vun der Klinik.",
      localTitle: "Äre feste Zänndokter zu Batumi.", localLead: "Fir Kontrollen, Hygiène, Péng a komplett Behandlungen — mat kloere Rendez-vousen an Erklärungen.", localCards: [{ title: "Éischte Besuch", text: "Eng grëndlech Opnam, Diagnos an e verständleche Plang." }, { title: "Péng an Dréngendes", text: "Frot haut no dem éischte passende Evaluatiounsmoment." }, { title: "Laangfristeg Fleeg", text: "Preventioun, Reparatur a Kontroll fir dauerhaft Mondgesondheet." }],
      internationalTitle: "Zännbehandlung zu Batumi — geplangt, ier Dir fortfuert.", internationalLead: "Eng grëndlech Virevaluatioun mécht Optiounen, Zäit a Käschte méi realistesch.", internationalSteps: [{ title: "Beschreift Äert Zil", text: "Start mat enger kuerzer Ufro — ouni Dossier iwwer WhatsApp." }, { title: "Klinesch Virevaluatioun", text: "Biller a Gesondheetsinfo ginn iwwer e séchere Wee gedeelt." }, { title: "Videogespréich", text: "Schwätzt iwwer Optiounen, Viraussetzungen, Zäit a Froen." }, { title: "Virleefege schrëftleche Parcours", text: "Kritt Schrëtt, Käschteberäich an déi wahrscheinlech Deeg." }, { title: "Ënnersichung bei Arrivée", text: "Diagnos an definitive Plang ginn an der Klinik confirméiert." }, { title: "Behandlung a Kontrollen", text: "Noutwendeg Kontroll- an Upassungszäit ass ageplangt." }, { title: "Dossier fir d’Heemrees", text: "Dir kritt Instruktiounen, Materialdaten a Bericht." }], autonomyTitle: "Är Rees. Ären Openthalt. Är Decisioun.", autonomyText: "Dir organiséiert d’Rees selwer. D’Klinik liwwert confirméiert Deeg a praktesch Informatioun.",
      contactTitle: "Start mat engem Gespréich.", contactLead: "Wielt eng Rendez-vous-Ufro oder eng praktesch WhatsApp-Fro. Medezinesch Dossiere ginn duerno sécher gedeelt.", contactCards: [{ title: "Rendez-vous ufroen", text: "Sot eis, ob Dir lokal wunnt oder eng Rees plangt." }, { title: "WhatsApp", text: "Fir séier praktesch Froen, net fir medezinesch Dokumenter." }, { title: "Klinikdaten", text: "Verifizéiert Adress, Nummer an Zäite ginn virum ëffentleche Start verbonnen." }],
    },
    booking: {
      eyebrow: "Rendez-vous ufroen", title: "Sot eis, wéi mir hëllefe kënnen.", close: "Ufro zoumaachen", closeWhatsApp: "WhatsApp-Fënster zoumaachen", routeQuestion: "Wéi ee Wee passt?", routeLabel: "Patientewee", localRoute: "Ech sichen Zännfleeg zu Batumi", internationalRoute: "Ech reesen aus dem Ausland", name: "Vollstännegen Numm", namePlaceholder: "Ären Numm", phone: "Telefon / WhatsApp", email: "E-Mail-Adress", treatment: "Haaptgrond", choose: "Optioun wielen", date: "Wonschdatum", time: "Wonschzäit", flexible: "Keng Preferenz", language: "Kontakt-Sprooch", note: "Kuerz Erklärung", noteLocal: "Zum Beispill Kontroll, Péng oder futtis Fëllung.", noteInternational: "Nennt Äert Zil a méiglech Reeszäit. Keng vertraulech Dossieren.", consent: "Ech stëmmen der Notzung vu mengen Donnéeë fir de Kontakt zou.", privacy: "Dës Ufro ass keng Diagnos oder confirméiert Buchung. Keng Scannen iwwer WhatsApp.", review: "Ufro iwwerpréiwen", readyEyebrow: "Bereet fir Kontakt", readyTitle: "Är Ufro ass preparéiert.", readyText: "Är Donnéeë bleiwen an dësem Browser. WhatsApp kritt nëmmen eng kuerz Aféierung mat Wee a Sprooch; d’Klinik muss d’Disponibilitéit nach confirméieren.", sendWhatsApp: "Weider op WhatsApp", copy: "Sécher Aféierung kopéieren", copied: "Aféierung kopéiert", copyFailed: "D’Kopéiere gouf blockéiert. Markéiert a kopéiert d’Aféierung uewen.", edit: "Donnéeën änneren", numberPending: "Déi verifizéiert Kliniknummer gëtt virum ëffentleche Start verbonnen.", messageGreeting: "Moien Marea Dental, ech hunn eng praktesch Fro oder wëll e Rendez-vous ufroen.", messageClosing: "Kontaktéiert mech w.e.g. fir de passenden nächste Schrëtt.", treatmentOptions: ["Kontroll oder Hygiène", "Péng oder dréngend Beschwer", "Zännimplantater", "Krounen oder Brécken", "Komplett Rehabilitatioun", "Veneers oder Smile Design", "Nach net sécher"], timeOptions: ["Moies", "Nomëttes", "Owes"],
    },
    footer: { eyebrow: "Ären nächste Schrëtt", title: "E klore Plang fänkt mat engem gudde Gespréich un.", description: "Eng Zännklinik zu Batumi fir lokal an international Patienten.", visit: "Besuch", navigate: "Entdecken", contact: "Kontakt", addressPending: "Déi genee Entrée a Kaart ginn no der Verifikatioun ergänzt.", contactPending: "Verifizéiert Kontaktdonnéeë ginn virum ëffentleche Start verbonnen.", prototypeNote: "Privat Konzept · klinesch Donnéeë musse verifizéiert ginn" },
  },

  ka: {
    languageName: "ქართული",
    utility: "ადგილობრივი და საერთაშორისო პაციენტებისთვის",
    nav: { home: "მთავარი", treatments: "მკურნალობა", results: "შედეგები", clinic: "ექიმები და კლინიკა", local: "ბათუმში", international: "საერთაშორისო", contact: "კონტაქტი", language: "ენის არჩევა", menu: "მენიუს გახსნა", primaryLabel: "მთავარი ნავიგაცია" },
    actions: { whatsapp: "WhatsApp", appointment: "ვიზიტის მოთხოვნა", onlineAssessment: "ონლაინ შეფასების დაწყება", call: "კლინიკაში დარეკვა", quickActions: "სწრაფი კავშირი", quickQuestion: "დასვით პრაქტიკული კითხვა", chooseMoment: "აირჩიეთ სასურველი დრო", learnMore: "გაიგეთ მეტი", viewAll: "ყველას ნახვა" },
    hero: { eyebrow: "ერთი სტომატოლოგიური კლინიკა · ბათუმი", title: "პროფესიონალური სტომატოლოგია.", emphasis: "მკაფიო გეგმა. ზედმეტი ლოდინის გარეშე.", lead: "შემოწმებიდან და მწვავე ტკივილიდან იმპლანტებამდე, რესტავრაციამდე და სრულ რეაბილიტაციამდე — ბათუმის მცხოვრებლებისა და უცხოეთიდან ჩამომსვლელთათვის.", localCta: "ვიზიტის მოთხოვნა", internationalLink: "21-დღიანი გეგმის ნახვა", proof: ["ადგილობრივი და საერთაშორისო ზრუნვა", "წერილობითი მკურნალობის გეგმა", "ყოველ ნაბიჯზე თქვენ წყვეტთ"], imageAlt: "კერამიკული გვირგვინის, სტომატოლოგიური სარკისა და ზღვის შუშის სარედაქციო ნატურმორტი" },
    routes: {
      eyebrow: "აირჩიეთ თქვენი გზა", title: "ერთი კლინიკა. დაწყების ორი გზა.",
      local: { eyebrow: "ბათუმში ზრუნვა მჭირდება", title: "სტომატოლოგიური ზრუნვა ბათუმში.", text: "ჩაეწერეთ შემოწმებაზე, აღწერეთ ტკივილი ან მოითხოვეთ ინდივიდუალური გრძელვადიანი გეგმა.", cta: "ვიზიტი ბათუმში" },
      international: { eyebrow: "ვემგზავრები ბათუმში", title: "დაიწყეთ სახლიდან საფუძვლიანი შეფასებით.", text: "აღწერეთ თქვენი საკითხი. შემდეგ განვიხილავთ შესაძლო ვარიანტებს, რეალისტურ ვადებსა და შემდეგ ნაბიჯს გამგზავრებამდე.", cta: "ონლაინ შეფასების დაწყება" },
    },
    needs: { eyebrow: "დაიწყეთ თქვენი კითხვით", title: "რისი მოგვარება გსურთ?", items: ["ტკივილი ან გადაუდებელი პრობლემა", "ერთი ან მეტი დაკარგული კბილი", "დაზიანებული გვირგვინები ან გაცვეთილი კბილები", "ბუნებრივი და თავდაჯერებული ღიმილი", "შემოწმება ან პროფესიული წმენდა", "პირის ღრუს სრული რეაბილიტაცია"] },
    treatmentSection: { eyebrow: "მკურნალობა", title: "ჯანმრთელობა, ფუნქცია და ბუნებრივი ღიმილი.", intro: "ყოველი მკურნალობა იწყება დიაგნოსტიკითა და ალტერნატივების, დროისა და ხარჯების განხილვით." },
    treatments: [
      { slug: "general-dentistry", number: "01", title: "ზოგადი სტომატოლოგია", short: "შემოწმება, ჰიგიენა და კბილის შენარჩუნებაზე ორიენტირებული ზრუნვა.", audience: "პროფილაქტიკისთვის, მგრძნობელობისთვის, კარიესისა და დაზიანებული ბჟენებისთვის.", timing: "დიაგნოზის მიხედვით ერთი ან რამდენიმე ვიზიტი." },
      { slug: "emergency-dentist", number: "02", title: "გადაუდებელი სტომატოლოგიური დახმარება", short: "სწრაფი შეფასება ტკივილის, შეშუპების ან კბილის მოტეხილობისას.", audience: "პრობლემისთვის, რომელიც რუტინულ ვიზიტამდე ვერ დაელოდება.", timing: "ჯერ ვადგენთ გადაუდებელ საჭიროებას, შემდეგ — საბოლოო მკურნალობას." },
      { slug: "dental-implants", number: "03", title: "დენტალური იმპლანტები", short: "კბილის ჩანაცვლება ფუნქციის, ჰიგიენისა და ხანგრძლივობის გათვალისწინებით.", audience: "ერთი, რამდენიმე ან ყველა დაკარგული კბილისთვის სრული გამოკვლევის შემდეგ.", timing: "იმპლანტაციას შესაძლოა დასჭირდეს შეხორცება და მეორე ეტაპი." },
      { slug: "crowns-bridges", number: "04", title: "გვირგვინები და ხიდები", short: "სიმტკიცისა და იერსახის აღდგენა დაგეგმილი კერამიკული სამუშაოთი.", audience: "დასუსტებული, მრავალჯერ აღდგენილი ან დაკარგული კბილებისთვის.", timing: "ვიზიტების რაოდენობა დამოკიდებულია მომზადებაზე, ლაბორატორიასა და მორგებაზე." },
      { slug: "full-mouth-rehabilitation", number: "05", title: "სრული რეაბილიტაცია", short: "კოორდინირებული გეგმა ცვეთისა და მრავალმხრივი პრობლემების დროს.", audience: "როდესაც ფუნქცია, კომფორტი და იერსახე ერთად საჭიროებს აღდგენას.", timing: "ბევრი ეტაპი ერთ ვიზიტში ეტევა; შეხორცებამ შეიძლება მოგვიანებით გაგრძელება მოითხოვოს." },
      { slug: "veneers-cosmetic-dentistry", number: "06", title: "ვინირები და ღიმილის დიზაინი", short: "კონსერვატიული ესთეტიკური გეგმა ბუნებრივი კბილების პატივისცემით.", audience: "ფორმის, ფერის, პროპორციის ან მდებარეობის სურვილებისთვის ჯანმრთელობის შემოწმების შემდეგ.", timing: "ვადა დამოკიდებულია ღრძილებზე, თანკბილვასა და წინასწარ მკურნალობაზე." },
    ],
    process: { eyebrow: "როგორ მიმდინარეობს ზრუნვა", title: "სიცხადე მკურნალობის დაწყებამდე.", intro: "თქვენ იღებთ გადაწყვეტილებისთვის საჭირო ინფორმაციას — ზეწოლის გარეშე.", steps: [{ title: "გამოკვლევა", text: "ვუსმენთ, ვიკვლევთ და ვადგენთ, რა ინფორმაციაა ჯერ საჭირო." }, { title: "წერილობითი გეგმა", text: "ვარიანტები, ეტაპები, დრო და ხარჯები მკაფიოდ იწერება." }, { title: "მკურნალობა", text: "ზრუნვა მიჰყვება შეთანხმებულ გეგმას; ცვლილებას თქვენი თანხმობა სჭირდება." }, { title: "კონტროლი", text: "იღებთ ინსტრუქციებს, დოკუმენტაციასა და შესაბამის შემდგომ რჩევას." }] },
    stay21: { eyebrow: "თქვენი ვიზიტის დაგეგმვა", title: "მკურნალობის გზა 21 დღეში — როდესაც ეს სამედიცინო თვალსაზრისით მიზანშეწონილია.", text: "შეფასების შემდეგ ვგეგმავთ, რისი უსაფრთხოდ ჩატარებაა შესაძლებელი. შეხორცებამ, სირთულემ ან ლაბორატორიულმა სამუშაომ შეიძლება მეტი დრო მოითხოვოს.", note: "დროის შეფასება გარანტია არ არის. ტემპს სამედიცინო ხარისხი განსაზღვრავს.", link: "სრული საერთაშორისო გზის ნახვა" },
    proof: { eyebrow: "ნდობა გადამოწმებადი უნდა იყოს", title: "არა ანონიმურ კლინიკას. არა ბუნდოვან დაპირებებს.", items: ["დასახელებული ექიმები და გადამოწმებადი კვალიფიკაცია", "რეალური შემთხვევები თანხმობითა და კონტექსტით", "მასალების, ეტაპებისა და ხარჯების ახსნა", "დროებით და საბოლოო მკურნალობას შორის მკაფიო განსხვავება"] },
    faq: { eyebrow: "სასარგებლო ინფორმაცია", title: "ხშირად დასმული კითხვები", items: [
      { question: "შეიძლება მკურნალობა 21 დღეში დასრულდეს?", answer: "ზოგი აღდგენითი და ესთეტიკური გეგმა ამ ვადაში თავსდება. იმპლანტის შეხორცებასა და რთულ შემთხვევებს შესაძლოა მეტი დრო დასჭირდეს." },
      { question: "რა გავაგზავნო ონლაინ შეფასებისთვის?", answer: "მთავარი კითხვა, საჭირო სამედიცინო ინფორმაცია და არსებული ახალი სურათები. მგრძნობიარე ფაილები უსაფრთხო არხით იგზავნება." },
      { question: "ონლაინ შეფასება უკვე დიაგნოზია?", answer: "არა. დიაგნოზი, საბოლოო გეგმა და ფასი კლინიკაში გამოკვლევის შემდეგ დგინდება." },
      { question: "აუცილებელია ორგანიზებული მოგზაურობა ან შემდგომი მოვლა?", answer: "არა. მოგზაურობას თავად აწყობთ. კლინიკა გაძლევთ თარიღებს, პრაქტიკულ ინფორმაციასა და დოკუმენტაციას." },
    ] },
    pages: {
      treatmentsTitle: "მკურნალობა სწორი დიაგნოზის საფუძველზე.", treatmentsLead: "ყოველდღიური ზრუნვა და რთული რეაბილიტაცია ერთ პასუხისმგებლიან კლინიკურ გეგმაში ერთიანდება.", treatmentDetailEyebrow: "მკურნალობა Marea Dental-ში", forWhom: "როდის შეიძლება დაგეხმაროთ?", forWhomText: "შესაბამისობა დასტურდება მხოლოდ კლინიკური გამოკვლევისა და საჭირო გამოსახულების შემდეგ.", planTitle: "მკურნალობის გზა", planSteps: [...sharedPlanSteps.ka], timing: "ვადები", timingNote: "პირადი დროის გეგმა შეფასების შემდეგ დასტურდება.", priceTitle: "ხარჯები სიურპრიზების გარეშე", priceText: "გამოკვლევის შემდეგ იღებთ წერილობით გეგმას მოსალოდნელი ხარჯებით. წინასწარი დიაპაზონი მხოლოდ საორიენტაციოა.",
      resultsTitle: "რეალური მკურნალობა. მკაფიო დოკუმენტაცია.", resultsLead: "შედეგმა უნდა აჩვენოს კლინიკური გადაწყვეტილება და არა მხოლოდ იდეალური ღიმილი.", resultsPrinciple: "შემთხვევა მტკიცებულებაა მხოლოდ კონტექსტთან ერთად.", resultsPrincipleText: "ყოველი შემთხვევა აჩვენებს საწყის მდგომარეობას, ვარიანტებს, მკურნალობას, მასალებს, ვიზიტებს, ხანგრძლივობასა და ექიმს.", casePending: "დაცულია გადამოწმებული შემთხვევისთვის წერილობითი თანხმობით.", caseFields: ["საწყისი მდგომარეობა", "მკურნალობა", "ვიზიტები", "ხანგრძლივობა", "ექიმი", "მასალები"],
      clinicTitle: "ერთი კლინიკა. ერთი პასუხისმგებელი გუნდი.", clinicLead: "უნდა იცოდეთ, ვინ გეგმავს, ვინ მკურნალობს და ვის მიმართავთ კითხვებით.", clinicPrinciples: [{ title: "ჯერ ახსნა", text: "დიაგნოზი, ვარიანტები და საზღვრები წინ უსწრებს მკურნალობას." }, { title: "შენარჩუნება, სადაც შესაძლებელია", text: "ბუნებრივი ქსოვილი არ ეწირება მარკეტინგულ დაპირებას." }, { title: "მკაფიო დოკუმენტაცია", text: "გეგმა, მასალები და შემდგომი რჩევა თქვენს დოკუმენტში შედის." }], teamTitle: "გაიცანით ადამიანები თქვენი მკურნალობის უკან", teamText: "გადამოწმებული სახელები, რეგისტრაცია, განათლება, მიმართულებები და ენები გამოქვეყნდება საჯარო გაშვებამდე.", teamRoles: ["იმპლანტოლოგია და ქირურგია", "რესტავრაციული სტომატოლოგია", "პაციენტის კოორდინაცია"], verification: "პროფილი ელოდება კლინიკის დადასტურებას.",
      localTitle: "თქვენი მუდმივი სტომატოლოგი ბათუმში.", localLead: "შემოწმება, ჰიგიენა, ტკივილი და სრული მკურნალობა — მკაფიო ვიზიტებითა და ახსნით.", localCards: [{ title: "პირველი ვიზიტი", text: "საფუძვლიანი მიღება, დიაგნოზი და გასაგები გეგმა." }, { title: "ტკივილი და გადაუდებელი საკითხები", text: "იკითხეთ დღეს პირველი შესაბამისი შეფასების დრო." }, { title: "გრძელვადიანი ზრუნვა", text: "პროფილაქტიკა, აღდგენა და კონტროლი ხანგრძლივი ჯანმრთელობისთვის." }],
      internationalTitle: "მკურნალობა ბათუმში — დაგეგმილი სახლიდან გამგზავრებამდე.", internationalLead: "საფუძვლიანი წინასწარი შეფასება ვარიანტებს, დროსა და ხარჯებს უფრო რეალისტურს ხდის.", internationalSteps: [{ title: "აღწერეთ მიზანი", text: "დაიწყეთ მოკლე განაცხადით — სამედიცინო დოკუმენტების WhatsApp-ით გაგზავნის გარეშე." }, { title: "კლინიკური წინასწარი შეფასება", text: "სურათები და ჯანმრთელობის ინფორმაცია შესაბამის უსაფრთხო გზას იყენებს." }, { title: "ვიდეოსაუბარი", text: "განიხილეთ ვარიანტები, წინაპირობები, დრო და კითხვები." }, { title: "წინასწარი წერილობითი გზა", text: "მიიღეთ ეტაპები, ხარჯების დიაპაზონი და სავარაუდო დღეები." }, { title: "გამოკვლევა ჩამოსვლისას", text: "დიაგნოზი და საბოლოო გეგმა კლინიკაში დასტურდება." }, { title: "მკურნალობა და კონტროლი", text: "გეგმაში შედის საჭირო შემოწმებისა და მორგების დრო." }, { title: "დოკუმენტები გამგზავრებისთვის", text: "იღებთ ინსტრუქციებს, მასალების მონაცემებსა და ანგარიშს." }], autonomyTitle: "თქვენი მგზავრობა. თქვენი ყოფნა. თქვენი გადაწყვეტილება.", autonomyText: "მოგზაურობას თავად აწყობთ. კლინიკა გაძლევთ დადასტურებულ დღეებსა და პრაქტიკულ ინფორმაციას.",
      contactTitle: "დაიწყეთ საუბრით.", contactLead: "აირჩიეთ ვიზიტის მოთხოვნა ან პრაქტიკული კითხვა WhatsApp-ზე. სამედიცინო დოკუმენტები უსაფრთხო გზას მიჰყვება.", contactCards: [{ title: "ვიზიტის მოთხოვნა", text: "გვითხარით, ადგილობრივად ცხოვრობთ თუ მოგზაურობას გეგმავთ." }, { title: "WhatsApp", text: "სწრაფი პრაქტიკული კითხვებისთვის — არა სამედიცინო დოკუმენტებისთვის." }, { title: "კლინიკის მონაცემები", text: "გადამოწმებული მისამართი, ნომერი და საათები საჯარო გაშვებამდე დაემატება." }],
    },
    booking: {
      eyebrow: "ვიზიტის მოთხოვნა", title: "გვითხარით, როგორ დაგეხმაროთ.", close: "ვიზიტის მოთხოვნის დახურვა", closeWhatsApp: "WhatsApp-ის პანელის დახურვა", routeQuestion: "რომელი გზა გერგებათ?", routeLabel: "პაციენტის გზა", localRoute: "ბათუმში სტომატოლოგიური დახმარება მჭირდება", internationalRoute: "ჩამოვდივარ უცხოეთიდან", name: "სახელი და გვარი", namePlaceholder: "თქვენი სახელი", phone: "ტელეფონი / WhatsApp", email: "ელფოსტა", treatment: "მთავარი მიზეზი", choose: "აირჩიეთ ვარიანტი", date: "სასურველი თარიღი", time: "სასურველი დრო", flexible: "არ აქვს მნიშვნელობა", language: "სასურველი ენა", note: "მოკლე განმარტება", noteLocal: "მაგალითად: შემოწმება, ტკივილი ან დაზიანებული ბჟენი.", noteInternational: "აღწერეთ მიზანი და მოგზაურობის პერიოდი. არ ჩაწეროთ კონფიდენციალური დოკუმენტები.", consent: "ვეთანხმები ჩემი მონაცემების გამოყენებას ამ მოთხოვნაზე დასაკავშირებლად.", privacy: "ეს მოთხოვნა არ არის დიაგნოზი ან დადასტურებული ვიზიტი. ნუ გააგზავნით სკანებს WhatsApp-ით.", review: "მოთხოვნის გადამოწმება", readyEyebrow: "კონტაქტისთვის მზადაა", readyTitle: "თქვენი მოთხოვნა მომზადებულია.", readyText: "თქვენი მონაცემები ამ ბრაუზერში რჩება. WhatsApp იღებს მხოლოდ მოკლე შესავალს თქვენი გზისა და ენის შესახებ; კლინიკამ ხელმისაწვდომობა ჯერ უნდა დაადასტუროს.", sendWhatsApp: "WhatsApp-ზე გაგრძელება", copy: "უსაფრთხო შესავლის კოპირება", copied: "შესავალი დაკოპირდა", copyFailed: "კოპირება დაიბლოკა. მონიშნეთ და დააკოპირეთ ზემოთ მოცემული შესავალი.", edit: "მონაცემების შეცვლა", numberPending: "კლინიკის გადამოწმებული ნომერი საჯარო გაშვებამდე უნდა დაემატოს.", messageGreeting: "გამარჯობა Marea Dental, მაქვს პრაქტიკული კითხვა ან მსურს ვიზიტის მოთხოვნა.", messageClosing: "გთხოვთ დამიკავშირდეთ შესაბამისი შემდეგი ნაბიჯის განსახილველად.", treatmentOptions: ["შემოწმება ან ჰიგიენა", "ტკივილი ან გადაუდებელი პრობლემა", "დენტალური იმპლანტები", "გვირგვინები ან ხიდები", "სრული რეაბილიტაცია", "ვინირები ან ღიმილის დიზაინი", "ჯერ არ ვარ დარწმუნებული"], timeOptions: ["დილა", "შუადღე", "საღამო"],
    },
    footer: { eyebrow: "შემდეგი ნაბიჯი", title: "მკაფიო გეგმა კარგი საუბრით იწყება.", description: "ერთი სტომატოლოგიური კლინიკა ბათუმში ადგილობრივი და საერთაშორისო პაციენტებისთვის.", visit: "ვიზიტი", navigate: "დათვალიერება", contact: "კონტაქტი", addressPending: "ზუსტი შესასვლელი და რუკის ბმული დადასტურების შემდეგ დაემატება.", contactPending: "გადამოწმებული საკონტაქტო მონაცემები საჯარო გაშვებამდე დაემატება.", prototypeNote: "პირადი კონცეფცია · კლინიკური მონაცემები საჭიროებს გადამოწმებას" },
  },
};
