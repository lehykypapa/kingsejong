import { useState } from "react";
import { UserPen, RotateCcw, ChevronRight, X } from "lucide-react";
import { JAMO_CATEGORIES, SEJONG_AVATAR_URL } from "../data/hangulTopics";
import type { StudentProfile } from "../types/chat";
import { AvatarImage } from "./AvatarImage";

interface JamoSidebarProps {
  studentProfile: StudentProfile;
  isStreaming: boolean;
  onSelectQuestion: (prompt: string) => void;
  onOpenEditProfile: () => void;
  onOpenSejongProfile: () => void;
  onResetChat: () => void;
  onCloseMobile?: () => void;
}

export function JamoSidebar({
  studentProfile,
  isStreaming,
  onSelectQuestion,
  onOpenEditProfile,
  onOpenSejongProfile,
  onResetChat,
  onCloseMobile,
}: JamoSidebarProps) {
  const [activeJamoId, setActiveJamoId] = useState(JAMO_CATEGORIES[0].id);
  const activeCategory =
    JAMO_CATEGORIES.find((cat) => cat.id === activeJamoId) ?? JAMO_CATEGORIES[0];

  return (
    <aside className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      {/* Top branding + mobile close */}
      <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#FEE500] text-[#3C1E1E] font-display font-bold text-lg flex items-center justify-center shrink-0 border border-[#E6CE00]">
            ㅎ
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-base font-bold text-[#1E1E1E] truncate">
              한글 자모 질문 길잡이
            </h1>
            <p className="text-xs text-slate-500 truncate">
              초성을 눌러 질문을 골라보세요
            </p>
          </div>
        </div>
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="길잡이 닫기"
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Profiles section */}
      <div className="px-5 py-4 space-y-3 border-b border-slate-200/80 bg-[#FAFAFA]">
        {/* Student profile card */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <AvatarImage
              src={studentProfile.avatarUrl}
              alt={`${studentProfile.name} 프로필`}
              fallbackJamo={studentProfile.name.charAt(0) || "ㅎ"}
              sizeClass="w-11 h-11"
            />
            <div className="min-w-0">
              <p className="text-xs text-slate-500">내 대화명</p>
              <p className="text-sm font-bold text-[#1E1E1E] truncate">
                {studentProfile.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenEditProfile}
            className="min-h-[40px] px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <UserPen className="w-3.5 h-3.5" />
            바꾸기
          </button>
        </div>

        {/* Sejong profile quick button */}
        <button
          type="button"
          onClick={onOpenSejongProfile}
          className="w-full min-h-[48px] px-3 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-[#3C1E1E]/40 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <AvatarImage
              src={SEJONG_AVATAR_URL}
              alt="세종대왕 프로필"
              fallbackJamo="ㅅ"
              sizeClass="w-10 h-10"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1E1E1E] truncate">
                세종대왕
              </p>
              <p className="text-xs text-slate-500 truncate">
                1397 · 1450 · 프로필 보기
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
      </div>

      {/* Hangul Jamo Tile Tabs */}
      <div className="px-5 pt-4 pb-3">
        <p className="text-xs font-semibold text-slate-500 mb-2.5">
          자모로 찾는 이야기 주제
        </p>
        <div className="grid grid-cols-5 gap-2" role="tablist" aria-label="한글 자모 주제 선택">
          {JAMO_CATEGORIES.map((category) => {
            const isSelected = category.id === activeCategory.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveJamoId(category.id)}
                className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#3C1E1E] ${
                  isSelected
                    ? "bg-[#3C1E1E] text-[#FEE500] border-[#3C1E1E] shadow-xs"
                    : "bg-[#F7F8FA] text-[#1E1E1E] border-slate-200 hover:bg-[#EFEFEF]"
                }`}
              >
                <span className="font-display text-xl font-bold leading-none">
                  {category.jamo}
                </span>
                <span
                  className={`mt-1 text-[10px] font-medium truncate max-w-full px-1 ${
                    isSelected ? "text-white/90" : "text-slate-500"
                  }`}
                >
                  {category.id === "hunminjeongeum"
                    ? "한글"
                    : category.id === "science"
                      ? "과학"
                      : category.id === "secret"
                        ? "일화"
                        : category.id === "today"
                          ? "오늘"
                          : "훗날"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Questions */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 chat-scroll">
        <div className={`p-3.5 rounded-2xl ${activeCategory.accentBg} mb-3`}>
          <div className="flex items-center gap-2.5">
            <span
              className={`w-8 h-8 rounded-lg bg-white/80 font-display font-bold text-lg flex items-center justify-center shrink-0 ${activeCategory.accentText}`}
            >
              {activeCategory.jamo}
            </span>
            <div className="min-w-0">
              <h2 className={`text-sm font-bold ${activeCategory.accentText}`}>
                {activeCategory.title}
              </h2>
              <p className="text-xs text-slate-600 truncate">
                {activeCategory.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {activeCategory.questions.map((q) => (
            <button
              key={q.id}
              type="button"
              disabled={isStreaming}
              onClick={() => {
                onSelectQuestion(q.prompt);
                onCloseMobile?.();
              }}
              className="w-full min-h-[48px] text-left p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-[#3C1E1E] hover:bg-[#FFFDF0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer group"
            >
              <p className="text-sm font-semibold text-[#1E1E1E] group-hover:text-[#3C1E1E]">
                {q.label}
              </p>
              <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {q.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Footer action: Reset chat */}
      <div className="p-4 border-t border-slate-200/80 bg-white">
        <button
          type="button"
          disabled={isStreaming}
          onClick={onResetChat}
          className="w-full min-h-[44px] px-4 rounded-xl border border-slate-200 bg-[#F8F9FA] hover:bg-[#EFEFEF] text-xs font-semibold text-slate-700 inline-flex items-center justify-center gap-2 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          대화 처음부터 다시 나누기
        </button>
      </div>
    </aside>
  );
}
