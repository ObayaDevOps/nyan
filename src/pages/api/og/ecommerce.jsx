// pages/api/og/e-commerce.jsx

import React from "react";
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    // dynamic params
    const title = searchParams.has("title")
      ? searchParams.get("title")?.slice(0, 100)
      : "My default title";
    const website = searchParams.get("website") || "mywebsite.com";
    const price = searchParams.get("price") || "";
    const image = searchParams.get("image") || "";

    return new ImageResponse(
      (
        <div tw="h-full w-full flex items-start justify-start">
          <div tw="flex items-start justify-start h-full">
            <div tw="flex w-2/5 flex-col justify-between h-full pl-12 py-12 bg-gray-50">
              <div tw="flex flex-col">
                <p tw="text-2xl font-bold mb-0 text-green-600">{website}</p>
                <h1 tw="text-5xl font-black text-left">{title}</h1>
              </div>
              <p tw="text-3xl font-bold bg-green-800 text-green-100 py-4 px-12 rounded-lg">
                {price}
              </p>
            </div>
            {image ? (
              <div tw="flex w-3/5 h-full">
                <img
                  tw="w-full h-full"
                  style={{ objectFit: "cover" }}
                  src={image}
                />
              </div>
            ) : null}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 627,
      }
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}