export type FilesData = {
    filenames: string[],
    items: any[]
}

export type StorageFile = {
    bstr: string;
    filename: string;
    sep?: any;
    lang: string;
}

export type ISettings = {
    langs: any;
    pitch: number;
    voice: string;
    volume: number;
    rate: number;
}
