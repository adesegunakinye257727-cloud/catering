import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CinematicHeroConfig,
  INITIAL_CINEMATIC_HERO_CONFIG,
  getCinematicHeroConfig,
  saveCinematicHeroConfig,
  replaceCinematicHeroVideo,
  subscribeToCinematicHeroConfig,
} from '../../services/cinematicHeroService';

export function useCinematicConfig() {
  const [config, setConfig] = useState<CinematicHeroConfig>(INITIAL_CINEMATIC_HERO_CONFIG);
  const [savedConfig, setSavedConfig] = useState<CinematicHeroConfig>(INITIAL_CINEMATIC_HERO_CONFIG);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [firestoreStatus, setFirestoreStatus] = useState<'connected' | 'offline' | 'fallback'>('connected');

  // Load initial data and subscribe to changes
  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      setLoading(true);
      setError(null);
      const res = await getCinematicHeroConfig();
      if (!isMounted) return;

      setConfig(res.data);
      setSavedConfig(res.data);
      if (res.fromCache) {
        setFirestoreStatus('fallback');
        if (res.error) {
          setError(res.error);
        }
      } else {
        setFirestoreStatus('connected');
      }
      setLoading(false);
    }

    loadInitial();

    // Setup real-time listener
    const unsubscribe = subscribeToCinematicHeroConfig(
      (freshData) => {
        if (!isMounted) return;
        setSavedConfig(freshData);
        // Only update current config if user hasn't made dirty edits
        setConfig((curr) => {
          const isDirty = JSON.stringify(curr) !== JSON.stringify(savedConfig);
          return isDirty ? curr : freshData;
        });
        setFirestoreStatus('connected');
      },
      (err) => {
        if (!isMounted) return;
        setFirestoreStatus('offline');
        console.warn('Firestore snapshot notice:', err.message);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Update a single field
  const updateField = useCallback(
    <K extends keyof CinematicHeroConfig>(field: K, value: CinematicHeroConfig[K]) => {
      setConfig((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Clear success notification on change
      setSuccessMessage(null);
    },
    []
  );

  // Set uploaded video data
  const setVideoData = useCallback(
    (videoInfo: { videoUrl: string; cloudinaryPublicId: string; videoName?: string }) => {
      setConfig((prev) => ({
        ...prev,
        videoUrl: videoInfo.videoUrl,
        cloudinaryPublicId: videoInfo.cloudinaryPublicId,
        videoName: videoInfo.videoName || prev.videoName || 'Cinematic Hero Food Video',
      }));
      setSuccessMessage(null);
    },
    []
  );

  // Remove video
  const removeVideo = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      videoUrl: '',
      cloudinaryPublicId: '',
      videoName: '',
      enabled: false,
    }));
    setSuccessMessage(null);
  }, []);

  // Check if form is dirty (modified from saved state)
  const isDirty = useMemo(() => {
    return (
      config.enabled !== savedConfig.enabled ||
      config.videoUrl !== savedConfig.videoUrl ||
      config.cloudinaryPublicId !== savedConfig.cloudinaryPublicId ||
      config.videoName !== savedConfig.videoName ||
      config.scrollControlled !== savedConfig.scrollControlled ||
      Number(config.sectionHeight) !== Number(savedConfig.sectionHeight) ||
      config.mobileEnabled !== savedConfig.mobileEnabled ||
      config.desktopEnabled !== savedConfig.desktopEnabled
    );
  }, [config, savedConfig]);

  // Discard changes
  const discardChanges = useCallback(() => {
    setConfig({ ...savedConfig });
    setError(null);
    setSuccessMessage('Changes discarded. Restored last saved settings.');
    setTimeout(() => setSuccessMessage(null), 3500);
  }, [savedConfig]);

  // Save changes to Firestore
  const saveChanges = useCallback(async () => {
    // Validation
    const height = Number(config.sectionHeight);
    if (isNaN(height) || height < 100 || height > 5000) {
      setError('Section height must be between 100vh and 5000vh.');
      return false;
    }

    if (config.videoUrl && !config.videoUrl.startsWith('http')) {
      setError('Please provide a valid URL for the video (starting with http or https).');
      return false;
    }

    setSaving(true);
    setError(null);

    const cleanConfig: CinematicHeroConfig = {
      ...config,
      sectionHeight: height,
    };

    const res = await saveCinematicHeroConfig(cleanConfig);
    setSaving(false);

    if (res.success) {
      setSavedConfig(cleanConfig);
      setConfig(cleanConfig);
      setSuccessMessage('Configuration saved to Firestore successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
      return true;
    } else {
      setError(res.error || 'Failed to save configuration to Firestore.');
      return false;
    }
  }, [config]);

  // Compute video status
  const videoStatus: 'active' | 'inactive' | 'no-video' = useMemo(() => {
    if (!config.videoUrl) return 'no-video';
    return config.enabled ? 'active' : 'inactive';
  }, [config.videoUrl, config.enabled]);

  // Directly replace the cinematic video in Firestore and update preview
  const replaceVideo = useCallback(
    async (videoData: { videoUrl: string; cloudinaryPublicId: string; videoName: string }) => {
      setSaving(true);
      setError(null);
      const res = await replaceCinematicHeroVideo(videoData);
      setSaving(false);

      if (res.success) {
        setConfig(res.updatedConfig);
        setSavedConfig(res.updatedConfig);
        setSuccessMessage('Cinematic video updated successfully.');
        setTimeout(() => setSuccessMessage(null), 5000);
        return true;
      } else {
        setError(res.error || 'Failed to update video in Firestore.');
        return false;
      }
    },
    []
  );

  return {
    config,
    savedConfig,
    loading,
    saving,
    error,
    setError,
    successMessage,
    firestoreStatus,
    isDirty,
    videoStatus,
    updateField,
    setVideoData,
    replaceVideo,
    removeVideo,
    discardChanges,
    saveChanges,
  };
}
