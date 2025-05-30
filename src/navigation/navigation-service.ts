import { ServiceContract } from "@aster-js/ioc";
import { IRouter } from "../routing";
import { INavigationService } from "./inavigation-service";
import { IAmbientValues } from "../routing/abstraction/iambient-values";

@ServiceContract(INavigationService)
export class DefaultNavigationService implements INavigationService {

    constructor(
        private readonly _history: History,
        @IRouter private readonly _router: IRouter,
        @IAmbientValues private readonly _ambientValues: IAmbientValues
    ) {
    }

    async navigate(relativeUrl: string, replace: boolean = false): Promise<void> {
        const [route, hash] = this.resolveRoute(relativeUrl);
        const result = await this._router.eval(route);
        if (result.success) {

            const url = new URL(result.relativeUrl, location.origin);
            url.hash = hash;
            this._ambientValues.coerceUrl(url);

            if (replace) {
                this._history.replaceState({}, "", url);
            }
            else {
                this._history.pushState({}, "", url);
            }
        }
        else {
            throw new Error(result.reason);
        }
    }

    private resolveRoute(relativeUrl: string): [string, string] {
        const hashIdx = relativeUrl.indexOf("#");
        if (hashIdx === -1) return [relativeUrl, ""];
        return [relativeUrl.substring(0, hashIdx), relativeUrl.substring(hashIdx)];
    }
}
