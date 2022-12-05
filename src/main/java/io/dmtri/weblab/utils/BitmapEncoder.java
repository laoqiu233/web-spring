package io.dmtri.weblab.utils;

import java.util.Base64;

/**
 * Encode the bitmap as a base64 string.
 */
public final class BitmapEncoder {
    private BitmapEncoder() {}

    public static String encode(boolean[][] bitmap, int bitmapResolution) {
        // Encodes the bitmap in base64 for frontend use.

        byte[] bitmapBytes = new byte[(int) Math.ceil(bitmapResolution * bitmapResolution / 8.0)];

        System.out.println("Encoded bitmap as byte array. Size: " + bitmapBytes.length);

        for (int i = 0; i < bitmapResolution * bitmapResolution; i++) {
            final int byteCount = i / 8;
            bitmapBytes[byteCount] <<= 1;
            if (bitmap[i / bitmapResolution][i % bitmapResolution]) bitmapBytes[byteCount]++;
        }

        String encoded = Base64.getEncoder().encodeToString(bitmapBytes);

        System.out.println("Encoded bitmap byte array in base 64. Size: " + encoded.length());

        return encoded;
    }
}