import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

export const schemas = {
  // Add specific schemas based on our app's needs
  playlistRequest: z.object({
    tracks: z.array(
      z.object({
        title: z.string(),
        artist: z.string(),
      }),
    ),
    title: z.string().optional(),
    description: z.string().optional(),
    privacyStatus: z.enum(["public", "private", "unlisted"]).optional(),
  }),
};

export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
): Promise<
  { success: true; data: T } | { success: false; error: NextResponse }
> {
  try {
    let body: unknown;

    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else {
      body = {};
    }

    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: NextResponse.json(
          {
            error: "Validation failed",
            details: error.errors.map((e) => ({
              field: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 },
        ),
      };
    }

    return {
      success: false,
      error: NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      ),
    };
  }
}
