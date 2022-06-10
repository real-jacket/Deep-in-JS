function loadScript(url) {
  const loader = new Promise((resolve) => {
    const script = document.createElement('script');
    script.charset = 'utf-8';
    script.src = url;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return loader;
}

function loadComponent(componentName, url) {
  return loadScript(url).then((success) => {
    if (!success) {
      throw new Error(`Failed to load ${componentName}`);
    }

    try {
      const content = window[componentName];
      let comp = content && content.__esModule ? content.default : content;

      return comp;
    } catch (e) {
      throw new Error(`Failed to load ${componentName}`);
    }
  });
}
