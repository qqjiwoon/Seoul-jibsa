import { useMemo, useState } from "react";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../types/auth";
import { resetPassword } from "../../api/AuthApi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import AuthCardLayout from "../../components/auth/AuthCardLayout";
import AuthTextField from "../../components/auth/AuthTextField";

function isStrongEnough(pw: string) {
  // 프로젝트 정책이 없어서 최소 길이만 기본 적용
  return pw.trim().length >= 8;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const initialToken = params.get("token") ?? "";

  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (isLoading) return false;
    if (!token.trim()) return false;
    if (!isStrongEnough(newPassword)) return false;
    if (newPassword !== confirmPassword) return false;
    return true;
  }, [token, newPassword, confirmPassword, isLoading]);

  const resetMessages = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setErrorCode(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    const safeToken = token.trim();
    const pw = newPassword.trim();

    if (!safeToken) {
      setErrorMessage("재설정 토큰을 입력해주세요.");
      return;
    }
    if (!isStrongEnough(pw)) {
      setErrorMessage("비밀번호는 8자 이상으로 입력해주세요.");
      return;
    }
    if (pw !== confirmPassword) {
      setErrorMessage("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword({ token: safeToken, newPassword: pw });

      if (res.success) {
        setSuccessMessage(res.message || "비밀번호가 변경되었습니다.");
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
      title="비밀번호 재설정"
      subtitle="이메일로 받은 토큰과 새 비밀번호를 입력해주세요."
      footer={
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 font-medium">
          <Link to="/login" className="hover:text-primary transition-colors">
            로그인으로 돌아가기
          </Link>
          <div className="w-px h-3 bg-gray-300"></div>
          <Link to="/recovery/password" className="hover:text-primary transition-colors">
            재설정 이메일 다시 보내기
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthTextField
          label="재설정 토큰"
          icon="key"
          value={token}
          onChange={setToken}
          placeholder="이메일에 포함된 토큰을 입력해주세요"
          autoComplete="off"
        />

        <AuthTextField
          label="새 비밀번호"
          icon="lock"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="새 비밀번호를 입력해주세요 (8자 이상)"
          autoComplete="new-password"
        />

        <AuthTextField
          label="새 비밀번호 확인"
          icon="lock"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="새 비밀번호를 다시 입력해주세요"
          autoComplete="new-password"
        />

        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="font-semibold">재설정 실패</div>
            <div className="mt-1">{errorMessage}</div>

            {errorCode === "USR-ERR-401" && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => navigate("/recovery/password")}
                  className="w-full rounded-2xl bg-primary text-white font-bold h-11 hover:brightness-105 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  재설정 이메일 다시 받기
                </button>
              </div>
            )}
          </div>
        )}

        {successMessage && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-4 text-sm">
            <div className="font-semibold text-gray-900">변경 완료</div>
            <div className="mt-1 text-gray-700">{successMessage}</div>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full rounded-2xl bg-primary text-white font-bold h-12 hover:brightness-105 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                로그인 하러가기
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit || !!successMessage}
          className="w-full bg-primary text-white font-bold text-lg h-14 rounded-2xl hover:brightness-105 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? "변경 중..." : "비밀번호 변경하기"}
        </button>
      </form>
    </AuthCardLayout>
  );
}
