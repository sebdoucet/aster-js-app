import { IRouteSegment } from "../iroute-segment";
import { RouteResolutionCursor } from "../route-resolution-cusor";
import { RouteValues } from "../route-data";


export class StaticRouteSegment implements IRouteSegment {

    get segment(): string { return this._segment; }

    constructor(
        private readonly _segment: string
    ) { }

    match(segment: string | undefined): boolean {
        return segment === this._segment;
    }

    read(ctx: RouteResolutionCursor, values: RouteValues): string | null {
        const current = ctx.peek();
        if (current !== this._segment) {
            throw new Error(`Invalid token: expected segment equals to "${this._segment}" but current segment is equal to "${current}"`);
        }
        ctx.shift();
        return this._segment;
    }

    resolve(values: RouteValues, consume?: boolean): string | null {
        return this._segment;
    }

    toString(): string {
        return this._segment;
    }
}
