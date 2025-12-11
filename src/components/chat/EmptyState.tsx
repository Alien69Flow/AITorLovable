export function EmptyState() {
  const topics = [
    { symbol: "Δ", label: "Blockchain / Web3" },
    { symbol: "π", label: "Neural Networks / Web4" },
    { symbol: "Φ", label: "Quantum / Web5" },
    { symbol: "Ω", label: "Alquimia" },
    { symbol: "Σ", label: "Código" },
    { symbol: "Ζ", label: "Filosofía" },
  ];

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 text-6xl font-heading font-light tracking-wider">
        <span className="text-secondary">Δlieπ</span>
        <span className="text-primary">FlΦw</span>
      </div>
      <h2 className="mb-2 text-xl font-medium text-secondary">DAO Synapse Collective</h2>
      <p className="mb-8 max-w-md text-sm text-muted-foreground">
        IA especializada en tecnologías emergentes, filosofía y ciencia. 
        Selecciona un modelo y comienza a explorar.
      </p>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {topics.map((topic) => (
          <div 
            key={topic.symbol}
            className="flex items-center gap-2 rounded-md border border-secondary/30 bg-card/50 backdrop-blur-sm px-3 py-2 text-sm hover:border-secondary/50 transition-colors"
          >
            <span className="text-lg font-light text-secondary">{topic.symbol}</span>
            <span className="text-muted-foreground">{topic.label}</span>
          </div>
        ))}
      </div>
      
      <p className="mt-8 text-xs text-secondary/60">
        Versión Gamma Omega Sigma Zeta
      </p>
    </div>
  );
}
