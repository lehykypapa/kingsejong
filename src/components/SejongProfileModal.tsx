import { X, BookOpen, Compass, Sparkles } from "lucide-react";
import { SEJONG_AVATAR_URL } from "../data/hangulTopics";
import { AvatarImage } from "./AvatarImage";

interface SejongProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SejongProfileModal({ isOpen, onClose }: SejongProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sejong-profile-title"
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-[#3C1E1E] text-white px-6 pt-6 pb-14">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#FEE500] tracking-wide">
              조선 제4대 임금 프로필
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="프로필 닫기"
              className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#FEE500]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-3 text-sm text-white/80 leading-relaxed">
            “백성이 제 뜻을 펴지 못하는 것을 안타깝게 여겨 스물여덟 글자를 새로 만드셨느니라.”
          </p>
        </div>

        <div className="px-6 pb-6 -mt-10">
          <div className="flex items-end gap-4">
            <AvatarImage
              src={SEJONG_AVATAR_URL}
              alt="세종대왕 어진 프로필"
              fallbackJamo="ㅅ"
              sizeClass="w-24 h-24 shadow-md border-4 border-white"
            />
            <div className="pb-1">
              <h2
                id="sejong-profile-title"
                className="font-display text-2xl font-bold text-[#1E1E1E]"
              >
                세종대왕 (이도)
              </h2>
              <p className="text-sm text-slate-600 font-mono-tabular">
                1397년 · 1450년
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/80">
              <div className="w-9 h-9 rounded-xl bg-[#FEE500] text-[#3C1E1E] font-display font-bold flex items-center justify-center shrink-0">
                ㅎ
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  주요 업적
                </h3>
                <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                  훈민정음 창제, 집현전 설치, 측우기·앙부일구·자격루 발명, 4군 6진 개척
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/80">
              <div className="w-9 h-9 rounded-xl bg-[#E8F3FA] text-[#164E78] flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  대화 안내 (1450년의 기억)
                </h3>
                <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                  세종대왕님은 1450년에 승하하셨기 때문에, 임진왜란이나 일제 강점기처럼 그 이후에 일어난 역사는 알지 못하세요. 오늘날의 이야기는 여러분이 직접 들려주세요!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              초등학생 맞춤형 역사 대화방
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              근엄하고 다정한 어투
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
