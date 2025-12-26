const pertaminaLogo = new Proxy({ "src": "/_astro/logo-pertamina.DqwOFuEp.png", "width": 800, "height": 199, "format": "png" }, {
  get(target, name, receiver) {
    if (name === "clone") {
      return structuredClone(target);
    }
    if (name === "fsPath") {
      return "E:/DATA/Ngoding/sim4lon/src/assets/logo-pertamina.png";
    }
    if (target[name] !== void 0 && globalThis.astroAsset) globalThis.astroAsset?.referencedImages.add("E:/DATA/Ngoding/sim4lon/src/assets/logo-pertamina.png");
    return target[name];
  }
});
export {
  pertaminaLogo as p
};
