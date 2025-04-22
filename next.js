import { parse } from "url";
import next from "next";

export async function nextApp(dev){
    const app = next({ dev });
    const handle = app.getRequestHandler();
    await app.prepare();

    return (req, res) => {
        const parsedUrl = parse(req?.url || "", true);
        handle(req, res, parsedUrl);
    };
}