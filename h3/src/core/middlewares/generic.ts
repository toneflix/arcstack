import { H3Event, serveStatic } from "h3";
import { readFile, stat } from "node:fs/promises";

import { before } from "../utils/helpers";
import { join } from "node:path";

/**
 *
 * @param event
 * @returns
 */
export const staticAssetHandler = (publicPath: string = "public") => {
  return (event: H3Event) => {
    const { pathname } = new URL(event.req.url);

    /**
     * Only serve if it looks like a static asset (has an extension)
     * but skip dotfiles or sensitive files
     */
    if (!/\.[a-zA-Z0-9]+$/.test(pathname)) return;
    if (pathname.startsWith("/.") || pathname.includes("..")) return;

    /**
     * Serve the asset
     */
    return serveStatic(event, {
      indexNames: ["/index.html"],
      getContents: (id) => {
        return <never>readFile(join(before(publicPath, id), id));
      },
      getMeta: async (id) => {
        const stats = await stat(join(before(publicPath, id), id)).catch(() => {});
        if (stats?.isFile()) {
          return {
            size: stats.size,
            mtime: stats.mtimeMs,
          };
        }
      },
    });
  };
};
