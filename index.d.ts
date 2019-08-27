declare namespace Bundler {
    interface ArchiveOptions {
        debug?: boolean;
        dest?: string;
    }

    interface CoreOptions {
        debug?: boolean;
        cwd?: string;
    }

    export function generateAddonArchive(location: string, options?: ArchiveOptions): Promise<string>;
    export function generateCoreExecutable(location: string, options?: CoreOptions): Promise<string>;
}

export as namespace Bundler;
export = Bundler;
