import { useMemo, useState } from "react";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../types/auth";
import { sendPasswordRecoveryEmail } from "../../api/AuthApi";
import { Link, useNavigate } from "react-router-dom";

import AuthCardLayout from "../../components/auth/AuthCardLayout";
import AuthTextField from "../../components/auth/AuthTextField";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function RecoverPasswordPage() {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (isLoading) return false;
    if (!loginId.trim()) return false;
    if (!isValidEmail(email)) return false;
    return true;
  }, [loginId, email, isLoading]);

  const resetMessages = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setErrorCode(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    const safeLoginId = loginId.trim();
    const safeEmail = email.trim();

    if (!safeLoginId) {
      setErrorMessage("아이디를 입력해주세요.");
      return;
    }
    if (!isValidEmail(safeEmail)) {
      setErrorMessage("이메일 형식이 올바르지 않습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendPasswordRecoveryEmail({
        loginId: safeLoginId,
        email: safeEmail,
      });

      if (res.success) {
        setSuccessMessage(res.message || "비밀번호 재설정 이메일을 전송했습니다.");
      } else {
        setErrorMessage(res.message || "요청 중 오류가 발생했습니다.");
      }
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      const code = axiosErr.response?.data?.code;
      const msg = axiosErr.response?.data?.message ?? "요청 중 오류가 발생했습니다.";
      setErrorCode(code ?? null);
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCardLayout
      title="비밀번호 찾기"
      subtitle="아이디와 이메일을 입력하시면 재설정 링크를 보내드립니다."
      footer={
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 font-medium">
          <Link to="/login" className="hover:text-primary transition-colors">
            로그인으로 돌아가기
          </Link>
          <div className="w-px h-3 bg-gray-300"></div>
          <Link to="/recovery/id" className="hover:text-primary transition-colors">
            아이디 찾기
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthTextField
          label="아이디"
          icon="person"
          value={loginId}
          onChange={setLoginId}
          placeholder="아이디를 입력해주세요"
          autoComplete="username"
        />

        <AuthTextField
          label="이메일"
          icon="mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="이메일을 입력해주세요"
        />

        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="font-semibold">전송 실패</div>
            <div className="mt-1">{errorMessage}</div>

            {errorCode === "USR-ERR-002" && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full rounded-2xl bg-primary text-white font-bold h-11 hover:brightness-105 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  로그인으로 이동
                </button>
              </div>
            )}
          </div>
        )}

        {successMessage && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-4 text-sm">
            <div className="font-semibold text-gray-900">전송 완료</div>
            <div className="mt-1 text-gray-700">{successMessage}</div>
            <div className="mt-3 text-gray-500">
              이메일이 보이지 않으면 스팸함도 확인해주세요.
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-primary text-white font-bold text-lg h-14 rounded-2xl hover:brightness-105 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? "전송 중..." : "재설정 이메일 보내기"}
        </button>

        <div className="pt-1 text-center">
          <Link
            to="/recovery/password/reset"
            className="text-xs text-gray-500 hover:text-primary transition-colors"
          >
            이미 토큰이 있으신가요? 비밀번호 재설정으로 이동
          </Link>
        </div>
      </form>
    </AuthCardLayout>
  );
}
