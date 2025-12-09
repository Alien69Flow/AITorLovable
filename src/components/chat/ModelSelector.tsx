import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AI_MODELS, type AIModel } from "@/lib/ai-models";

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const availableModels = AI_MODELS.filter(m => m.available);
  const unavailableModels = AI_MODELS.filter(m => !m.available);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px] border-border bg-background">
        <SelectValue placeholder="Seleccionar modelo" />
      </SelectTrigger>
      <SelectContent>
        {availableModels.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex items-center gap-2">
              <span className="font-medium">{model.name}</span>
              <span className="text-xs text-muted-foreground">({model.provider})</span>
            </div>
          </SelectItem>
        ))}
        {unavailableModels.length > 0 && (
          <>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              Próximamente (requiere API key)
            </div>
            {unavailableModels.map((model) => (
              <SelectItem key={model.id} value={model.id} disabled>
                <div className="flex items-center gap-2 opacity-50">
                  <span>{model.name}</span>
                  <span className="text-xs">({model.provider})</span>
                </div>
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
}
