# AiTor Paywall: owner handoff

This foundation is ready for the owner decisions. It deliberately grants no access from the browser and it does not accept a transaction hash as proof by itself.

## What is already prepared

- `wallet_identities`: links a verified EVM wallet to an authenticated user.
- `access_orders`: records a requested crypto payment or NFT verification.
- `access_entitlements`: is the source of truth for paid access after server-side verification.
- `access-status`: authenticated endpoint that returns active entitlements for the current user.

## What the owner must decide

1. `PAYWALL_CHAIN_ID`: EVM CAIP-2 identifier, for example `eip155:137`.
2. `PAYWALL_ASSET`: payment asset, for example `USDC`.
3. `PAYWALL_RECIPIENT_ADDRESS`: public treasury address that receives payments.
4. `PAYWALL_ARCHITECT_PRICE`: price in the asset's base units or a documented decimal convention.
5. `PAYWALL_ACCESS_DAYS`: access duration after a confirmed payment.
6. `VITE_REOWN_PROJECT_ID`: Reown Project ID for the web client.
7. Optional NFT: contract address, chain and membership rule.

## Implementation order after owner confirmation

1. Add Reown AppKit and connect an EVM wallet.
2. Ask the wallet to sign a one-time ownership message; verify it server-side before setting `verified_at`.
3. Create an `access_orders` record server-side with the fixed payment destination and price.
4. Ask the user to send the payment, then verify the transaction with an RPC/provider on the server.
5. Only after chain, recipient, asset and amount match, create `access_entitlements` and update `user_credits.paid_tier`.
6. Make the Telegram bot consult the same entitlement before allowing paid actions.

## Security rules

- Never grant a tier from the browser, a Telegram message, or a transaction hash supplied by the user.
- Never store a seed phrase, private key or wallet password.
- The service role performs all writes to wallet, order and entitlement tables.
- Make a small test payment before enabling production access.
