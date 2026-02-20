// Translation structure type (allows any string values)
export interface Translations {
  common: {
    bookNow: string;
    learnMore: string;
    callUs: string;
    readMore: string;
    services: string;
    team: string;
    contact: string;
    call: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    cta: string;
    trustBadges: {
      experience: string;
      patients: string;
      topRated: string;
    };
    floatingCards: {
      aiBooking: string;
      available: string;
      googleReviews: string;
    };
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
  };
  team: {
    badge: string;
    title: string;
    subtitle: string;
  };
  whyChooseUs: {
    title: string;
    subtitle: string;
    insurance: string;
  };
  video: {
    badge: string;
    title: string;
    subtitle: string;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    labels: {
      address: string;
      phone: string;
      email: string;
      todayHours: string;
      openingHours: string;
      today: string;
      closed: string;
    };
    getDirections: string;
    contactInfo: string;
  };
  cta: {
    title: string;
    subtitle: string;
    chatButton: string;
    features: {
      noWaiting: string;
      instant: string;
      available: string;
    };
  };
  chat: {
    title: string;
    status: string;
    placeholder: string;
    welcome: string;
    error: string;
    openChat: string;
    closeChat: string;
    minimizeChat: string;
    expandChat: string;
  };
  navbar: {
    callClinic: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    ourTeam: string;
    contactUs: string;
    insurance: string;
    copyright: string;
  };
  features: {
    aiBooking: {
      title: string;
      description: string;
    };
    smartScheduling: {
      title: string;
      description: string;
    };
    quickConfirmation: {
      title: string;
      description: string;
    };
    personalizedCare: {
      title: string;
      description: string;
    };
  };
}
