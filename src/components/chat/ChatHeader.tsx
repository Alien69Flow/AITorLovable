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
        {/* UFO Logo */}
        <div className="relative flex items-center justify-center w-10 h-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* UFO body */}
            <ellipse cx="50" cy="55" rx="35" ry="12" fill="hsl(var(--secondary))" opacity="0.9"/>
            <ellipse cx="50" cy="52" rx="25" ry="8" fill="hsl(var(--secondary))" />
            {/* UFO dome */}
            <ellipse cx="50" cy="45" rx="15" ry="12" fill="hsl(var(--primary))" opacity="0.8"/>
            <ellipse cx="50" cy="42" rx="10" ry="8" fill="hsl(var(--primary))" />
            {/* Light beam */}
            <polygon points="42,60 58,60 65,85 35,85" fill="hsl(var(--primary))" opacity="0.4"/>
            {/* Lights on UFO */}
            <circle cx="30" cy="55" r="3" fill="hsl(var(--primary))" className="animate-pulse"/>
            <circle cx="50" cy="58" r="3" fill="hsl(var(--primary))" className="animate-pulse" style={{animationDelay: '0.3s'}}/>
            <circle cx="70" cy="55" r="3" fill="hsl(var(--primary))" className="animate-pulse" style={{animationDelay: '0.6s'}}/>
          </svg>
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-lg font-heading font-bold tracking-tight">
            <span className="text-primary">Δlieπ</span>
            <span className="text-secondary">FlΦw</span>
            <span className="text-primary"> $pac€</span>
            <span className="text-muted-foreground"> DAO</span>
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
