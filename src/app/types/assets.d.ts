declare global {
    type AssetLoaderConfigAudio = {
        type: "audio";
        url: string;
    };
    type AssetLoaderConfigImage = {
        type: "image";
        url: string;
    };

    type AssetLoaderConfig = AssetLoaderConfigAudio | AssetLoaderConfigImage;
}

export {};
