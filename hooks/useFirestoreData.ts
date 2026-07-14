import { useCallback, useEffect, useMemo, useState } from 'react';

import { enableFirestoreOfflinePersistence } from '@/firebase/firestore';

type Loader<TData> = () => Promise<TData>;

const queryCache = new Map<string, unknown>();

export function clearFirestoreDataCache() {
  queryCache.clear();
}

export type FirestoreHookState<TData> = {
  data: TData;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  retry: () => Promise<void>;
};

function readError(error: unknown) {
  const nextError = error as { message?: string };
  const message = nextError.message ?? '';
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('permission') || lowerMessage.includes('insufficient')) {
    return 'You do not have permission to load this Firestore data. Please check the account role and Firebase rules.';
  }

  if (lowerMessage.includes('index')) {
    return 'This Firestore data could not be loaded because a database index is missing. Try again after checking the Firebase setup.';
  }

  return 'Unable to load Firestore data. Please try again.';
}

export function useFirestoreData<TData>(cacheKey: string, initialData: TData, loader: Loader<TData>): FirestoreHookState<TData> {
  const cachedData = queryCache.get(cacheKey) as TData | undefined;
  const [data, setData] = useState<TData>(cachedData ?? initialData);
  const [loading, setLoading] = useState(!cachedData);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      await enableFirestoreOfflinePersistence();
      const nextData = await loader();
      queryCache.set(cacheKey, nextData);
      setData(nextData);
    } catch (nextError) {
      const fallbackData = queryCache.get(cacheKey) as TData | undefined;
      const nextData = fallbackData ?? initialData;
      setError(readError(nextError));
      setData(nextData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [cacheKey, loader]);

  useEffect(() => {
    void load();
  }, [load]);

  return useMemo(
    () => ({ data, loading, error, refreshing, retry: load }),
    [data, error, load, loading, refreshing],
  );
}



