/**
 * Static Site authentication adapter.
 *
 * This build intentionally keeps game progress on the player's device and
 * does not require OAuth, tRPC, a database, or a Node.js backend.
 */
type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

type StaticUser = {
  name?: string;
  email?: string;
};

export function useAuth(_options?: UseAuthOptions) {
  return {
    user: null as StaticUser | null,
    loading: false,
    error: null,
    isAuthenticated: false,
    refresh: async () => undefined,
    logout: async () => undefined,
  };
}
