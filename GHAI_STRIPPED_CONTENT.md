# GHAI Stripped Content Archive

Preserved content removed during the GHAI strip (2026-04-08).
Organized by source file for future restoration.

---

## app/ghost-ai/page.tsx

### Contract Address Constant
```tsx
const GHAI_CONTRACT = 'Ch8Ek9PTbzSGdL4EWHC2pQfPq2vTseiCPjeZsAZLx5gK'
```

### Price Data Interface & State
```tsx
interface PriceData {
  priceUsd: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}
```

### Price fetch useEffect
```tsx
const [price, setPrice] = useState<PriceData | null>(null)
const [priceLoading, setPriceLoading] = useState(true)

useEffect(() => {
  fetch('/api/ghai/price')
    .then(r => r.ok ? r.json() : null)
    .then(d => { if (d?.priceUsd) setPrice(d) })
    .catch(() => {})
    .finally(() => setPriceLoading(false))
}, [])

const priceUp = (price?.priceChange24h ?? 0) >= 0
```

### Buy on Raydium Button
```tsx
<a
  href={`https://raydium.io/swap/?inputMint=sol&outputMint=${GHAI_CONTRACT}`}
  target="_blank" rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold transition-all"
  style={{
    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
    color: '#fff',
    boxShadow: '0 0 30px rgba(139,92,246,0.35)',
  }}
  onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(139,92,246,0.6)'}
  onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(139,92,246,0.35)'}
>
  Buy on Raydium <ArrowRight size={15} />
</a>
```

### Tagline "swap on Raydium"
```tsx
The ecosystem token of voidexa — swap on Raydium, use on the platform
```

### Live Price Card Section (lines 393-523)
```tsx
{/* Live price card */}
<motion.div ... className="mb-10 rounded-2xl p-6" ...>
  {/* GHAI price display, 24h change, Volume, Liquidity, Market Cap */}
</motion.div>

{/* Contract address */}
<motion.div ... className="rounded-2xl p-5 mb-6" ...>
  <code>{GHAI_CONTRACT}</code>
  <a href={`https://solscan.io/token/${GHAI_CONTRACT}`}>Solscan</a>
</motion.div>

{/* Token stats grid: Chain, Supply, Mint, Freeze */}
<motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
  Chain: Solana, Supply: 700M circulating, Mint: Revoked, Freeze: Revoked
</motion.div>
```

### Void Chat CTA "pay in USD or GHAI"
```tsx
Claude, GPT-4o, and Gemini — one interface — pay in USD or GHAI
```

---

## app/claim-your-planet/page.tsx

### GHAI Discount Banner (Section 2)
```tsx
{/* ── 2. GHAI BANNER ── */}
<section>
  <motion.div>
    USD pricing. GHAI accepted at 15% discount.
    All planet pricing is in USD. Pay via Stripe, or use GHAI at a 15% discount. GHAI is available on Raydium (Solana).
    All prices in USD. Pay with GHAI for a discount.
  </motion.div>
</section>
```

### Pioneer Reward Amounts (Section 4)
```tsx
{ milestone: '6-Month Milestone', amount: '5,000,000 GHAI', ... }
{ milestone: '12-Month Milestone', amount: '5,000,000 GHAI', ... }
```

### Fuel Your Planet Pricing (Section 5)
```tsx
desc: '$500 USD (or equivalent in GHAI at daily rate) — a one-time deposit...'
desc: '$50/month USD (or equivalent in GHAI at daily rate) — keeps your planet active...'
```

### Protected Ecosystem GHAI References
```tsx
'Every GHAI transaction is tracked on-chain. USD payments tracked via Stripe...'
'Planet rules, pioneer rewards, and fund distribution are enforced by smart contracts — no manual overrides.'
```

### How to Claim Step 3
```tsx
desc: 'Once approved, make your initial GHAI deposit, set up your monthly contribution, and launch your planet into the star system.'
```

### Hero "Fuel it with USD or GHAI"
```tsx
Build infrastructure. Fuel it with USD or GHAI. Become part of the network that runs itself.
```

---

## app/void-chat/pricing/page.tsx

### GHAI Tier Card
```tsx
<div className="bg-gray-900 border-2 border-purple-500 rounded-2xl p-8 relative">
  <span className="absolute -top-3 ...">
    {GHAI_DISCOUNT_PERCENT}% cheaper
  </span>
  <h3>GHAI Tokens</h3>
  <p>1-5 GHAI per message</p>
  <ul>
    ✓ All models including premium
    ✓ Pay only for what you use
    ✓ No subscription
    ✓ {GHAI_DISCOUNT_PERCENT}% cheaper than fiat
  </ul>
  <button>Deposit GHAI</button>
</div>
```

### Per-Model Pricing Table GHAI Column
```tsx
<th>GHAI / message</th>
<td>{GHAI_COSTS[model.id]} GHAI</td>
```

### Stripe Pro "Premium models need GHAI"
```tsx
<li>✗ Premium models need GHAI</li>
```

### Page description
```tsx
Access the world's best AI models. Pay only for what you use with GHAI tokens, or subscribe for unlimited access.
```

### Imports
```tsx
import { GHAI_COSTS, STRIPE_PRO, GHAI_DISCOUNT_PERCENT } from '@/config/pricing';
```

---

## app/profile/page.tsx

### Wallet Connection Section (lines 275-329)
```tsx
{/* Wallet connections */}
<motion.div>
  <h2>Connected wallets</h2>
  {/* Wallet error display */}
  {/* Wallet list with Solscan links */}
  <div className="flex gap-2">
    <button onClick={connectPhantom}>Connect Phantom</button>
    <button onClick={connectSolflare}>Connect Solflare</button>
  </div>
</motion.div>
```

### Wallet Imports and Functions
```tsx
import { Copy, Check, ExternalLink } from 'lucide-react'
import bs58 from 'bs58'

interface WalletConnection { ... }
type PhantomProvider = any
type SolflareProvider = any
function getPhantom() { ... }
function getSolflare() { ... }
// connectPhantom() function
// connectSolflare() function
// reloadWallets() function
```

### Wallet State Variables
```tsx
const [wallets, setWallets] = useState<WalletConnection[]>([])
const [connectingWallet, setConnecting] = useState<'phantom' | 'solflare' | null>(null)
const [walletError, setWalletError] = useState('')
```

---

## components/ghost-ai/CreditDisplay.tsx

### Full GHAI Balance Display
```tsx
// GHAI balance
{balance.platformBalance > 0 ? (
  <p><span>{balance.platformBalance.toFixed(2)}</span> GHAI</p>
) : balance.tier !== 'pro' ? (
  <p>No GHAI balance</p>
) : null}

// Wallet balance
{balance.walletBalance !== null && balance.walletBalance > 0 && (
  <p>Wallet: {balance.walletBalance.toFixed(0)} GHAI</p>
)}

// Deposit CTA
{balance.tier !== 'pro' && balance.platformBalance <= 0 && (
  <a href="/void-chat/pricing">Deposit GHAI or buy credits →</a>
)}
```

---

## components/ghost-ai/DepositModal.tsx

### Full Deposit Modal
```tsx
// Complete GHAI deposit flow: user sends GHAI to voidexa wallet, enters tx signature for verification
// Receiver wallet display, amount input, wallet address input, tx signature input, verify button
import { GHAI_TOKEN, VOIDEXA_RECEIVER_WALLET } from '@/config/constants';
```

---

## components/ghost-ai/GhaiTicker.tsx

### Full Live Ticker
```tsx
// Live GHAI price ticker — polls /api/ghai/price every 60s
// Price display, 24h change, Volume, Liquidity
// fetchPrice() with 60s interval
```

---

## components/ghost-ai/ModelSelector.tsx

### GHAI Cost in Dropdown
```tsx
import { GHAI_COSTS } from '@/config/pricing';

const [ghaiPriceUsd, setGhaiPriceUsd] = useState<number | null>(null);

useEffect(() => {
  fetch('/api/ghai/price')
    .then((r) => r.ok ? r.json() : null)
    .then((d) => { if (d?.priceUsd) setGhaiPriceUsd(d.priceUsd); })
    .catch(() => {});
}, []);

function msgPrice(modelId: string): string {
  const ghaiCost = GHAI_COSTS[modelId] ?? 1;
  if (ghaiPriceUsd !== null) {
    const usd = ghaiCost * ghaiPriceUsd;
    return usd < 0.01 ? `$${usd.toFixed(6)}/msg` : `$${usd.toFixed(4)}/msg`;
  }
  return `${ghaiCost} GHAI`;
}

// In option: {m.displayName} — {msgPrice(m.id)}{m.isPremium ? ' ★' : ''}
```

---

## components/sections/home/ClaimPlanetTeaser.tsx

### "10M GHAI" Specific Amount
```tsx
up to <span style={{ color: '#94a3b8', fontWeight: 500 }}>10M GHAI</span> vested over 18 months.
```

---

## components/sections/home/HomeCtas.tsx

No content removed — GHAI card text ("GHAI TOKEN", "The fuel of voidexa") stays visual. Changed text to "Coming Soon".

---

## components/layout/Navigation.tsx

### /token Mobile Secondary Link
```tsx
{ href: '/token', label: 'Token', badge: null },
```

---

## components/control-plane/ControlPlaneDashboard.tsx

### GhaiPanel Contract Address
```tsx
{ label: 'contract', value: 'Ch8Ek9P…x5gK', color: 'rgba(100,200,255,0.7)' },
```

### GHAI Token System Health Entry
```tsx
{ name: 'GHAI Token', status: 'live', color: GREEN, note: 'Solana mainnet · Ch8Ek9P…x5gK' },
```

### GHAI Price Metric Card
```tsx
<MetricCard label="GHAI Price" value="$0.0042" sub="+3.2% 24h" accent={PURPLE} demo />
```

### Active Systems Sub
```tsx
sub="Quantum · Trading · KCP-90 · GHAI"
```

---

## config/constants.ts

### Contract Address and Receiver Wallet
```tsx
export const GHAI_TOKEN = {
  contractAddress: 'Ch8Ek9PTbzSGdL4EWHC2pQfPq2vTseiCPjeZsAZLx5gK',
  ...
};

export const VOIDEXA_RECEIVER_WALLET = process.env.GHAI_RECEIVER_WALLET || '';
```

---

## app/token/page.tsx

### Redirect to #token-info
```tsx
router.replace('/ghost-ai#token-info')
```

---

## app/void-chat/page.tsx

### GHAI Cost in Model Selector
```tsx
import { GHAI_COSTS, USD_COSTS } from '@/config/pricing';

// In option text:
({USD_COSTS[m.id] ?? '$0.01'}/msg or {GHAI_COSTS[m.id]} GHAI{m.isPremium ? ' ★' : ''})
```

---

## app/admin/void-chat/page.tsx

### GHAI Stats Cards
```tsx
const { data: ghaiStats } = await serviceClient
  .from('user_credits')
  .select('total_ghai_deposited, total_ghai_spent');

const totalDeposited = ghaiStats?.reduce((sum, r) => sum + Number(r.total_ghai_deposited), 0) || 0;
const totalSpent = ghaiStats?.reduce((sum, r) => sum + Number(r.total_ghai_spent), 0) || 0;

<StatCard label="GHAI Deposited" value={`${totalDeposited.toFixed(0)} GHAI`} />
<StatCard label="GHAI Spent" value={`${totalSpent.toFixed(0)} GHAI`} />
<StatCard label="GHAI in Platform" value={`${(totalDeposited - totalSpent).toFixed(0)} GHAI`} />
```

---

## app/whitepaper/page.tsx

### GHAI Token Eyebrow Text
```tsx
Ghost AI · GHAI Token
```
