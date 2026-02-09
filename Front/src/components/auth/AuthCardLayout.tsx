// Front/src/components/auth/AuthCardLayout.tsx
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthCardLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="bg-white flex flex-col items-center my-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-lg border border-gray-100 p-8 md:p-10 relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <img
              src="/seouljibsa.png"
              alt="서울집사 로고"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-[#111814] mb-1">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
          )}
        </div>

        {children}

        {footer ? <div className="mt-10">{footer}</div> : null}
      </div>
    </div>
  );
}
