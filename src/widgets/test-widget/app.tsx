import React, {memo, useCallback, useState, useEffect} from 'react';
import Button from '@jetbrains/ring-ui-built/components/button/button';

const host = await YTApp.register();

const AppComponent: React.FunctionComponent = () => {
    // TODO: Search functionality for projects?

    const [buttonValue, setButtonValue] = useState(false);
    const [projects, setProjects] = useState<string[]>([]);

    // TODO: Websockets to make changes realtime?
    useEffect(() => {
        const fetchProjects = async () => {
            const result = await host.fetchYouTrack('projects');
            setProjects(result.projects);
        };
        fetchProjects();
    }, []);

    // TODO: Websockets to make changes realtime?
    const toggleBackendFlag = useCallback(async () => {
        const result = await host.fetchApp('backend/flag', {method: 'POST', body: {value: buttonValue}})
        console.log(`result is ${result}`);
        // TODO: check if response is ok
        if (result) {
            setButtonValue(!buttonValue);
        } else {
            host.alert('Error changing button state!');
        }
    }, [buttonValue]);

  return (
    <div className="widget">
      <Button primary onClick={toggleBackendFlag}>Toggle Backend</Button>
        { projects.map((project, index) =>
            <div key={index}>{project}</div>
        )}
    </div>
  );
};

export const App = memo(AppComponent);
