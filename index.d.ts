declare namespace Bundler {
    interface ArchiveOptions {
        debug?: boolean;
    }

    export function createArchive(location: string, options?: ArchiveOptions): Promise<string>;
    export function compileCore(location: string): Promise<string>;
}

export as namespace Bundler;
export = Bundler;
