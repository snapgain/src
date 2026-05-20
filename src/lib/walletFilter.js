/**
 * Build the `userWallet` payload that `computeStrategies` expects when
 * the user opted into wallet-only filtering in Settings.
 *
 * Returns `null` if filtering is OFF, OR if the wallet is empty (we
 * never want to show zero routes — that's worse than showing too many).
 * Returning null tells the strategies engine to skip the filter.
 *
 * Shape (when active):
 *   {
 *     cashbackPlatformNames: Set<string>,
 *     milesProgramNames:      Set<string>,
 *   }
 */
export function buildWalletFilter({ walletOnly, wallet }) {
  if (!walletOnly) return null;
  if (!wallet) return null;
  const cb = new Set(
    (wallet.cashbackPlatforms || [])
      .map((p) => p?.platform?.name)
      .filter(Boolean)
  );
  const mp = new Set(
    (wallet.milesPrograms || [])
      .map((m) => m?.miles_program?.name)
      .filter(Boolean)
  );
  if (cb.size === 0 && mp.size === 0) return null; // empty wallet → show all
  return { cashbackPlatformNames: cb, milesProgramNames: mp };
}
