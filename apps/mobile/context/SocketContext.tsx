import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { type Socket, io } from "socket.io-client";
import { API_CONFIG } from "../constants/config";
import { useAuthStore } from "../stores/useAuthStore";

interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
	sendMessage: (
		conversationId: string,
		content: string,
		type?: "text" | "image" | "video" | "file",
		attachments?: any[],
	) => void;
	joinConversation: (conversationId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
};

interface SocketProviderProps {
	children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const { user, isAuthenticated } = useAuthStore();

	useEffect(() => {
		let newSocket: Socket | null = null;

		if (isAuthenticated && user?.accessToken) {
			console.log("Initializing socket connection...");
			newSocket = io(API_CONFIG.CHAT_URL, {
				auth: {
					token: user.accessToken,
				},
				transports: ["websocket"],
				autoConnect: true,
			});

			newSocket.on("connect", () => {
				console.log("Socket connected:", newSocket?.id);
				setIsConnected(true);
			});

			newSocket.on("disconnect", () => {
				console.log("Socket disconnected");
				setIsConnected(false);
			});

			newSocket.on("connect_error", (err) => {
				console.error("Socket connection error:", err);
				setIsConnected(false);
			});

			setSocket(newSocket);
		} else {
			if (socket) {
				console.log("Cleaning up socket connection due to logout/no token");
				socket.disconnect();
				setSocket(null);
				setIsConnected(false);
			}
		}

		return () => {
			if (newSocket) {
				console.log("Cleaning up socket connection on unmount/change");
				newSocket.disconnect();
			}
		};
	}, [isAuthenticated, user?.accessToken]); // Re-connect if auth state or token changes

	const sendMessage = (
		conversationId: string,
		content: string,
		type: "text" | "image" | "video" | "file" = "text",
		attachments: any[] = [],
	) => {
		if (socket && isConnected) {
			socket.emit(
				"send_message",
				{
					conversationId,
					content,
					type,
					attachments,
				},
				(response: any) => {
					if (!response.success) {
						console.error("Failed to send message:", response);
					}
				},
			);
		} else {
			console.warn("Cannot send message: Socket not connected");
		}
	};

	const joinConversation = (conversationId: string) => {
		// In some implementations, rooms are joined automatically or uniquely.
		// The server handler provided earlier joins all user rooms on connect.
		// But if a new conversation is created, we might need to join it specifically?
		// For now, checks showing the backend auto-joins on connect.
		// If needed we can emit to join a specific room.
		console.log("Joining conversation logic placeholder", conversationId);
	};

	return (
		<SocketContext.Provider
			value={{ socket, isConnected, sendMessage, joinConversation }}
		>
			{children}
		</SocketContext.Provider>
	);
};
