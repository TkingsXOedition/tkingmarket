
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsItem, formatDate } from '@/utils/stocksApi';
import { cn } from '@/lib/utils';
import { NewspaperIcon } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem[];
  className?: string;
}

export function NewsCard({ news, className }: NewsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3 flex flex-row items-center">
        <div className="flex items-center">
          <NewspaperIcon className="h-5 w-5 mr-2" />
          <h3 className="font-semibold text-lg">Market News</h3>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {news.map((item) => (
            <div key={item.id} className="p-4 transition-colors hover:bg-muted/30">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-base">{item.title}</h4>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formatDate(item.publishedAt)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
              
              {item.imageUrl && (
                <div className="relative h-32 mb-3 overflow-hidden rounded-md">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover" 
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {item.relatedSymbols?.map((symbol) => (
                    <Badge key={symbol} variant="outline" className="text-xs">
                      {symbol}
                    </Badge>
                  ))}
                </div>
                <span className="text-xs font-medium text-primary">{item.source}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
