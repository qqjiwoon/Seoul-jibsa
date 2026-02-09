// Front/src/pages/Auth/RecoverIdPage.tsx
import { useMemo, useState } from "react";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../types/auth";
import { recoverLoginId } from "../../api/AuthApi";
import { Link, useNavigate } from "react-router-dom";

import AuthCardLayout from "../../components/auth/AuthCardLayout";
import AuthTextField from "../../components/auth/AuthTextField";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function RecoverIdPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [foundLoginId, setFoundLoginId] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => isValidEmail(email) && !isLoading,
    [email, isLoading]
  );

  const resetResult = () => {
    setFoundLoginId(null);
    setServerMessage(null);
    setErrorMessage(null);
    setErrorCode(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetResult();

    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setErrorMessage("이메일 형식이 올바르지 않습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await recoverLoginId(trimmed);
      setFoundLoginId(res.loginId);
      setServerMessage(res.message ?? "아이디 조회에 성공했습니다.");
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      const code = axiosErr.response?.data?.code;
      const msg =
        axiosErr.response?.data?.message ?? "요청 중 오류가 발생했습니다.";

      setErrorCode(code ?? null);
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCardLayout
      title="아이디 찾기"
      subtitle="가입하신 이메일로 아이디를 조회해 드립니다."
      footer={
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 font-medium">
          <Link to="/login" className="hover:text-primary transition-colors">
            로그인으로 돌아가기
          </Link>
          <div className="w-px h-3 bg-gray-300"></div>
          <Link to="/signup" className="hover:text-primary transition-colors">
            회원가입
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="font-semibold">조회 실패</div>
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

        {foundLoginId && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-4">
            <div className="text-sm font-bold text-gray-900 ml-1">조회된 아이디</div>
            <div className="mt-2 rounded-2xl bg-white border border-gray-200 px-4 py-3.5 font-bold text-gray-900">
              {foundLoginId}
            </div>

            {serverMessage && (
              <div className="mt-2 text-sm text-gray-600">{serverMessage}</div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex-1 bg-primary text-white font-bold h-12 rounded-2xl hover:brightness-105 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                로그인
              </button>
              <button
                type="button"
                onClick={() => navigate("/recovery/password")}
                className="flex-1 h-12 rounded-2xl border border-gray-200 bg-white text-gray-900 font-bold hover:bg-gray-50 transition-all"
              >
                비밀번호 찾기
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-primary text-white font-bold text-lg h-14 rounded-2xl hover:brightness-105 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? "조회 중..." : "아이디 조회"}
        </button>
      </form>
    </AuthCardLayout>
  );
}
