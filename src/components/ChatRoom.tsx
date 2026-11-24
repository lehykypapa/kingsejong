import { useEffect, useRef, useState } from "react";
import {
  Search,
  SendHorizontal,
  Menu,
  X,
  RotateCcw,
  AlertCircle,
  Smile,
} from "lucide-react";
import { JAMO_STICKERS, SEJONG_AVATAR_URL } from "../data/hangulTopics";
import type { ChatMessage, StudentProfile } from "../types/chat";
import { AvatarImage } from "./AvatarImage";

interface ChatRoomProps {
  studentProfile: StudentProfile;
  messages: ChatMessage[];
  isStreaming: boolean;
  errorMsg: string | null;
  onSendMessage: (text: string) => void;
  onRetryLast: () => void;
  onOpenSejongProfile: () => void;
  onOpenEditProfile: () => void;
  onOpenMobileSidebar: () => void;
  onResetChat: () => void;
}

export function ChatRoom({
  studentProfile,
  messages,
  isStreaming,
  errorMsg,
  onSendMessage,
  onRetryLast,
  onOpenSejongProfile,
  onOpenEditProfile,
  onOpenMobileSidebar,
  onResetChat,
}: ChatRoomProps) {
  const [inputValue, setInputValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isStickerOpen, setIsStickerOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const todayLabel = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());

  const filteredMessages = searchQuery.trim()
    ? messages.filter((m) =>
        m.text.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : messages;

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isStreaming) return;
    onSendMessage(trimmed);
    setInputValue("");
    setIsStickerOpen(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-full w-full jamo-chat-bg">
      {/* KakaoTalk-style Top Chat Header */}
      <header className="bg-[#A9BDCE]/95 backdrop-blur-xs border-b border-black/8 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="한글 자모 질문 길잡이 열기"
            className="lg:hidden min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center rounded-xl text-[#1E1E1E] hover:bg-black/8 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenSejongProfile}
            aria-label="세종대왕 프로필 보기"
            className="flex items-center gap-3 min-w-0 text-left group cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-[#3C1E1E]"
          >
            <AvatarImage
              src={SEJONG_AVATAR_URL}
              alt="세종대왕 프로필 사진"
              fallbackJamo="ㅅ"
              sizeClass="w-11 h-11 group-hover:scale-[1.03] transition-transform"
            />
            <div className="min-w-0">
              <h2 className="font-display text-base sm:text-lg font-bold text-[#1E1E1E] truncate">
                세종대왕
              </h2>
              <p className="text-xs text-[#2E3D4C] truncate">
                조선 제4대 임금 · 1397~1450
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenEditProfile}
            className="hidden sm:inline-flex items-center gap-2 min-h-[40px] px-3 rounded-xl bg-white/60 hover:bg-white/90 text-xs font-semibold text-[#1E1E1E] transition-colors cursor-pointer whitespace-nowrap"
          >
            <AvatarImage
              src={studentProfile.avatarUrl}
              alt={studentProfile.name}
              fallbackJamo={studentProfile.name.charAt(0)}
              sizeClass="w-6 h-6"
            />
            <span className="max-w-[96px] truncate">{studentProfile.name}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSearchOpen((prev) => !prev);
              if (isSearchOpen) setSearchQuery("");
            }}
            aria-label="대화 내용 검색"
            aria-expanded={isSearchOpen}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
              isSearchOpen
                ? "bg-[#3C1E1E] text-[#FEE500]"
                : "text-[#1E1E1E] hover:bg-black/8"
            }`}
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onResetChat}
            disabled={isStreaming}
            aria-label="새 대화 시작"
            title="대화 새로 시작하기"
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#1E1E1E] hover:bg-black/8 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Collapsible KakaoTalk Search Bar */}
      {isSearchOpen && (
        <div className="bg-white/95 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center gap-2 shrink-0">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="나눈 대화 내용을 찾아보세요..."
            autoFocus
            className="flex-1 text-sm text-[#1E1E1E] placeholder:text-slate-400 focus:outline-none min-h-[36px]"
          />
          {searchQuery && (
            <span className="text-xs text-slate-500 font-mono-tabular whitespace-nowrap">
              {filteredMessages.length}건
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setIsSearchOpen(false);
            }}
            aria-label="검색 닫기"
            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scrollable Message Thread */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4 chat-scroll">
        {/* Date Separator (clean unboxed typography with hairlines) */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-xs font-medium text-[#2E3D4C] whitespace-nowrap">
            {todayLabel}
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* Empty search state */}
        {searchQuery.trim() && filteredMessages.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-[#2E3D4C]">
              “{searchQuery}”와(과) 일치하는 대화가 없어요.
            </p>
          </div>
        )}

        {filteredMessages.map((msg) => {
          const isUser = msg.sender === "user";

          if (isUser) {
            return (
              <div key={msg.id} className="flex items-end justify-end gap-2">
                <div className="flex flex-col items-end shrink-0 pb-0.5">
                  {msg.isUnread && (
                    <span className="text-[11px] font-bold text-[#FEE500] drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] leading-none mb-0.5">
                      1
                    </span>
                  )}
                  <span className="text-[11px] text-[#334657] font-mono-tabular whitespace-nowrap">
                    {msg.timestamp}
                  </span>
                </div>

                <div className="relative max-w-[78%] sm:max-w-[68%] bg-[#FEE500] text-[#1E1E1E] px-4 py-2.5 rounded-2xl rounded-tr-xs shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                    {msg.text}
                  </p>
                </div>

                <AvatarImage
                  src={studentProfile.avatarUrl}
                  alt={studentProfile.name}
                  fallbackJamo={studentProfile.name.charAt(0) || "ㅎ"}
                  sizeClass="w-9 h-9 self-start hidden sm:block"
                />
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex items-start gap-2.5">
              <button
                type="button"
                onClick={onOpenSejongProfile}
                aria-label="세종대왕 프로필 크게 보기"
                className="shrink-0 cursor-pointer rounded-[38%] focus-visible:outline-2 focus-visible:outline-[#3C1E1E]"
              >
                <AvatarImage
                  src={SEJONG_AVATAR_URL}
                  alt="세종대왕"
                  fallbackJamo="ㅅ"
                  sizeClass="w-11 h-11 shadow-xs"
                />
              </button>

              <div className="flex flex-col items-start max-w-[80%] sm:max-w-[70%]">
                <span className="text-xs font-semibold text-[#1F2D3A] mb-1 ml-0.5">
                  세종대왕
                </span>
                <div className="flex items-end gap-2 w-full">
                  <div className="relative bg-white text-[#1E1E1E] px-4 py-3 rounded-2xl rounded-tl-xs shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
                    {msg.text ? (
                      <p className="text-[15px] leading-[1.65] whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                    ) : (
                      <div
                        aria-label="세종대왕님이 답장을 적고 계십니다"
                        className="flex items-center gap-1.5 py-1 px-1"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#3C1E1E]/40 animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 rounded-full bg-[#3C1E1E]/40 animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 rounded-full bg-[#3C1E1E]/40 animate-bounce [animation-delay:300ms]" />
                      </div>
                    )}
                  </div>
                  {msg.text && (
                    <span className="text-[11px] text-[#334657] font-mono-tabular whitespace-nowrap shrink-0 pb-0.5">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {errorMsg && (
          <div
            role="alert"
            className="mx-auto max-w-lg bg-white/95 border border-[#FCA5A5] rounded-2xl p-4 flex items-start gap-3 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#991B1B]">
                전달에 잠시 어려움이 생겼습니다
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {errorMsg}
              </p>
              <button
                type="button"
                onClick={onRetryLast}
                className="mt-2.5 min-h-[36px] px-3.5 rounded-lg bg-[#FEE500] hover:bg-[#F5DC00] text-xs font-bold text-[#3C1E1E] transition-colors cursor-pointer"
              >
                다시 여쭙기
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Hangul Jamo Quick Sticker Drawer */}
      {isStickerOpen && (
        <div className="bg-[#F8F9FA] border-t border-slate-200 px-4 sm:px-6 py-3 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#3C1E1E]">
              한글 자모 인사 스티커 · 누르면 바로 전해져요
            </span>
            <button
              type="button"
              onClick={() => setIsStickerOpen(false)}
              aria-label="스티커 서랍 닫기"
              className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
            >
              닫기
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {JAMO_STICKERS.map((sticker) => (
              <button
                key={sticker.id}
                type="button"
                disabled={isStreaming}
                onClick={() => {
                  onSendMessage(sticker.message);
                  setIsStickerOpen(false);
                }}
                className="min-h-[48px] p-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#3C1E1E] hover:bg-[#FFFDF0] flex items-center gap-2.5 text-left transition-colors disabled:opacity-50 cursor-pointer"
              >
                <span className="w-9 h-9 rounded-lg bg-[#FEE500] text-[#3C1E1E] font-display font-bold text-lg flex items-center justify-center shrink-0">
                  {sticker.jamo}
                </span>
                <span className="text-xs font-semibold text-[#1E1E1E] leading-snug">
                  {sticker.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* KakaoTalk Bottom Message Composer */}
      <footer className="bg-white border-t border-slate-200/90 px-3 sm:px-5 py-3 shrink-0">
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => setIsStickerOpen((prev) => !prev)}
            aria-label="한글 자모 인사 스티커 열기"
            aria-expanded={isStickerOpen}
            className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
              isStickerOpen
                ? "bg-[#3C1E1E] text-[#FEE500]"
                : "bg-[#F4F5F7] text-[#3C1E1E] hover:bg-[#EAECEF]"
            }`}
          >
            <Smile className="w-5 h-5" />
          </button>

          <div className="flex-1 bg-[#F4F5F7] rounded-2xl border border-transparent focus-within:border-[#3C1E1E]/30 focus-within:bg-white transition-colors px-4 py-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="세종대왕님께 궁금한 점을 편하게 물어보세요..."
              aria-label="메시지 입력"
              className="w-full bg-transparent text-[15px] text-[#1E1E1E] placeholder:text-slate-400 resize-none focus:outline-none leading-6 max-h-[120px]"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isStreaming}
            aria-label="메시지 전송"
            className="min-h-[44px] px-4 sm:px-5 rounded-xl bg-[#FEE500] hover:bg-[#F5DC00] disabled:bg-[#EAECEF] disabled:text-slate-400 text-[#3C1E1E] font-bold text-sm inline-flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">전송</span>
            <SendHorizontal className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
