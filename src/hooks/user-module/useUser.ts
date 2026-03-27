import { useState, useCallback } from "react";
import type { UserProfile, UserSettings } from "@/types/user.types";
import { mockProfile, defaultSettings } from "@/data/mockUserData";

/** Lightweight user hook — swap mock data for real API later */
export function useUser() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  const login = useCallback(() => setIsLoggedIn(true), []);
  const logout = useCallback(() => setIsLoggedIn(false), []);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((p) => ({ ...p, ...patch }));
  }, []);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  return {
    profile,
    isLoggedIn,
    settings,
    login,
    logout,
    updateProfile,
    updateSettings,
  };
}
