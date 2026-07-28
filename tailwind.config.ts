import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        w: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          'surface-2': 'var(--color-surface-2)',
          border: 'var(--color-border)',
          'border-2': 'var(--color-border-2)',
          orange: 'var(--color-orange)',
          yellow: 'var(--color-yellow)',
          text: 'var(--color-text)',
          'text-2': 'var(--color-text-2)',
          'text-3': 'var(--color-text-3)',
          // Game Classes (legacy compat)
          joker: 'var(--color-joker)',
          wall: 'var(--color-wall)',
          striker: 'var(--color-striker)',
          mastermind: 'var(--color-mastermind)',
          // New Faction Classes
          warrior: 'var(--color-warrior)',
          support: 'var(--color-support)',
          trickster: 'var(--color-trickster)',
          mystic: 'var(--color-mystic)',
          royal: 'var(--color-royal)',
          rogue: 'var(--color-rogue)',
          // State indicators
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          danger: 'var(--color-danger)',
        },
      },
      boxShadow: {
        'glow-orange': '0 0 20px var(--color-orange-glow)',
        'glow-yellow': '0 0 20px var(--color-yellow-glow)',
        'glow-joker': '0 0 20px var(--color-joker-glow)',
        'glow-wall': '0 0 20px var(--color-wall-glow)',
        'glow-striker': '0 0 20px var(--color-striker-glow)',
        'glow-mastermind': '0 0 20px var(--color-mastermind-glow)',
        // Tactile shadows
        'tactile-sm': '0 2px 4px rgba(45, 34, 28, 0.05), 0 1px 2px rgba(45, 34, 28, 0.05)',
        'tactile-md': '0 6px 12px rgba(45, 34, 28, 0.06), 0 2px 4px rgba(45, 34, 28, 0.04)',
        'tactile-lg': '0 12px 24px rgba(45, 34, 28, 0.08), 0 4px 8px rgba(45, 34, 28, 0.04)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        card: ['var(--font-card)'],
      },
    },
  },
  plugins: [],
} satisfies Config
