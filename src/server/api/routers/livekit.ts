import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { AccessToken } from "livekit-server-sdk";

export const livekitRouter = createTRPCRouter({
  getToken: publicProcedure
    .input(
      z.object({
        room: z.string().min(1),
        username: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const { room, username } = input;

      const apiKey = process.env.LIVEKIT_API_KEY;
      const apiSecret = process.env.LIVEKIT_API_SECRET;
      const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

      if (!apiKey || !apiSecret || !wsUrl) {
        throw new Error("Server misconfigured");
      }

      // The room parameter is now a base64 encoded JSON string containing LiveKitRoomConfig
      // We use it directly as the room name for LiveKit
      const at = new AccessToken(apiKey, apiSecret, { identity: username });
      at.addGrant({
        room,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
      });

      return { token: await at.toJwt(), url: wsUrl };
    }),
});
