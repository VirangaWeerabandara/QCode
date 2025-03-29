import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";

interface FormInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FirstNameInput = ({ value, onChange }: FormInputProps) => (
  <div className="mb-4">
    <label htmlFor="first-name" className="sr-only">
      First Name
    </label>
    <input
      id="first-name"
      name="firstName"
      type="text"
      value={value}
      onChange={onChange}
      autoComplete="firstName"
      required
      className="relative block w-full appearance-none rounded-md border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      placeholder="First Name"
    />
  </div>
);

const LastNameInput = ({ value, onChange }: FormInputProps) => (
  <div className="mb-4">
    <label htmlFor="last-name" className="sr-only">
      Last Name
    </label>
    <input
      id="last-name"
      name="lastName"
      type="text"
      value={value}
      onChange={onChange}
      autoComplete="lastName"
      required
      className="relative block w-full appearance-none rounded-md border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      placeholder="Last Name"
    />
  </div>
);

const EmailInput = ({ value, onChange }: FormInputProps) => (
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

const PasswordInput = ({ value, onChange }: FormInputProps) => (
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

const Register = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
    setError(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        setIsLoading(false);
        return;
      }

      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));
      setIsLoading(false);
      closeModal();
    } catch (error) {
      setError("An error occurred during registration");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0">
        <div className="hidden lg:block">
          <button
            className="text-Blueviolet text-lg font-medium ml-9 py-5 px-16 transition duration-150 ease-in-out rounded-full bg-semiblueviolet hover:text-white hover:bg-Blueviolet"
            onClick={openModal}
          >
            Sign up
          </button>
        </div>
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
                  <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md space-y-8">
                      <div>
                        <img
                          className="mx-auto h-12 w-auto"
                          src="/assets/logo/logo1.png"
                          alt="Your Company"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                          Register your account
                        </h2>
                      </div>

                      {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                          <div className="flex">
                            <div className="ml-3">
                              <p className="text-sm text-red-700">{error}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                          <FirstNameInput
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                          <LastNameInput
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                          <EmailInput
                            value={formData.email}
                            onChange={handleChange}
                          />
                          <PasswordInput
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              id="remember-me"
                              name="remember-me"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor="remember-me"
                              className="ml-2 block text-sm text-gray-900"
                            >
                              Remember me
                            </label>
                          </div>
                        </div>

                        <div>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-Blueviolet py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                          >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                            </span>
                            {isLoading ? "Registering..." : "Register Now"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-100"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Register;
