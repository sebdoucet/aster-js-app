import { ServiceContract } from "@aster-js/ioc";
import { IApplicationPartLifecycle, ApplicationPartLifecycleHooks } from "../../application-part/iapplication-part-lifecycle";

import { IRouter } from "../abstraction/irouter";

@ServiceContract(IApplicationPartLifecycle)
export class DefaultNavigationHandler {
    private readonly _self: this;

    constructor(
        private readonly _location: Location,
        @IRouter private readonly _router: IRouter
    ) {
        this._self = this;
    }

    [ApplicationPartLifecycleHooks.setup](): Promise<void> {
        return Promise.resolve();
    }

    async [ApplicationPartLifecycleHooks.activated](): Promise<void> {
        const url = this._location.pathname + this._location.search;
        await this._self._router.eval(url);
        return Promise.resolve();
    }

    [ApplicationPartLifecycleHooks.deactivated](): Promise<void> {
        return Promise.resolve();
    }
}
