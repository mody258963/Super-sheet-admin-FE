import { useEffect, useLayoutEffect } from 'react';

// This hook is a safe way to use useLayoutEffect for SSR
// It uses useLayoutEffect on the client and useEffect on the server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
