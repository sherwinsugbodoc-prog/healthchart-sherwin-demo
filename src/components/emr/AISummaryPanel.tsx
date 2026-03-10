import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, ChevronDown, ChevronUp, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AISummaryPanelProps {
  summary: string;
  lastUpdated?: string;
}

export function AISummaryPanel({ summary, lastUpdated }: AISummaryPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse markdown-like content
  const formatSummary = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h4 key={i} className="font-semibold text-sm mt-3 mb-1">{line.replace(/\*\*/g, '')}</h4>;
      }
      if (line.startsWith('• ')) {
        return <li key={i} className="text-sm ml-4 text-muted-foreground">{line.substring(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="text-sm text-muted-foreground">{line}</p>;
    });
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-sm">AI Patient Summary</span>
          <Badge variant="outline" className="text-2xs border-primary/30 text-primary">
            Beta
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-2xs text-muted-foreground">
              Updated {lastUpdated}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="bg-card rounded-md p-3 border max-h-64 overflow-y-auto">
            {formatSummary(summary)}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xs text-muted-foreground">
              AI-generated summary. Always verify with source records.
            </span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                <RefreshCw className="h-3 w-3" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                <RefreshCw className="h-3 w-3" />
                Sample
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs gap-1"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
