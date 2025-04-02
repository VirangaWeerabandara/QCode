import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { API_ROUTES, fetchApi } from "../../../utils/api";
import { useAuth } from "../../context/AuthContext"; 

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface LoginResponse {
  email: string;
  token: string;
  _id: string;
  name: string;
}

const EmailInput: React.FC<InputProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <label htmlFor="email-address" className="sr-only">
      Email address
    </label>
    <input
      id="email-address"
      name="email"
      type="email"
      value={value}
      onChange={onChange}
      autoComplete="email"
      required
      className="relative block w-full appearance-none rounded-md border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      placeholder="Email address"
    />
  </div>
);

const PasswordInput: React.FC<InputProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <label htmlFor="password" className="sr-only">
      Password
    </label>
    <input
      id="password"
      name="password"
      type="password"
      value={value}
      onChange={onChange}
      autoComplete="current-password"
      required
      className="relative block w-full appearance-none rounded-md border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      placeholder="Password"
    />
  </div>
);

interface ApiError {
  error: string;
}

function isApiError(data: any): data is ApiError {
  return "error" in data;
}

const SignDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { login } = useAuth(); // Use the login function from Auth Context

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchApi<LoginResponse>(API_ROUTES.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Use Auth Context login instead of directly setting localStorage
      login(data.token, {
        email: data.email,
        id: data._id,
        name: data.name,
      });

      // Reset form
      setEmail("");
      setPassword("");
      setIsLoading(false);
      setIsOpen(false);

      // Redirect to dashboard after successful login
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to server"
      );
      setIsLoading(false);
      console.error("Login error:", err);
    }
  };

  const closeModal = (): void => {
    setIsOpen(false);
    setError(null);
  };

  const openModal = (): void => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="">
        <button
          type="button"
          onClick={openModal}
          className="rounded-full border border-Blueviolet px-6 py-2 text-sm font-medium text-Blueviolet hover:bg-Blueviolet hover:text-white hover:bg-opacity-90 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-Blueviolet focus-visible:ring-opacity-75"
        >
          Sign In
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div>
                    <Image
                      className="mx-auto h-12 w-auto"
                      src="/assets/logo/logo1.png"
                      alt="Your Company"
                      width={48} // Specify the width (h-12 = 48px)
                      height={48} // Specify the height
                    />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                      Sign in to your account
                    </h2>
                  </div>

                  <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="space-y-4">
                      <EmailInput
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm text-center">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative flex w-full justify-center rounded-md border border-transparent bg-Blueviolet py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                      </span>
                      {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SignDialog;
