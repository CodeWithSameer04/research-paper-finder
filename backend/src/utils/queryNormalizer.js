/**
 * Dictionary of common academic, scientific, economic, mathematical, and computer science term aliases
 * and spelling variations.
 */
const TERM_ALIASES = [
  // Economics & Finance
  {
    patterns: [/rams[ae]y[- ]+cass[- ]+koopmans?/i, /rams[ae]y[- ]+koopmans?/i],
    canonical: 'Ramsey-Cass-Koopmans'
  },
  {
    patterns: [/black[- ]+scholes?[- ]+merton/i, /black[- ]+schole\b/i],
    canonical: 'Black-Scholes-Merton'
  },
  {
    patterns: [/hecksh?er[- ]+ohlin/i],
    canonical: 'Heckscher-Ohlin'
  },
  {
    patterns: [/karush[- ]+kuhn[- ]+tucker/i, /\bkkt[- ]+conditions?\b/i, /kuhn[- ]+tucker/i],
    canonical: 'Karush-Kuhn-Tucker'
  },
  {
    patterns: [/nash[- ]+equilibri(a|um)/i],
    canonical: 'Nash Equilibrium'
  },
  {
    patterns: [/solow[- ]+swan/i],
    canonical: 'Solow-Swan'
  },
  {
    patterns: [/mankiw[- ]+romer[- ]+weil/i],
    canonical: 'Mankiw-Romer-Weil'
  },
  {
    patterns: [/mundell[- ]+fleming/i],
    canonical: 'Mundell-Fleming'
  },
  {
    patterns: [/lucas[- ]+critique/i],
    canonical: 'Lucas Critique'
  },

  // Computer Science & AI
  {
    patterns: [/attention[- ]+is[- ]+all[- ]+you[- ]+need/i],
    canonical: 'Attention Is All You Need'
  },
  {
    patterns: [/\bresnet\b/i, /deep[- ]+residual[- ]+learning/i],
    canonical: 'Deep Residual Learning'
  },
  {
    patterns: [/dijkstras?\b/i, /dykstra\b/i],
    canonical: 'Dijkstra'
  },
  {
    patterns: [/generative[- ]+adversarial[- ]+networks?\b/i, /\bgans?\b/i],
    canonical: 'Generative Adversarial Networks'
  },
  {
    patterns: [/markov[- ]+decision[- ]+process(es)?\b/i, /\bmdps?\b/i],
    canonical: 'Markov Decision Process'
  },
  {
    patterns: [/convolutional[- ]+neural[- ]+networks?\b/i, /\bcnns?\b/i],
    canonical: 'Convolutional Neural Networks'
  },
  {
    patterns: [/recurrent[- ]+neural[- ]+networks?\b/i, /\brnns?\b/i],
    canonical: 'Recurrent Neural Networks'
  },
  {
    patterns: [/long[- ]+short[- ]+term[- ]+memory\b/i, /\blstms?\b/i],
    canonical: 'Long Short-Term Memory'
  },
  {
    patterns: [/principal[- ]+component[- ]+analysis\b/i, /\bpca\b/i],
    canonical: 'Principal Component Analysis'
  },
  {
    patterns: [/support[- ]+vector[- ]+machines?\b/i, /\bsvms?\b/i],
    canonical: 'Support Vector Machine'
  },

  // Biology, Chemistry & Medicine
  {
    patterns: [/michaelis[- ]+menten\b/i, /michalis[- ]+menten\b/i],
    canonical: 'Michaelis-Menten'
  },
  {
    patterns: [/hodgkins?[- ]+huxley\b/i],
    canonical: 'Hodgkin-Huxley'
  },
  {
    patterns: [/hardy[- ]+weinberg\b/i],
    canonical: 'Hardy-Weinberg'
  },
  {
    patterns: [/lotka[- ]+volterra\b/i],
    canonical: 'Lotka-Volterra'
  },
  {
    patterns: [/crispr[- ]*cas9?\b/i],
    canonical: 'CRISPR-Cas9'
  },

  // Physics & Mathematics
  {
    patterns: [/navier[- ]+stokes?\b/i],
    canonical: 'Navier-Stokes'
  },
  {
    patterns: [/schr[oö]e?dinger\b/i],
    canonical: 'Schrödinger'
  },
  {
    patterns: [/poincar[eé]\b/i],
    canonical: 'Poincaré'
  },
  {
    patterns: [/g[oö]e?del\b/i],
    canonical: 'Gödel'
  },
  {
    patterns: [/levenberg[- ]+marquardt\b/i],
    canonical: 'Levenberg-Marquardt'
  },
  {
    patterns: [/feynman[- ]+kac\b/i],
    canonical: 'Feynman-Kac'
  },
  {
    patterns: [/bellman[- ]+ford\b/i],
    canonical: 'Bellman-Ford'
  }
];

/**
 * Normalizes query string, resolving spelling variations, aliases, and known terminology.
 *
 * @param {string} rawQuery
 * @returns {{ normalizedQuery: string, wasCorrected: boolean, originalQuery: string, suggestedTerm: string|null }}
 */
export function normalizeQuery(rawQuery) {
  if (!rawQuery || typeof rawQuery !== 'string') {
    return {
      normalizedQuery: '',
      wasCorrected: false,
      originalQuery: rawQuery || '',
      suggestedTerm: null
    };
  }

  const trimmed = rawQuery.trim();
  let normalized = trimmed;
  let wasCorrected = false;
  let suggestedTerm = null;

  for (const alias of TERM_ALIASES) {
    for (const pattern of alias.patterns) {
      if (pattern.test(normalized)) {
        normalized = normalized.replace(pattern, alias.canonical);
        wasCorrected = true;
        suggestedTerm = alias.canonical;
        break;
      }
    }
    if (wasCorrected) break;
  }

  // Clean up any double spaces or excess punctuation
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return {
    normalizedQuery: normalized,
    wasCorrected: wasCorrected && normalized.toLowerCase() !== trimmed.toLowerCase(),
    originalQuery: trimmed,
    suggestedTerm: wasCorrected ? suggestedTerm : null
  };
}
