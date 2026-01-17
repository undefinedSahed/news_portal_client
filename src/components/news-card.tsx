import Link from "next/link";
import { Card } from "./ui/card";
import { News } from "@/lib/queries";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "./ui/badge";

interface NewsCardProps {
  news: News;
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/${news.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full py-0 gap-0">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {news.category}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {format(new Date(news.createdAt), "MMM dd, yyyy")}
            </span>
          </div>
          <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 hover:text-primary transition">
            {news.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {news.description}
          </p>
        </div>
      </Card>
    </Link>
  );
}
