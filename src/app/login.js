import React, { useEffect, useState } from "react";
import { validateEmail } from "../../lib/utils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailInPutError, setEmailInputError] = useState(false);
  const [passwordInPutError, setPasswordInputError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    validate();
  }, [email, password]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`,
      // 移除 redirect: true 選項
    });

    setIsLoading(false);

    if (res?.ok) {
      // 顯示成功訊息
      console.log("成功");
      // 手動導向到所需頁面
      router.push("/your-desired-path");
    } else {
      // 顯示失敗訊息
      setError("失敗! 請檢查您的輸入並重試。");
      console.log("失敗", res);
    }
  }

  function validate() {
    let emailIsValid = validateEmail(email);

    if (!emailIsValid) {
      setEmailInputError(true);
      return;
    }
    if (password.length < 6) {
      setPasswordInputError(true);
    } else {
      setEmailInputError(false);
      setPasswordInputError(false);
    }
  }

  return (
    <div className="flex justify-center items-center m-auto p-3">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            電子郵件
          </label>
          <input
            className={`border-${
              emailInPutError ? "red-500" : ""
            } shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="email"
            type="text"
            placeholder="電子郵件"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            密碼
          </label>
          <input
            className={` border-${
              passwordInPutError ? "red-500" : ""
            } shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
            id="password"
            type="password"
            placeholder="******************"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <p className="text-red-500 text-xs italic">請輸入密碼。</p>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500  hover:bg-blue-700 text-white font-bold py-2  px-4 rounded  focus:outline-none  focus:shadow-outline"
            type="submit"
            disabled={isLoading ? true : false}
          >
            {isLoading ? "載入中..." : "登入"}
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            忘記密碼?
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;