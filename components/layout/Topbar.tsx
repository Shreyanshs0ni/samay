import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export function Topbar() {
  return (
    <div className="flex items-center justify-between w-full">
      <h2 className="text-sm text-muted-foreground">Welcome back 👋</h2>

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
