import { useCallback, useState } from "react";
import { ChatRoom } from "./components/ChatRoom";
import { EntryProfileModal } from "./components/EntryProfileModal";
import { JamoSidebar } from "./components/JamoSidebar";
import { SejongProfileModal } from "./components/SejongProfileModal";
import type { ChatMessage, StudentProfile } from "./types/chat";

function formatKoreanTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function createWelcomeMessage(studentName: string): ChatMessage {
  return {
    id: `welcome-${Date.now()}`,
    sender: "sejong",
    text: `허허, 반갑구나 ${studentName}아!\n나는 조선의 임금 세종이라 하노라. 오늘 이렇게 어린 벗과 글월로 마주 앉게 되니 참으로 기쁘고 대견하구나.\n\n내가 만든 훈민정음이나 여러 과학 기구, 궁궐의 숨은 이야기도 좋고, 그대가 사는 오늘날의 신기한 세상 이야기도 좋으니 무엇이든 편히 물어보거라.`,
    timestamp: formatKoreanTime(),
  };
}

export default function App() {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSejongProfileOpen, setIsSejongProfileOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleEnterChat = (profile: StudentProfile) => {
    setStudentProfile(profile);
    setMessages([createWelcomeMessage(profile.name)]);
    setErrorMsg(null);
    setLastFailedText(null);
  };

  const handleUpdateProfile = (updatedProfile: StudentProfile) => {
    setStudentProfile(updatedProfile);
    setIsEditProfileOpen(false);
  };

  const handleResetChat = () => {
    if (!studentProfile || isStreaming) return;
    setMessages([createWelcomeMessage(studentProfile.name)]);
    setErrorMsg(null);
    setLastFailedText(null);
  };

  const sendToSejong = useCallback(
    async (text: string, currentMessages: ChatMessage[], activeProfile: StudentProfile) => {
      const userMsgId = `user-${Date.now()}`;
      const sejongMsgId = `sejong-${Date.now() + 1}`;
      const nowTime = formatKoreanTime();

      const userMessage: ChatMessage = {
        id: userMsgId,
        sender: "user",
        text,
        timestamp: nowTime,
        isUnread: true,
      };

      const pendingSejongMessage: ChatMessage = {
        id: sejongMsgId,
        sender: "sejong",
        text: "",
        timestamp: nowTime,
        isStreaming: true,
      };

      setMessages([...currentMessages, userMessage, pendingSejongMessage]);
      setIsStreaming(true);
      setErrorMsg(null);
      setLastFailedText(null);

      const payloadBody = JSON.stringify({
        studentName: activeProfile.name,
        history: currentMessages
          .filter((m) => !m.isStreaming && m.text.trim().length > 0)
          .map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        message: text,
      });

      const applyReplyText = (replyText: string) => {
        const replyTime = formatKoreanTime();
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === userMsgId) return { ...m, isUnread: false };
            if (m.id === sejongMsgId) {
              return { ...m, text: replyText, timestamp: replyTime, isStreaming: false };
            }
            return m;
          })
        );
      };

      const fetchJsonFallback = async () => {
        const fallbackRes = await fetch("/api/chat?mode=json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-response-mode": "json",
          },
          body: payloadBody,
        });

        const fallbackData = (await fallbackRes.json().catch(() => null)) as {
          text?: string;
          error?: string;
        } | null;

        if (!fallbackRes.ok) {
          throw new Error(
            fallbackData?.error || `세종대왕님께 전갈을 보내지 못했습니다. (${fallbackRes.status})`
          );
        }

        if (!fallbackData?.text) {
          throw new Error("응답 내용을 받지 못했습니다. 다시 한 번 여쭈어 주세요.");
        }

        applyReplyText(fallbackData.text);
      };

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payloadBody,
        });

        if (!response.ok) {
          let errText = "";
          try {
            const errJson = await response.json();
            if (errJson?.error) errText = errJson.error;
          } catch {
            // fallback below
          }
          if (errText) {
            throw new Error(errText);
          }
          await fetchJsonFallback();
          return;
        }

        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const jsonData = (await response.json()) as { text?: string; error?: string };
          if (jsonData.error) throw new Error(jsonData.error);
          if (jsonData.text) {
            applyReplyText(jsonData.text);
            return;
          }
        }

        if (!response.body) {
          await fetchJsonFallback();
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        let accumulated = "";

        const processEvents = (events: string[]) => {
          for (const event of events) {
            const line = event
              .split(/\r?\n/)
              .find((l) => l.startsWith("data: "));
            if (!line) continue;

            const rawJson = line.slice(6).trim();
            if (!rawJson) continue;

            let parsed: {
              text?: string;
              done?: boolean;
              error?: string;
            };
            try {
              parsed = JSON.parse(rawJson);
            } catch {
              continue;
            }

            if (parsed.error) {
              throw new Error(parsed.error);
            }

            if (parsed.text) {
              accumulated += parsed.text;
              const currentText = accumulated;
              const replyTime = formatKoreanTime();

              setMessages((prev) =>
                prev.map((m) => {
                  if (m.id === userMsgId) {
                    return { ...m, isUnread: false };
                  }
                  if (m.id === sejongMsgId) {
                    return { ...m, text: currentText, timestamp: replyTime };
                  }
                  return m;
                })
              );
            }
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            if (buffer.trim()) {
              processEvents(buffer.split(/\r?\n\r?\n/));
            }
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split(/\r?\n\r?\n/);
          buffer = events.pop() ?? "";
          processEvents(events);
        }

        if (!accumulated.trim()) {
          await fetchJsonFallback();
          return;
        }

        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === userMsgId) return { ...m, isUnread: false };
            if (m.id === sejongMsgId) {
              return {
                ...m,
                isStreaming: false,
              };
            }
            return m;
          })
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "대화 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
        setErrorMsg(message);
        setLastFailedText(text);
        setMessages((prev) => prev.filter((m) => m.id !== sejongMsgId));
      } finally {
        setIsStreaming(false);
      }
    },
    []
  );

  const handleSendMessage = (text: string) => {
    if (!studentProfile || isStreaming) return;
    void sendToSejong(text, messages, studentProfile);
  };

  const handleRetryLast = () => {
    if (!studentProfile || !lastFailedText || isStreaming) return;
    const lastMsg = messages[messages.length - 1];
    const cleaned =
      lastMsg?.sender === "user" && lastMsg.text === lastFailedText
        ? messages.slice(0, -1)
        : messages;
    void sendToSejong(lastFailedText, cleaned, studentProfile);
  };

  if (!studentProfile) {
    return (
      <EntryProfileModal
        mode="entry"
        onComplete={handleEnterChat}
      />
    );
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#F4F6F8]">
      {/* Desktop Left Sidebar */}
      <div className="hidden lg:block w-[360px] shrink-0 h-full">
        <JamoSidebar
          studentProfile={studentProfile}
          isStreaming={isStreaming}
          onSelectQuestion={handleSendMessage}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
          onOpenSejongProfile={() => setIsSejongProfileOpen(true)}
          onResetChat={handleResetChat}
        />
      </div>

      {/* Mobile Slide-Over Sidebar Drawer */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden flex"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/45"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-[86%] max-w-[340px] h-full bg-white shadow-xl">
            <JamoSidebar
              studentProfile={studentProfile}
              isStreaming={isStreaming}
              onSelectQuestion={handleSendMessage}
              onOpenEditProfile={() => {
                setIsMobileSidebarOpen(false);
                setIsEditProfileOpen(true);
              }}
              onOpenSejongProfile={() => {
                setIsMobileSidebarOpen(false);
                setIsSejongProfileOpen(true);
              }}
              onResetChat={() => {
                setIsMobileSidebarOpen(false);
                handleResetChat();
              }}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main KakaoTalk Chat Area */}
      <div className="flex-1 h-full min-w-0">
        <ChatRoom
          studentProfile={studentProfile}
          messages={messages}
          isStreaming={isStreaming}
          errorMsg={errorMsg}
          onSendMessage={handleSendMessage}
          onRetryLast={handleRetryLast}
          onOpenSejongProfile={() => setIsSejongProfileOpen(true)}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onResetChat={handleResetChat}
        />
      </div>

      {/* Modals */}
      {isEditProfileOpen && (
        <EntryProfileModal
          mode="edit"
          initialProfile={studentProfile}
          onComplete={handleUpdateProfile}
          onCancel={() => setIsEditProfileOpen(false)}
        />
      )}

      <SejongProfileModal
        isOpen={isSejongProfileOpen}
        onClose={() => setIsSejongProfileOpen(false)}
      />
    </div>
  );
}
