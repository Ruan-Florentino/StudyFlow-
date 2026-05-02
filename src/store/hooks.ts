import { useShallow } from 'zustand/react/shallow';
import { useUserStore, useUIStore, useSessionStore } from './index';

export const useAuth = () => {
  const userStore = useUserStore(
    useShallow((s) => ({
      name: s.name,
      bio: s.bio,
      profilePic: s.profilePic,
      coverPic: s.coverPic,
      userId: s.userId,
      isAuthReady: s.isAuthReady,
      setName: s.setName,
      setBio: s.setBio,
      setProfilePic: s.setProfilePic,
      setCoverPic: s.setCoverPic,
      setUserId: s.setUserId,
      setAuthReady: s.setAuthReady,
    }))
  );

  const uiStore = useUIStore(
    useShallow((s) => ({
      hasCompletedOnboarding: s.hasCompletedOnboarding,
      completeOnboarding: s.completeOnboarding,
    }))
  );

  return { ...userStore, ...uiStore };
};

export const usePomodoro = () => {
  return useSessionStore(
    useShallow((s) => ({
      routine: s.routine,
      setRoutine: s.setRoutine,
      studyRooms: s.studyRooms,
      joinRoom: s.joinRoom,
      updateGlobalPulse: s.updateGlobalPulse,
      setAudioVolume: s.setAudioVolume,
      setAudioPlaying: s.setAudioPlaying,
    }))
  );
};
