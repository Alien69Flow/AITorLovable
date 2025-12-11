import { Button } from "@/components/ui/button";
import { ModelSelector } from "./ModelSelector";
import { Trash2, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ChatHeaderProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  onClear: () => void;
  hasMessages: boolean;
}

export function ChatHeader({ selectedModel, onModelChange, onClear, hasMessages }: ChatHeaderProps) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-sm px-4 py-3">
      <div className="flex items-center gap-3">
        {/* AlienFlow Logo */}
        <div className="relative flex items-center justify-center w-10 h-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Alien head outline */}
            <ellipse cx="50" cy="45" rx="28" ry="35" fill="none" stroke="hsl(var(--secondary))" strokeWidth="2"/>
            {/* Eyes */}
            <ellipse cx="38" cy="40" rx="8" ry="12" fill="hsl(var(--secondary))" opacity="0.8"/>
            <ellipse cx="62" cy="40" rx="8" ry="12" fill="hsl(var(--secondary))" opacity="0.8"/>
            {/* Eye glow */}
            <ellipse cx="38" cy="38" rx="4" ry="6" fill="hsl(var(--primary))" className="animate-pulse"/>
            <ellipse cx="62" cy="38" rx="4" ry="6" fill="hsl(var(--primary))" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
            {/* Delta symbol on forehead */}
            <polygon points="50,20 42,35 58,35" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"/>
            {/* Antenna */}
            <line x1="50" y1="10" x2="50" y2="18" stroke="hsl(var(--primary))" strokeWidth="2"/>
            <circle cx="50" cy="8" r="3" fill="hsl(var(--primary))" className="animate-pulse"/>
          </svg>
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-lg font-heading font-bold tracking-tight">
            <span className="text-secondary">Δlieπ</span>
            <span className="text-primary">FlΦw</span>
            <span className="text-secondary"> $pac€</span>
            <span className="text-primary"> DAO</span>
          </h1>
          <span className="text-[10px] tracking-widest text-muted-foreground font-body">
            AI Tor • ΓΩΣΖ Synapse
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <ModelSelector value={selectedModel} onChange={onModelChange} />
        
        {hasMessages && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClear}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}

        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleSignOut}
          className="text-muted-foreground hover:text-primary"
          title="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
