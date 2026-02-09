// Front/src/pages/Auth/LoginPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import GoogleButton from "../../components/login/GoogleButton";
import KakaoButton from "../../components/login/KakaoButton";
import AuthCardLayout from "../../components/auth/AuthCardLayout";
import AuthTextField from "../../components/auth/AuthTextField";

import { login as loginAPI } from "../../api/AuthApi";
import { useAuth } from "../../context/AuthContext";
import { useUIStore } from "../../store/uiStore";

const baseURL = "/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const openAlert = useUIStore((state) => state.openAlert);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!loginId || !password) {
      openAlert({
        title: "입력 오류",
        message: "아이디와 비밀번호를 모두 입력해주세요.",
        icon: "warning",
        variant: "danger",
      });
      return;
    }

    const result = await loginAPI({ loginId, password });

    if (result) {
      login({
        accessToken: result.accessToken,
        userName: result.userName,
        userRole: result.userRole,
      });

      openAlert({
        title: "환영합니다!",
        message: `${result.userName}님, 반갑습니다!`,
        icon: "check",
        onConfirm: () => navigate("/"),
      });
    } else {
      openAlert({
        title: "로그인 실패",
        message: "아이디 또는 비밀번호가 일치하지 않습니다.",
        icon: "error",
        variant: "danger",
      });
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = `${baseURL}/auth/kakao`;
  };

  const handleGoogleLogin = () => {
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <AuthCardLayout
      title="서울집사 로그인"
      subtitle="청년과 신혼부부를 위한 맞춤형 주거지원 서비스"
      footer={
        <div className="text-center">
          <p className="text-sm text-gray-500">
            아직 회원이 아니신가요?{" "}
            <Link to="/signup" className="text-primary font-bold hover:underline ml-1">
              회원가입
            </Link>
          </p>
        </div>
      }
    >
      {/* 로그인 폼 */}
      <form onSubmit={handleLogin} className="space-y-5">
        <AuthTextField
          label="아이디"
          icon="person"
          name="userId"
          value={loginId}
          onChange={setLoginId}
          placeholder="아이디를 입력해주세요"
          autoComplete="username"
        />

        <AuthTextField
          label="비밀번호"
          icon="lock"
          type="password"
          name="password"
          value={password}
          onChange={setPassword}
          placeholder="비밀번호를 입력해주세요"
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="w-full bg-primary text-white font-bold text-lg h-14 rounded-2xl hover:brightness-105 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-2"
        >
          로그인
        </button>

        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 font-medium pt-2">
          <Link to="/recovery/id" className="hover:text-primary transition-colors">
            아이디 찾기
          </Link>
          <div className="w-px h-3 bg-gray-300"></div>
          <Link to="/recovery/password" className="hover:text-primary transition-colors">
            비밀번호 찾기
          </Link>
        </div>
      </form>

      {/* 소셜 로그인 */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400 font-medium">또는</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <KakaoButton onClick={handleKakaoLogin} />
        <GoogleButton onClick={handleGoogleLogin} />
      </div>
    </AuthCardLayout>
  );
}
