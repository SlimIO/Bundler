declare namespace Bundler {
    interface ArchiveOptions {
        debug?: boolean;
    }

    interface CoreOptions {
        debug?: boolean;
        cwd?: string;
    }

    export function createArchive(location: string, options?: ArchiveOptions): Promise<string>;
    export function compileCore(location: string, options?: CoreOptions): Promise<string>;
}

export as namespace Bundler;
export = Bundler;
