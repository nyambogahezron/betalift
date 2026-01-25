import { motion } from "framer-motion";
import { MessageCircle, ThumbsUp, Share2 } from "lucide-react";

interface FloatingCardProps {
  claim: string;
  status: "true" | "false" | "misleading";
  author: string;
  timeAgo: string;
  description?: string;
  className?: string;
  animationDelay?: number;
  sources?: string[];
}

const statusConfig = {
  true: {
    label: "True",
    bgColor: "bg-success/10",
    textColor: "text-success",
    dotColor: "bg-success",
  },
  false: {
    label: "Claim is False",
    bgColor: "bg-destructive/10",
    textColor: "text-destructive",
    dotColor: "bg-destructive",
  },
  misleading: {
    label: "Misleading",
    bgColor: "bg-warning/10",
    textColor: "text-warning",
    dotColor: "bg-warning",
  },
};

export const FloatingCard = ({
  claim,
  status,
  author,
  timeAgo,
  description,
  className = "",
  animationDelay = 0,
  sources = [],
}: FloatingCardProps) => {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: animationDelay, ease: "easeOut" }}
      className={`glass-card rounded-2xl p-4 max-w-[280px] ${className}`}
    >
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 1, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: animationDelay,
        }}
      >
        {/* Status Badge */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgColor} mb-3`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
          <span className={`text-xs font-medium ${config.textColor}`}>{config.label}</span>
        </div>

        {/* Claim */}
        <p className="text-sm font-medium text-foreground mb-2 line-clamp-2">{claim}</p>

        {/* Description if present */}
        {description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{description}</p>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {sources.map((source, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary"
              >
                {source.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        )}

        {/* Author & Meta */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary-foreground">
              {author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground">{author}</p>
            <p className="text-[10px] text-muted-foreground">{timeAgo}</p>
          </div>
        </div>

        {/* Interactions */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50">
          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="text-[10px]">2</span>
          </button>
          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
