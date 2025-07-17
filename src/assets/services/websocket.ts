import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

interface AnalysisUpdate {
  event:
    | "UPLOAD_PROGRESS"
    | "ANALYSIS_PROGRESS"
    | "ANALYSIS_COMPLETE"
    | "ANALYSIS_ERROR"
    | "ANALYSIS_UPDATE";
  data: {
    studyId: string;
    progress?: number;
    status?: "uploading" | "processing" | "completed" | "failed";
    message?: string;
    findings?: Array<{
      birads: string;
      confidence: number;
      regions: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
        confidence: number;
      }>;
    }>;
    error?: string;
  };
}

interface WebSocketService {
  connect: () => void;
  disconnect: () => void;
  onMessage: (callback: (update: AnalysisUpdate) => void) => () => void;
  joinRoom?: (room: string) => void;
  isConnected: () => boolean;
}

type WebSocketType = "native" | "socket.io";

const createWebSocketService = (
  url: string,
  type: WebSocketType = "socket.io"
): WebSocketService => {
  // Replace useRef with regular object properties
  let wsRef: WebSocket | null = null;
  let socketRef: Socket | null = null;
  let reconnectAttempts: number = 0;
  const maxReconnectAttempts = 5;
  const reconnectInterval = 5000;
  let messageCallbacks: Array<(update: AnalysisUpdate) => void> = [];

  const isConnected = () => {
    if (type === "socket.io") {
      return socketRef?.connected || false;
    }
    return wsRef?.readyState === WebSocket.OPEN;
  };

  const connectNativeWebSocket = () => {
    if (wsRef && wsRef.readyState === WebSocket.OPEN) return;

    wsRef = new WebSocket(url);

    wsRef.onopen = () => {
      console.log("Native WebSocket connected");
      reconnectAttempts = 0;
    };

    wsRef.onmessage = (event) => {
      try {
        const update: AnalysisUpdate = JSON.parse(event.data);
        messageCallbacks.forEach((callback) => callback(update));
      } catch (error) {
        console.error("WebSocket message parse error:", error);
      }
    };

    wsRef.onclose = () => {
      console.log("Native WebSocket closed");
      if (reconnectAttempts < maxReconnectAttempts) {
        setTimeout(() => {
          console.log(
            `Reconnecting WebSocket (attempt ${reconnectAttempts + 1})`
          );
          reconnectAttempts += 1;
          connectNativeWebSocket();
        }, reconnectInterval);
      }
    };

    wsRef.onerror = (error) => {
      console.error("Native WebSocket error:", error);
    };
  };

  const connectSocketIO = () => {
    if (socketRef?.connected) return;

    socketRef = io(url, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.on("connect", () => {
      console.log("Socket.IO connected");
      reconnectAttempts = 0;
    });

    // Handle all the different event types
    const eventTypes = [
      "UPLOAD_PROGRESS",
      "ANALYSIS_PROGRESS",
      "ANALYSIS_COMPLETE",
      "ANALYSIS_ERROR",
      "ANALYSIS_UPDATE",
    ];

    eventTypes.forEach((eventType) => {
      socketRef?.on(eventType, (data: any) => {
        const update: AnalysisUpdate = {
          event: eventType as AnalysisUpdate["event"],
          data,
        };
        messageCallbacks.forEach((callback) => callback(update));
      });
    });

    socketRef.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    socketRef.on("connect_error", (error: any) => {
      console.error("Socket.IO connection error:", error);
      if (reconnectAttempts < maxReconnectAttempts) {
        setTimeout(() => {
          console.log(
            `Reconnecting Socket.IO (attempt ${reconnectAttempts + 1})`
          );
          reconnectAttempts += 1;
          connectSocketIO();
        }, reconnectInterval);
      }
    });

    socketRef.on("error", (error: any) => {
      console.error("Socket.IO error:", error);
    });
  };

  const connect = () => {
    if (type === "socket.io") {
      connectSocketIO();
    } else {
      connectNativeWebSocket();
    }
  };

  const disconnect = () => {
    if (type === "socket.io") {
      if (socketRef) {
        socketRef.disconnect();
        socketRef = null;
      }
    } else {
      if (wsRef) {
        wsRef.close();
        wsRef = null;
      }
    }
  };

  const onMessage = (callback: (update: AnalysisUpdate) => void) => {
    messageCallbacks.push(callback);
    return () => {
      messageCallbacks = messageCallbacks.filter((cb) => cb !== callback);
    };
  };

  const joinRoom = (room: string) => {
    if (type === "socket.io" && socketRef) {
      socketRef.emit("joinRoom", room);
    } else {
      console.warn("joinRoom is only available for Socket.IO connections");
    }
  };

  return {
    connect,
    disconnect,
    onMessage,
    joinRoom: type === "socket.io" ? joinRoom : undefined,
    isConnected,
  };
};

// Configuration for different environments
const getWebSocketConfig = () => {
  const isDevelopment = import.meta.env.NODE_ENV === "development";
  const socketIOUrl =
    import.meta.env.REACT_APP_SOCKET_IO_URL || "http://localhost:5000";
  const nativeWSUrl =
    import.meta.env.REACT_APP_WS_URL || "ws://localhost:3000/dicom/updates";

  // You can switch between 'socket.io' and 'native' based on your backend
  const preferredType: WebSocketType = "socket.io";

  return {
    url: preferredType === "socket.io" ? socketIOUrl : nativeWSUrl,
    type: preferredType,
  };
};

// Singleton WebSocket service instance
const config = getWebSocketConfig();
export const webSocketService = createWebSocketService(config.url, config.type);

// React hook for WebSocket integration
export const useWebSocket = (onUpdate: (update: AnalysisUpdate) => void) => {
  const onUpdateRef = useRef(onUpdate);

  // Keep the callback ref updated
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  // Stable callback that won't cause reconnections
  const stableOnUpdate = useCallback((update: AnalysisUpdate) => {
    onUpdateRef.current(update);
  }, []);

  useEffect(() => {
    const unsubscribe = webSocketService.onMessage(stableOnUpdate);
    webSocketService.connect();

    return () => {
      unsubscribe();
      // Don't disconnect on unmount to allow other components to use the same connection
      // webSocketService.disconnect();
    };
  }, [stableOnUpdate]);

  return {
    connect: webSocketService.connect,
    disconnect: webSocketService.disconnect,
    joinRoom: webSocketService.joinRoom,
    isConnected: webSocketService.isConnected,
  };
};

// Enhanced hook with room management for Socket.IO
export const useWebSocketWithRoom = (
  onUpdate: (update: AnalysisUpdate) => void,
  room?: string
) => {
  const websocket = useWebSocket(onUpdate);

  useEffect(() => {
    if (room && websocket.joinRoom) {
      // Join room after connection is established
      const timer = setTimeout(() => {
        if (websocket.isConnected()) {
          websocket.joinRoom!(room);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [room, websocket]);

  return websocket;
};

// Utility hook for specific analysis updates
export const useAnalysisUpdates = (studyId?: string) => {
  const [updates, setUpdates] = useState<AnalysisUpdate[]>([]);
  const [latestUpdate, setLatestUpdate] = useState<AnalysisUpdate | null>(null);

  const handleUpdate = useCallback(
    (update: AnalysisUpdate) => {
      // Filter updates by studyId if provided
      if (studyId && update.data.studyId !== studyId) {
        return;
      }

      setLatestUpdate(update);
      setUpdates((prev) => [...prev, update]);
    },
    [studyId]
  );

  const websocket = useWebSocketWithRoom(handleUpdate, studyId);

  const clearUpdates = useCallback(() => {
    setUpdates([]);
    setLatestUpdate(null);
  }, []);

  return {
    updates,
    latestUpdate,
    clearUpdates,
    ...websocket,
  };
};

// Re-export types for convenience
export type { AnalysisUpdate, WebSocketService };
