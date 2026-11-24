import { useRef, useState } from "react";
import { Upload, ArrowRight, Check, X } from "lucide-react";
import { AVATAR_OPTIONS, SEJONG_AVATAR_URL } from "../data/hangulTopics";
import type { StudentProfile } from "../types/chat";
import { AvatarImage } from "./AvatarImage";

interface EntryProfileModalProps {
  mode: "entry" | "edit";
  initialProfile?: StudentProfile | null;
  onComplete: (profile: StudentProfile) => void;
  onCancel?: () => void;
}

export function EntryProfileModal({
  mode,
  initialProfile,
  onComplete,
  onCancel,
}: EntryProfileModalProps) {
  const [name, setName] = useState(initialProfile?.name ?? "");
  const [selectedAvatarId, setSelectedAvatarId] = useState(
    initialProfile?.avatarId ?? AVATAR_OPTIONS[0].id
  );
  const [customImageUrl, setCustomImageUrl] = useState<string>(
    initialProfile?.avatarId === "custom" ? initialProfile.avatarUrl : ""
  );
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPreset = AVATAR_OPTIONS.find((a) => a.id === selectedAvatarId);
  const previewAvatarUrl =
    selectedAvatarId === "custom" && customImageUrl
      ? customImageUrl
      : selectedPreset?.imageUrl ?? AVATAR_OPTIONS[0].imageUrl;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("이미지 파일(JPG, PNG 등)만 선택할 수 있어요.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCustomImageUrl(reader.result);
        setSelectedAvatarId("custom");
        setErrorMsg("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg("세종대왕님이 부르실 내 대화명을 입력해 주세요.");
      return;
    }
    if (trimmed.length > 12) {
      setErrorMsg("대화명은 12글자 이내로 지어 주세요.");
      return;
    }

    onComplete({
      name: trimmed,
      avatarId: selectedAvatarId,
      avatarUrl: previewAvatarUrl,
    });
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="student-nickname"
          className="block text-sm font-semibold text-[#1E1E1E] mb-2"
        >
          1. 대화명 정하기
        </label>
        <div className="flex items-center gap-3">
          <AvatarImage
            src={previewAvatarUrl}
            alt="선택한 내 프로필 사진"
            fallbackJamo={name.trim().charAt(0) || "ㅎ"}
            sizeClass="w-14 h-14 shadow-xs"
          />
          <input
            id="student-nickname"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
            placeholder="예: 민준이, 한글사랑, 지우"
            maxLength={12}
            autoFocus
            className="flex-1 min-h-[48px] px-4 rounded-xl bg-[#F8F9FA] border border-slate-300 text-base text-[#1E1E1E] placeholder:text-slate-400 focus:outline-none focus:border-[#3C1E1E] focus:bg-white transition-colors"
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          세종대왕님이 이 이름으로 다정하게 불러주실 거예요. (최대 12자)
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-sm font-semibold text-[#1E1E1E]">
            2. 프로필 사진 고르기
          </span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[40px] px-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#3C1E1E] bg-[#F4F5F7] hover:bg-[#EAECEF] rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-[#3C1E1E]"
          >
            <Upload className="w-3.5 h-3.5" />
            내 사진 올리기
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AVATAR_OPTIONS.map((option) => {
            const isSelected = selectedAvatarId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedAvatarId(option.id)}
                className={`group relative flex flex-col items-center p-3 rounded-2xl border text-center transition-all min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#3C1E1E] ${
                  isSelected
                    ? "bg-[#FFF9DB] border-[#3C1E1E] shadow-xs"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="relative">
                  <AvatarImage
                    src={option.imageUrl}
                    alt={option.label}
                    fallbackJamo={option.jamoMark}
                    sizeClass="w-16 h-16"
                  />
                  {isSelected && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#3C1E1E] text-[#FEE500] flex items-center justify-center shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  )}
                </div>
                <span className="mt-2.5 text-xs font-semibold text-[#1E1E1E] whitespace-nowrap">
                  {option.label}
                </span>
                <span className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                  {option.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {selectedAvatarId === "custom" && customImageUrl && (
          <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-[#FFF9DB] border border-[#E6C200]">
            <AvatarImage
              src={customImageUrl}
              alt="직접 올린 내 프로필 사진"
              sizeClass="w-11 h-11"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#3C1E1E]">
                직접 올린 사진이 선택되었어요
              </p>
              <p className="text-[11px] text-slate-600">
                아래의 입장 버튼을 누르면 이 사진으로 대화방에 들어갑니다.
              </p>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <p
          role="alert"
          className="text-sm font-medium text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] px-3.5 py-2.5 rounded-xl"
        >
          {errorMsg}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        {mode === "edit" && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[48px] px-5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          className="flex-1 min-h-[48px] px-6 rounded-xl bg-[#FEE500] hover:bg-[#F5DC00] active:scale-[0.99] text-[#3C1E1E] text-base font-bold inline-flex items-center justify-center gap-2 shadow-xs border border-[#E6CE00] transition-all cursor-pointer"
        >
          <span>{mode === "entry" ? "세종대왕님 대화방 들어가기" : "프로필 저장하기"}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );

  if (mode === "edit") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-heading"
      >
        <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200 max-h-[92vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h2
              id="edit-profile-heading"
              className="font-display text-xl font-bold text-[#1E1E1E]"
            >
              내 대화명과 프로필 사진 바꾸기
            </h2>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                aria-label="창 닫기"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F3F5F7] flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-5xl bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left column: King Sejong Welcome & Hangul Jamo identity */}
        <div className="lg:col-span-5 bg-[#3C1E1E] text-white p-7 sm:p-9 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              {["ㅅ", "ㅈ", "ㄷ", "ㅇ"].map((jamo) => (
                <span
                  key={jamo}
                  className="w-9 h-9 rounded-xl bg-[#FEE500] text-[#3C1E1E] font-display font-bold text-lg flex items-center justify-center"
                >
                  {jamo}
                </span>
              ))}
            </div>

            <h1 className="mt-6 font-display text-3xl sm:text-4xl font-bold leading-snug text-balance">
              세종대왕님과 카톡해요
            </h1>
            <p className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed">
              훈민정음을 만드신 세종대왕님과 직접 이야기를 나누어 보세요. 역사 속 궁금한 이야기, 임금님의 숨겨진 일상, 그리고 우리가 사는 오늘날의 소식까지 들려드릴 수 있어요.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15">
            <div className="flex items-center gap-4">
              <AvatarImage
                src={SEJONG_AVATAR_URL}
                alt="세종대왕 어진"
                fallbackJamo="ㅅ"
                sizeClass="w-16 h-16 border-2 border-[#FEE500]"
              />
              <div>
                <p className="font-display text-lg font-bold text-[#FEE500]">
                  세종대왕 (1397 · 1450)
                </p>
                <p className="text-xs text-white/80 mt-0.5 leading-relaxed">
                  근엄하지만 따뜻하고 다정한 말투로 어린이들의 질문에 자세히 답해주십니다.
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-white/70 leading-relaxed">
              안내 · 1450년에 승하하신 세종대왕님은 그 이후의 역사는 아직 알지 못하십니다.
            </p>
          </div>
        </div>

        {/* Right column: Student Profile Setup */}
        <div className="lg:col-span-7 p-7 sm:p-9 flex flex-col justify-center">
          <div className="mb-6">
            <p className="text-xs font-semibold text-[#8A5A00]">
              대화방 입장 준비
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-[#1E1E1E]">
              어린 벗의 이름과 모습을 알려주세요
            </h2>
          </div>
          {formContent}
        </div>
      </div>
    </div>
  );
}
