import { motion } from "framer-motion";
import {
	Battery,
	ChevronLeft,
	Share,
	Signal,
	Sparkles,
	Wifi,
} from "lucide-react";

const tabs = ["All", "America", "Race", "History", "Politics", "Ed..."];

const posts = [
	{
		date: "Mar 21, 2025 at 12:45 PM",
		status: "Claim is true",
		statusColor: "text-success",
		content:
			"iOS and Android are two major mobile operating system are using all around the world.",
		author: "Harry",
		sources: ["K", "N", "W"],
		likes: 12,
		comments: 9,
		shares: 49,
	},
	{
		date: "Mar 19, 2025 at 5:12 PM",
		status: "Claim is mostly correct",
		statusColor: "text-primary",
		content: "Fox News acts as a propaganda arm of the Republican party.",
		author: "Elyse",
		sources: ["W", "N"],
		likes: 17,
		comments: 5,
		shares: 49,
	},
];

export const PhoneMockup = () => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9, y: 40 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
			className="relative"
		>
			{/* Phone Frame */}
			<div className="relative w-[280px] md:w-[320px] mx-auto">
				{/* Phone body */}
				<div className="bg-foreground rounded-[3rem] p-2 shadow-phone">
					{/* Screen */}
					<div className="bg-card rounded-[2.5rem] overflow-hidden">
						{/* Status Bar */}
						<div className="flex items-center justify-between px-6 pt-3 pb-2">
							<span className="text-xs font-semibold text-foreground">
								9:41
							</span>
							<div className="w-24 h-6 bg-foreground rounded-full" />
							<div className="flex items-center gap-1">
								<Signal className="w-4 h-4 text-foreground" />
								<Wifi className="w-4 h-4 text-foreground" />
								<Battery className="w-5 h-5 text-foreground" />
							</div>
						</div>

						{/* App Header */}
						<div className="flex items-center justify-between px-4 py-2">
							<ChevronLeft className="w-6 h-6 text-muted-foreground" />
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
									<Sparkles className="w-4 h-4 text-primary" />
								</div>
								<div>
									<h3 className="text-sm font-semibold text-foreground">
										Betalift
									</h3>
									<p className="text-[10px] text-muted-foreground">
										Clear Facts, Civil Voices
									</p>
								</div>
							</div>
							<Share className="w-5 h-5 text-muted-foreground" />
						</div>

						{/* Tabs */}
						<div className="flex gap-2 px-4 py-2 overflow-x-auto">
							{tabs.map((tab, i) => (
								<button
									key={tab}
									className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
										i === 0
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-secondary-foreground"
									}`}
								>
									{tab}
								</button>
							))}
						</div>

						{/* Posts */}
						<div className="px-4 py-2 space-y-3 min-h-[280px]">
							{posts.map((post, i) => (
								<div key={i} className="bg-secondary/50 rounded-xl p-3">
									<div className="flex items-center justify-between mb-2">
										<span className="text-[9px] text-muted-foreground">
											{post.date}
										</span>
										<span
											className={`text-[9px] font-medium ${post.statusColor}`}
										>
											{post.status}
										</span>
									</div>
									<p className="text-xs text-foreground mb-2 line-clamp-2">
										{post.content}
									</p>
									<div className="flex items-center gap-1 mb-2">
										{post.sources.map((s, j) => (
											<div
												key={j}
												className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary"
											>
												{s}
											</div>
										))}
										<span className="text-[9px] text-muted-foreground ml-1">
											Sources
										</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-1">
											<div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent" />
											<span className="text-[10px] font-medium text-foreground">
												{post.author}
											</span>
										</div>
										<div className="flex items-center gap-3 text-[9px] text-muted-foreground">
											<span>♡ {post.likes}</span>
											<span>💬 {post.comments}</span>
											<span>↗ {post.shares}</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};
