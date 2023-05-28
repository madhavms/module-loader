import React, { useEffect, useState, Suspense } from "react";
import { loadRemoteModule } from "../helpers/loadModule";

const WidgetSelector = () => {
    const [widgets, setWidgets] = useState([]);
    const [Component, setComponent] = useState(null);
  
    useEffect(() => {
      const fetchWidgets = async () => {
        try {
          const response = await fetch("/config.json"); 
          const data = await response.json();
          setWidgets(data);
        } catch (error) {
          console.error("Error fetching widgets:", error);
        }
      };
  
      fetchWidgets();
    }, []);
  
    const handleWidgetSelect = async (selectedWidget) => {
      const { url, scope, widget } = selectedWidget;
      const loadComponent = loadRemoteModule(url, scope, widget);
      setComponent(React.lazy(loadComponent));
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
        <Suspense fallback={<div>Loading...</div>}>
          {Component && <Component />}
        </Suspense>
      </div>
    );
  };
  
  export default WidgetSelector;