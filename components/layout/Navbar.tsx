import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';

export default function Navbar() {
  return (
    <div className="flex justify-between p-4">
      <div className="flex items-center">
        <Image src="/logo.png" alt="logo" width="50" height="50" />
        <h1>SAMAY</h1>
      </div>
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <Show when="signed-out">
          <SignInButton forceRedirectUrl="/dashboard" />
          <SignUpButton forceRedirectUrl="/dashboard">
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </div>
  );
}
