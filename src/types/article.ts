import { Contact } from "./contact";
import * as Ids from "./ids";

export interface Article {
  id: Ids.Article;
  timePublished: "2006-07-13T14:23:39+00:00";
  isCorporative: false;
  lang: "ru" | "en";
  titleHtml: string;
  leadData: {
    textHtml: string;
    imageUrl: null;
    buttonTextHtml: null;
    image: null;
  };
  editorVersion: "1.0";
  postType: "article";
  postLabels: [];
  author: {
    id: Ids.User;
    alias: string;
    fullname: "Denis Kryuchkov";
    avatarUrl: string;
    speciality: "Publisher";
    scoreStats: { score: 564; votesCount: 1558 };
    rating: 0;
    relatedData: {
      vote: { value: null };
      canVote: true;
      votePlus: { canVote: true; isKarmaEnough: true; isChargeEnough: true };
      voteMinus: { canVote: true; isKarmaEnough: true; isChargeEnough: true };
      isSubscribed: false;
    };
    contacts: Array<Contact>;
    authorContacts: Array<Contact>;
    paymentDetails: {
      paymentYandexMoney: null;
      paymentPayPalMe: null;
      paymentWebmoney: null;
    };
    donationsMethod: null;
  };
  statistics: {
    commentsCount: number;
    favoritesCount: number;
    readingCount: number;
    score: number;
    votesCount: number;
    votesCountPlus: number;
    votesCountMinus: number;
  };
  hubs: Array<{
    id: Ids.Hub;
    alias: string;
    type: "collective";
    title: string;
    titleHtml: string;
    isProfiled: false;
    relatedData: { isSubscribed: false };
  }>;
  flows: [
    { id: "4"; alias: "marketing"; title: "Маркетинг"; titleHtml: "Маркетинг" },
  ];
  relatedData: {
    vote: { value: null; voteTimeExpired: "2006-08-12T14:23:39+00:00" };
    unreadCommentsCount: 0;
    bookmarked: false;
    canComment: true;
    canEdit: false;
    canVotePlus: false;
    canVoteMinus: false;
    isChargeEnough: true;
    isKarmaEnough: true;
    canViewVotes: false;
    canModerateComments: false;
    trackerSubscribed: false;
    emailSubscribed: false;
  };
  textHtml: string;
  tags: Array<{ titleHtml: string }>;
  metadata: {
    stylesUrls: [];
    scriptUrls: [];
    shareImageUrl: "https://habr.com/share/publication/1/5f946dfec41a62041bf9eccde651cf32/";
    shareImageWidth: 1200;
    shareImageHeight: 630;
    vkShareImageUrl: "https://habr.com/share/publication/1/5f946dfec41a62041bf9eccde651cf32/?format=vk";
    schemaJsonLd: '{"@context":"http:\\/\\/schema.org","@type":"Article","mainEntityOfPage":{"@type":"WebPage","@id":"https:\\/\\/habr.com\\/ru\\/articles\\/1\\/"},"headline":"Wiki-FAQ для Хабрахабра","datePublished":"2006-07-13T18:23:39+04:00","dateModified":"2006-07-13T18:23:39+04:00","author":{"@type":"Person","name":"Denis Kryuchkov"},"publisher":{"@type":"Organization","name":"Habr","logo":{"@type":"ImageObject","url":"https:\\/\\/habrastorage.org\\/webt\\/a_\\/lk\\/9m\\/a_lk9mjkccjox-zccjrpfolmkmq.png"}},"description":"Привет!  Для сборника ответов на Часто Задаваемые Вопросы мы решили использовать идею wiki, поскольку, как нам кажется, нет смысла писать одному конкретному чело...","url":"https:\\/\\/habr.com\\/ru\\/articles\\/1\\/#post-content-body","about":["h_habr","f_marketing"],"image":["https:\\/\\/habr.com\\/share\\/publication\\/1\\/5f946dfec41a62041bf9eccde651cf32\\/"]}';
    metaDescription: "Привет! Для сборника ответов на Часто Задаваемые Вопросы мы решили использовать идею wiki, поскольку, как нам кажется, нет смысла писать одному конкретному человеку FAQ для такого сайта, как...";
    mainImageUrl: null;
    amp: true;
    customTrackerLinks: [];
  };
  polls: [];
  commentsEnabled: { status: true; reason: null };
  rulesRemindEnabled: false;
  votesEnabled: true;
  status: "published";
  plannedPublishTime: null;
  checked: null;
  hasPinnedComments: false;
  format: null;
  banner: null;
  multiwidget: null;
  readingTime: 1;
  complexity: null;
  isEditorial: false;
}
