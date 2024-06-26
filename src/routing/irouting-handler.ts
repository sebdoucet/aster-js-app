import { ServiceIdentifier } from "@aster-js/ioc";
import { RouteData } from "./route-data";
import { IApplicationPart } from "../abstraction";

export const IRoutingHandler = ServiceIdentifier<IRoutingHandler>({ name: "IRoutingHandler", namespace: "@aster-js/app", unique: true });

/**
 * Service ID and Implementation for routing handler.
 * A routing handler is in charge handling matching navigation
 */
export interface IRoutingHandler {
    /** Gets the string path used to describe the route */
    readonly path: string;
    /**
     * Method called when the  route match
     * @param data Route data that contains route values and query values
     * @param app Application that handle the route
     */
    handle(data: RouteData, app: IApplicationPart): Promise<void>;
}
