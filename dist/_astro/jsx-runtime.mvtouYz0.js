import{a as requireReact}from"./index.DcciWILN.js";var jsxRuntime={exports:{}},reactJsxRuntime_production_min={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var hasRequiredReactJsxRuntime_production_min;function requireReactJsxRuntime_production_min(){if(hasRequiredReactJsxRuntime_production_min)return reactJsxRuntime_production_min;hasRequiredReactJsxRuntime_production_min=1;var f=requireReact(),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;g!==void 0&&(e=""+g),a.key!==void 0&&(e=""+a.key),a.ref!==void 0&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)d[b]===void 0&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}return reactJsxRuntime_production_min.Fragment=l,reactJsxRuntime_production_min.jsx=q,reactJsxRuntime_production_min.jsxs=q,reactJsxRuntime_production_min}var hasRequiredJsxRuntime;function requireJsxRuntime(){return hasRequiredJsxRuntime||(hasRequiredJsxRuntime=1,jsxRuntime.exports=requireReactJsxRuntime_production_min()),jsxRuntime.exports}var jsxRuntimeExports=requireJsxRuntime();export{jsxRuntimeExports as j};
