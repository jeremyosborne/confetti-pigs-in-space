declare global {
    /**
     * Provide enough information to load an audio file.
     */
    type AssetLoaderConfigAudio = {
        type: "audio";
        url: string;
    };
    /**
     * Provide enough information to load an image file.
     */
    type AssetLoaderConfigImage = {
        type: "image";
        url: string;
    };

    type AssetLoaderConfig = AssetLoaderConfigAudio | AssetLoaderConfigImage;
}

export {};
