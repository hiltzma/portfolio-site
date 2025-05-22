import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { AdminPanel } from "./AdminPanel";
import { PublicView } from "./PublicView";
import { Profile } from "./lib/types";
import { useEffect, useState } from "react";

export default function App() {
  const profile = useQuery(api.profile.get) as Profile | null;
  const certificates = useQuery(api.certificates.list);
  const achievements = useQuery(api.achievements.list);
  const education = useQuery(api.education.list);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const isAdminSetup = useQuery(api.adminAuth.checkAdminSetup);
  const isAdmin = useQuery(api.adminAuth.validateAdminAccess);
  const adminEmail = useQuery(api.adminAuth.getAdminEmail);

  const closeDialog = () => {
    const dialog = document.getElementById('signin-dialog') as HTMLDialogElement;
    if (dialog) dialog.close();
    setShowAdminDialog(false);
  };

  // Listen for Ctrl+Shift+A to show admin dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        const dialog = document.getElementById('signin-dialog') as HTMLDialogElement;
        if (dialog) dialog.showModal();
        setShowAdminDialog(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // If authenticated but not admin, sign out
  useEffect(() => {
    if (isAdmin === false) {
      const signOutButton = document.querySelector('[data-sign-out]') as HTMLButtonElement;
      if (signOutButton) {
        signOutButton.click();
      }
    }
  }, [isAdmin]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-200">
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-800">
        <h2 className="text-xl font-semibold text-red-500">Portfolio</h2>
        <Authenticated>
          {isAdmin && <SignOutButton />}
        </Authenticated>
      </header>
      <main className="flex-1">
        <Authenticated>
          {isAdmin ? (
            <AdminPanel 
              profile={profile} 
              certificates={certificates} 
              achievements={achievements}
              education={education}
            />
          ) : (
            <div className="text-center text-gray-400 mt-8">
              Access denied. This account is not authorized as admin.
            </div>
          )}
        </Authenticated>
        <Unauthenticated>
          {profile ? (
            <PublicView 
              profile={profile}
              certificates={certificates}
              achievements={achievements}
              education={education}
            />
          ) : (
            <div className="text-center text-gray-400 mt-8">
              No profile data available yet. Admin needs to add profile information.
            </div>
          )}
          <dialog id="signin-dialog" className="rounded-lg p-6 backdrop:bg-black/50 bg-gray-900 text-gray-200">
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2 text-red-500">Admin Login</h2>
              {isAdminSetup ? (
                <p className="text-gray-400">Sign in with admin email: {adminEmail}</p>
              ) : (
                <p className="text-gray-400">First time setup - Create admin account</p>
              )}
            </div>
            <SignInForm />
            <button 
              onClick={closeDialog}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
            >
              ✕
            </button>
          </dialog>
        </Unauthenticated>
      </main>
      {showAdminDialog && (
        <div className="fixed bottom-4 left-4 text-sm text-gray-500">
          Press Ctrl+Shift+A to show admin login
        </div>
      )}
      <Toaster theme="dark" />
    </div>
  );
}
