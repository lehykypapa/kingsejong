import sejongPortraitImg from "../assets/images/sejong_portrait_1794789518474.jpg";
import avatarSeonbiImg from "../assets/images/avatar_seonbi_1794789519178.jpg";
import avatarHanbokGirlImg from "../assets/images/avatar_hanbok_girl_1794789519183.jpg";
import avatarBaekguImg from "../assets/images/avatar_baekgu_1794789520276.jpg";
import avatarHorangiImg from "../assets/images/avatar_horangi_1794789521076.jpg";
import type { AvatarOption, JamoCategory, JamoSticker } from "../types/chat";

export const SEJONG_AVATAR_URL = sejongPortraitImg;

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: "seonbi",
    label: "꼬마 선비",
    subtitle: "책을 좋아하는 유생",
    imageUrl: avatarSeonbiImg,
    jamoMark: "ㅅ",
  },
  {
    id: "hanbok-girl",
    label: "한복 소녀",
    subtitle: "궁궐 나들이 친구",
    imageUrl: avatarHanbokGirlImg,
    jamoMark: "ㅎ",
  },
  {
    id: "baekgu",
    label: "유건 백구",
    subtitle: "똑똑한 진돗개 벗",
    imageUrl: avatarBaekguImg,
    jamoMark: "ㅂ",
  },
  {
    id: "horangi",
    label: "두루마리 호랑이",
    subtitle: "용감한 민화 아기 호랑이",
    imageUrl: avatarHorangiImg,
    jamoMark: "ㅇ",
  },
];

export const JAMO_CATEGORIES: JamoCategory[] = [
  {
    id: "hunminjeongeum",
    jamo: "ㅎ",
    title: "한글과 훈민정음",
    subtitle: "백성을 사랑해 만든 우리 글자",
    accentBg: "bg-[#FFF6CC]",
    accentText: "text-[#8A5A00]",
    questions: [
      {
        id: "h-1",
        label: "왜 새 글자를 만드셨나요?",
        prompt: "임금님! 왜 어려운 한자 대신 백성들을 위한 새로운 글자(훈민정음)를 만드셨나요?",
      },
      {
        id: "h-2",
        label: "자음과 모음의 모양 비밀",
        prompt: "한글의 자음(ㄱ, ㄴ, ㅁ, ㅅ, ㅇ)과 모음(ㆍ, ㅡ, ㅣ)은 무엇을 본떠서 만드신 건가요?",
      },
      {
        id: "h-3",
        label: "신하들의 반대는 없었나요?",
        prompt: "훈민정음을 만드실 때 최만리 같은 신하들이 반대하지는 않았나요? 어떻게 설득하셨나요?",
      },
    ],
  },
  {
    id: "science",
    jamo: "ㄱ",
    title: "과학과 발명품",
    subtitle: "장영실과 만든 놀라운 기구들",
    accentBg: "bg-[#E8F3FA]",
    accentText: "text-[#164E78]",
    questions: [
      {
        id: "g-1",
        label: "측우기는 왜 만드셨나요?",
        prompt: "비의 양을 재는 측우기는 왜 만드셨고, 농사에 어떤 도움이 되었나요?",
      },
      {
        id: "g-2",
        label: "장영실을 믿으신 이유",
        prompt: "노비 신분이었던 장영실 선생님을 알아보고 큰 일을 맡기신 이야기가 궁금해요!",
      },
      {
        id: "g-3",
        label: "해시계와 물시계의 원리",
        prompt: "앙부일구(해시계)와 자격루(물시계)는 백성들이 시간을 알기 쉽게 어떻게 만들어졌나요?",
      },
    ],
  },
  {
    id: "secret",
    jamo: "ㅅ",
    title: "세종대왕의 숨은 이야기",
    subtitle: "임금님의 일상과 인간적인 모습",
    accentBg: "bg-[#FDECEB]",
    accentText: "text-[#992924]",
    questions: [
      {
        id: "s-1",
        label: "고기를 정말 좋아하셨나요?",
        prompt: "임금님께서는 반찬으로 고기를 정말 좋아하시고 책 읽느라 운동을 자주 못 하셨다는 게 사실인가요?",
      },
      {
        id: "s-2",
        label: "눈이 아프셨을 때 이야기",
        prompt: "어릴 때부터 책을 너무 많이 읽으셔서 눈이 많이 아프셨다면서요? 어릴 적 독서 습관이 궁금해요!",
      },
      {
        id: "s-3",
        label: "노비에게도 주신 특별한 휴가",
        prompt: "아기를 낳은 노비 어머니와 아버지에게도 휴가를 주셨다는 숨은 이야기를 들려주세요!",
      },
    ],
  },
  {
    id: "today",
    jamo: "ㅇ",
    title: "오늘날 우리들의 이야기",
    subtitle: "2026년의 세상 소식 들려드리기",
    accentBg: "bg-[#EAF6EE]",
    accentText: "text-[#1A6338]",
    questions: [
      {
        id: "o-1",
        label: "스마트폰으로 한글을 써요",
        prompt: "임금님! 요즘 우리는 손바닥만 한 '스마트폰'이라는 기계에 한글 자모를 눌러 멀리 있는 친구와 바로 대화해요!",
      },
      {
        id: "o-2",
        label: "세계 사람들이 한글을 배워요",
        prompt: "임금님이 만드신 한글을 지금은 전 세계 수많은 나라 사람들이 배우고 감탄하고 있어요!",
      },
      {
        id: "o-3",
        label: "요즘 초등학생 학교 생활",
        prompt: "요즘 초등학교에서는 점심에 맛있는 급식을 먹고 친구들과 국어·역사 공부를 해요. 임금님 어릴 적 공부는 어땠나요?",
      },
    ],
  },
  {
    id: "future",
    jamo: "ㅁ",
    title: "먼 훗날의 역사 물어보기",
    subtitle: "1450년 이후 일도 아실까?",
    accentBg: "bg-[#F2EEF9]",
    accentText: "text-[#4D2E85]",
    questions: [
      {
        id: "m-1",
        label: "일제 강점기 이야기를 아시나요?",
        prompt: "임금님, 훗날 일제 강점기에 일본에게 나라를 빼앗겼던 아픈 역사를 혹시 아시나요?",
      },
      {
        id: "m-2",
        label: "임진왜란과 이순신 장군님",
        prompt: "임금님, 훗날 일본이 쳐들어온 임진왜란 때 거북선을 만든 이순신 장군님 이야기를 들어보셨나요?",
      },
      {
        id: "m-3",
        label: "대한민국이라는 나라 이름",
        prompt: "임금님! 지금 우리나라 이름이 '대한민국'이라는 사실을 알고 계셨나요?",
      },
    ],
  },
];

export const JAMO_STICKERS: JamoSticker[] = [
  {
    id: "st-h",
    jamo: "ㅎ",
    title: "하하, 반갑습니다!",
    message: "임금님 안녕하세요! 오늘도 재미있는 이야기를 들려주세요.",
  },
  {
    id: "st-g",
    jamo: "ㄱ",
    title: "궁금한 게 있어요!",
    message: "임금님, 제가 역사 책에서 보고 정말 궁금한 게 생겼어요!",
  },
  {
    id: "st-c",
    jamo: "ㅊ",
    title: "최고의 임금님!",
    message: "백성을 사랑해 한글을 만들어 주셔서 정말 감사해요!",
  },
  {
    id: "st-o",
    jamo: "ㅇ",
    title: "오늘 제 이야기 들어보세요",
    message: "임금님께 오늘 제가 살고 있는 요즘 세상 이야기를 들려드리고 싶어요!",
  },
];
