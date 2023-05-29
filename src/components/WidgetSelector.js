import React, { useEffect, useState, Suspense, useRef } from "react";
import { loadRemoteModule } from "../helpers/loadModule";

const WidgetSelector = () => {
    const [widgets, setWidgets] = useState([]);
    const [renderers, setRenderers] = useState([]);
    const widgetRoot = useRef(null);
    
    useEffect(() => {
      const fetchWidgets = async () => {
        try {
          const [widgetsResponse, renderersResponse] = await Promise.all([
            fetch("/config.json"),
            fetch("/renderer.json"),
          ]);
    
          const widgetsData = await widgetsResponse.json();
          const renderersData = await renderersResponse.json();
    
          setWidgets(widgetsData);
          setRenderers(renderersData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      fetchWidgets();
    }, []);

    const handleWidgetSelect = async (selectedWidget) => {
      const { url, scope, widget, renderer } = selectedWidget;
      const rendererConfig = renderers[renderer];
      console.log(rendererConfig.url, rendererConfig.scope, rendererConfig.module);
      const renderFn =  await loadRemoteModule(rendererConfig.url, rendererConfig.scope, rendererConfig.module)();
      const loadedComponent =  loadRemoteModule(url, scope, widget);
      renderFn.default(loadedComponent, widgetRoot.current)
    };

    return (
      <div>
        <h2>Select Widget:</h2>
        <select onChange={(e) => handleWidgetSelect(widgets[e.target.value])}>
          <option value="">Select a widget</option>
          {widgets.map((widget, index) => (
            <option key={index} value={index}>
              {widget.label}
            </option>
          ))}
        </select>
        <div id="widget-root" ref={widgetRoot}></div>
      </div>
    );
  };
  
  export default WidgetSelector;