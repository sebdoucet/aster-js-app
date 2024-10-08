import { Delayed } from "@aster-js/async";
import { Constructor, asserts } from "@aster-js/core";
import { IIoCContainerBuilder, IIoCModule, IoCKernel, LogLevel } from "@aster-js/ioc";
import { AppConfigureDelegate, configure, IAppConfigureHandler, IApplicationPart, IApplicationPartBuilder } from "../abstraction";
import { ApplicationPart } from "./application-part";
import { ApplicationPartBuilder } from "./application-part-builder";
import { ChildApplicationPartBuilder } from "./child-application-part";
import { DefaultApplicationConfigureHandler } from "./default-application-configure-handler";
import { INavigationService } from "../navigation";

class SinglePageAppBuilder extends ApplicationPartBuilder {

    protected createApplicationPart(parent: IIoCModule, iocBuilder: IIoCContainerBuilder): IApplicationPart {
        return new SinglePageApplication(parent, iocBuilder);
    }
}

export class SinglePageApplication extends ApplicationPart {

    get parent(): IIoCModule { return this._parent; }

    constructor(
        private readonly _parent: IIoCModule,
        builder: IIoCContainerBuilder
    ) {
        super(builder);
    }

    navigate(url: string, replace?: boolean): Promise<void> {
        return this.services.get(INavigationService, true)
            .navigate(url, replace);
    }

    protected createAppBuilder(name: string): IApplicationPartBuilder {
        const result = new Delayed<IApplicationPart>();
        this.addChild(result);
        return new ChildApplicationPartBuilder(name, this, result);
    }

    private static createKernel() {
        const builder = IoCKernel.create();
        builder.configure(x => {
            x.addConsoleLogger(LogLevel.trace);
        });
        return builder.build();
    }

    async start(): Promise<boolean> {
        if (await this._parent.start() && await super.start()) {
            await this.activatePart(this);
            return true;
        }
        return false;
    }

    static create(appName: string, ...handlerCtors: Constructor<IAppConfigureHandler>[]): IApplicationPartBuilder {
        const kernel = SinglePageApplication.createKernel();

        const result = new Delayed<IApplicationPart>();
        const builder = new SinglePageAppBuilder(appName, kernel, result);
        for (const handlerCtor of handlerCtors) {
            const handler = kernel.services.createInstance(handlerCtor);
            handler[configure](builder);
        }
        return builder;
    }

    static async start(appName: string, configHandler: Constructor<IAppConfigureHandler> | AppConfigureDelegate): Promise<SinglePageApplication> {
        const handler = IAppConfigureHandler.resolve(configHandler);
        const app = SinglePageApplication.create(appName, DefaultApplicationConfigureHandler, handler).build();
        await app.start();
        asserts.instanceOf(app, SinglePageApplication);
        return app;
    }
}
