// #region Core

// Core is using
// - NoUndefinedComponent
// - NoEmptyErrors
// - FromTypes
// - IntersectRequires
// - GetErrors
// - Props

// Core's Global State

const st = fn.symbol = Symbol("(st)composable");
const errors: unique symbol = Symbol.for("(st)error");
const runtime: unique symbol = Symbol()
const Executables: Record<symbol, (name: symbol, value: any, userFunc: (props: any) => any, storage: any) => void> = {}

Executables[errors] = function(name, value, userFunc, list: any[]) {
    list.push(value[errors])
}

// End

/**
 * ### ST
 * @see [Tutorial](https://github.com/aikmandean/st#overview)
 * @param func Your function definition, accepts a single props parameter.
 * @param propDefs The dep spread of your function. Dependencies or error cases.
 * ```ts
 * const yourFunction = fn(props => {
 * 
 *      return props.firstName + props.lastName
 * 
 * }, FirstName, LastName)
 * ```
 */
export function fn<
  TypeSpread extends any[],
  Component extends ST.NoUndefinedComponent<ST.NoEmptyErrors<Props>>,
  Props = ST.FromTypes<ST.IntersectRequires<TypeSpread>>,
>(func: Component, ...propDefs: TypeSpread):
  [ST.GetErrors<Props>[0]] extends [never] ?
  (props: { [K in keyof ST.Props<Props>]: ST.Props<Props>[K] }) =>
    ReturnType<Component> :
  <Err>(props: { [K in keyof ST.Props<Props>]: ST.Props<Props>[K] } & Err) =>
    | MayFail<ST.GetErrors<Props>[0], Err>
    | ReturnType<Component>

/**
 * ### ST
 * @see [Tutorial](https://github.com/aikmandean/st#overview)
 * @param name Function name. Shows in code editor or stack traces.
 * @param func Your function definition, accepts a single props parameter.
 * @param propDefs The dep spread of your function. Dependencies or error cases.
 * ```ts
 * const yourFunction = fn("Your Function Name", props => {
 * 
 *      return props.firstName + props.lastName
 * 
 * }, FirstName, LastName)
 * ```
 */
export function fn<
  Name extends string,
  TypeSpread extends any[],
  Component extends ST.NoUndefinedComponent<ST.NoEmptyErrors<Props>>,
  Props = ST.FromTypes<ST.IntersectRequires<TypeSpread>>,
>(name: Name, func: Component, ...propDefs: TypeSpread):
  [ST.GetErrors<Props>[0]] extends [never] ?
  <N = Name>(props: { [K in keyof ST.Props<Props>]: ST.Props<Props>[K] }) =>
    ReturnType<Component> :
  <N = Name, Err = {}>(props: { [K in keyof ST.Props<Props>]: ST.Props<Props>[K] } & Err) =>
    | MayFail<ST.GetErrors<Props>[0], Err>
    | ReturnType<Component>

{
    if(typeof name == "string")
        Object.defineProperty(func, "name", { value: name || "(st)fallbackFunctionName" })
    else {
        if(func)
            propDefs.unshift(func)
        func = name
        // @ts-ignore
        name = func.name || "(st)fallbackFunctionName"
    }
    
    // // DEBUG MODE
    // const st = eval(`({
    //     ["(st)${name}"](props) {
    //         utilFallbackAssign(props, defaults)
    //         return func(props, props)
    //     }
    // }["(st)${name}"])`)

    // // RELEASE MODE
    Object.defineProperty(f, "name", { value: name })

    const defaults = {}
    // @ts-ignore
    f[st] = {}
    // @ts-ignore
    f[runtime] = {}
    f[runtime][errors] = []

    for (const propObj of propDefs) // @ts-ignore
    for (const [key, value] of utilComposeProps(propObj, f[st])) 
    for (const S of Object.getOwnPropertySymbols(value)) 
        Executables[S]?.(key, value, f, f[runtime][key])
        // console.log({S, key, value})


    // @ts-ignore
    return f

    function f(props: any = {}) {
        const originalErrors = props[errors] || []
        props[errors] = originalErrors.concat(f[runtime][errors])

        try {
            // @ts-ignore
            const canthen = func(props, props)
            if(!canthen || typeof canthen != "object") return canthen
            if("then" in canthen) return asyncF(canthen, originalErrors)
            return canthen
        } catch (error) {
            const type = error?.constructor
            if(!type) throw error
            if(!(errors in type)) throw error
            if(originalErrors.includes(type)) throw error
            return error
        }
    }
    // @ts-ignore
    async function asyncF(promise, originalErrors) {
        try {
            const result = await promise
            return result
        } catch (error) {
            const type = error?.constructor
            if(!type) throw error
            if(!(errors in type)) throw error
            if(originalErrors.includes(type)) throw error
            return error
        }
    }
}

type MayFail<T, U> = ST.GetErrors<U> extends [infer U1] ? [T] extends [infer T1] ? T1 extends U1 ? never : T1 : never : never


/**
 * ### NamedThrow
 * A type safe throwable which does does **not** inherit from the Error class in JavaScript.
 * Does not have a `.stack` property.
 * @param kind Error code or title
 * @param props Error details or state needed to interpret the data
 * ```ts
 * class DuplicateEmailErr extends NamedThrow("DuplicateEmail") {}
 * 
 * const checkEmail = fn(props => {
 * 
 *     if(...) {
 * 
 *          throw new DuplicateEmailErr()
 * 
 *     }
 * 
 * }, DuplicateEmailErr)
 * ```
 */
export function NamedThrow<Kind extends string, Props = {}>(kind: Kind, props?: Props): {new(props: Props): {as: Kind, [errors]: "object"} & Props} {
    Object.defineProperty(throwable, "name", { value: kind })
    Object.defineProperty(throwable, "as", { value: kind })
    Object.defineProperty(throwable, errors, { value: false })

    // @ts-ignore
    return throwable

    // @ts-ignore
    function throwable(props) {
        // @ts-ignore
        this.name = kind
        // @ts-ignore
        Object.assign(this, props)
    }
}
/**
 * ### NamedError
 * A type safe error which inherits from the Error class in JavaScript.
 * Contains the `.stack` property.
 * @param kind Error code or title
 * @param props Error details or state needed to interpret the data
 * ```ts
 * class DuplicateEmailErr extends NamedThrow("DuplicateEmail") {}
 * 
 * const checkEmail = fn(props => {
 * 
 *     if(...) {
 * 
 *          throw new DuplicateEmailErr()
 * 
 *     }
 * 
 * }, DuplicateEmailErr)
 * ```
 */
export function NamedError<Kind extends string, Props = {}>(kind: Kind, props?: Props): {new(props: Props): {as: Kind, [errors]: "exception"} & Props & Error} {
    class Errorable extends Error {
        // @ts-ignore
        constructor(props) {
            super()
            Object.defineProperty(this, "name", { value: kind })
            Object.defineProperty(this, "as", { value: kind })
            Object.assign(this, props)
        }
        static [errors] = true
        get message() {
            return `No message. Override the \`.message\` property using a getter`
        }
    }
    
    Object.defineProperty(Errorable, "name", { value: kind })

    // @ts-ignore
    return Errorable
}
// #endregion

// #region ST
export default ST

namespace ST {
  // @ts-expect-error
  export type IntersectRequires<T> = ST.Util.UnionToIntersection<ST.Fn.Index<T>>
  // @ts-expect-error
  export type NoEmptyErrors<T> = [keyof T[ST.Throw]] extends [never] ? Omit<T, ST.Throw> : T
  export type NoUndefinedComponent<T> = (props: { [K in keyof T]-?: Exclude<T[K], undefined> }) => unknown
  export type GetErrors<CProps> = CProps extends { [errors]: infer E }
    ? [Exclude<any, E>] extends [never]
    ? [never]
    : [E]
    : [never]
  export type Props<T> = ST.Util.UnionToIntersection<{
    [K in Exclude<keyof T, ST.Throw>]:
    [Extract<T[K], undefined>] extends [never] ?
    { [K1 in K]: T[K1] } :
    { [K1 in K]?: Exclude<T[K1], undefined> }
  }[Exclude<keyof T, ST.Throw>]>
  export type FromTypes<T> = T extends { [errors]: infer X }
    // @ts-expect-error
    ? { [K in Exclude<keyof T, symbol>]: T[K] } & { [errors]: InstanceType<X[keyof X]> }
    : T
  export type Throw = typeof ST.Declare.SErr

  export namespace Fn {
    export type Index<T extends any[]> = { [K in keyof T]: PComposable<T[K]> }[number]
    // @ts-expect-error
    export type Error<E> = E extends { as: infer S } ? { [errors]: { [K in S]: { new(...a: any): E } } } : {}
    export type PComposable<T> =
      T extends { new(...a: any): { as: infer S } } ?
      // @ts-expect-error
      { [errors]: { [K in S]: T } } :
      T extends (p: infer P) => infer R ?
      [Extract<R, { as: string, [errors]: any }>] extends [never] ?
      P :
      P & Error<Extract<R, { as: string, [errors]: any }>> :
      T
  }

  export namespace Util {
    export type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never
    export type LiteralLoss<T> = T extends number ? number : T extends string ? string : T extends boolean ? boolean : T
  }

  export namespace Declare {
    export const SErr: typeof errors = errors;
  }
}
// #endregion

// #region Private Utils
// @ts-ignore
function utilComposeProps(propObj, symbols) {
    const entries = [];
    if(st in propObj) 
        propObj = propObj[st]
    const symList = Object.getOwnPropertySymbols(propObj);
    
    for (const key of symList)
        if (key == errors)
            continue
        else if (key != runtime)
            entries.push([key, symbols[key] = propObj[key]]);
    
    if(errors in propObj)
        entries.push([errors, {[errors]: propObj}])

    return entries;
}
// #endregion