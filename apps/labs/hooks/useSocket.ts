"use client";

import { useEffect, useState } from "react";

export default function useSocket(labSlug: string) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        // const newSocket = new WebSocket(`ws://${labSlug}.labs.letscodeofficial.tech`);
        const newSocket = new WebSocket(`ws://localhost:3001`);
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [labSlug]);

    return socket;
}
