/**
 * Global type declarations for CareerHQ application
 */

interface Window {
  /**
   * Cleanup function for the tracker simulation
   * Used in debug tools to stop ongoing simulations
   */
  trackerCleanup: (() => void) | null;
}
